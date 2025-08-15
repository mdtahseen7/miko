'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function TermsOfService() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchLaterCount, setWatchLaterCount] = useState(0);
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
        currentView="terms"
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
            Terms of Service
          </h1>
          
          <p className="text-gray-300 text-lg mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using Miko ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service. These Terms of Service apply to all visitors, users, and others who 
                access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Description of Service</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Miko is an educational streaming platform that aggregates links to third-party content sources. 
                  Our service provides:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Access to movies and TV shows through third-party streaming sources</li>
                  <li>Live sports streaming links</li>
                  <li>User account management and profiles</li>
                  <li>Content search and discovery features</li>
                  <li>Watch later functionality</li>
                </ul>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-200 leading-relaxed">
                    <strong>Important:</strong> Miko does not host, store, or provide any video content directly. 
                    All content is sourced from third-party providers. We are not responsible for the availability, 
                    quality, or legality of content provided by these sources.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. User Responsibilities</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-purple-400">Legal Compliance</h3>
                <p className="text-gray-300 leading-relaxed">
                  You are solely responsible for ensuring that your use of the Service complies with all 
                  applicable local, state, national, and international laws and regulations. This includes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Compliance with copyright and intellectual property laws</li>
                  <li>Adherence to your jurisdiction's streaming and media consumption regulations</li>
                  <li>Respect for content licensing restrictions</li>
                  <li>Following age-appropriate content guidelines</li>
                </ul>
                
                <h3 className="text-xl font-medium text-purple-400 mt-6">Account Security</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use strong, unique passwords</li>
                  <li>Notify us immediately of any unauthorized account access</li>
                  <li>Take responsibility for all activities under your account</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Prohibited Uses</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You may not use our Service:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
                <li>To interfere with or circumvent the security features of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Third-Party Content and Services</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-purple-400">Content Sources</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our Service aggregates content from various third-party sources. We do not control, 
                  endorse, or assume responsibility for any third-party content, websites, or services 
                  accessed through our platform.
                </p>
                
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-200 font-medium mb-2">Security Notice</h4>
                  <p className="text-yellow-200 text-sm leading-relaxed">
                    Some streaming sources may require disabled iframe sandboxing, which could expose you to:
                  </p>
                  <ul className="list-disc list-inside text-yellow-200 text-sm space-y-1 mt-2">
                    <li>Third-party advertisements and pop-ups</li>
                    <li>Potential tracking scripts</li>
                    <li>Redirect attempts</li>
                  </ul>
                  <p className="text-yellow-200 text-sm mt-2">
                    <strong>Recommendation:</strong> Use ad-blockers and privacy-focused browsers for enhanced protection.
                  </p>
                </div>

                <h3 className="text-xl font-medium text-purple-400 mt-6">Authentication Services</h3>
                <p className="text-gray-300 leading-relaxed">
                  We use Clerk for authentication services. By creating an account, you agree to be bound 
                  by Clerk's terms of service and privacy policy in addition to ours.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. User Accounts</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  When you create an account with us, you must provide information that is accurate, 
                  complete, and current at all times.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>You are responsible for safeguarding the password and all activities under your account</li>
                  <li>We reserve the right to terminate accounts that violate these terms</li>
                  <li>You may delete your account at any time through the settings page</li>
                  <li>We may retain certain information as required by law or for legitimate business purposes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Intellectual Property Rights</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-purple-400">Our Content</h3>
                <p className="text-gray-300 leading-relaxed">
                  The Service and its original content, features, and functionality are and will remain 
                  the exclusive property of Miko and its licensors. The Service is protected by copyright, 
                  trademark, and other laws.
                </p>
                
                <h3 className="text-xl font-medium text-purple-400">User Content</h3>
                <p className="text-gray-300 leading-relaxed">
                  By uploading content (such as profile pictures), you grant us a non-exclusive, 
                  royalty-free license to use, modify, and display such content in connection with the Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the Service, to understand our practices. By using our Service, you agree 
                to the collection and use of information in accordance with our{' '}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Disclaimers</h2>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-medium text-purple-400 mb-4">Service Availability</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We do not guarantee that the Service will be available at all times. We may experience 
                  hardware, software, or other problems or need to perform maintenance related to the Service.
                </p>
                
                <h3 className="text-xl font-medium text-purple-400 mb-4">Content Disclaimer</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  The information on this Service is provided on an "as is" basis. To the fullest extent 
                  permitted by law, we exclude all representations, warranties, and conditions relating to 
                  our Service and the use of this Service.
                </p>
                
                <h3 className="text-xl font-medium text-purple-400 mb-4">Educational Purpose</h3>
                <p className="text-gray-300 leading-relaxed">
                  This Service is provided for educational and informational purposes only. We do not 
                  encourage or endorse any illegal activities or copyright infringement.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">10. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                In no event shall Miko, its directors, employees, partners, agents, suppliers, or affiliates 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including 
                without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
                from your use of the Service.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Use of or inability to use the Service</li>
                <li>Unauthorized access to or alteration of your transmissions or data</li>
                <li>Statements or conduct of any third party on the Service</li>
                <li>Any other matter relating to the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">11. Termination</h2>
              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We may terminate or suspend your account immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Upon termination, your right to use the Service will cease immediately. If you wish to 
                  terminate your account, you may simply discontinue using the Service or contact us 
                  for account deletion.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">12. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of your jurisdiction, without 
                regard to its conflict of law provisions. Our failure to enforce any right or provision 
                of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">13. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new 
                terms taking effect.
              </p>
              <p className="text-gray-300 leading-relaxed">
                What constitutes a material change will be determined at our sole discretion. By continuing 
                to access or use our Service after those revisions become effective, you agree to be bound 
                by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">14. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <ul className="text-gray-300 space-y-2">
                  <li><strong>Email:</strong> legal@miko-stream.app</li>
                  <li><strong>Contact Page:</strong> <Link href="/contact" className="text-purple-400 hover:text-purple-300">miko-stream.app/contact</Link></li>
                  <li><strong>GitHub:</strong> <a href="https://github.com/mdtahseen7" className="text-purple-400 hover:text-purple-300">@mdtahseen7</a></li>
                </ul>
              </div>
            </section>

            <section className="border-t border-gray-800 pt-8">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-red-200 font-semibold mb-3">Final Disclaimer</h3>
                <p className="text-red-200 leading-relaxed text-sm">
                  <strong>IMPORTANT:</strong> Miko is an educational project that aggregates links to 
                  third-party streaming sources. We do not host, store, upload, or provide any video content. 
                  All content is provided by external sources. Users are solely responsible for ensuring 
                  their compliance with applicable laws and regulations in their jurisdiction. The developers 
                  and operators of Miko assume no responsibility for how the service is used or for any 
                  legal consequences that may arise from its use.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
