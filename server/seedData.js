export const heroData = {
  name: 'Tek Narayan Yadav',
  tagline: 'I build scalable AI-powered web applications with modern user experiences that solve real-world problems.',
  roles: [
    'Full Stack Developer',
    'MERN Stack Developer',
    'Artificial Intelligence and Machine Learning',
    'Software Developer',
    'Problem Solver'
  ],
  techOrbs: [
    { label: 'React', color: '#61dafb', angle: 0, radius: 120 },
    { label: 'Node.js', color: '#84ce24', angle: 72, radius: 120 },
    { label: 'MongoDB', color: '#47a248', angle: 144, radius: 120 },
    { label: 'AI', color: '#a855f7', angle: 216, radius: 120 },
    { label: 'JS', color: '#3178c6', angle: 288, radius: 120 }
  ],
  resumeName: 'Tek Narayan Yadav.pdf'
}

export const aboutData = {
  name: 'Tek Narayan Yadav',
  role: 'Full Stack & AI Engineer',
  location: 'India',
  bio: [
    "I'm a passionate Full Stack Developer and AI Engineer with expertise in the MERN stack. I love crafting scalable web applications that combine beautiful design with powerful technology.",
    "My journey started with curiosity about how websites work, evolving into a deep passion for building AI-powered applications that solve real-world problems. I believe great software is both technically excellent and delightful to use."
  ],
  tags: ['MERN Stack', 'AI/ML', 'OpenAI', 'LangChain', 'TypeScript', 'RAG', 'Docker'],
  stats: [
    { label: 'Projects Completed', value: 20, suffix: '+' },
    { label: 'Technologies', value: 30, suffix: '+' },
    { label: 'GitHub Contributions', value: 500, suffix: '+' },
    { label: 'Coding Hours', value: 2000, suffix: '+' }
  ]
}

export const skillCategoriesData = [
  {
    name: 'Frontend',
    color: '#61dafb',
    skills: [
      { name: 'React', pct: 92 },
      { name: 'TypeScript', pct: 85 },
      { name: 'Next.js', pct: 80 },
      { name: 'Tailwind CSS', pct: 90 },
      { name: 'JavaScript', pct: 93 }
    ]
  },
  {
    name: 'Backend',
    color: '#84ce24',
    skills: [
      { name: 'Node.js', pct: 88 },
      { name: 'Express.js', pct: 87 },
      { name: 'REST APIs', pct: 90 }
    ]
  },
  {
    name: 'Database',
    color: '#47a248',
    skills: [
      { name: 'MongoDB', pct: 88 },
      { name: 'SQL', pct: 75 },
      { name: 'Redis', pct: 65 }
    ]
  },
  {
    name: 'AI / ML',
    color: '#a855f7',
    skills: [
      { name: 'OpenAI API', pct: 85 },
      { name: 'LangChain', pct: 78 },
      { name: 'RAG', pct: 75 },
      { name: 'Gemini API', pct: 70 },
      { name: 'Vector DBs', pct: 68 }
    ]
  },
  {
    name: 'DevOps / Cloud',
    color: '#06b6d4',
    skills: [
      { name: 'Docker', pct: 72 },
      { name: 'Vercel', pct: 88 },
      { name: 'Render', pct: 80 },
      { name: 'GitHub Actions', pct: 70 }
    ]
  },
  {
    name: 'Tools',
    color: '#f59e0b',
    skills: [
      { name: 'Git / GitHub', pct: 92 },
      { name: 'VS Code', pct: 95 },
      { name: 'Figma', pct: 70 },
      { name: 'Postman', pct: 85 }
    ]
  }
]

