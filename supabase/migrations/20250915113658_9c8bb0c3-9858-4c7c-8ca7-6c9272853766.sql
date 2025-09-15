-- Create function to send application email notification
CREATE OR REPLACE FUNCTION public.notify_employer_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  vacancy_data record;
  employer_email text;
  resume_data record;
  notification_payload jsonb;
BEGIN
  -- Get vacancy and employer info
  SELECT v.title, v.employer_id, p.email
  INTO vacancy_data
  FROM vacancies v
  LEFT JOIN profiles p ON p.id = v.employer_id
  WHERE v.id = NEW.vacancy_id;
  
  IF vacancy_data.email IS NULL THEN
    RAISE LOG 'No employer email found for vacancy %', NEW.vacancy_id;
    RETURN NEW;
  END IF;
  
  -- Get resume data if resume_id is provided
  IF NEW.resume_id IS NOT NULL THEN
    SELECT full_name, email, phone, summary, skills
    INTO resume_data
    FROM resumes
    WHERE id = NEW.resume_id;
  END IF;
  
  -- Build notification payload
  notification_payload := jsonb_build_object(
    'type', 'new_application',
    'vacancy_id', NEW.vacancy_id,
    'vacancy_title', vacancy_data.title,
    'employer_email', vacancy_data.email,
    'application_id', NEW.id,
    'applied_by', NEW.applied_by,
    'message', NEW.message,
    'guest_name', NEW.guest_name,
    'guest_email', NEW.guest_email,
    'guest_phone', NEW.guest_phone,
    'resume_id', NEW.resume_id,
    'resume_file_url', NEW.resume_file_url,
    'resume_link', NEW.resume_link
  );
  
  -- Add resume data if available
  IF resume_data IS NOT NULL THEN
    notification_payload := notification_payload || jsonb_build_object(
      'resume_data', jsonb_build_object(
        'full_name', resume_data.full_name,
        'email', resume_data.email,
        'phone', resume_data.phone,
        'summary', resume_data.summary,
        'skills', resume_data.skills
      )
    );
  END IF;
  
  -- Call the edge function to send email
  PERFORM
    net.http_post(
      url := 'https://usmwwkltvjyjzaxsdyhz.supabase.co/functions/v1/send-application-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := notification_payload
    );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new applications
DROP TRIGGER IF EXISTS on_application_created ON public.applications;
CREATE TRIGGER on_application_created
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_employer_new_application();