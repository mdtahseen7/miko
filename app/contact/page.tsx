'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        currentView="contact"
        showSearch={showSearch}
        searchQuery={searchQuery}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={handleViewChange}
        onSearchToggle={handleSearchToggle}
        onSearchChange={handleSearchChange}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 py-32 pt-40">{/* Added pt-40 to account for navbar */}
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions, feedback, or need support? We would love to hear from you. 
            Reach out through any of the channels below or send us a message.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Contact Information</h2>
              
              <div className="space-y-6">
                {/* GitHub */}
                <div className="flex items-start space-x-4 p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">GitHub</h3>
                    <p className="text-gray-400 mb-2">Report issues, contribute, or follow development</p>
                    <a 
                      href="https://github.com/mdtahseen7" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      github.com/mdtahseen7
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Email Support</h3>
                    <p className="text-gray-400 mb-2">General inquiries and support requests</p>
                    <a 
                      href="mailto:support@miko-stream.app" 
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      support@miko-stream.app
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-start space-x-4 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Response Time</h3>
                    <p className="text-gray-400">We aim to respond within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="bg-gray-900/50 rounded-lg border border-gray-700">
                  <summary className="p-4 cursor-pointer text-white hover:text-purple-400 transition-colors">
                    How do I report a broken streaming source?
                  </summary>
                  <div className="px-4 pb-4 text-gray-400">
                    You can report broken sources by creating an issue on our GitHub repository or sending us an email with the specific source and content details.
                  </div>
                </details>
                
                <details className="bg-gray-900/50 rounded-lg border border-gray-700">
                  <summary className="p-4 cursor-pointer text-white hover:text-purple-400 transition-colors">
                    Is Miko safe to use?
                  </summary>
                  <div className="px-4 pb-4 text-gray-400">
                    Miko aggregates content from third-party sources. We recommend using ad-blockers and privacy-focused browsers for enhanced security when streaming content.
                  </div>
                </details>
                
                <details className="bg-gray-900/50 rounded-lg border border-gray-700">
                  <summary className="p-4 cursor-pointer text-white hover:text-purple-400 transition-colors">
                    Can I contribute to the project?
                  </summary>
                  <div className="px-4 pb-4 text-gray-400">
                    Yes! Miko is open source. You can contribute by reporting issues, submitting pull requests, or helping with documentation on our GitHub repository.
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Send us a Message</h2>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-gray-400"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                    Type of Inquiry
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                  >
                    <option value="general">General Question</option>
                    <option value="support">Technical Support</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="privacy">Privacy Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-gray-400"
                    placeholder="Brief description of your message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-gray-400 resize-vertical"
                    placeholder="Please provide detailed information about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Sending…</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-400">Thank you for contacting us. We&#39;ll get back to you soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-gray-900/30 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-center text-white">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/" className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-colors group">
              <div className="w-12 h-12 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0H8v0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2 group-hover:text-purple-400 transition-colors">Documentation</h3>
              <p className="text-gray-400">Browse our documentation for setup and usage guides</p>
            </Link>

            <Link href="/privacy" className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-colors group">
              <div className="w-12 h-12 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2 group-hover:text-purple-400 transition-colors">Privacy Policy</h3>
              <p className="text-gray-400">Learn how we protect your data and privacy</p>
            </Link>

            <a href="https://github.com/mdtahseen7" target="_blank" rel="noopener noreferrer" className="bg-gray-900/50 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-colors group">
              <div className="w-12 h-12 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2 group-hover:text-purple-400 transition-colors">GitHub Repository</h3>
              <p className="text-gray-400">Contribute to the project or report issues</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