export const projectsData = [
  {
    title: 'AI ERP System',
    subtitle: 'Enterprise Resource Planning with AI Assistant',
    description: 'A comprehensive AI-powered ERP system with natural language database queries, intelligent reporting, and automated workflows. Built for enterprise scale with real-time collaboration.',
    tech: ['React', 'Node.js', 'MongoDB', 'OpenAI', 'LangChain', 'Socket.io'],
    color: '#4361ee',
    gradient: 'from-blue-600 to-purple-700',
    features: ['NL Database Queries', 'AI Analytics', 'Real-time Dashboard', 'Role-based Access', 'Report Generation'],
    category: 'AI',
    status: 'Production'
  },
  {
    title: 'Medical Store Platform',
    subtitle: 'Full Stack Healthcare E-Commerce',
    description: 'Complete medical store management system with inventory tracking, prescription handling, patient records, billing, and AI-powered medicine recommendations.',
    tech: ['React', 'Express.js', 'MongoDB', 'Tailwind CSS', 'JWT', 'Stripe'],
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    features: ['Inventory Management', 'Prescription System', 'Patient Records', 'Billing & Invoicing', 'AI Recommendations'],
    category: 'Full Stack',
    status: 'Live'
  },
  {
    title: 'Food Delivery Platform',
    subtitle: 'Real-time Food Ordering & Tracking',
    description: 'Multi-vendor food delivery platform with real-time order tracking, payment integration, restaurant dashboards, and intelligent delivery route optimization.',
    tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Maps API', 'Razorpay'],
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
    features: ['Real-time Tracking', 'Multi-vendor', 'Payment Gateway', 'Route Optimization', 'Push Notifications'],
    category: 'Full Stack',
    status: 'Live'
  },
  {
    title: 'AI Chatbot Suite',
    subtitle: 'Multi-model Conversational AI',
    description: 'Sophisticated chatbot platform supporting multiple AI models, RAG-powered knowledge bases, conversation memory, and embeddable widgets for any website.',
    tech: ['React', 'FastAPI', 'LangChain', 'Pinecone', 'OpenAI', 'PostgreSQL'],
    color: '#a855f7',
    gradient: 'from-purple-600 to-pink-600',
    features: ['Multi-model Support', 'RAG Integration', 'Conversation Memory', 'Embeddable Widget', 'Analytics'],
    category: 'AI',
    status: 'Beta'
  },
  {
    title: 'Developer Portfolio',
    subtitle: 'This very portfolio you are viewing',
    description: 'Award-worthy developer portfolio with 3D animations, glassmorphism design, AI assistant, command palette, and cinematic micro-interactions.',
    tech: ['React', 'TypeScript', 'Framer Motion', 'Three.js', 'Tailwind CSS'],
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    features: ['3D Animations', 'AI Assistant', 'Command Palette', 'Dark Theme', 'Responsive'],
    category: 'Frontend',
    status: 'Live'
  },
  {
    title: 'AI Code Reviewer',
    subtitle: 'Automated Code Review with AI',
    description: 'GitHub-integrated AI code reviewer that analyses pull requests, suggests improvements, detects bugs, ensures coding standards, and generates comprehensive reports.',
    tech: ['Node.js', 'GitHub API', 'OpenAI', 'MongoDB', 'React', 'TypeScript'],
    color: '#84ce24',
    gradient: 'from-green-500 to-emerald-600',
    features: ['PR Integration', 'Bug Detection', 'Code Quality', 'Auto Comments', 'Trend Reports'],
    category: 'AI',
    status: 'WIP'
  }
]

export const timelineData = [
  { year: '2020', startDate: '2020', endDate: '2020', isCurrent: false, title: 'Started Programming', desc: 'Discovered the world of coding. First HTML page. Instant addiction.', color: '#4361ee', icon: '🚀' },
  { year: '2021', startDate: '2021', endDate: '2021', isCurrent: false, title: 'Frontend Fundamentals', desc: 'Mastered HTML, CSS, and JavaScript. Built first interactive websites. Fell in love with UI.', color: '#06b6d4', icon: '🎨' },
  { year: '2022', startDate: '2022', endDate: '2022', isCurrent: false, title: 'React & Modern JS', desc: 'Dove deep into React ecosystem, hooks, state management, and component architecture.', color: '#a855f7', icon: '⚛️' },
  { year: '2022 - 2023', startDate: '2022', endDate: '2023', isCurrent: false, title: 'MERN Stack Mastery', desc: 'Full-stack development with MongoDB, Express, React, and Node.js. First complete web apps shipped.', color: '#84ce24', icon: '🛠️' },
  { year: '2023', startDate: '2023', endDate: '2023', isCurrent: false, title: 'AI Integration', desc: 'OpenAI API, LangChain, RAG architectures. Building AI-powered applications became my focus.', color: '#f59e0b', icon: '🤖' },
  { year: '2023 - 2024', startDate: '2023', endDate: '2024', isCurrent: false, title: 'AI ERP Project', desc: 'Led development of enterprise ERP with natural language database queries and AI analytics.', color: '#ec4899', icon: '🏢' },
  { year: '2024 - Present', startDate: '2024', endDate: 'Present', isCurrent: true, title: 'Full Stack AI Engineer', desc: 'Combining deep frontend expertise with AI engineering to build next-gen applications.', color: '#4361ee', icon: '⚡' },
  { year: '2025+', startDate: '2025', endDate: 'Future', isCurrent: false, title: 'Future: AI-Native Products', desc: 'Building AI-native SaaS products from 0 to 1. Multi-agent systems. The future starts now.', color: '#06b6d4', icon: '🌟' }
]

