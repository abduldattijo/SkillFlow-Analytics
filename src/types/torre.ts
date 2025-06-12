// src/types/torre.ts
export interface TorreSearchResult {
  name: string;
  username: string;
  picture?: string;
  location?: string;
  professionalTitle?: string;
  summary?: string;
}

export interface TorreGenome {
  person: {
    name: string;
    username: string;
    picture?: string;
    location?: {
      name: string;
      country: string;
    };
    professionalHeadline?: string;
    summary?: string;
  };
  skills: Array<{
    name: string;
    proficiency: 'novice' | 'intermediate' | 'advanced' | 'expert';
    highlightIndex: number;
  }>;
  experiences: Array<{
    category: string;
    name: string;
    organizations: Array<{
      name: string;
      picture?: string;
    }>;
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
    responsibilities?: string[];
  }>;
  education: Array<{
    category: string;
    name: string;
    organizations: Array<{
      name: string;
    }>;
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
  interests: Array<{
    name: string;
  }>;
}

export interface SkillAnalytics {
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

export interface LocationData {
  country: string;
  count: number;
}

export interface SearchAnalytics {
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