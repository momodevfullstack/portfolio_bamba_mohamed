'use client';

import { useState } from 'react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');

  // Données simulées pour les analytics
  const analyticsData = {
    visitors: {
      total: 15420,
      change: '+12.5%',
      chart: [1200, 1350, 1420, 1180, 1650, 1890, 2100]
    },
    pageViews: {
      total: 45680,
      change: '+8.3%',
      chart: [4200, 4800, 5200, 4100, 5800, 6200, 6900]
    },
    bounceRate: {
      total: '32.5%',
      change: '-2.1%',
      chart: [35, 34, 33, 36, 32, 31, 32.5]
    },
    avgSession: {
      total: '2m 45s',
      change: '+15.2%',
      chart: [120, 135, 142, 118, 165, 189, 165]
    }
  };

  const topPages = [
    { page: '/', views: 12450, percentage: 27.2 },
    { page: '/portfolio', views: 8960, percentage: 19.6 },
    { page: '/services', views: 6780, percentage: 14.8 },
    { page: '/contact', views: 5420, percentage: 11.9 },
    { page: '/portfolio/ai-support-assistant', views: 4230, percentage: 9.3 },
    { page: '/about', views: 3890, percentage: 8.5 },
  ];

  const trafficSources = [
    { source: 'Direct', visits: 6540, percentage: 42.4 },
    { source: 'Google', visits: 4230, percentage: 27.4 },
    { source: 'LinkedIn', visits: 2180, percentage: 14.1 },
    { source: 'GitHub', visits: 1560, percentage: 10.1 },
    { source: 'Autres', visits: 910, percentage: 5.9 },
  ];

  const devices = [
    { device: 'Desktop', visits: 8940, percentage: 58.0 },
    { device: 'Mobile', visits: 5480, percentage: 35.5 },
    { device: 'Tablet', visits: 1000, percentage: 6.5 },
  ];

  const countries = [
    { country: 'France', visits: 8920, percentage: 57.8 },
    { country: 'Canada', visits: 2340, percentage: 15.2 },
    { country: 'Belgique', visits: 1890, percentage: 12.3 },
    { country: 'Suisse', visits: 1560, percentage: 10.1 },
    { country: 'Autres', visits: 710, percentage: 4.6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Analysez les performances de votre site</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visiteurs</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.visitors.total.toLocaleString()}</p>
              <p className="text-sm text-green-600">{analyticsData.visitors.change}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pages vues</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.pageViews.total.toLocaleString()}</p>
              <p className="text-sm text-green-600">{analyticsData.pageViews.change}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de rebond</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.bounceRate.total}</p>
              <p className="text-sm text-red-600">{analyticsData.bounceRate.change}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Durée moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.avgSession.total}</p>
              <p className="text-sm text-green-600">{analyticsData.avgSession.change}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pages les plus visitées</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 w-8">{index + 1}.</span>
                    <span className="text-sm text-gray-600 ml-2">{page.page}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${page.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Sources de trafic</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {source.visits.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device and Location Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Appareils</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {devices.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{device.device}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {device.visits.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Countries */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pays</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {countries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{country.country}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${country.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {country.visits.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
