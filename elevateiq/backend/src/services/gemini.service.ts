import { ParsedResume, SkillAnalysis, GeneratedProjectData, RoadmapPhase } from '../types';

// ============================================================
// Rule-based fallback engine — works with ZERO API key needed
// ============================================================

const ROLE_SKILL_MAP: Record<string, string[]> = {
  'GenAI Engineer': ['Python', 'LangChain', 'LlamaIndex', 'RAG', 'LLM', 'Hugging Face', 'Transformers', 'Prompt Engineering', 'OpenAI API', 'Vector Databases', 'FastAPI', 'Docker'],
  'AI Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NumPy', 'Pandas', 'Scikit-learn', 'MLOps', 'Docker', 'AWS'],
  'Full Stack Developer': ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'TypeScript', 'REST API', 'Git', 'Docker', 'Tailwind', 'Next.js'],
  'Data Analyst': ['SQL', 'Excel', 'Python', 'Pandas', 'Power BI', 'Tableau', 'Data Visualization', 'Statistics', 'NumPy', 'Matplotlib'],
  'Data Scientist': ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'SQL', 'Deep Learning', 'Matplotlib', 'Seaborn', 'Jupyter'],
  'ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'MLOps', 'AWS', 'CI/CD', 'Scikit-learn', 'Machine Learning'],
  'Software Engineer': ['Java', 'Python', 'C++', 'Data Structures', 'Algorithms', 'System Design', 'Git', 'OOP', 'REST API', 'SQL'],
  'Backend Developer': ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker', 'Redis', 'System Design', 'Microservices'],
  'Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Next.js', 'Redux', 'Figma'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Jenkins', 'Bash', 'Git'],
  'Cloud Engineer': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'CI/CD', 'Networking'],
};

const PROJECT_TEMPLATES: Record<string, GeneratedProjectData[]> = {
  default: [
    {
      title: 'Personal Portfolio Website',
      description: 'Build a responsive personal portfolio showcasing your projects, skills, and resume. Include smooth animations, a contact form, and dark mode toggle. Deploy it live to demonstrate your work to recruiters.',
      techStack: ['React', 'Tailwind CSS', 'Vercel'],
      difficulty: 'BEGINNER',
      duration: '1-2 weeks',
      outcomes: ['Live deployed portfolio', 'Responsive design skills', 'Git/GitHub workflow'],
      resources: [{ title: 'React Documentation', url: 'https://react.dev', type: 'documentation' }],
      category: 'Web Development',
    },
    {
      title: 'Task Management App',
      description: 'Create a full CRUD task manager with user authentication, categories, due dates, and priority levels. Add drag-and-drop functionality and persistent storage using a database.',
      techStack: ['React', 'Node.js', 'Express', 'PostgreSQL'],
      difficulty: 'BEGINNER',
      duration: '2-3 weeks',
      outcomes: ['Full CRUD operations', 'Authentication flow', 'Database design'],
      resources: [{ title: 'Express Guide', url: 'https://expressjs.com', type: 'documentation' }],
      category: 'Full Stack',
    },
    {
      title: 'E-Commerce Platform',
      description: 'Build a complete e-commerce app with product listings, cart, checkout flow, and order management. Implement search, filters, and a payment gateway integration in sandbox mode.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
      difficulty: 'INTERMEDIATE',
      duration: '4-5 weeks',
      outcomes: ['Payment integration', 'State management at scale', 'Database relationships'],
      resources: [{ title: 'Stripe Docs', url: 'https://stripe.com/docs', type: 'documentation' }],
      category: 'Full Stack',
    },
    {
      title: 'Real-time Chat Application',
      description: 'Develop a real-time messaging app with WebSockets, supporting group chats, typing indicators, and online status. Add message history and notification system.',
      techStack: ['React', 'Socket.io', 'Node.js', 'Redis'],
      difficulty: 'INTERMEDIATE',
      duration: '3-4 weeks',
      outcomes: ['WebSocket implementation', 'Real-time data sync', 'Scalable architecture'],
      resources: [{ title: 'Socket.io Docs', url: 'https://socket.io/docs', type: 'documentation' }],
      category: 'Full Stack',
    },
    {
      title: 'Microservices-based API System',
      description: 'Architect a system of independent microservices (auth, orders, inventory) communicating via message queues. Containerize each service with Docker and orchestrate with docker-compose.',
      techStack: ['Node.js', 'Docker', 'RabbitMQ', 'PostgreSQL', 'Redis'],
      difficulty: 'ADVANCED',
      duration: '5-6 weeks',
      outcomes: ['Microservices architecture', 'Container orchestration', 'Message queue patterns'],
      resources: [{ title: 'Docker Docs', url: 'https://docs.docker.com', type: 'documentation' }],
      category: 'Backend Architecture',
    },
    {
      title: 'CI/CD Pipeline with Cloud Deployment',
      description: 'Set up an automated CI/CD pipeline that tests, builds, and deploys an application to the cloud on every push. Include monitoring, rollback strategy, and infrastructure as code.',
      techStack: ['GitHub Actions', 'Docker', 'AWS', 'Terraform'],
      difficulty: 'ADVANCED',
      duration: '4-5 weeks',
      outcomes: ['Automated deployments', 'Infrastructure as code', 'Production monitoring'],
      resources: [{ title: 'GitHub Actions Docs', url: 'https://docs.github.com/actions', type: 'documentation' }],
      category: 'DevOps',
    },
  ],
  ai: [
    {
      title: 'AI Resume Analyzer',
      description: 'Build a tool that parses resumes and uses an LLM to score them against job descriptions, highlighting strengths and gaps. Add a clean UI to upload and view results.',
      techStack: ['Python', 'FastAPI', 'OpenAI API', 'React'],
      difficulty: 'BEGINNER',
      duration: '2 weeks',
      outcomes: ['LLM API integration', 'Prompt engineering basics', 'Document parsing'],
      resources: [{ title: 'OpenAI API Docs', url: 'https://platform.openai.com/docs', type: 'documentation' }],
      category: 'GenAI',
    },
    {
      title: 'RAG-based Document Q&A System',
      description: 'Create a chatbot that answers questions from uploaded PDFs using Retrieval-Augmented Generation. Implement chunking, embeddings, and a vector database for semantic search.',
      techStack: ['Python', 'LangChain', 'Pinecone', 'OpenAI API'],
      difficulty: 'BEGINNER',
      duration: '2-3 weeks',
      outcomes: ['RAG pipeline', 'Vector embeddings', 'Semantic search'],
      resources: [{ title: 'LangChain Docs', url: 'https://python.langchain.com', type: 'documentation' }],
      category: 'GenAI',
    },
    {
      title: 'AI-Powered Code Review Assistant',
      description: 'Build a tool that analyzes GitHub pull requests using an LLM to suggest improvements, detect bugs, and check coding standards. Integrate with GitHub API for automated comments.',
      techStack: ['Python', 'LangChain', 'GitHub API', 'FastAPI'],
      difficulty: 'INTERMEDIATE',
      duration: '3-4 weeks',
      outcomes: ['GitHub API integration', 'Automated workflows', 'LLM-based analysis'],
      resources: [{ title: 'GitHub REST API', url: 'https://docs.github.com/rest', type: 'documentation' }],
      category: 'GenAI',
    },
    {
      title: 'Multi-Agent Research Assistant',
      description: 'Design a system of cooperating AI agents that research a topic, summarize findings, and generate a report. Use agent orchestration frameworks for task delegation.',
      techStack: ['Python', 'LangGraph', 'OpenAI API', 'Vector DB'],
      difficulty: 'INTERMEDIATE',
      duration: '4 weeks',
      outcomes: ['Multi-agent systems', 'Task orchestration', 'Report generation'],
      resources: [{ title: 'LangGraph Docs', url: 'https://langchain-ai.github.io/langgraph', type: 'documentation' }],
      category: 'GenAI',
    },
    {
      title: 'Fine-tuned Domain-Specific Chatbot',
      description: 'Fine-tune an open-source LLM on domain-specific data (e.g. legal, medical) and deploy it with a REST API. Benchmark performance against the base model.',
      techStack: ['Python', 'Hugging Face', 'PyTorch', 'Docker'],
      difficulty: 'ADVANCED',
      duration: '5-6 weeks',
      outcomes: ['Model fine-tuning', 'Evaluation metrics', 'Model deployment'],
      resources: [{ title: 'Hugging Face Docs', url: 'https://huggingface.co/docs', type: 'documentation' }],
      category: 'GenAI',
    },
    {
      title: 'Production-Grade AI API Gateway',
      description: 'Build a scalable API gateway in front of multiple LLM providers with caching, rate limiting, fallback logic, and cost tracking dashboards.',
      techStack: ['Python', 'FastAPI', 'Redis', 'Docker', 'PostgreSQL'],
      difficulty: 'ADVANCED',
      duration: '5 weeks',
      outcomes: ['API gateway design', 'Cost optimization', 'Production reliability'],
      resources: [{ title: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com', type: 'documentation' }],
      category: 'GenAI',
    },
  ],
};

const RESUME_TIPS = [
  'Add quantifiable metrics to your project descriptions (e.g. "improved performance by 40%", "reduced load time by 2 seconds").',
  'Include a dedicated "Skills" section grouped by category (Languages, Frameworks, Tools, Databases) for ATS readability.',
  'Use strong action verbs at the start of bullet points: "Built", "Designed", "Optimized", "Deployed" instead of "Worked on".',
  'Add links to your GitHub, LinkedIn, and live project demos directly in the header section.',
  'Keep your resume to one page if you have less than 5 years of experience — focus on quality over quantity.',
  'Tailor your project descriptions to highlight technologies relevant to your target role.',
  'Add a brief professional summary (2-3 lines) at the top highlighting your career focus and key strengths.',
  'Include certifications or relevant coursework if you lack professional experience.',
];

const ROADMAP_TEMPLATES: Record<string, RoadmapPhase[]> = {
  default: [
    { phase: 1, title: 'Foundation Building', duration: '4-6 weeks', goals: ['Strengthen core programming fundamentals', 'Complete 2-3 beginner projects'], skills: ['Data Structures', 'Algorithms', 'Git/GitHub'], milestones: ['Complete a beginner project', 'Push code to GitHub regularly'] },
    { phase: 2, title: 'Core Skill Development', duration: '6-8 weeks', goals: ['Learn key frameworks for target role', 'Build 1-2 intermediate projects'], skills: ['Frameworks', 'Databases', 'API Design'], milestones: ['Deploy an intermediate project', 'Write technical documentation'] },
    { phase: 3, title: 'Advanced Specialization', duration: '6-8 weeks', goals: ['Master advanced concepts', 'Contribute to open source'], skills: ['System Design', 'Performance Optimization', 'Testing'], milestones: ['Complete an advanced project', 'Make an open-source contribution'] },
    { phase: 4, title: 'Job Readiness', duration: '4-6 weeks', goals: ['Polish portfolio and resume', 'Practice interviews'], skills: ['Interview Prep', 'System Design Interviews', 'Behavioral Questions'], milestones: ['Mock interviews completed', 'Portfolio finalized', 'Apply to 20+ roles'] },
  ],
};

function calculateScore(presentCount: number, totalCount: number, experienceCount: number, projectCount: number): number {
  const skillRatio = totalCount > 0 ? (presentCount / totalCount) : 0;
  let score = Math.round(skillRatio * 60);
  score += Math.min(experienceCount * 8, 16);
  score += Math.min(projectCount * 6, 24);
  return Math.min(Math.max(score, 15), 95);
}

class GeminiService {
  private apiKey: string;
  private baseURL = 'https://api.groq.com/openai/v1/chat/completions';
  private models = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'gemma2-9b-it'];

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  private async tryAI(prompt: string): Promise<string | null> {
    if (!this.apiKey) return null;

    for (const model of this.models) {
      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          console.log(`Model ${model} failed: ${response.status}`);
          continue;
        }

        const data = await response.json() as { choices: { message: { content: string } }[] };
        return data.choices[0].message.content;
      } catch (err) {
        console.log(`Model ${model} error:`, (err as Error).message);
        continue;
      }
    }
    return null;
  }

  private cleanJSON(text: string): string {
    return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  }

  // ============================================================
  // SKILL GAP ANALYSIS
  // ============================================================
  async analyzeSkillGaps(resume: ParsedResume, targetRole: string): Promise<SkillAnalysis> {
    const requiredSkills = ROLE_SKILL_MAP[targetRole] || ROLE_SKILL_MAP['Software Engineer'];
    const resumeSkillsLower = resume.skills.map(s => s.toLowerCase());

    const presentSkills = requiredSkills.filter(s => resumeSkillsLower.includes(s.toLowerCase()));
    const missingSkills = requiredSkills.filter(s => !resumeSkillsLower.includes(s.toLowerCase()));

    // Try AI first for richer analysis
    const prompt = `You are an expert career coach. Analyze this resume for a ${targetRole} position.

Resume Skills: ${resume.skills.join(', ')}
Experience: ${JSON.stringify(resume.experience?.slice(0, 2))}
Projects: ${JSON.stringify(resume.projects?.slice(0, 2))}

Return ONLY valid JSON (no markdown):
{
  "presentSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "partialSkills": ["skill1"],
  "overallScore": 72,
  "strengthAreas": ["area1", "area2"],
  "improvementAreas": ["area1", "area2"],
  "summary": "Brief assessment"
}`;

    const aiResponse = await this.tryAI(prompt);
    if (aiResponse) {
      try {
        return JSON.parse(this.cleanJSON(aiResponse));
      } catch {
        console.log('AI response parse failed, using fallback');
      }
    }

    // Fallback rule-based analysis
    const score = calculateScore(
      presentSkills.length,
      requiredSkills.length,
      resume.experience?.length || 0,
      resume.projects?.length || 0
    );

    return {
      presentSkills: presentSkills.length > 0 ? presentSkills : resume.skills.slice(0, 6),
      missingSkills: missingSkills.slice(0, 8),
      partialSkills: [],
      overallScore: score,
      strengthAreas: presentSkills.slice(0, 3).length > 0 ? presentSkills.slice(0, 3) : ['Foundational programming knowledge'],
      improvementAreas: missingSkills.slice(0, 3),
      summary: `Based on your current profile, you have ${presentSkills.length} of ${requiredSkills.length} key skills for ${targetRole}. Focus on building the missing skills through hands-on projects.`,
    } as SkillAnalysis & { summary: string };
  }

  // ============================================================
  // PROJECT GENERATION
  // ============================================================
  async generateProjects(resume: ParsedResume, targetRole: string, skillGaps: SkillAnalysis): Promise<GeneratedProjectData[]> {
    const prompt = `Generate 6 project ideas for a ${targetRole} student.
Current skills: ${resume.skills.slice(0, 8).join(', ')}
Missing skills: ${skillGaps.missingSkills.slice(0, 4).join(', ')}

Return ONLY valid JSON array (no markdown):
[
  {
    "title": "Project Title",
    "description": "2-3 sentence description",
    "techStack": ["tech1", "tech2"],
    "difficulty": "BEGINNER",
    "duration": "2-3 weeks",
    "outcomes": ["outcome1", "outcome2"],
    "resources": [{"title": "Docs", "url": "https://docs.example.com", "type": "documentation"}],
    "category": "Web Development"
  }
]
Generate 2 BEGINNER, 2 INTERMEDIATE, 2 ADVANCED.`;

    const aiResponse = await this.tryAI(prompt);
    if (aiResponse) {
      try {
        const parsed = JSON.parse(this.cleanJSON(aiResponse));
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        console.log('AI project response parse failed, using fallback');
      }
    }

    // Fallback templates based on role
    const isAIRole = ['GenAI Engineer', 'AI Engineer', 'ML Engineer', 'Data Scientist'].includes(targetRole);
    return isAIRole ? PROJECT_TEMPLATES.ai : PROJECT_TEMPLATES.default;
  }

  // ============================================================
  // ROADMAP GENERATION
  // ============================================================
  async generateRoadmap(targetRole: string, currentSkills: string[]): Promise<{ phases: RoadmapPhase[]; timeline: string }> {
    const prompt = `Create career roadmap for ${targetRole}.
Current skills: ${currentSkills.slice(0, 8).join(', ')}

Return ONLY valid JSON (no markdown):
{
  "timeline": "6-9 months",
  "phases": [
    {
      "phase": 1,
      "title": "Foundation",
      "duration": "4-6 weeks",
      "goals": ["goal1", "goal2"],
      "skills": ["skill1", "skill2"],
      "milestones": ["milestone1"]
    }
  ]
}
Create exactly 4 phases.`;

    const aiResponse = await this.tryAI(prompt);
    if (aiResponse) {
      try {
        const parsed = JSON.parse(this.cleanJSON(aiResponse));
        if (parsed.phases && Array.isArray(parsed.phases)) return parsed;
      } catch {
        console.log('AI roadmap response parse failed, using fallback');
      }
    }

    // Fallback roadmap template, personalized with role-specific skills
    const requiredSkills = ROLE_SKILL_MAP[targetRole] || ROLE_SKILL_MAP['Software Engineer'];
    const phases = JSON.parse(JSON.stringify(ROADMAP_TEMPLATES.default)) as RoadmapPhase[];

    phases[1].skills = requiredSkills.slice(0, 3);
    phases[2].skills = requiredSkills.slice(3, 6);
    phases[1].title = `${targetRole} Core Skills`;
    phases[2].title = `Advanced ${targetRole} Topics`;

    return { phases, timeline: '5-7 months' };
  }

  // ============================================================
  // RESUME IMPROVEMENT SUGGESTIONS
  // ============================================================
  async generateResumeImprovements(resume: ParsedResume, targetRole: string): Promise<string[]> {
    const prompt = `Review resume for ${targetRole}.
Skills: ${resume.skills.slice(0, 8).join(', ')}

Return ONLY valid JSON array of 6 tips (no markdown):
["tip1", "tip2", "tip3", "tip4", "tip5", "tip6"]`;

    const aiResponse = await this.tryAI(prompt);
    if (aiResponse) {
      try {
        const parsed = JSON.parse(this.cleanJSON(aiResponse));
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        console.log('AI tips response parse failed, using fallback');
      }
    }

    // Fallback static tips
    return RESUME_TIPS;
  }
}

export const geminiService = new GeminiService();
