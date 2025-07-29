'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { availableSources } from '@/lib/sources';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import Navbar from '@/components/Navbar';

export default function SettingsPage() {
  const router = useRouter();
  const [preferredSource, setPreferredSource] = useState('');
  const [defaultQuality, setDefaultQuality] = useState('720p');
  const [autoPlay, setAutoPlay] = useState(true);
  const [watchLater, setWatchLater] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchLaterCount, setWatchLaterCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    loadSettings();
    loadWatchLater();
    
    // Handle scroll for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadSettings = () => {
    setPreferredSource(getLocalStorage('preferredSource', availableSources[0]?.id || ''));
    setDefaultQuality(getLocalStorage('defaultQuality', '720p'));
    setAutoPlay(getLocalStorage('autoPlay', true));
  };

  const loadWatchLater = () => {
    const saved = getLocalStorage('watchLater', []);
    setWatchLater(saved);
    setWatchLaterCount(saved.length);
  };

  const saveSettings = () => {
    setLocalStorage('preferredSource', preferredSource);
    setLocalStorage('defaultQuality', defaultQuality);
    setLocalStorage('autoPlay', autoPlay);
    alert('Settings saved successfully!');
  };

  const clearWatchLater = () => {
    if (confirm('Are you sure you want to clear your watch later list?')) {
      setWatchLater([]);
      setLocalStorage('watchLater', []);
      setWatchLaterCount(0);
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all stored data? This will reset all settings and clear your watch later list.')) {
      localStorage.clear();
      loadSettings();
      loadWatchLater();
      alert('All data cleared successfully!');
    }
  };

  const handleViewChange = (view: string) => {
    if (view === 'home') {
      router.push('/');
    } else if (view === 'livesports') {
      router.push('/livesports');
    } else if (view === 'settings') {
      // Already on settings page
      return;
    } else {
      router.push(`/?view=${view}`);
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar
        currentView="settings"
        showSearch={showSearch}
        searchQuery={searchQuery}
        watchLaterCount={watchLaterCount}
        isScrolled={isScrolled}
        onViewChange={handleViewChange}
        onSearchToggle={handleSearchToggle}
        onSearchChange={handleSearchChange}
      />

      {/* Main content */}
      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Settings</h1>
            <p className="text-gray-400">Customize your Nova streaming experience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Playback Settings */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 000-5H9v5zm0 0H7.5a2.5 2.5 0 000 5H9v-5zm0 0v5m0-5h2.5m-.5-2a2.5 2.5 0 000-5m0 5v5" />
                </svg>
                Playback Settings
              </h2>
              
              <div className="space-y-6">
                {/* Preferred Source */}
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Video Source</label>
                  <select
                    value={preferredSource}
                    onChange={(e) => setPreferredSource(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  >
                    {availableSources.map(source => (
                      <option key={source.id} value={source.id}>
                        {source.name} {source.requiresNoSandbox ? '(Ads Possible)' : '(Secure)'}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-400 mt-1">
                    Default video source for playback
                  </p>
                </div>

                {/* Default Quality */}
                <div>
                  <label className="block text-sm font-medium mb-2">Default Quality</label>
                  <select
                    value={defaultQuality}
                    onChange={(e) => setDefaultQuality(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-red-500 focus:outline-none"
                  >
                    <option value="1080p">1080p (Full HD)</option>
                    <option value="720p">720p (HD)</option>
                    <option value="480p">480p (SD)</option>
                    <option value="auto">Auto (Recommended)</option>
                  </select>
                  <p className="text-sm text-gray-400 mt-1">
                    Preferred video quality when available
                  </p>
                </div>

                {/* Auto Play */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoPlay}
                      onChange={(e) => setAutoPlay(e.target.checked)}
                      className="mr-3 w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium">Auto-play next episode</span>
                  </label>
                  <p className="text-sm text-gray-400 mt-1 ml-7">
                    Automatically play the next episode for TV shows
                  </p>
                </div>
              </div>

              <button
                onClick={saveSettings}
                className="w-full mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>

            {/* Data Management */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Data Management
              </h2>
              
              <div className="space-y-6">
                {/* Watch Later Info */}
                <div>
                  <h3 className="font-medium mb-2">Watch Later</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    You have {watchLater.length} items in your watch later list
                  </p>
                  <button
                    onClick={clearWatchLater}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                  >
                    Clear Watch Later
                  </button>
                </div>

                {/* Storage Info */}
                <div>
                  <h3 className="font-medium mb-2">Storage</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Clear all stored data including settings and watch later list
                  </p>
                  <button
                    onClick={clearAllData}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="mt-8 bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About Nova
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium mb-2">Version Information</h3>
                <p className="text-gray-400">Nova Streaming Platform v2.0</p>
                <p className="text-gray-400">Built with Next.js and React</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Features</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• HD/4K Video Streaming</li>
                  <li>• TV Shows & Movies</li>
                  <li>• Live Sports</li>
                  <li>• Watch Later List</li>
                  <li>• Multiple Video Sources</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