export const aiShowcaseData = [
  { iconName: 'Brain', title: 'AI ERP Assistant', desc: 'Conversational ERP interface — ask questions in plain English, get business insights instantly.', color: '#4361ee', tags: ['LangChain', 'OpenAI', 'RAG'], status: 'Production' },
  { iconName: 'Database', title: 'NL Database Query', desc: 'Natural language to SQL/MongoDB queries. No SQL knowledge needed. Just ask.', color: '#06b6d4', tags: ['GPT-4', 'MongoDB', 'SQL'], status: 'Live' },
  { iconName: 'MessageSquare', title: 'RAG Chatbot', desc: 'Upload documents, build a knowledge base, and chat with your data using vector search.', color: '#a855f7', tags: ['Pinecone', 'LangChain', 'Embeddings'], status: 'Beta' },
  { iconName: 'FileText', title: 'OCR Intelligence', desc: 'Extract, structure, and analyse text from any image or PDF using AI vision models.', color: '#f59e0b', tags: ['Vision API', 'OCR', 'NLP'], status: 'WIP' },
  { iconName: 'BarChart3', title: 'AI Analytics Engine', desc: 'Automated insights, anomaly detection, and predictive analytics from raw business data.', color: '#ec4899', tags: ['Python', 'Pandas', 'OpenAI'], status: 'Research' },
  { iconName: 'Search', title: 'Semantic Search', desc: 'Beyond keyword matching — semantic similarity search across large document corpora.', color: '#84ce24', tags: ['Embeddings', 'Vector DB', 'FAISS'], status: 'Prototype' }
]

export const githubData = {
  repositoriesCount: 48,
  totalStars: 377,
  followers: 124,
  commitsThisYear: 847,
  recentRepos: [
    { name: 'ai-erp-system', desc: 'Enterprise ERP with NL database queries', lang: 'TypeScript', stars: 48, forks: 12, color: '#3178c6' },
    { name: 'mern-food-delivery', desc: 'Real-time food delivery platform', lang: 'JavaScript', stars: 34, forks: 9, color: '#f7df1e' },
    { name: 'rag-chatbot-suite', desc: 'RAG-powered multi-model chatbot', lang: 'TypeScript', stars: 61, forks: 18, color: '#3178c6' },
    { name: 'medical-store-app', desc: 'Full-stack healthcare e-commerce', lang: 'JavaScript', stars: 27, forks: 7, color: '#f7df1e' },
    { name: 'langchain-tools', desc: 'LangChain utility library', lang: 'Python', stars: 92, forks: 24, color: '#3572A5' },
    { name: 'portfolio-2027', desc: 'Premium futuristic portfolio', lang: 'TypeScript', stars: 115, forks: 31, color: '#3178c6' }
  ],
  langStats: [
    { lang: 'TypeScript', pct: 42, color: '#3178c6' },
    { lang: 'JavaScript', pct: 28, color: '#f7df1e' },
    { lang: 'Python', pct: 15, color: '#3572a5' },
    { lang: 'CSS', pct: 10, color: '#563d7c' },
    { lang: 'Other', pct: 5, color: '#555' }
  ]
}

export const certsData = [
  { title: 'Full Stack Web Development', issuer: 'Coursera · Meta', date: 'Dec 2023', category: 'Full Stack', color: '#4361ee', gradient: 'from-blue-600 to-blue-800', credentialId: 'META-FS-2023-7821', skills: ['React', 'Node.js', 'MongoDB', 'Express'], verified: true },
  { title: 'AI & Machine Learning Fundamentals', issuer: 'DeepLearning.AI', date: 'Mar 2024', category: 'AI / ML', color: '#a855f7', gradient: 'from-purple-600 to-purple-800', credentialId: 'DL-AI-2024-1193', skills: ['Neural Networks', 'NLP', 'LLMs', 'RAG'], verified: true },
  { title: 'LangChain & LLM Development', issuer: 'Udemy · Verified', date: 'May 2024', category: 'AI / ML', color: '#06b6d4', gradient: 'from-cyan-600 to-blue-700', credentialId: 'UDM-LC-2024-5542', skills: ['LangChain', 'Agents', 'Vector DB', 'RAG'], verified: true },
  { title: 'MongoDB Developer Associate', issuer: 'MongoDB University', date: 'Aug 2023', category: 'Database', color: '#47a248', gradient: 'from-green-600 to-emerald-800', credentialId: 'MGDB-DEV-2023-0884', skills: ['Aggregation', 'Indexing', 'Schema Design'], verified: true },
  { title: 'React & Advanced Patterns', issuer: 'Frontend Masters', date: 'Jan 2024', category: 'Frontend', color: '#61dafb', gradient: 'from-cyan-500 to-blue-600', credentialId: 'FEM-RCT-2024-3301', skills: ['Hooks', 'Context', 'Performance', 'Testing'], verified: true },
  { title: 'Docker & Kubernetes Essentials', issuer: 'Linux Foundation', date: 'Oct 2023', category: 'DevOps', color: '#2496ed', gradient: 'from-blue-500 to-blue-700', credentialId: 'LF-DK-2023-6617', skills: ['Containers', 'Orchestration', 'CI/CD'], verified: true }
]

export const achievementsData = [
  { platform: 'LeetCode', color: '#f89f1b', stats: [{ label: 'Problems Solved', value: 340 }, { label: 'Contest Rating', value: 1642 }, { label: 'Global Rank', value: 98000 }], badge: 'Knight', badgeColor: '#f59e0b' },
  { platform: 'HackerRank', color: '#2ec866', stats: [{ label: 'Certifications', value: 5 }, { label: 'Stars', value: 120 }, { label: 'Score', value: 3800 }], badge: '5★ Coder', badgeColor: '#2ec866' },
  { platform: 'CodeChef', color: '#b97a57', stats: [{ label: 'Rating', value: 1724 }, { label: 'Rank', value: 3 }, { label: 'Problems', value: 215 }], badge: '3★ Rated', badgeColor: '#b97a57' },
  { platform: 'GeeksforGeeks', color: '#2d8651', stats: [{ label: 'Problems', value: 280 }, { label: 'Score', value: 1650 }, { label: 'Streak', value: 47 }], badge: 'Institute Rank 2', badgeColor: '#2d8651' }
]

export const blogPostsData = [
  { title: 'Building Production-Grade RAG Systems with LangChain', excerpt: 'A deep dive into retrieval-augmented generation: chunking strategies, embedding models, vector database choices, and real-world pitfalls I encountered building an AI ERP system.', category: 'AI Engineering', readTime: '12 min', date: 'Jul 18, 2025', color: '#a855f7', gradient: 'from-purple-600/20 to-blue-600/10', tags: ['LangChain', 'RAG', 'OpenAI', 'Pinecone'], featured: true },
  { title: 'MERN Stack Architecture Patterns That Scale to 100K Users', excerpt: 'Architectural decisions, database sharding strategies, caching layers, and deployment configurations that keep your MERN app performant under heavy load.', category: 'Full Stack', readTime: '9 min', date: 'Jun 30, 2025', color: '#4361ee', gradient: 'from-blue-600/20 to-cyan-600/10', tags: ['MERN', 'Node.js', 'MongoDB', 'Redis'], featured: true },
  { title: 'How I Built an NL-to-MongoDB Query Engine', excerpt: 'The complete engineering breakdown of building a system that converts plain English questions into MongoDB aggregation pipelines using GPT-4 and few-shot prompting.', category: 'AI Engineering', readTime: '15 min', date: 'May 12, 2025', color: '#06b6d4', gradient: 'from-cyan-600/20 to-purple-600/10', tags: ['GPT-4', 'MongoDB', 'NLP', 'API Design'], featured: false },
  { title: 'React Performance: From 4s to 800ms Load Time', excerpt: 'Code-splitting, lazy loading, memoization, virtual lists, and bundle analysis techniques I used to cut load times by 80% in a production React app.', category: 'Frontend', readTime: '7 min', date: 'Apr 5, 2025', color: '#61dafb', gradient: 'from-cyan-500/15 to-blue-600/10', tags: ['React', 'Performance', 'Vite', 'Optimization'], featured: false },
  { title: 'Docker Compose for Full Stack Devs: The Real Guide', excerpt: 'Skip the toy examples. This covers multi-service orchestration, environment management, networking, volumes, and production-ready Docker Compose setups.', category: 'DevOps', readTime: '11 min', date: 'Mar 20, 2025', color: '#2496ed', gradient: 'from-blue-500/15 to-blue-700/10', tags: ['Docker', 'DevOps', 'Node.js'], featured: false },
  { title: 'JWT vs Sessions: What Nobody Tells You', excerpt: 'The real tradeoffs between JWT and session-based auth — token invalidation, refresh flows, XSS/CSRF surface, and when to use each in MERN applications.', category: 'Security', readTime: '8 min', date: 'Feb 14, 2025', color: '#ec4899', gradient: 'from-pink-600/15 to-rose-600/10', tags: ['JWT', 'Auth', 'Security', 'Express'], featured: false }
]

export const testimonialsData = [
  { name: 'Priya Sharma', role: 'CTO', company: 'TechStartup AI', avatar: 'PS', avatarColor: '#4361ee', rating: 5, review: 'Tek Narayan built our AI ERP system from scratch in just 3 months. The natural language query feature alone saved our team 10+ hours a week. Exceptional technical depth and fast delivery.', highlight: 'Natural language query saved us 10+ hours/week' },
  { name: 'Rohan Mehta', role: 'Engineering Manager', company: 'HealthTech Corp', avatar: 'RM', avatarColor: '#06b6d4', rating: 5, review: "We hired Tek Narayan for our medical store platform. His code quality, documentation, and communication were all top-notch. He anticipated edge cases we hadn't even thought of.", highlight: "Anticipated edge cases we hadn't even thought of" },
  { name: 'Ananya Gupta', role: 'Product Manager', company: 'FoodTech Ventures', avatar: 'AG', avatarColor: '#a855f7', rating: 5, review: 'The real-time food delivery platform Tek Narayan built handles 500+ concurrent orders flawlessly. His architecture decisions were exactly right for our scale. Highly recommended.', highlight: 'Handles 500+ concurrent orders flawlessly' },
  { name: 'Dr. Vikram Singh', role: 'Founder', company: 'AI Research Lab', avatar: 'VS', avatarColor: '#ec4899', rating: 5, review: 'Tek Narayan integrated our LangChain RAG pipeline with the existing infrastructure seamlessly. His AI knowledge is genuinely impressive — he understood our requirements immediately.', highlight: 'AI knowledge is genuinely impressive' },
  { name: 'Kavya Reddy', role: 'Senior Developer', company: 'SaaS Platform Co.', avatar: 'KR', avatarColor: '#f59e0b', rating: 5, review: 'Collaborated with Tek Narayan on an open-source project. His code is clean, well-structured, and he reviews PRs with great care. A developer who genuinely cares about quality.', highlight: 'Code is clean, well-structured, reviews with great care' }
]

export const chatFAQsData = [
  { keywords: ['teknarayan', 'tek', 'who', 'about'], response: "Tek Narayan Yadav is a Full Stack Developer and AI Engineer specializing in the MERN stack. He builds scalable, AI-powered web applications and has worked on projects ranging from enterprise ERP systems to real-time food delivery platforms." },
  { keywords: ['mern', 'stack'], response: "Tek Narayan's MERN stack expertise includes: **MongoDB** for database design, **Express.js** for REST APIs, **React** for frontend, and **Node.js** for server-side logic. He has shipped multiple production MERN applications." },
  { keywords: ['ai', 'chatbot', 'langchain', 'rag'], response: "Tek Narayan's AI projects include: an AI ERP Assistant (natural language database queries), a RAG-powered chatbot, an OCR intelligence system, and a semantic search engine. He works with OpenAI API, LangChain, Pinecone, and vector databases." },
  { keywords: ['erp'], response: "The AI ERP System is Tek Narayan's flagship project — an enterprise resource planning platform where users can query the database in plain English. It uses LangChain + GPT-4 to translate natural language to MongoDB queries, with real-time dashboards and AI analytics." },
  { keywords: ['skill', 'tech', 'know'], response: "Tek Narayan's core skills: React, TypeScript, Next.js, Node.js, Express.js, MongoDB, OpenAI API, LangChain, RAG, Docker, Tailwind CSS. He also knows Python, SQL, Redis, and GraphQL." },
  { keywords: ['contact', 'email', 'reach'], response: "You can reach Tek Narayan at: 📧 teknarayan@example.com | 💼 LinkedIn: linkedin.com/in/teknarayanyadav | 🐱 GitHub: github.com/teknarayanyadav" },
  { keywords: ['resume', 'cv'], response: "Tek Narayan's resume is available for download from the portfolio. It covers his MERN stack projects, AI integrations, technical skills, and learning journey." },
  { keywords: ['experience', 'journey', 'year'], response: "Tek Narayan has been coding since 2020. His journey: HTML/CSS → JavaScript → React → MERN Stack → AI integrations. He's built 20+ projects and contributed 500+ times on GitHub." },
  { keywords: ['project', 'work', 'built'], response: "Featured projects: 1) AI ERP System, 2) Medical Store Platform, 3) Food Delivery App, 4) AI Chatbot Suite, 5) Developer Portfolio, 6) AI Code Reviewer. Click 'Projects' to explore each one!" },
  { keywords: ['hire', 'available', 'job'], response: "Tek Narayan is available for full-time roles, freelance projects, and collaborations. He's particularly interested in AI-powered product development and MERN stack applications. Use the Contact section to reach out!" }
]
