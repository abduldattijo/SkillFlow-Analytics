// src/app/api/search/route.ts - DEMO VERSION
import { NextRequest, NextResponse } from 'next/server';
import { torreAPI } from '@/lib/torre-api';
import { SkillAnalyzer } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { query, limit = 30 } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Demo Search for: "${query}"`);

    // Use demo API
    const searchResults = await torreAPI.searchPeople(query, limit);

    if (searchResults.length === 0) {
      return NextResponse.json({
        totalProfiles: 0,
        skillAnalytics: [],
        locationDistribution: [],
        profiles: [],
        message: `No demo profiles found for "${query}". Try: "python", "javascript", "react", "data scientist"`,
        isDemo: true
      });
    }

    console.log(`✅ Found ${searchResults.length} demo profiles`);

    // Get detailed genomes for analysis
    const usernames = searchResults
      .filter(result => result.username)
      .map(result => result.username)
      .slice(0, Math.min(15, searchResults.length)); // Limit for performance

    const genomes = await torreAPI.batchGetGenomes(usernames);

    console.log(`✅ Analyzed ${genomes.length} detailed profiles`);

    // Perform analytics
    const skillAnalytics = SkillAnalyzer.analyzeSkills(genomes);
    const locationDistribution = SkillAnalyzer.getLocationDistribution(genomes);

    // Create profile summaries
    const profiles = genomes.map(genome => ({
      name: genome.person.name,
      username: genome.person.username,
      headline: genome.person.professionalHeadline,
      topSkills: genome.skills.slice(0, 5).map(s => s.name),
      location: genome.person.location?.name
    }));

    const analytics = {
      totalProfiles: searchResults.length,
      skillAnalytics: skillAnalytics.slice(0, 15),
      locationDistribution,
      profiles,
      isDemo: true,
      demoMessage: `Showing realistic demo data for "${query}". This demonstrates the full analytics capabilities with Torre-like data structure.`
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Demo Search API error:', error);

    return NextResponse.json(
      {
        error: 'Demo search failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        isDemo: true
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SkillFlow Analytics Demo API',
    availableQueries: [
      'python - Python developers and data scientists',
      'javascript - JavaScript and Node.js developers',
      'react - React and frontend developers',
      'data scientist - Data science professionals',
      'devops - DevOps and infrastructure engineers'
    ],
    note: 'This demo uses realistic fake data that mimics Torre\'s API structure and responses.',
    isDemo: true
  });
}