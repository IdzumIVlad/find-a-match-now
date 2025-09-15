import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <>
      <SEOHead
        title="Terms of Use"
        description="Review the terms of use for laburoGO job search and recruitment platform"
        keywords="terms of use, user agreement, laburoGO, employment"
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Use</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance and Binding Agreement</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing laburoGO, you enter into a binding legal agreement with us. These terms govern all use of our platform 
                and services. If you disagree with any provision, you must immediately cease using our platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time without notice. Your continued use constitutes acceptance 
                of all changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Account Registration and User Obligations</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Account registration grants us extensive rights over your profile and data. You must provide accurate information 
                and maintain account security at your own risk.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You must be at least 13 years old to create an account</li>
                <li>All information provided becomes our property</li>
                <li>We may terminate accounts at our sole discretion without notice</li>
                <li>You are liable for all account activity and unauthorized access</li>
                <li>Background checks and verification may be conducted at our discretion</li>
                <li>Multiple accounts are prohibited and may result in immediate termination</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Content Rights and User Submissions</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">By submitting content, you grant us unlimited rights:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Perpetual, worldwide license to use, modify, and distribute your content</li>
                <li>Right to create derivative works and sublicense to third parties</li>
                <li>Authority to use your name, likeness, and professional information</li>
                <li>Permission to use content for marketing, training AI, and commercial purposes</li>
                <li>Right to retain content even after account deletion</li>
                <li>No compensation required for any use of your submissions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Service Modifications and Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We reserve absolute discretion over our platform:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Services may be modified, suspended, or terminated without notice</li>
                <li>Account termination may occur for any reason or no reason</li>
                <li>No refunds will be provided for terminated services</li>
                <li>We may block access based on location, IP address, or other factors</li>
                <li>Features may be removed or restricted at any time</li>
                <li>Data loss may occur during service modifications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Prohibited Activities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Users are strictly prohibited from:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Any activity we deem harmful to our business interests</li>
                <li>Attempting to reverse engineer or access our systems</li>
                <li>Using automated tools or bots (detection results in immediate ban)</li>
                <li>Competing with our services or creating similar platforms</li>
                <li>Sharing negative reviews or criticism on public platforms</li>
                <li>Circumventing any restrictions or security measures</li>
                <li>Using the platform for any unlawful purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Disclaimer of Warranties and Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                OUR PLATFORM IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES. WE DISCLAIM ALL LIABILITY FOR:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Any damages, losses, or injuries resulting from platform use</li>
                <li>Accuracy of user-submitted information or job postings</li>
                <li>Employment outcomes, hiring decisions, or career results</li>
                <li>Data breaches, security incidents, or privacy violations</li>
                <li>Service interruptions, bugs, or technical failures</li>
                <li>Actions of other users or third parties</li>
                <li>Financial losses or business opportunities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Indemnification and User Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to defend, indemnify, and hold us harmless from any claims, damages, or expenses 
                (including attorney fees) arising from your use of our platform or violation of these terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Your liability to us is unlimited and includes consequential damages, lost profits, and legal costs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Dispute Resolution and Arbitration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                ALL DISPUTES MUST BE RESOLVED THROUGH BINDING ARBITRATION. You waive your right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Trial by jury or court proceedings</li>
                <li>Class action lawsuits or collective legal action</li>
                <li>Appeal arbitration decisions</li>
                <li>Seek injunctive or equitable relief</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Payments and Fees</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Payment terms are subject to change without notice. All fees are non-refundable. 
                We may charge additional fees for premium features, data requests, or account recovery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Governing Law and Jurisdiction</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms are governed by laws most favorable to our interests. Any legal proceedings 
                must be conducted in our preferred jurisdiction, regardless of your location.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For terms-related inquiries: legal@laburoGO.com (responses not guaranteed)
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfUse;