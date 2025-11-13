import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0A5C8C] to-[#084a6f] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              Privacy Policy
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Power Scouts ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our electricity 
              comparison service at powerscouts.com (the "Service").
            </p>
            <p className="text-gray-600 leading-relaxed">
              By using our Service, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Use our electricity plan comparison tool (ZIP code, usage information)</li>
              <li>Contact us via phone, email, or chat support</li>
              <li>Sign up for email updates or newsletters</li>
              <li>Complete a form to enroll in an electricity plan</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              This may include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Name and contact information (email address, phone number, mailing address)</li>
              <li>ZIP code and service address</li>
              <li>Electricity usage information</li>
              <li>Current electricity provider and account information</li>
              <li>Payment information (processed securely by third-party payment processors)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you access our Service, we automatically collect certain information about your device and usage:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on our Service</li>
              <li>Referring website or search engine</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Provide and maintain our Service</li>
              <li>Compare electricity plans and rates based on your location and usage</li>
              <li>Facilitate enrollment in electricity plans with providers</li>
              <li>Communicate with you about plans, rates, and our services</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze and improve our Service</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sharing Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may share your information with:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Electricity Providers</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you choose to enroll in an electricity plan, we share your information with the selected provider 
              to facilitate enrollment and service activation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Providers</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We work with third-party service providers who help us operate our Service, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Web hosting and infrastructure providers</li>
              <li>Payment processors</li>
              <li>Email and communication services</li>
              <li>Analytics and marketing platforms</li>
              <li>Customer support tools</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Requirements</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may disclose your information if required by law or in response to valid legal processes, such as 
              subpoenas, court orders, or government requests.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Business Transfers</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              In connection with a merger, acquisition, or sale of assets, your information may be transferred to 
              the acquiring entity.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to improve your experience and analyze usage. You can 
              control cookies through your browser settings. Note that disabling cookies may affect your ability to 
              use certain features of our Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information 
              from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over 
              the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Restrict Processing:</strong> Request limitation on how we use your information</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              To exercise these rights, please contact us at privacy@powerscouts.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our Service is not intended for individuals under 18 years of age. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">California Privacy Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              California residents have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to request deletion of personal information</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this 
              Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-900 font-semibold mb-2">Power Scouts</p>
              <p className="text-gray-600 mb-1">Email: privacy@powerscouts.com</p>
              <p className="text-gray-600 mb-1">Phone: 855-475-8315</p>
              <p className="text-gray-600">
                Mail: Power Scouts Privacy Team<br />
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