// src/lib/analytics.ts
import { TorreGenome, SkillAnalytics, LocationData } from '@/types/torre';

export class SkillAnalyzer {
  static analyzeSkills(genomes: TorreGenome[]): SkillAnalytics[] {
    const skillMap = new Map<string, {
      count: number;
      proficiencies: string[];
      industries: Set<string>;
    }>();

    genomes.forEach(genome => {
      // Extract industries from experiences
      const industries = new Set(
        genome.experiences
          .flatMap(exp => exp.organizations.map(org => org.name))
          .filter(Boolean)
      );

      genome.skills.forEach(skill => {
        if (!skillMap.has(skill.name)) {
          skillMap.set(skill.name, {
            count: 0,
            proficiencies: [],
            industries: new Set()
          });
        }

        const skillData = skillMap.get(skill.name)!;
        skillData.count++;
        skillData.proficiencies.push(skill.proficiency);
        industries.forEach(industry => skillData.industries.add(industry));
      });
    });

    return Array.from(skillMap.entries()).map(([skillName, data]) => {
      const proficiencyLevels = {
        novice: data.proficiencies.filter(p => p === 'novice').length,
        intermediate: data.proficiencies.filter(p => p === 'intermediate').length,
        advanced: data.proficiencies.filter(p => p === 'advanced').length,
        expert: data.proficiencies.filter(p => p === 'expert').length,
      };

      const avgProficiency = data.proficiencies.reduce((sum, prof) => {
        const weights = { novice: 1, intermediate: 2, advanced: 3, expert: 4 };
        return sum + (weights[prof as keyof typeof weights] || 0);
      }, 0) / data.proficiencies.length;

      // Simple trend calculation (could be enhanced with historical data)
      const trend = this.calculateTrend(skillName, data.count);

      return {
        skillName,
        frequency: data.count,
        avgProficiency,
        industries: Array.from(data.industries).slice(0, 5), // Top 5 industries
        experienceLevels: proficiencyLevels,
        trend
      };
    }).sort((a, b) => b.frequency - a.frequency);
  }

  static calculateTrend(skillName: string, frequency: number): 'rising' | 'stable' | 'declining' {
    // Simple heuristic for demo - in real app would use historical data
    const risingSkills = ['typescript', 'react', 'python', 'aws', 'kubernetes', 'docker', 'nextjs', 'node.js'];
    const decliningSkills = ['jquery', 'flash', 'silverlight', 'perl', 'cobol'];

    const lowerSkillName = skillName.toLowerCase();

    if (risingSkills.some(skill => lowerSkillName.includes(skill))) {
      return 'rising';
    } else if (decliningSkills.some(skill => lowerSkillName.includes(skill))) {
      return 'declining';
    } else if (frequency > 15) {
      return 'rising';
    } else if (frequency < 5) {
      return 'declining';
    }

    return 'stable';
  }

  static getLocationDistribution(genomes: TorreGenome[]): LocationData[] {
    const locationMap = new Map<string, number>();

    genomes.forEach(genome => {
      const country = genome.person.location?.country || 'Unknown';
      locationMap.set(country, (locationMap.get(country) || 0) + 1);
    });

    return Array.from(locationMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 countries
  }

  static getExperienceDistribution(genomes: TorreGenome[]) {
    const experienceMap = new Map<string, number>();

    genomes.forEach(genome => {
      const totalYears = genome.experiences.reduce((sum, exp) => {
        if (exp.fromYear && exp.toYear) {
          return sum + (parseInt(exp.toYear) - parseInt(exp.fromYear));
        } else if (exp.fromYear && !exp.toYear) {
          // Assume current year if no end year
          return sum + (new Date().getFullYear() - parseInt(exp.fromYear));
        }
        return sum;
      }, 0);

      const bracket = totalYears < 2 ? '0-2 years' :
                     totalYears < 5 ? '2-5 years' :
                     totalYears < 10 ? '5-10 years' : '10+ years';

      experienceMap.set(bracket, (experienceMap.get(bracket) || 0) + 1);
    });

    return Array.from(experienceMap.entries())
      .map(([bracket, count]) => ({ bracket, count }));
  }

  static getTopIndustries(genomes: TorreGenome[], limit: number = 10) {
    const industryMap = new Map<string, number>();

    genomes.forEach(genome => {
      genome.experiences.forEach(exp => {
        exp.organizations.forEach(org => {
          if (org.name && org.name.trim()) {
            industryMap.set(org.name, (industryMap.get(org.name) || 0) + 1);
          }
        });
      });
    });

    return Array.from(industryMap.entries())
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  static getLanguageDistribution(genomes: TorreGenome[]) {
    const languageMap = new Map<string, number>();

    genomes.forEach(genome => {
      genome.languages.forEach(lang => {
        if (lang.language && lang.language.trim()) {
          languageMap.set(lang.language, (languageMap.get(lang.language) || 0) + 1);
        }
      });
    });

    return Array.from(languageMap.entries())
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
  }
}