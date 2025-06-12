This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




# SkillFlow Analytics 🚀

**AI-Powered Talent Intelligence Platform**

SkillFlow Analytics is a comprehensive talent intelligence platform that analyzes professional data to provide insights on skill trends, market demand, and career opportunities. Built with Next.js 14, TypeScript, and AI-powered analytics.

![SkillFlow Analytics](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌐 Live Demo

**Production URL**: [https://skillflow-analytics.vercel.app](https://skill-flow-analytics-9k8bz495b-abduldattijos-projects.vercel.app/)  
**Repository**: [https://github.com/abduldattijo/SkillFlow-Analytics](https://github.com/abduldattijo/SkillFlow-Analytics)

## ✨ Features

### 🔍 **Smart Search**
- AI-powered search suggestions for skills, roles, companies, and locations
- Real-time filtering with intelligent ranking
- Recent searches and trending queries
- Advanced filters (experience, location, salary, remote options)

### 📊 **Analytics Dashboard**
- **Overview**: Profile summaries and top skills analysis
- **Skills Analysis**: Skill frequency, trends, and market demand
- **Geographic Distribution**: Global talent location insights
- **AI Insights**: Skill correlations and career path predictions
- **Network Visualization**: Interactive skill relationship mapping

### 🤖 **AI Intelligence Engine**
- Skill correlation analysis with confidence scores
- Career path recommendations with probability matching
- Market demand forecasting and salary insights
- Skill gap identification and learning recommendations

### 🎨 **Modern UI/UX**
- Clean, professional design with dark mode support
- Responsive layout for all devices
- Smooth animations and micro-interactions
- Interactive data visualizations

## 🏗️ **Technical Architecture**

```
SkillFlow Analytics/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── api/search/         # API routes for talent search
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── SkillFlowDashboard.tsx    # Main dashboard
│   │   ├── SmartSearch.tsx           # Search component
│   │   └── ui/                       # UI components
│   ├── lib/                    # Utility libraries
│   │   ├── ai-analytics.ts     # AI intelligence engine
│   │   ├── analytics.ts        # Data analytics utilities
│   │   └── torre-api.ts        # API integration layer
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── AI_PROMPTS.md              # Complete AI prompts documentation
└── README.md                  # Project documentation
```

## 🛠️ **Technology Stack**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React for consistent iconography
- **Deployment**: Vercel for seamless CI/CD
- **AI Integration**: Custom analytics engine with realistic algorithms

## 📈 **Data & Analytics**

### Demo Mode
The platform includes a comprehensive demo mode with realistic data that mimics Torre.ai's API structure:

- **Professional Profiles**: 50+ synthetic profiles across various tech roles
- **Skill Analysis**: Real industry correlation patterns
- **Geographic Distribution**: Global tech hub representation
- **Market Intelligence**: Simulated demand and salary data

### AI-Powered Insights
- **Skill Correlations**: Advanced algorithms analyzing skill relationships
- **Career Predictions**: Machine learning-inspired path recommendations
- **Market Forecasting**: Demand prediction based on industry trends
- **Talent Intelligence**: Comprehensive analytics for strategic decisions

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abduldattijo/SkillFlow-Analytics.git
   cd SkillFlow-Analytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables
The platform works in demo mode by default. For Torre.ai API integration:

```env
TORRE_API_KEY=your_torre_api_key_here
NEXT_PUBLIC_DEMO_MODE=false
```

## 🎯 **Usage Guide**

### Basic Search
1. Enter a skill, role, or company in the search bar
2. Select from AI-powered suggestions
3. Apply filters for refined results
4. Explore analytics across different tabs

### Demo Searches
Try these example searches to see the full capabilities:
- **"python"** - Python developers and data scientists
- **"javascript"** - JavaScript and frontend developers  
- **"react"** - React specialists and component developers
- **"data scientist"** - ML engineers and data professionals

### Analytics Exploration
- **Overview Tab**: See profile summaries and skill distributions
- **Skills Tab**: Analyze skill frequencies and market trends
- **Locations Tab**: Explore geographic talent distribution
- **AI Insights Tab**: Discover skill correlations and career paths
- **Network Tab**: Interact with skill relationship visualizations

## 🔧 **Development**

### Project Structure
```typescript
// Component Architecture
SkillFlowDashboard (Main Container)
├── SmartSearch (Search Interface)
├── Analytics Tabs (Data Views)
├── SkillNetworkVisualization (Canvas Graphics)
└── AI Intelligence Engine (Analytics)

// Data Flow
User Query → API Processing → AI Analysis → Visualization
```

### Key Components

**SkillFlowDashboard**: Main container managing state and tab navigation  
**SmartSearch**: Advanced search with suggestions and filters  
**AI Analytics Engine**: Sophisticated algorithms for skill intelligence  
**Network Visualization**: Interactive Canvas-based skill relationships  

### Adding New Features

1. **New Analytics Tab**
   ```typescript
   // Add to TabType union
   type TabType = 'overview' | 'skills' | 'locations' | 'new-tab';
   
   // Add tab configuration
   { id: 'new-tab', label: 'New Feature', icon: NewIcon }
   ```

2. **Custom AI Insights**
   ```typescript
   // Extend AISkillIntelligence class
   static newAnalysisMethod(data: any[]): AnalysisResult {
     // Custom algorithm implementation
   }
   ```

## 🚀 **Deployment**

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel automatically detects Next.js and deploys
3. Environment variables can be set in Vercel dashboard

### Manual Deployment
```bash
npm run build
npm run start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 **Performance & Optimization**

- **Bundle Size**: Optimized with Next.js automatic code splitting
- **Loading Performance**: Skeleton states and progressive loading
- **Search Performance**: Debounced input with optimized algorithms
- **Visualization Performance**: Canvas-based rendering with RAF optimization

## 🛡️ **Security & Privacy**

- **Data Privacy**: Demo mode uses synthetic data only
- **API Security**: Proper error handling and validation
- **XSS Protection**: Sanitized inputs and outputs
- **CORS Handling**: Secure cross-origin resource sharing

## 🔮 **Future Enhancements**

### Planned Features
- **Real Torre.ai Integration**: Live API connection for production data
- **User Authentication**: Personal dashboards and saved searches
- **Advanced AI Models**: GPT integration for deeper insights
- **Export Functionality**: PDF reports and data downloads
- **Team Collaboration**: Shared analytics and insights
- **Custom Dashboards**: Personalized analytics views

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Caching**: Redis implementation for performance
- **Machine Learning**: Enhanced prediction algorithms
- **Multi-language**: Internationalization support

## 🤝 **Contributing**

Contributions are welcome! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Torre.ai** for inspiration and API structure reference
- **Vercel** for excellent deployment platform
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for beautiful styling utilities
- **Claude AI** for development assistance and code generation

## 📞 **Support**

For questions, issues, or feature requests:
- **Email**: [your-email@example.com]
- **GitHub Issues**: [Create an issue](https://github.com/abduldattijo/SkillFlow-Analytics/issues)
- **Torre Messenger**: Direct communication for project-related queries

---

**Built with ❤️ using AI-assisted development**  
*SkillFlow Analytics - Empowering talent decisions with intelligent insights*