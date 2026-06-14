import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ParsedResume } from '../types';

export class ResumeParserService {
  async parseFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
      return this.parsePDF(filePath);
    } else if (ext === '.docx') {
      return this.parseDOCX(filePath);
    }
    throw new Error('Unsupported file format');
  }

  private async parsePDF(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  private async parseDOCX(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  extractStructuredData(rawText: string): Partial<ParsedResume> {
    const skills = this.extractSkills(rawText);
    const experience = this.extractExperience(rawText);
    const education = this.extractEducation(rawText);
    const projects = this.extractProjects(rawText);

    return { rawText, skills, experience, education, projects };
  }

  private extractSkills(text: string): string[] {
    const skillKeywords = [
      // Programming Languages
      'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Kotlin', 'Swift',
      'R', 'Scala', 'PHP', 'Ruby', 'Dart', 'MATLAB',
      // Web
      'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'FastAPI', 'Django', 'Flask',
      'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'GraphQL', 'REST API',
      // Data/AI/ML
      'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch',
      'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'OpenCV',
      'LangChain', 'LlamaIndex', 'RAG', 'LLM', 'Hugging Face', 'Transformers',
      'BERT', 'GPT', 'Stable Diffusion', 'GenAI', 'Prompt Engineering',
      // Cloud/DevOps
      'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions',
      'Jenkins', 'Nginx', 'Linux', 'Bash',
      // Databases
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'SQLite', 'Prisma',
      'Firebase', 'Supabase', 'DynamoDB',
      // Tools
      'Git', 'GitHub', 'Jira', 'Figma', 'Postman', 'VS Code', 'Jupyter',
      // Concepts
      'Agile', 'Scrum', 'System Design', 'Microservices', 'API Design', 'OOP', 'DSA',
    ];

    const found = new Set<string>();
    const lowerText = text.toLowerCase();

    for (const skill of skillKeywords) {
      if (lowerText.includes(skill.toLowerCase())) {
        found.add(skill);
      }
    }

    return Array.from(found);
  }

  private extractExperience(text: string): { title: string; company: string; duration: string; description: string[] }[] {
    // Basic experience extraction
    const experiences: { title: string; company: string; duration: string; description: string[] }[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const expKeywords = ['experience', 'work', 'employment', 'internship', 'position'];
    let inExpSection = false;

    for (let i = 0; i < lines.length; i++) {
      const lower = lines[i].toLowerCase();
      if (expKeywords.some(k => lower.includes(k))) {
        inExpSection = true;
        continue;
      }
      if (inExpSection && (lower.includes('education') || lower.includes('skills') || lower.includes('projects'))) {
        break;
      }
      if (inExpSection && lines[i].length > 10) {
        // Simple heuristic
        experiences.push({
          title: lines[i],
          company: lines[i + 1] || '',
          duration: '',
          description: [],
        });
      }
    }

    return experiences.slice(0, 5);
  }

  private extractEducation(text: string): { degree: string; institution: string; year: string }[] {
    const education: { degree: string; institution: string; year: string }[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const eduKeywords = ['b.tech', 'b.e', 'm.tech', 'bca', 'mca', 'bachelor', 'master', 'degree', 'university', 'college', 'institute'];

    for (const line of lines) {
      if (eduKeywords.some(k => line.toLowerCase().includes(k))) {
        education.push({
          degree: line,
          institution: '',
          year: '',
        });
      }
    }

    return education.slice(0, 3);
  }

  private extractProjects(text: string): { name: string; description: string; techStack: string[] }[] {
    const projects: { name: string; description: string; techStack: string[] }[] = [];
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let inProjectSection = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('project')) {
        inProjectSection = true;
        continue;
      }
      if (inProjectSection && (lines[i].toLowerCase().includes('experience') || lines[i].toLowerCase().includes('education'))) {
        break;
      }
      if (inProjectSection && lines[i].length > 10 && lines[i].length < 100) {
        projects.push({
          name: lines[i],
          description: lines[i + 1] || '',
          techStack: this.extractSkills(lines[i] + ' ' + (lines[i + 1] || '')),
        });
      }
    }

    return projects.slice(0, 5);
  }
}

export const resumeParserService = new ResumeParserService();
