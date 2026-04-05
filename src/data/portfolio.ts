export const personalInfo = {
  name: 'Fabian Pavel Velicea',
  title: 'Software Developer / Engineer',
  tagline: '.NET, Blazor, WPF & Full-Stack Developer',
  email: 'fabianvelicia@hotmail.com',
  phone: '(+40) 730887973',
  location: 'Brasov, Romania',
  nationality: 'Romanian',
  dob: '29/03/2002',
  github: 'https://github.com/InfinityAtom',
  socials: {
    github: 'https://github.com/InfinityAtom',
  },
};

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  status: 'Completed' | 'In Progress' | 'Archived';
  year: string;
  link?: string;
  github?: string;
  features?: string[];
  architecture?: string[];
  security?: string[];
  languages?: { name: string; features: string }[];
  details?: string;
}

export const projects: Project[] = [
  {
    id: 'proj-pep5',
    name: 'PeP5 - Programming Examination Platform',
    description: 'A comprehensive, secure online examination system with SafeExamBrowser-like protection and AI-powered code evaluation. Consists of a Blazor Server web app for exam management and a WPF desktop client with full system lockdown capabilities.',
    tech: ['.NET 6.0', '.NET 8.0', 'Blazor Server', 'WPF', 'SQL Server', 'Entity Framework Core', 'WebView2', 'Monaco Editor', 'OpenAI GPT-4o', 'Piston API', 'Google Cloud', 'Docker'],
    status: 'Completed',
    year: '2025',
    link: 'https://pep-webapp-795388481242.us-central1.run.app',
    github: 'https://github.com/InfinityAtom/PeP5',
    features: [
      'Role-based access: Admin, Teacher, Student',
      'Exam creation with drag-and-drop builder',
      'AI-powered question generation (GPT-4o)',
      'Full IDE with Monaco editor (VS Code-style)',
      'Multi-file project support',
      'Auto code grading: quality, correctness, efficiency',
      'Task navigator with progress tracking',
      'CSV data import for bulk student enrollment',
      'Results analytics and performance reports',
      'Resizable editor/task panel layout',
      'Exam code generation with expiration',
    ],
    security: [
      'Fullscreen enforcement (no window switching)',
      'Keyboard blocking (Alt+Tab, Win, PrtScr)',
      'Clipboard monitoring and clearing',
      'Taskbar hiding',
      'Screenshot/recording prevention',
      'VM & debugger detection',
      'Remote session blocking',
      'Process monitoring for forbidden apps',
      'Multi-monitor detection',
      'Violation tracking with watermarking',
      'Secure password-protected exit',
    ],
    architecture: [
      'Controllers/ - API endpoints',
      'Models/ - Domain entities + ProgrammingExamModels',
      'Services/ - ProgrammingExamService, CodeExecutionService, OpenAIService',
      'Pages/Blazor/ - UI components by role (Admin, Teacher, Student)',
      'PeP.ExamApp/ - WPF desktop app with security features',
    ],
    languages: [
      { name: 'Python', features: 'Full syntax, CSV parsing, pandas integration' },
      { name: 'Java', features: 'Class-based, automatic multi-file compilation' },
      { name: 'JavaScript', features: 'ES6+, Node.js console, module support' },
      { name: 'C#', features: '.NET-style projects with class structure' },
    ],
    details: 'Deployed on Google Cloud using Cloud Run + Cloud SQL. Includes Docker config, Cloud Build integration. ExamApp installer ~50MB for Windows 10/11 64-bit with auto .NET 8.0 and WebView2 installation.',
  },
  {
    id: 'proj-1',
    name: 'React95 Portfolio',
    description: 'A Windows 95 themed portfolio website built with React and TypeScript. The very site you are looking at right now!',
    tech: ['React', 'TypeScript', 'React95', 'Vite'],
    status: 'Completed',
    year: '2026',
  },
];

export interface WorkExperience {
  title: string;
  company: string;
  period: string;
  location: string;
}

export const workExperience: WorkExperience[] = [
  {
    title: 'Software Developer / Engineer',
    company: 'Siemens S.R.L.',
    period: '08/2025 - Current',
    location: 'Brasov, Romania',
  },
  {
    title: 'Software Developer Intern',
    company: 'Siemens S.R.L.',
    period: '05/2023 - 07/2025',
    location: 'Brasov, Romania',
  },
  {
    title: 'Technical Support Specialist',
    company: 'Computer Generated Solutions Romania S.R.L.',
    period: '02/2022 - 05/2022',
    location: 'Brasov, Romania',
  },
];

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
}

export const education: Education[] = [
  {
    degree: 'Electronic and Integrated Communications Systems — Master Degree',
    institution: 'Faculty of Electrical Engineering and Computer Science',
    period: '10/2025 - Current',
    location: 'Brasov, Romania',
  },
  {
    degree: 'Technologies and Telecommunications Systems — Bachelor\'s Degree',
    institution: 'Faculty of Electrical Engineering and Computer Science',
    period: '10/2021 - 07/2025',
    location: 'Brasov, Romania',
  },
];

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  doi?: string;
}

export const publications: Publication[] = [
  {
    title: 'Programming Examination Platform',
    authors: 'Velicea, F.P., Ghimbcan, A.E., Filip, R.C., Danciu, G.M., Kertesz, C.Z. (2025)',
    venue: 'ICL 2024. Lecture Notes in Networks and Systems, vol 1281. Springer, Cham.',
    doi: 'https://doi.org/10.1007/978-3-031-83520-9_33',
  },
  {
    title: 'Biological Barcodes for Engineering and Medical Applications',
    authors: 'Velicea, Fabian Pavel and Bogdan, Ioana Corina',
    venue: 'Book of Abstracts ISIM & ISWIM',
  },
];

export interface Skill {
  category: string;
  items: { name: string; level: number }[];
}

export const skills: Skill[] = [
  {
    category: '.NET Ecosystem',
    items: [
      { name: '.NET C#', level: 95 },
      { name: '.NET Blazor', level: 90 },
      { name: '.NET MAUI', level: 75 },
      { name: 'WPF', level: 88 },
    ],
  },
  {
    category: 'Web & Frontend',
    items: [
      { name: 'JavaScript', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'CSS', level: 82 },
      { name: 'React', level: 75 },
    ],
  },
  {
    category: 'Backend & Systems',
    items: [
      { name: 'SQL', level: 88 },
      { name: 'Python', level: 78 },
      { name: 'Java', level: 75 },
      { name: 'C / C++', level: 70 },
    ],
  },
  {
    category: 'DevOps & Tools',
    items: [
      { name: 'Docker', level: 80 },
      { name: 'Google Cloud', level: 78 },
      { name: 'Git', level: 90 },
      { name: 'VBA', level: 65 },
    ],
  },
];

export const resumeText = `FABIAN PAVEL VELICEA
Software Developer / Engineer
==========================================

CONTACT
------------------------------------------
Email: fabianvelicia@hotmail.com
Phone: (+40) 730887973
Location: Brasov, Romania
GitHub: github.com/InfinityAtom

WORK EXPERIENCE
------------------------------------------
Software Developer / Engineer
Siemens S.R.L. | 08/2025 - Current
Brasov, Romania

Software Developer Intern
Siemens S.R.L. | 05/2023 - 07/2025
Brasov, Romania

Technical Support Specialist
Computer Generated Solutions Romania
02/2022 - 05/2022 | Brasov, Romania

EDUCATION
------------------------------------------
Master: Electronic and Integrated
Communications Systems
Faculty of EE & CS | 10/2025 - Current

Bachelor: Technologies and Telecom Systems
Faculty of EE & CS | 10/2021 - 07/2025

SKILLS
------------------------------------------
.NET C# | .NET Blazor | .NET MAUI | WPF
JavaScript | TypeScript | CSS | React
Java | C | C++ | VBA | Python
Docker | SQL | Google Cloud | Git

LANGUAGES
------------------------------------------
Romanian: Native
English: C2 Listening, C1 Reading,
         B2 Speaking, C2 Writing

PUBLICATIONS
------------------------------------------
"Programming Examination Platform"
ICL 2024, Springer LNNS vol 1281
DOI: 10.1007/978-3-031-83520-9_33

"Biological Barcodes for Engineering
and Medical Applications"
Book of Abstracts ISIM & ISWIM

PROJECTS
------------------------------------------
PeP5 - Programming Examination Platform
github.com/InfinityAtom/PeP5
`;
