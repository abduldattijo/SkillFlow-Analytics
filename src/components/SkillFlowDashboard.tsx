"use client";

import React, { useState } from 'react';
import { Search, TrendingUp, Users, MapPin, Award, Loader, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Types
interface SkillAnalytics {
  skillName: string;
  frequency: number;
  avgProficiency: number;
  industries: string[];
  experienceLevels: {
    novice: number;
    intermediate: number;
    advanced: number;
    expert: number;
  };
  trend: 'rising' | 'stable' | 'declining';
}

interface LocationData {
  country: string;
  count: number;
}

interface SearchAnalytics {
  totalProfiles: number;
  skillAnalytics: SkillAnalytics[];
  locationDistribution: LocationData[];
  profiles: Array<{
    name: string;
    username: string;
    headline?: string;
    topSkills: string[];
    location?: string;
  }>;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const SkillFlowDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');
  const [searchResults, setSearchResults] = useState<SearchAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery, limit: 50 }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down';
    trendValue?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trendValue}
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );

  const TrendIndicator = ({ trend }: { trend: 'rising' | 'stable' | 'declining' }) => {
    const colors = {
      rising: 'text-green-500 bg-green-100',
      stable: 'text-yellow-500 bg-yellow-100',
      declining: 'text-red-500 bg-red-100'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[trend]}`}>
        {trend}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SkillFlow Analytics</h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
              <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                ✨ Demo Mode
              </span>
              <span>Powered by Torre.ai-like Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Talent Search & Analytics</h2>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for skills, roles, or keywords... (e.g., 'Python developer', 'React', 'Data Scientist')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Analyzing...' : 'Search'}</span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {/* Demo Data Notice */}
          {searchResults && (searchResults as any).isDemo && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  ✨ Demo Mode - Realistic Torre-like Data
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {(searchResults as any).demoMessage || 'This demonstrates SkillFlow Analytics with realistic demo data that mimics Torre\'s API structure and responses.'}
                </p>
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <strong>Try these searches:</strong> "python", "javascript", "react", "data scientist", "devops"
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {searchResults && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Profiles"
                value={searchResults.totalProfiles.toLocaleString()}
                icon={Users}
                trend="up"
                trendValue="+12% vs last search"
              />
              <StatCard
                title="Unique Skills"
                value={searchResults.skillAnalytics.length}
                icon={Award}
                trend="up"
                trendValue={`${searchResults.skillAnalytics.filter(s => s.trend === 'rising').length} trending`}
              />
              <StatCard
                title="Countries"
                value={searchResults.locationDistribution.length}
                icon={MapPin}
              />
              <StatCard
                title="Analyzed Profiles"
                value={searchResults.profiles.length}
                icon={TrendingUp}
                trend="up"
                trendValue="Deep analysis"
              />
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'skills', name: 'Skill Trends', icon: TrendingUp },
                    { id: 'locations', name: 'Geographic Distribution', icon: MapPin },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Skills by Frequency</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Based on {searchResults.profiles.length} analyzed profiles
                      </p>
                    </div>

                    {/* Skills Bar Chart */}
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={searchResults.skillAnalytics.slice(0, 10)}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis
                            dataKey="skillName"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            className="text-xs"
                          />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              border: 'none',
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Bar dataKey="frequency" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Skills Table */}
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Skill</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Frequency</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg Proficiency</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trend</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {searchResults.skillAnalytics.slice(0, 10).map((skill) => (
                            <tr key={skill.skillName} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {skill.skillName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {skill.frequency} profiles
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {skill.avgProficiency.toFixed(1)}/4.0
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <TrendIndicator trend={skill.trend} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'locations' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Geographic Distribution</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Pie Chart */}
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={searchResults.locationDistribution.slice(0, 5)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({country, percent}) => `${country} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {searchResults.locationDistribution.slice(0, 5).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Location List */}
                      <div className="space-y-3">
                        {searchResults.locationDistribution.slice(0, 8).map((location, index) => (
                          <div key={location.country} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium text-gray-900 dark:text-white">{location.country}</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-300">{location.count} profiles</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!searchResults && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              ✨ Discover Talent Insights with Demo Data
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              Experience SkillFlow Analytics with realistic demo data that showcases the full power of Torre-like talent analytics and insights.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 max-w-lg mx-auto">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🎯 Try These Demo Searches:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 text-blue-700 dark:text-blue-300 font-medium">
                  "python"
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 text-purple-700 dark:text-purple-300 font-medium">
                  "javascript"
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 text-green-700 dark:text-green-300 font-medium">
                  "react"
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 text-orange-700 dark:text-orange-300 font-medium">
                  "data scientist"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillFlowDashboard;