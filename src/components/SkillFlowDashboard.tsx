"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, TrendingUp, Users, MapPin, Award, AlertCircle, Loader, BarChart3, Globe, Brain, Zap, Target, Network, Star } from 'lucide-react';

// Types
type TabType = 'overview' | 'skills' | 'locations' | 'ai-insights' | 'network';

interface SearchFilter {
  experience: string[];
  location: string[];
  skills: string[];
  salaryRange: [number, number];
  remote: boolean;
}

interface SkillNode {
  id: string;
  name: string;
  demand: number;
  trend: 'rising' | 'stable' | 'declining';
  size: number;
  connections: string[];
  salary: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SkillConnection {
  source: string;
  target: string;
  strength: number;
}

interface SkillCorrelation {
  skill: string;
  correlation: number;
  confidence: number;
  marketDemand: 'high' | 'medium' | 'low';
  trend: 'rising' | 'stable' | 'declining';
}

interface CareerPath {
  title: string;
  probability: number;
  timeframe: string;
  requiredSkills: string[];
  salaryRange: { min: number; max: number };
}

interface MarketInsight {
  skill: string;
  demand: number;
  supply: number;
  competition: 'low' | 'medium' | 'high';
  opportunities: number;
  averageSalary: number;
  growthRate: number;
}

// Mock Smart Search Component (simplified for demo)
const SmartSearch: React.FC<{ onSearch: (query: string, filters?: SearchFilter) => void; initialQuery?: string; isLoading?: boolean }> = ({ onSearch, initialQuery = '', isLoading = false }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
        <div className="flex items-center px-4 py-3">
          <Search className="w-5 h-5 mr-3 text-gray-400" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for skills, roles, companies, or locations..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none text-lg"
            disabled={isLoading}
          />

          <button
            onClick={handleSearch}
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
  );
};

// Mock AI Intelligence (simplified)
class AISkillIntelligence {
  static analyzeSkillCorrelations(skill: string): SkillCorrelation[] {
    const correlations = {
      'react': [
        { skill: 'JavaScript', correlation: 0.95, confidence: 0.98, marketDemand: 'high' as const, trend: 'rising' as const },
        { skill: 'TypeScript', correlation: 0.78, confidence: 0.92, marketDemand: 'high' as const, trend: 'rising' as const },
        { skill: 'Node.js', correlation: 0.72, confidence: 0.89, marketDemand: 'medium' as const, trend: 'stable' as const }
      ],
      'python': [
        { skill: 'Django', correlation: 0.68, confidence: 0.91, marketDemand: 'high' as const, trend: 'stable' as const },
        { skill: 'FastAPI', correlation: 0.45, confidence: 0.83, marketDemand: 'high' as const, trend: 'rising' as const },
        { skill: 'Machine Learning', correlation: 0.55, confidence: 0.79, marketDemand: 'high' as const, trend: 'rising' as const }
      ],
      'javascript': [
        { skill: 'HTML5', correlation: 0.92, confidence: 0.97, marketDemand: 'high' as const, trend: 'stable' as const },
        { skill: 'CSS3', correlation: 0.89, confidence: 0.95, marketDemand: 'medium' as const, trend: 'stable' as const },
        { skill: 'React', correlation: 0.73, confidence: 0.91, marketDemand: 'high' as const, trend: 'rising' as const }
      ]
    };

    const key = skill.toLowerCase() as keyof typeof correlations;
    return correlations[key] || correlations.react;
  }

  static generateCareerPaths(): CareerPath[] {
    return [
      {
        title: 'Senior Software Engineer',
        probability: 0.78,
        timeframe: '18-24 months',
        requiredSkills: ['System Design', 'Leadership', 'Cloud Architecture'],
        salaryRange: { min: 130000, max: 200000 }
      },
      {
        title: 'Tech Lead',
        probability: 0.65,
        timeframe: '24-36 months',
        requiredSkills: ['Team Management', 'Architecture', 'Mentoring'],
        salaryRange: { min: 150000, max: 230000 }
      }
    ];
  }

  static generateMarketInsights(skills: string[]): MarketInsight[] {
    return skills.map(skill => ({
      skill,
      demand: Math.floor(Math.random() * 40) + 60,
      supply: Math.floor(Math.random() * 30) + 50,
      competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      opportunities: Math.floor(Math.random() * 1000) + 500,
      averageSalary: 100000 + Math.floor(Math.random() * 50000),
      growthRate: Math.floor(Math.random() * 20) + 5
    }));
  }
}

// Interactive Skill Network Visualization (Full Version)
const SkillNetworkVisualization: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [connections, setConnections] = useState<SkillConnection[]>([]);

  // Generate realistic skill network data
  const generateSkillNetwork = useCallback((centerSkill: string) => {
    const skillData = {
      'react': {
        core: { name: 'React', demand: 92, trend: 'rising' as const, salary: 115000 },
        connected: [
          { name: 'JavaScript', demand: 95, trend: 'stable' as const, salary: 110000, strength: 0.9 },
          { name: 'TypeScript', demand: 88, trend: 'rising' as const, salary: 125000, strength: 0.8 },
          { name: 'Node.js', demand: 82, trend: 'stable' as const, salary: 120000, strength: 0.7 },
          { name: 'Redux', demand: 65, trend: 'stable' as const, salary: 118000, strength: 0.6 },
          { name: 'Next.js', demand: 78, trend: 'rising' as const, salary: 128000, strength: 0.65 },
          { name: 'GraphQL', demand: 72, trend: 'rising' as const, salary: 135000, strength: 0.5 },
          { name: 'Jest', demand: 58, trend: 'stable' as const, salary: 112000, strength: 0.55 }
        ]
      },
      'python': {
        core: { name: 'Python', demand: 88, trend: 'rising' as const, salary: 120000 },
        connected: [
          { name: 'Django', demand: 75, trend: 'stable' as const, salary: 118000, strength: 0.8 },
          { name: 'FastAPI', demand: 68, trend: 'rising' as const, salary: 125000, strength: 0.7 },
          { name: 'Machine Learning', demand: 95, trend: 'rising' as const, salary: 145000, strength: 0.75 },
          { name: 'Pandas', demand: 72, trend: 'stable' as const, salary: 115000, strength: 0.65 },
          { name: 'TensorFlow', demand: 85, trend: 'rising' as const, salary: 140000, strength: 0.6 },
          { name: 'PostgreSQL', demand: 78, trend: 'stable' as const, salary: 110000, strength: 0.7 },
          { name: 'Docker', demand: 82, trend: 'rising' as const, salary: 125000, strength: 0.6 }
        ]
      },
      'javascript': {
        core: { name: 'JavaScript', demand: 95, trend: 'stable' as const, salary: 110000 },
        connected: [
          { name: 'React', demand: 92, trend: 'rising' as const, salary: 115000, strength: 0.9 },
          { name: 'Vue.js', demand: 68, trend: 'stable' as const, salary: 108000, strength: 0.6 },
          { name: 'Angular', demand: 72, trend: 'stable' as const, salary: 112000, strength: 0.65 },
          { name: 'Node.js', demand: 82, trend: 'stable' as const, salary: 120000, strength: 0.8 },
          { name: 'TypeScript', demand: 88, trend: 'rising' as const, salary: 125000, strength: 0.75 },
          { name: 'Express', demand: 75, trend: 'stable' as const, salary: 115000, strength: 0.7 }
        ]
      }
    };

    const data = skillData[centerSkill.toLowerCase() as keyof typeof skillData] || skillData.react;
    const width = 600;
    const height = 400;

    // Create nodes
    const allSkills = [data.core, ...data.connected];
    const newNodes: SkillNode[] = allSkills.map((skill, index) => ({
      id: skill.name,
      name: skill.name,
      demand: skill.demand,
      trend: skill.trend,
      size: index === 0 ? 60 : 30 + (skill.demand / 100) * 20,
      connections: index === 0 ? data.connected.map(s => s.name) : [data.core.name],
      salary: skill.salary,
      x: index === 0 ? width / 2 : Math.random() * width,
      y: index === 0 ? height / 2 : Math.random() * height,
      vx: 0,
      vy: 0
    }));

    // Create connections
    const newConnections: SkillConnection[] = data.connected.map(skill => ({
      source: data.core.name,
      target: skill.name,
      strength: skill.strength || 0.5
    }));

    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  // Physics simulation
  const updatePhysics = useCallback(() => {
    if (!isAnimating) return;

    setNodes(prevNodes => {
      const newNodes = [...prevNodes];
      const width = 600;
      const height = 400;
      const centerForce = 0.01;
      const repelForce = 500;
      const attractForce = 0.02;
      const damping = 0.95;

      newNodes.forEach((node, i) => {
        // Center force
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.vx += dx * centerForce;
        node.vy += dy * centerForce;

        // Repel from other nodes
        newNodes.forEach((other, j) => {
          if (i !== j) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = repelForce / (distance * distance);
            node.vx += (dx / distance) * force;
            node.vy += (dy / distance) * force;
          }
        });

        // Attract to connected nodes
        connections.forEach(conn => {
          if (conn.source === node.id || conn.target === node.id) {
            const otherId = conn.source === node.id ? conn.target : conn.source;
            const other = newNodes.find(n => n.id === otherId);
            if (other) {
              const dx = other.x - node.x;
              const dy = other.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = attractForce * conn.strength;
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        });

        // Apply velocity and damping
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;

        // Boundary constraints
        const margin = node.size;
        node.x = Math.max(margin, Math.min(width - margin, node.x));
        node.y = Math.max(margin, Math.min(height - margin, node.y));
      });

      return newNodes;
    });
  }, [connections, isAnimating]);

  // Canvas drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    connections.forEach(conn => {
      const source = nodes.find(n => n.id === conn.source);
      const target = nodes.find(n => n.id === conn.target);

      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${conn.strength * 0.6})`;
        ctx.lineWidth = conn.strength * 4;
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);

      // Color based on trend
      const colors = {
        rising: '#10b981',
        stable: '#6366f1',
        declining: '#ef4444'
      };

      ctx.fillStyle = colors[node.trend];
      ctx.fill();

      // Border
      ctx.strokeStyle = node === selectedSkill ? '#fbbf24' : '#ffffff';
      ctx.lineWidth = node === selectedSkill ? 3 : 2;
      ctx.stroke();

      // Demand indicator
      if (node.demand > 80) {
        ctx.beginPath();
        ctx.arc(node.x + node.size / 3, node.y - node.size / 3, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
      }

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(10, node.size / 4)}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name, node.x, node.y);
    });
  }, [nodes, connections, selectedSkill]);

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance < node.size / 2;
    });

    setSelectedSkill(clickedNode || null);
  };

  // Initialize network when search term changes
  useEffect(() => {
    generateSkillNetwork(searchTerm);
  }, [searchTerm, generateSkillNetwork]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      updatePhysics();
      draw();
    }, 50);

    return () => clearInterval(interval);
  }, [draw, updatePhysics, isAnimating]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Skill Network
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interactive skill correlation visualization
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isAnimating
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {isAnimating ? 'Animating' : 'Paused'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto cursor-pointer"
              onClick={handleCanvasClick}
            />

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Rising</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Stable</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">High Demand</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Details Panel */}
        <div className="space-y-4">
          {selectedSkill ? (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                  {selectedSkill.name}
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Market Demand</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        style={{ width: `${selectedSkill.demand}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedSkill.demand}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trend</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-4 h-4 ${
                      selectedSkill.trend === 'rising' ? 'text-green-500' :
                      selectedSkill.trend === 'stable' ? 'text-blue-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-medium capitalize ${
                      selectedSkill.trend === 'rising' ? 'text-green-600 dark:text-green-400' :
                      selectedSkill.trend === 'stable' ? 'text-blue-600 dark:text-blue-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {selectedSkill.trend}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Salary</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${selectedSkill.salary.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    Connected to {selectedSkill.connections.length} related skills
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click on a skill node to view detailed insights
              </p>
            </div>
          )}

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                AI Insights
              </h4>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {searchTerm} professionals often learn TypeScript next
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  85% correlation with cloud technologies
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  High demand in fintech and healthcare
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const SkillFlowDashboard: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [currentQuery, setCurrentQuery] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(false);

  const handleSearch = async (query: string, filters?: SearchFilter) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          limit: 30,
          filters
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
      setShowAIInsights(true);

      // Auto-show AI insights tab for impressive effect
      setTimeout(() => {
        setActiveTab('ai-insights');
      }, 1000);

    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">SkillFlow Analytics</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI-powered talent intelligence platform for discovering skill trends, market insights, and career opportunities
          </p>
          <div className="mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
              <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                ✨ Demo Mode
              </span>
              <span>Powered by Torre.ai-like Data</span>
            </div>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="mb-8">
          <SmartSearch
            onSearch={handleSearch}
            initialQuery={currentQuery}
            isLoading={isLoading}
          />
        </div>

        {/* Demo Data Notice */}
        {searchResults && (searchResults as Record<string, unknown>).isDemo && (
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
                {(searchResults as Record<string, unknown>).demoMessage as string || 'This demonstrates SkillFlow Analytics with realistic demo data that mimics Torre\'s API structure and responses.'}
              </p>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                <strong>Try these searches:</strong> &ldquo;python&rdquo;, &ldquo;javascript&rdquo;, &ldquo;react&rdquo;, &ldquo;data scientist&rdquo;, &ldquo;devops&rdquo;
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">Search Error</h4>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600 dark:text-gray-300">Analyzing talent data...</span>
            </div>
          </div>
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
                  &ldquo;python&rdquo;
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 text-purple-700 dark:text-purple-300 font-medium">
                  &ldquo;javascript&rdquo;
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 text-green-700 dark:text-green-300 font-medium">
                  &ldquo;react&rdquo;
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2 text-orange-700 dark:text-orange-300 font-medium">
                  &ldquo;data scientist&rdquo;
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Results */}
        {searchResults && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profiles</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{((searchResults as Record<string, unknown>).totalProfiles as number || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Skills Found</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{((searchResults as Record<string, unknown>).skillAnalytics as unknown[] || []).length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Locations</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{((searchResults as Record<string, unknown>).locationDistribution as unknown[] || []).length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Insights</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {showAIInsights ? (
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ready</span>
                      ) : (
                        '...'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
                { id: 'skills' as TabType, label: 'Skills Analysis', icon: Award },
                { id: 'locations' as TabType, label: 'Locations', icon: Globe },
                { id: 'ai-insights' as TabType, label: 'AI Insights', icon: Brain },
                { id: 'network' as TabType, label: 'Skill Network', icon: Network }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'ai-insights' && showAIInsights && (
                    <Zap className="w-3 h-3 text-yellow-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Overview</h3>
                  <div className="space-y-4">
                    {((searchResults as Record<string, unknown>).profiles as Record<string, unknown>[] || []).slice(0, 5).map((profile: Record<string, unknown>, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {(profile.name as string || '').charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{profile.name as string}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{profile.headline as string}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(profile.topSkills as string[] || []).slice(0, 3).map((skill: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Skills */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Skills</h3>
                  <div className="space-y-3">
                    {((searchResults as Record<string, unknown>).skillAnalytics as Record<string, unknown>[] || []).slice(0, 8).map((skill: Record<string, unknown>, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {skill.name as string || `Skill ${index + 1}`}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                              style={{ width: `${Math.min(100, ((skill.frequency as number || 0) / (((searchResults as Record<string, unknown>).skillAnalytics as Record<string, unknown>[] || [])[0]?.frequency as number || 1)) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {skill.frequency as number || 0}
                          </span>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No skill data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Skills Analysis</h3>
                {((searchResults as Record<string, unknown>).skillAnalytics as Record<string, unknown>[] || []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {((searchResults as Record<string, unknown>).skillAnalytics as Record<string, unknown>[] || []).map((skill: Record<string, unknown>, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {skill.name as string || `Skill ${index + 1}`}
                          </h4>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {skill.frequency as number || 0}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            style={{ width: `${Math.min(100, ((skill.frequency as number || 0) / (((searchResults as Record<string, unknown>).skillAnalytics as Record<string, unknown>[] || [])[0]?.frequency as number || 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {skill.percentage as string || '0'}% of profiles
                          </span>
                          {skill.trend && (
                            <span className={`px-2 py-1 rounded-full ${
                              skill.trend === 'rising' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              skill.trend === 'declining' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {skill.trend as string}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No skills data available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'locations' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Geographic Distribution</h3>
                {((searchResults as Record<string, unknown>).locationDistribution as Record<string, unknown>[] || []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {((searchResults as Record<string, unknown>).locationDistribution as Record<string, unknown>[] || []).map((location: Record<string, unknown>, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {location.location as string || `Location ${index + 1}`}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {location.count as number || 0}
                          </span>
                          {location.percentage && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {location.percentage as string}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No location data available</p>
                  </div>
                )}
              </div>
            )}

            {/* AI Insights Tab */}
            {activeTab === 'ai-insights' && showAIInsights && (
              <div className="space-y-8">
                {/* Skill Correlations */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skill Correlation Analysis</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered insights for &ldquo;{currentQuery}&rdquo;</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Correlations */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>Skills Often Found Together</span>
                      </h4>
                      <div className="space-y-3">
                        {AISkillIntelligence.analyzeSkillCorrelations(currentQuery).slice(0, 6).map((corr, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {(corr.correlation * 100).toFixed(0)}%
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">{corr.skill}</span>
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className={`px-2 py-1 rounded-full ${
                                    corr.marketDemand === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    corr.marketDemand === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                  }`}>
                                    {corr.marketDemand} demand
                                  </span>
                                  {corr.trend === 'rising' && (
                                    <span className="text-green-600 dark:text-green-400">↗ trending</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {(corr.confidence * 100).toFixed(0)}% confidence
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Career Paths */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span>Recommended Career Paths</span>
                      </h4>
                      <div className="space-y-4">
                        {AISkillIntelligence.generateCareerPaths().slice(0, 3).map((path, index) => (
                          <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white">{path.title}</h5>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {(path.probability * 100).toFixed(0)}% match
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Timeline: {path.timeframe}
                            </p>
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                              ${path.salaryRange.min.toLocaleString()} - ${path.salaryRange.max.toLocaleString()}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {path.requiredSkills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Insights */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span>Market Intelligence</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {AISkillIntelligence.generateMarketInsights([currentQuery, ...AISkillIntelligence.analyzeSkillCorrelations(currentQuery).slice(0, 2).map(c => c.skill)]).slice(0, 3).map((insight, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">{insight.skill}</h4>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Demand</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                                  style={{ width: `${insight.demand}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{insight.demand}%</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              +{insight.growthRate.toFixed(1)}%
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Salary</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              ${insight.averageSalary.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Competition</span>
                            <span className={`text-sm font-medium ${
                              insight.competition === 'low' ? 'text-green-600 dark:text-green-400' :
                              insight.competition === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {insight.competition}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skill Network Tab */}
            {activeTab === 'network' && (
              <SkillNetworkVisualization searchTerm={currentQuery} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SkillFlowDashboard;