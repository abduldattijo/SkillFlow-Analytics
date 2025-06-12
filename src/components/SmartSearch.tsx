"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, TrendingUp, Clock, Sparkles, X } from 'lucide-react';

interface SearchSuggestion {
  text: string;
  type: 'skill' | 'role' | 'company' | 'location';
  count: number;
  trend: 'hot' | 'rising' | 'stable';
  confidence: number;
}

interface SearchFilter {
  experience: string[];
  location: string[];
  skills: string[];
  salaryRange: [number, number];
  remote: boolean;
}

interface SmartSearchProps {
  onSearch: (query: string, filters?: SearchFilter) => void;
  initialQuery?: string;
  isLoading?: boolean;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ onSearch, initialQuery = '', isLoading = false }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    experience: [],
    location: [],
    skills: [],
    salaryRange: [50000, 200000],
    remote: false
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smart suggestions data
  const smartSuggestions = {
    skills: [
      { text: 'React Developer', count: 1247, trend: 'hot' as const, confidence: 0.95 },
      { text: 'Python Engineer', count: 2156, trend: 'rising' as const, confidence: 0.92 },
      { text: 'Machine Learning', count: 892, trend: 'hot' as const, confidence: 0.89 },
      { text: 'TypeScript', count: 756, trend: 'rising' as const, confidence: 0.87 },
      { text: 'DevOps Engineer', count: 654, trend: 'rising' as const, confidence: 0.85 },
      { text: 'Full Stack', count: 1834, trend: 'stable' as const, confidence: 0.83 },
      { text: 'Data Scientist', count: 976, trend: 'hot' as const, confidence: 0.91 },
      { text: 'Node.js', count: 567, trend: 'stable' as const, confidence: 0.79 }
    ],
    roles: [
      { text: 'Senior Software Engineer', count: 1456, trend: 'stable' as const, confidence: 0.94 },
      { text: 'Frontend Developer', count: 1123, trend: 'rising' as const, confidence: 0.88 },
      { text: 'Backend Engineer', count: 934, trend: 'stable' as const, confidence: 0.86 },
      { text: 'Product Manager', count: 723, trend: 'rising' as const, confidence: 0.81 }
    ],
    companies: [
      { text: 'Google', count: 234, trend: 'stable' as const, confidence: 0.98 },
      { text: 'Microsoft', count: 198, trend: 'stable' as const, confidence: 0.97 },
      { text: 'Meta', count: 156, trend: 'rising' as const, confidence: 0.95 },
      { text: 'Netflix', count: 89, trend: 'stable' as const, confidence: 0.92 }
    ],
    locations: [
      { text: 'San Francisco', count: 3456, trend: 'stable' as const, confidence: 0.96 },
      { text: 'New York', count: 2789, trend: 'stable' as const, confidence: 0.95 },
      { text: 'Berlin', count: 1245, trend: 'rising' as const, confidence: 0.89 },
      { text: 'Remote', count: 4567, trend: 'hot' as const, confidence: 0.98 }
    ]
  };

  // Generate contextual suggestions based on input
  const generateSuggestions = useCallback((input: string): SearchSuggestion[] => {
    if (!input.trim()) {
      // Show trending searches when empty
      return [
        ...smartSuggestions.skills.slice(0, 3).map(s => ({ ...s, type: 'skill' as const })),
        ...smartSuggestions.roles.slice(0, 2).map(s => ({ ...s, type: 'role' as const }))
      ];
    }

    const searchTerm = input.toLowerCase();
    const allSuggestions = [
      ...smartSuggestions.skills.map(s => ({ ...s, type: 'skill' as const })),
      ...smartSuggestions.roles.map(s => ({ ...s, type: 'role' as const })),
      ...smartSuggestions.companies.map(s => ({ ...s, type: 'company' as const })),
      ...smartSuggestions.locations.map(s => ({ ...s, type: 'location' as const }))
    ];

    // Filter by relevance
    return allSuggestions
      .filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchTerm) ||
        searchTerm.split(' ').some(term =>
          suggestion.text.toLowerCase().includes(term)
        )
      )
      .sort((a, b) => {
        // Sort by relevance score
        const aScore = a.confidence * (a.text.toLowerCase().indexOf(searchTerm) === 0 ? 1.2 : 1);
        const bScore = b.confidence * (b.text.toLowerCase().indexOf(searchTerm) === 0 ? 1.2 : 1);
        return bScore - aScore;
      })
      .slice(0, 6);
  }, []);

  // Handle input change with debounced suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showSuggestions) {
        setSuggestions(generateSuggestions(query));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, showSuggestions, generateSuggestions]);

  // Handle search execution
  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    // Add to recent searches
    setRecentSearches(prev => {
      const newRecent = [finalQuery, ...prev.filter(s => s !== finalQuery)].slice(0, 5);
      return newRecent;
    });

    setShowSuggestions(false);
    onSearch(finalQuery, filters);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  // Handle filter changes
  const updateFilter = (key: keyof SearchFilter, value: string[] | [number, number] | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hot': return <Sparkles className="w-3 h-3 text-red-500" />;
      case 'rising': return <TrendingUp className="w-3 h-3 text-green-500" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill': return '🔧';
      case 'role': return '👔';
      case 'company': return '🏢';
      case 'location': return '📍';
      default: return '🔍';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-200 ${
        showSuggestions 
          ? 'border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}>
        <div className="flex items-center px-4 py-3">
          <Search className={`w-5 h-5 mr-3 transition-colors ${
            showSuggestions ? 'text-blue-500' : 'text-gray-400'
          }`} />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              } else if (e.key === 'Escape') {
                setShowSuggestions(false);
              }
            }}
            placeholder="Search for skills, roles, companies, or locations..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg"
            disabled={isLoading}
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center space-x-2 ml-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-black/10 dark:shadow-black/30 z-50 overflow-hidden">
          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect({ text: search, type: 'skill', count: 0, trend: 'stable', confidence: 1 })}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="max-h-80 overflow-y-auto">
            {suggestions.length > 0 ? (
              <div className="p-2">
                {!query && (
                  <div className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending Searches</span>
                  </div>
                )}

                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {suggestion.text}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {suggestion.type} • {suggestion.count.toLocaleString()} professionals
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(suggestion.trend)}
                      <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          style={{ width: `${suggestion.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No suggestions found for &ldquo;{query}&rdquo;</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Search anyway
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-black/10 dark:shadow-black/30 z-40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience Level
              </label>
              <div className="space-y-2">
                {['Entry Level', 'Mid Level', 'Senior Level', 'Executive'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.experience.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFilter('experience', [...filters.experience, level]);
                        } else {
                          updateFilter('experience', filters.experience.filter(l => l !== level));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <div className="space-y-2">
                {['San Francisco', 'New York', 'Berlin', 'Remote', 'London'].map(location => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFilter('location', [...filters.location, location]);
                        } else {
                          updateFilter('location', filters.location.filter(l => l !== location));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Range
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="30000"
                  max="300000"
                  step="10000"
                  value={filters.salaryRange[1]}
                  onChange={(e) => updateFilter('salaryRange', [filters.salaryRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>${filters.salaryRange[0].toLocaleString()}</span>
                  <span>${filters.salaryRange[1].toLocaleString()}+</span>
                </div>

                <label className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => updateFilter('remote', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remote-friendly only</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setFilters({
                experience: [],
                location: [],
                skills: [],
                salaryRange: [50000, 200000],
                remote: false
              })}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                setShowFilters(false);
                handleSearch();
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;