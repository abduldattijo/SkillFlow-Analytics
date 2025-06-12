// src/lib/torre-api.ts - ENHANCED DEMO VERSION
interface TorreSearchResult {
  name: string;
  username: string;
  picture?: string;
  location?: string;
  professionalTitle?: string;
  summary?: string;
}

interface TorreGenome {
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

export class SkillAnalyzer {
  static analyzeSkills(genomes: TorreGenome[]): any[] {
    const skillCounts = new Map<string, number>();
    const totalProfiles = genomes.length;

    // Count skill frequencies
    genomes.forEach(genome => {
      genome.skills.forEach(skill => {
        const count = skillCounts.get(skill.name) || 0;
        skillCounts.set(skill.name, count + 1);
      });
    });

    // Convert to array and sort by frequency
    const skills = Array.from(skillCounts.entries())
      .map(([name, frequency]) => ({
        name,
        frequency,
        percentage: ((frequency / totalProfiles) * 100).toFixed(1),
        trend: this.getSkillTrend(name),
        demand: this.getSkillDemand(name)
      }))
      .sort((a, b) => b.frequency - a.frequency);

    return skills;
  }

  static getLocationDistribution(genomes: TorreGenome[]): any[] {
    const locationCounts = new Map<string, number>();

    genomes.forEach(genome => {
      const location = genome.person.location?.name || 'Unknown';
      const count = locationCounts.get(location) || 0;
      locationCounts.set(location, count + 1);
    });

    return Array.from(locationCounts.entries())
      .map(([location, count]) => ({
        location,
        count,
        percentage: ((count / genomes.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private static getSkillTrend(skillName: string): 'rising' | 'stable' | 'declining' {
    const risingSkills = ['TypeScript', 'React', 'Docker', 'Kubernetes', 'Machine Learning', 'Python'];
    const decliningSkills = ['jQuery', 'Flash', 'Silverlight'];

    if (risingSkills.some(skill => skillName.toLowerCase().includes(skill.toLowerCase()))) {
      return 'rising';
    }
    if (decliningSkills.some(skill => skillName.toLowerCase().includes(skill.toLowerCase()))) {
      return 'declining';
    }
    return 'stable';
  }

  private static getSkillDemand(skillName: string): 'high' | 'medium' | 'low' {
    const highDemandSkills = ['React', 'Python', 'JavaScript', 'TypeScript', 'Machine Learning', 'AWS'];
    const lowDemandSkills = ['Flash', 'Silverlight', 'VB.NET'];

    if (highDemandSkills.some(skill => skillName.toLowerCase().includes(skill.toLowerCase()))) {
      return 'high';
    }
    if (lowDemandSkills.some(skill => skillName.toLowerCase().includes(skill.toLowerCase()))) {
      return 'low';
    }
    return 'medium';
  }
}

class TorreAPI {
  private baseURL = 'https://torre.ai/api';

  // Realistic demo data based on real Torre profiles
  private demoProfiles = {
    'python': [
      {
        name: 'Sofia Rodriguez',
        username: 'sofia-rodriguez',
        picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c1?w=150',
        location: 'Madrid, Spain',
        professionalTitle: 'Senior Python Developer',
        summary: 'Full-stack Python developer with 6+ years experience in Django, FastAPI, and machine learning applications.'
      },
      {
        name: 'Marcus Chen',
        username: 'marcus-chen',
        picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        location: 'San Francisco, CA',
        professionalTitle: 'Python Data Scientist',
        summary: 'Data scientist specializing in Python, pandas, scikit-learn, and deep learning with TensorFlow.'
      },
      {
        name: 'Elena Petrov',
        username: 'elena-petrov',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        location: 'Berlin, Germany',
        professionalTitle: 'Backend Python Engineer',
        summary: 'Backend engineer focused on scalable Python applications using Django, PostgreSQL, and AWS.'
      },
      {
        name: 'Carlos Mendoza',
        username: 'carlos-mendoza',
        picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        location: 'Mexico City, Mexico',
        professionalTitle: 'Python DevOps Engineer',
        summary: 'DevOps engineer with expertise in Python automation, Docker, Kubernetes, and CI/CD pipelines.'
      },
      {
        name: 'Aisha Okafor',
        username: 'aisha-okafor',
        picture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        location: 'Lagos, Nigeria',
        professionalTitle: 'Python Machine Learning Engineer',
        summary: 'ML engineer building intelligent systems with Python, TensorFlow, and cloud platforms.'
      }
    ],
    'javascript': [
      {
        name: 'David Kim',
        username: 'david-kim',
        picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        location: 'Seoul, South Korea',
        professionalTitle: 'Senior JavaScript Developer',
        summary: 'Full-stack JavaScript developer with expertise in React, Node.js, and TypeScript.'
      },
      {
        name: 'Isabella Silva',
        username: 'isabella-silva',
        picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        location: 'São Paulo, Brazil',
        professionalTitle: 'Frontend React Developer',
        summary: 'Frontend specialist creating beautiful user interfaces with React, Next.js, and modern CSS.'
      },
      {
        name: 'Ahmed Hassan',
        username: 'ahmed-hassan',
        picture: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150',
        location: 'Cairo, Egypt',
        professionalTitle: 'Node.js Backend Developer',
        summary: 'Backend developer building scalable APIs with Node.js, Express, and MongoDB.'
      }
    ],
    'react': [
      {
        name: 'Jennifer Wu',
        username: 'jennifer-wu',
        picture: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150',
        location: 'Vancouver, Canada',
        professionalTitle: 'React Frontend Lead',
        summary: 'Frontend team lead specializing in React, Redux, and component architecture.'
      },
      {
        name: 'Mikael Andersson',
        username: 'mikael-andersson',
        picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        location: 'Stockholm, Sweden',
        professionalTitle: 'React Native Developer',
        summary: 'Mobile app developer creating cross-platform apps with React Native and Expo.'
      }
    ]
  };

  private createDetailedProfile(profile: any): TorreGenome {
    const skills = this.generateRealisticSkills(profile.professionalTitle);
    const experiences = this.generateRealisticExperiences(profile.professionalTitle);

    return {
      person: {
        name: profile.name,
        username: profile.username,
        picture: profile.picture,
        location: {
          name: profile.location,
          country: profile.location.split(', ').pop() || 'Unknown'
        },
        professionalHeadline: profile.professionalTitle,
        summary: profile.summary
      },
      skills,
      experiences,
      education: this.generateEducation(),
      languages: this.generateLanguages(),
      interests: this.generateInterests()
    };
  }

  private generateRealisticSkills(title: string): any[] {
    const skillSets = {
      'Python': [
        { name: 'Python', proficiency: 'expert' },
        { name: 'Django', proficiency: 'advanced' },
        { name: 'FastAPI', proficiency: 'intermediate' },
        { name: 'Flask', proficiency: 'advanced' },
        { name: 'PostgreSQL', proficiency: 'advanced' },
        { name: 'AWS', proficiency: 'intermediate' },
        { name: 'Docker', proficiency: 'intermediate' },
        { name: 'Git', proficiency: 'advanced' },
        { name: 'Linux', proficiency: 'intermediate' },
        { name: 'REST APIs', proficiency: 'expert' }
      ],
      'JavaScript': [
        { name: 'JavaScript', proficiency: 'expert' },
        { name: 'TypeScript', proficiency: 'advanced' },
        { name: 'React', proficiency: 'expert' },
        { name: 'Node.js', proficiency: 'advanced' },
        { name: 'Express', proficiency: 'advanced' },
        { name: 'MongoDB', proficiency: 'intermediate' },
        { name: 'HTML5', proficiency: 'expert' },
        { name: 'CSS3', proficiency: 'advanced' },
        { name: 'Git', proficiency: 'advanced' },
        { name: 'npm', proficiency: 'advanced' }
      ],
      'React': [
        { name: 'React', proficiency: 'expert' },
        { name: 'JavaScript', proficiency: 'expert' },
        { name: 'TypeScript', proficiency: 'advanced' },
        { name: 'Redux', proficiency: 'advanced' },
        { name: 'Next.js', proficiency: 'intermediate' },
        { name: 'CSS3', proficiency: 'advanced' },
        { name: 'HTML5', proficiency: 'expert' },
        { name: 'Jest', proficiency: 'intermediate' },
        { name: 'Webpack', proficiency: 'intermediate' },
        { name: 'Git', proficiency: 'advanced' }
      ],
      'Data Science': [
        { name: 'Python', proficiency: 'expert' },
        { name: 'Pandas', proficiency: 'expert' },
        { name: 'NumPy', proficiency: 'advanced' },
        { name: 'Scikit-learn', proficiency: 'advanced' },
        { name: 'TensorFlow', proficiency: 'intermediate' },
        { name: 'SQL', proficiency: 'advanced' },
        { name: 'Jupyter', proficiency: 'expert' },
        { name: 'Matplotlib', proficiency: 'advanced' },
        { name: 'Statistics', proficiency: 'expert' },
        { name: 'Machine Learning', proficiency: 'advanced' }
      ],
      'DevOps': [
        { name: 'Docker', proficiency: 'expert' },
        { name: 'Kubernetes', proficiency: 'advanced' },
        { name: 'AWS', proficiency: 'expert' },
        { name: 'Python', proficiency: 'advanced' },
        { name: 'Terraform', proficiency: 'advanced' },
        { name: 'Jenkins', proficiency: 'intermediate' },
        { name: 'Git', proficiency: 'expert' },
        { name: 'Linux', proficiency: 'expert' },
        { name: 'Monitoring', proficiency: 'advanced' },
        { name: 'CI/CD', proficiency: 'expert' }
      ]
    };

    const getSkillSet = (title: string) => {
      if (title.includes('Python')) return skillSets.Python;
      if (title.includes('JavaScript')) return skillSets.JavaScript;
      if (title.includes('React')) return skillSets.React;
      if (title.includes('Data')) return skillSets['Data Science'];
      if (title.includes('DevOps')) return skillSets.DevOps;
      return skillSets.React; // fallback
    };

    const relevantSkills = getSkillSet(title);

    return relevantSkills.map((skill, index) => ({
      name: skill.name,
      proficiency: skill.proficiency,
      highlightIndex: index
    }));
  }

  private generateRealisticExperiences(title: string): any[] {
    const companies = [
      'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify', 'Airbnb', 'Uber', 'Tesla',
      'Shopify', 'Stripe', 'Datadog', 'Twilio', 'Slack', 'GitHub', 'GitLab', 'Docker', 'MongoDB', 'Redis'
    ];

    const currentYear = new Date().getFullYear();
    const experiences = [];

    for (let i = 0; i < 3; i++) {
      const startYear = currentYear - (i * 2 + 1);
      const endYear = i === 0 ? currentYear : startYear + 2;

      experiences.push({
        category: 'jobs',
        name: i === 0 ? `Senior ${title}` : `${title}`,
        organizations: [{
          name: companies[Math.floor(Math.random() * companies.length)],
          picture: ''
        }],
        fromYear: startYear.toString(),
        toYear: i === 0 ? undefined : endYear.toString(),
        responsibilities: [
          'Developed and maintained high-quality software applications',
          'Collaborated with cross-functional teams to deliver features',
          'Mentored junior developers and conducted code reviews',
          'Optimized application performance and scalability'
        ]
      });
    }

    return experiences;
  }

  private generateEducation(): any[] {
    const universities = [
      'Stanford University', 'MIT', 'University of California Berkeley', 'Carnegie Mellon University',
      'Georgia Institute of Technology', 'University of Washington', 'Cornell University'
    ];

    return [{
      category: 'education',
      name: 'Bachelor of Science in Computer Science',
      organizations: [{
        name: universities[Math.floor(Math.random() * universities.length)]
      }],
      fromYear: '2015',
      toYear: '2019'
    }];
  }

  private generateLanguages(): any[] {
    const languages = [
      { language: 'English', fluency: 'Fluent' },
      { language: 'Spanish', fluency: 'Native' },
      { language: 'Portuguese', fluency: 'Conversational' }
    ];

    return languages.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private generateInterests(): any[] {
    const interests = [
      'Machine Learning', 'Open Source', 'Blockchain', 'Cloud Computing',
      'Mobile Development', 'Web Development', 'Data Science', 'Cybersecurity'
    ];

    return interests.slice(0, Math.floor(Math.random() * 4) + 2).map(name => ({ name }));
  }

  async searchPeople(query: string, limit: number = 50): Promise<TorreSearchResult[]> {
    console.log(`🔍 Demo Mode: Searching for "${query}"`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find matching profiles
    const searchTerm = query.toLowerCase();
    let results: TorreSearchResult[] = [];

    // Check for exact matches first
    if (this.demoProfiles[searchTerm as keyof typeof this.demoProfiles]) {
      results = [...this.demoProfiles[searchTerm as keyof typeof this.demoProfiles]];
    } else {
      // Partial matches
      Object.values(this.demoProfiles).forEach(profiles => {
        profiles.forEach(profile => {
          if (profile.professionalTitle.toLowerCase().includes(searchTerm) ||
              profile.summary.toLowerCase().includes(searchTerm)) {
            results.push(profile);
          }
        });
      });
    }

    // Add some variation to make it realistic
    const shuffled = results.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(limit, 50));
  }

  async getGenome(username: string): Promise<TorreGenome> {
    console.log(`🧬 Demo Mode: Fetching genome for ${username}`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find profile by username
    let profile: any = null;
    Object.values(this.demoProfiles).forEach(profiles => {
      const found = profiles.find(p => p.username === username);
      if (found) profile = found;
    });

    if (!profile) {
      throw new Error(`Profile ${username} not found`);
    }

    return this.createDetailedProfile(profile);
  }

  async batchGetGenomes(usernames: string[]): Promise<TorreGenome[]> {
    console.log(`🔄 Demo Mode: Fetching ${usernames.length} genomes...`);

    const genomes: TorreGenome[] = [];

    for (const username of usernames) {
      try {
        const genome = await this.getGenome(username);
        genomes.push(genome);

        // Realistic delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`⚠️ Could not fetch genome for ${username}`);
      }
    }

    return genomes;
  }
}

export const torreAPI = new TorreAPI();