'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
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
  
    window.location.href = `/?view=${view}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        currentView="about"
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] bg-clip-text text-transparent">
            About Miko
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A modern, educational streaming platform that breaks down barriers to quality entertainment, 
            making movies, TV shows, and live sports accessible to everyone.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              At Miko, we believe that quality entertainment should not be locked behind multiple paywalls. 
              Our mission is to democratize access to movies, TV shows, and live sports by aggregating 
              content from various sources into one seamless platform.
            </p>
            <p className="text-gray-300 leading-relaxed text-lg">
              We are committed to providing a user-friendly, secure, and comprehensive streaming experience 
              while maintaining transparency about our sources and encouraging responsible usage.
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Educational Focus</h3>
              <p className="text-gray-300">
                Miko is designed as an educational project to demonstrate modern web technologies 
                and streaming aggregation techniques.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">What Makes Miko Special</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Multiple Sources</h3>
              <p className="text-gray-400">
                Access content from 20+ streaming sources, ensuring availability and quality options for all users.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Security First</h3>
              <p className="text-gray-400">
                Smart iframe sandboxing, security warnings, and ad-blocker recommendations keep you safe while streaming.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">User Experience</h3>
              <p className="text-gray-400">
                Personalized profiles, watch later lists, and a modern interface designed for seamless entertainment.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Built with Modern Technology</h2>
          <div className="bg-gray-900/30 rounded-2xl p-8 border border-gray-700">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-3 border border-gray-600">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Next.js</h4>
                <p className="text-gray-400 text-sm">React framework for production</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">TS</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">TypeScript</h4>
                <p className="text-gray-400 text-sm">Type-safe JavaScript</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">TW</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Tailwind CSS</h4>
                <p className="text-gray-400 text-sm">Utility-first CSS framework</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Clerk</h4>
                <p className="text-gray-400 text-sm">Authentication & user management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Meet the Developer</h2>
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30">
              <div className="w-24 h-24 bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">MT</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">MD Tahseen</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Full-stack developer passionate about creating accessible, user-friendly applications. 
                Miko represents a journey into modern streaming technology, demonstrating the power of 
                React, Next.js, and thoughtful user experience design.
              </p>
              <div className="flex justify-center space-x-4">
                <a 
                  href="https://github.com/mdtahseen7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/in/md-tahseen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Start Streaming?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Miko for their entertainment needs. 
            Create your account today and discover a world of movies, TV shows, and live sports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-gradient-to-r from-[#8A2BE2] to-[#FF6EC4] text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Start Watching Now
            </Link>
            <Link 
              href="/contact"
              className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-600"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900/50 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">Have Questions?</h3>
          <p className="text-gray-400 mb-6">
            Check out our documentation, privacy policy, or get in touch with our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
