'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function PrivacyPolicy() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchLaterCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Handle scroll for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewChange = (view: string) => {
    // Navigate to home with the selected view
    window.location.href = `/?view=${view}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        currentView="privacy"
        showSearch={showSearch}
        searchQuery={searchQuery}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={handleViewChange}
        onSearchToggle={handleSearchToggle}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-32 pt-40">{/* Added pt-40 to account for navbar */}
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <p className="text-gray-300 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to Miko (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our streaming platform service. 
                Please read this privacy policy carefully. If you do not agree with the terms of this 
                privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3 text-purple-400">Personal Information</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Register for an account</li>
                <li>Create a user profile</li>
                <li>Upload profile pictures</li>
                <li>Contact us with inquiries</li>
                <li>Use interactive features of our service</li>
              </ul>

              <h3 className="text-xl font-medium mb-3 text-purple-400">Automatically Collected Information</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you visit our platform, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>IP address and browser information</li>
                <li>Operating system and device information</li>
                <li>Pages viewed and time spent on our service</li>
                <li>Search queries and viewing preferences</li>
                <li>Cookie and tracking data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide, operate, and maintain our streaming service</li>
                <li>Improve, personalize, and expand our service</li>
                <li>Understand and analyze how you use our service</li>
                <li>Develop new products, services, and features</li>
                <li>Communicate with you about updates and support</li>
                <li>Process your transactions and manage your account</li>
                <li>Send you promotional communications (with your consent)</li>
                <li>Find and prevent fraud and security issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Third-Party Services</h2>
              
              <h3 className="text-xl font-medium mb-3 text-purple-400">Authentication</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use Clerk for authentication services. When you create an account, your information 
                is processed according to Clerk&#39;s privacy policy. We recommend reviewing their privacy 
                practices at clerk.com.
              </p>

              <h3 className="text-xl font-medium mb-3 text-purple-400">Streaming Sources</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong className="text-yellow-400">Important:</strong> Miko aggregates content from 
                third-party streaming sources. We do not host any video content directly. When you 
                access streaming content, you may be subject to the privacy policies and terms of 
                service of those third-party providers.
              </p>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-200 text-sm">
                  <strong>Security Notice:</strong> Some streaming sources may require disabled iframe 
                  sandboxing, which could expose you to third-party tracking. We recommend using ad-blockers 
                  and privacy-focused browsers for enhanced protection.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Data Storage and Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                However, please note that no method of transmission over the internet is 100% secure.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Data is encrypted in transit using HTTPS</li>
                <li>Passwords are securely hashed using industry standards</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
                <li>Regular security audits and updates are performed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Cookies and Tracking</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Essential cookies:</strong> Required for basic site functionality</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics cookies:</strong> Help us understand site usage and performance</li>
                <li><strong>Authentication cookies:</strong> Keep you logged in securely</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights and Choices</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Children&#39;s Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian 
                and believe your child has provided us with personal information, please contact us 
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We take appropriate measures to ensure that your personal information receives an adequate 
                level of protection in the jurisdictions in which we process it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Changes to This Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. 
                Your continued use of the service after any changes indicates your acceptance of the 
                updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <ul className="text-gray-300 space-y-2">
                  <li><strong>Email:</strong> mdtahseen2901@gmail.com</li>
                  <li><strong>GitHub:</strong> <a href="https://github.com/mdtahseen7" className="text-purple-400 hover:text-purple-300">@mdtahseen7</a></li>
                  <li><strong>Response Time:</strong> We aim to respond within 48 hours</li>
                </ul>
              </div>
            </section>

            <section className="border-t border-gray-800 pt-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Disclaimer</h2>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <p className="text-red-200 leading-relaxed">
                  <strong>Important:</strong> Miko is an educational project that aggregates links to 
                  third-party streaming sources. We do not host any video content on our servers. 
                  Users are responsible for ensuring their compliance with local laws and regulations 
                  when accessing content through third-party sources.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
