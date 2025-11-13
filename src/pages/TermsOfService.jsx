import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              Terms of Service
            </h1>
            <p className="text-lg text-blue-100">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By accessing or using Power Scouts' website and services ("Service"), you agree to be bound by these 
              Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These Terms apply to all visitors, users, and others who access or use the Service. We reserve the right 
              to update and change the Terms by posting updates and changes to our website. Your continued use of the 
              Service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Power Scouts provides a free electricity plan comparison service for residential and commercial customers 
              in deregulated Texas electricity markets. Our Service allows you to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Compare electricity rates and plans from multiple providers</li>
              <li>View plan details, rates, and terms</li>
              <li>Enroll in electricity plans through our platform</li>
              <li>Access educational resources about the Texas electricity market</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Power Scouts acts as an independent marketplace and is not an electricity provider. We receive compensation 
              from electricity providers when customers enroll through our Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              While you can browse plans without creating an account, certain features may require registration. When 
              creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 18 years old to use our Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Use of Service</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Permitted Use</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may use our Service for lawful purposes only. You agree to use the Service only to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Compare electricity plans for your own personal or business needs</li>
              <li>Obtain information about electricity providers and plans</li>
              <li>Enroll in electricity service for addresses where you are authorized to do so</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Use</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Impersonate any person or entity or falsely state your affiliation</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Scrape, copy, or collect data from the Service using automated means</li>
              <li>Use the Service to transmit spam, viruses, or malicious code</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Remove or alter any copyright, trademark, or proprietary notices</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Plan Enrollment and Provider Relationships</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you enroll in an electricity plan through our Service:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>You are entering into a direct contract with the electricity provider, not with Power Scouts</li>
              <li>The provider's terms and conditions govern your electricity service</li>
              <li>Power Scouts is not responsible for the provider's performance, billing, or customer service</li>
              <li>You must review and accept the provider's Terms of Service and Electricity Facts Label (EFL)</li>
              <li>You authorize Power Scouts to share your information with the provider to facilitate enrollment</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Power Scouts makes reasonable efforts to display accurate plan information but cannot guarantee that all 
              rates and details are current or error-free. Always verify plan details with the provider before enrolling.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimers and Limitations of Liability</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service "As Is"</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or 
              implied, including but not limited to warranties of merchantability, fitness for a particular purpose, 
              or non-infringement.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Guarantee of Results</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Power Scouts does not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>That you will save money by using our Service</li>
              <li>The accuracy, completeness, or timeliness of plan information</li>
              <li>That the Service will be uninterrupted, secure, or error-free</li>
              <li>That any specific plan will be available or suitable for your needs</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              To the maximum extent permitted by law, Power Scouts shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly 
              or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of your personal information</li>
              <li>Any interruption or cessation of the Service</li>
              <li>Any bugs, viruses, or malicious code transmitted through the Service</li>
              <li>Any errors or omissions in plan information or rates</li>
              <li>The performance or non-performance of any electricity provider</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are owned by Power Scouts and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may not copy, modify, distribute, sell, or lease any part of our Service or included software, nor 
              may you reverse engineer or attempt to extract the source code of that software, unless laws prohibit 
              these restrictions or you have our written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our Service may contain links to third-party websites or services that are not owned or controlled by 
              Power Scouts. We have no control over and assume no responsibility for the content, privacy policies, 
              or practices of any third-party websites or services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless Power Scouts and its officers, directors, employees, 
              agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including attorneys' 
              fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Any information you provide through the Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or 
              liability, for any reason, including breach of these Terms. Upon termination, your right to use the 
              Service will immediately cease.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All provisions of the Terms which by their nature should survive termination shall survive, including 
              ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the State of Texas, 
              without regard to its conflict of law provisions. Any disputes arising from these Terms or your use 
              of the Service shall be resolved in the courts located in Texas.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
              provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material 
              change will be determined at our sole discretion.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By continuing to access or use our Service after revisions become effective, you agree to be bound by 
              the revised terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-900 font-semibold mb-2">Power Scouts</p>
              <p className="text-gray-600 mb-1">Email: legal@powerscouts.com</p>
              <p className="text-gray-600 mb-1">Phone: 855-475-8315</p>
              <p className="text-gray-600">
                Mail: Power Scouts Legal Department<br />
                [Company Address]<br />
                [City, State ZIP]
              </p>
            </div>
          </section>

          {/* Back Link */}
          <div className="pt-8 border-t border-gray-200">
            <Link 
              to={createPageUrl("Home")} 
              className="text-[#0A5C8C] hover:text-[#084a6f] font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}