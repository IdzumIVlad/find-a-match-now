import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Learn how laburoGO collects, uses and protects your personal data on our job search platform"
        keywords="privacy policy, data protection, GDPR, personal data, laburoGO"
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US')}</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction and Consent</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing or using laburoGO, you explicitly consent to our collection, use, and processing of your information 
                as described in this Privacy Policy. This policy grants us broad rights to use your data for business purposes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Your continued use of our platform constitutes ongoing consent, even if you haven't explicitly agreed to any updates 
                we may make to this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information Collection</h2>
              
              <h3 className="text-xl font-medium text-foreground mb-3">2.1 Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">We collect extensive information including:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Full name, contact details, and identification information</li>
                <li>Email addresses, phone numbers, and social media profiles</li>
                <li>Complete professional history, skills, and educational background</li>
                <li>Resume data, portfolio content, and any uploaded documents</li>
                <li>Company information, financial data, and business details (for employers)</li>
                <li>Payment information and transaction history</li>
                <li>Communications with other users and our support team</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">2.2 Automatically Collected Data</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>IP addresses, precise geolocation, and device identifiers</li>
                <li>Complete browsing history and device information</li>
                <li>All platform interactions, clicks, and behavioral patterns</li>
                <li>Cookies, web beacons, and tracking technologies</li>
                <li>Audio recordings of customer service calls</li>
                <li>Biometric data when available through device sensors</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We use your information for any purpose that serves our business interests, including:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Providing, modifying, and terminating our services at our discretion</li>
                <li>Creating user profiles and algorithms for matching and recommendations</li>
                <li>Marketing, advertising, and promoting our services and third-party products</li>
                <li>Research, analytics, and data monetization opportunities</li>
                <li>Training AI models and developing new technologies</li>
                <li>Compliance with legal obligations and law enforcement requests</li>
                <li>Protecting our business interests and intellectual property</li>
                <li>Any other purpose we deem necessary for business operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to share your information with third parties for various purposes, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Any business partners, affiliates, or subsidiaries</li>
                <li>Service providers, contractors, and marketing partners</li>
                <li>Potential acquirers in case of business sale or merger</li>
                <li>Government agencies and law enforcement (with or without legal process)</li>
                <li>Credit agencies, background check companies, and verification services</li>
                <li>Advertisers and data analytics companies</li>
                <li>Any party we believe may benefit from access to your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent text-foreground mb-4">5. Data Security and Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                While we implement reasonable security measures, we make no guarantees about data security. 
                We retain your data indefinitely and may use it even after account deletion.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Data may be stored indefinitely for business purposes</li>
                <li>Backup copies may remain in our systems permanently</li>
                <li>We are not liable for data breaches or unauthorized access</li>
                <li>Data may be transferred to any jurisdiction worldwide</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Limited Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Subject to applicable law and our business interests, you may have limited rights:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Request access to some of your data (fees may apply)</li>
                <li>Request corrections (at our discretion)</li>
                <li>Request deletion (subject to our retention policies)</li>
                <li>Opt-out of some communications (core services excluded)</li>
                <li>All requests are subject to verification and business justification</li>
                <li>We may deny requests that interfere with our operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use extensive tracking technologies including cookies, web beacons, and fingerprinting. 
                Disabling these may result in reduced functionality or service termination.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We track all user activities across devices and may share this data with advertising networks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. International Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be processed and stored anywhere in the world, including countries with 
                less stringent privacy protections. By using our service, you consent to these transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Policy Changes</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this policy at any time without notice. Continued use of our service 
                constitutes acceptance of any changes. We are not obligated to notify you of modifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For privacy inquiries (response not guaranteed):
              </p>
              <ul className="list-none text-muted-foreground space-y-1">
                <li>Email: privacy@laburoGO.com</li>
                <li>Response time: Up to 90 days</li>
                <li>Fees may apply for data requests</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;