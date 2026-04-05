import { useState } from 'react';
import { Frame, Button, ProgressBar, Fieldset, Checkbox, Tree } from '@react95/core';
import {
  Computer,
  Computer3,
  FolderOpen,
  FileText,
  Globe,
  Lock,
  Network,
  Settings,
  Notepad,
} from '@react95/icons';

type Section =
  | 'welcome'
  | 'overview'
  | 'webapp'
  | 'examapp'
  | 'ide'
  | 'languages'
  | 'security'
  | 'architecture'
  | 'deployment';

const sectionLabels: Record<Section, string> = {
  welcome: 'Welcome',
  overview: 'Product Overview',
  webapp: 'Web Application',
  examapp: 'ExamApp Desktop',
  ide: 'IDE & Code Editor',
  languages: 'Languages',
  security: 'Security Engine',
  architecture: 'Architecture',
  deployment: 'Deployment',
};

const sectionOrder: Section[] = [
  'welcome', 'overview', 'webapp', 'examapp', 'ide',
  'languages', 'security', 'architecture', 'deployment',
];

/* ─── Banner ─── */
function Banner({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #000080 0%, #0055aa 40%, #1084d0 100%)',
      padding: '20px 24px',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      borderBottom: '2px solid #000',
    }}>
      <Computer variant="32x32_4" />
      <div>
        <div style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: 1 }}>{title}</div>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>{subtitle}</div>
      </div>
    </div>
  );
}

/* ─── Sidebar ─── */
function Sidebar({ onSelect }: { active: Section; onSelect: (s: Section) => void }) {
  const treeData = sectionOrder.map((s, i) => ({
    id: i,
    label: sectionLabels[s],
    icon: <FileText variant="16x16_4" />,
    onClick: () => onSelect(s),
  }));

  return (
    <Frame boxShadow="in" style={{
      width: 190,
      backgroundColor: '#fff',
      overflow: 'auto',
      flexShrink: 0,
      padding: 4,
    }}>
      <Tree
        data={treeData}
        root={{ id: 99, label: 'PeP5 Documentation', icon: <FolderOpen variant="16x16_4" /> }}
      />
    </Frame>
  );
}

/* ─── Status Bar ─── */
function StatusBar({ section, current, total }: { section: string; current: number; total: number }) {
  return (
    <Frame boxShadow="in" style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '3px 8px',
      fontSize: 11,
      backgroundColor: '#c0c0c0',
      borderTop: '1px solid #808080',
    }}>
      <span>Section: {section}</span>
      <span>Page {current} of {total}</span>
    </Frame>
  );
}

/* ─── Toolbar ─── */
function Toolbar({ onPrev, onNext, canPrev, canNext, onVisit }: {
  onPrev: () => void; onNext: () => void;
  canPrev: boolean; canNext: boolean;
  onVisit: () => void;
}) {
  return (
    <Frame boxShadow="out" style={{
      display: 'flex',
      gap: 4,
      padding: '3px 6px',
      alignItems: 'center',
      borderBottom: '1px solid #808080',
    }}>
      <Button disabled={!canPrev} onClick={onPrev} style={{ fontSize: 11, padding: '2px 12px' }}>
        &lt; Back
      </Button>
      <Button disabled={!canNext} onClick={onNext} style={{ fontSize: 11, padding: '2px 12px' }}>
        Next &gt;
      </Button>
      <div style={{ flex: 1 }} />
      <Button onClick={onVisit} style={{ fontSize: 11, padding: '2px 12px' }}>
        Visit Live App
      </Button>
      <Button onClick={() => window.open('https://github.com/InfinityAtom/PeP5', '_blank')} style={{ fontSize: 11, padding: '2px 12px' }}>
        GitHub
      </Button>
    </Frame>
  );
}

/* ─── Section: Welcome ─── */
function WelcomeSection() {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Blue side panel like classic installers */}
      <div style={{
        width: 180,
        background: 'linear-gradient(to bottom, #000080, #1084d0)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexShrink: 0,
      }}>
        <Computer variant="32x32_4" />
        <div style={{
          color: '#fff',
          fontSize: 22,
          fontWeight: 'bold',
          marginTop: 16,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          letterSpacing: 4,
        }}>PeP5</div>
      </div>

      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#000080', marginBottom: 8 }}>
          Welcome to PeP5
        </div>
        <div style={{ fontSize: 16, color: '#000080', marginBottom: 20, fontStyle: 'italic' }}>
          Programming Examination Platform v5.0
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '8px 0' }} />

        <p style={{ lineHeight: 1.8, fontSize: 13, marginBottom: 12 }}>
          PeP is a comprehensive, secure online examination system with
          SafeExamBrowser-like protection and AI-powered code evaluation.
        </p>

        <p style={{ lineHeight: 1.8, fontSize: 13, marginBottom: 16 }}>
          The platform consists of two main components:
        </p>

        <Fieldset legend="Components" style={{ marginBottom: 16 }}>
          <div style={{ padding: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Globe variant="16x16_4" />
              <b>Blazor Server Web App</b> — Exam management, AI grading, analytics
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Computer3 variant="16x16_4" />
              <b>WPF Desktop Client</b> — Secure exam-taking with full system lockdown
            </div>
          </div>
        </Fieldset>

        <p style={{ fontSize: 12, color: '#808080' }}>
          Click "Next" or select a topic from the sidebar to explore.
        </p>
      </div>
    </div>
  );
}

/* ─── Section: Overview ─── */
function OverviewSection() {
  return (
    <div style={{ padding: 16 }}>
      <SectionHeader icon={<Computer variant="32x32_4" />} title="Product Overview" />

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Fieldset legend="Platform Stats" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            <StatRow label="User Roles" value="Admin, Teacher, Student" />
            <StatRow label="Exam Types" value="Traditional + Programming" />
            <StatRow label="AI Engine" value="OpenAI GPT-4o-mini" />
            <StatRow label="Code Executor" value="Piston API" />
            <StatRow label="IDE" value="Monaco Editor (VS Code)" />
            <StatRow label="Version" value="5.0.0" />
          </div>
        </Fieldset>

        <Fieldset legend="Tech Stack" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            <TechBar label=".NET / Blazor" pct={95} />
            <TechBar label="WPF / Desktop" pct={90} />
            <TechBar label="SQL Server / EF Core" pct={88} />
            <TechBar label="OpenAI Integration" pct={85} />
            <TechBar label="Google Cloud" pct={80} />
            <TechBar label="Docker" pct={75} />
          </div>
        </Fieldset>
      </div>

      <Fieldset legend="Key Highlights">
        <div style={{ padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[
            'Full IDE with Monaco editor',
            'AI-powered question generation',
            'Anti-cheat lockdown engine',
            'Multi-language code execution',
            'Auto code grading & scoring',
            'Real-time progress tracking',
            'VM & debugger detection',
            'Google Cloud deployment',
          ].map((f, i) => (
            <Checkbox key={i} checked readOnly style={{ fontSize: 12 }}>{f}</Checkbox>
          ))}
        </div>
      </Fieldset>
    </div>
  );
}

/* ─── Section: Web App ─── */
function WebAppSection() {
  return (
    <div style={{ padding: 16 }}>
      <SectionHeader icon={<Globe variant="32x32_4" />} title="Web Application" />

      <Fieldset legend="Teacher Features" style={{ marginBottom: 12 }}>
        <div style={{ padding: 8 }}>
          {[
            'Exam creation with drag-and-drop question builder',
            'AI-powered question generation from topic descriptions',
            'Programming exam creation with multi-file projects',
            'Question bank management and reuse',
            'Exam code generation with configurable expiration',
            'CSV data import for bulk student enrollment',
            'Results analytics with detailed performance reports',
          ].map((f, i) => (
            <FeatureItem key={i} text={f} />
          ))}
        </div>
      </Fieldset>

      <Fieldset legend="Student Features">
        <div style={{ padding: 8 }}>
          {[
            'Take exams through web browser or secure desktop app',
            'Full IDE environment for programming exams',
            'Real-time progress tracking with auto-save',
            'View results with AI-generated feedback',
            'Code quality assessment and scoring breakdown',
          ].map((f, i) => (
            <FeatureItem key={i} text={f} />
          ))}
        </div>
      </Fieldset>
    </div>
  );
}

/* ─── Section: ExamApp ─── */
function ExamAppSection() {
  return (
    <div style={{ padding: 16 }}>
      <SectionHeader icon={<Computer3 variant="32x32_4" />} title="ExamApp Desktop Client" />

      <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
        The ExamApp is a WPF desktop application built on .NET 8.0 that provides
        a SafeExamBrowser-like secure environment for exam-taking.
      </p>

      <div style={{ display: 'flex', gap: 12 }}>
        <Fieldset legend="Lockdown Features" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            {[
              'Fullscreen enforcement',
              'Keyboard blocking (Alt+Tab, Win, PrtScr)',
              'Clipboard monitoring & clearing',
              'Taskbar hiding',
              'Screenshot/recording prevention',
              'Focus change detection & logging',
            ].map((f, i) => (
              <FeatureItem key={i} text={f} />
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="Custom Taskbar" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            {[
              'Real-time clock display',
              'Internet connectivity indicator',
              'Violation counter badge',
              'Secure password-protected exit',
              'Network settings panel',
              'WiFi management interface',
            ].map((f, i) => (
              <FeatureItem key={i} text={f} />
            ))}
          </div>
        </Fieldset>
      </div>

      <Fieldset legend="System Requirements" style={{ marginTop: 12 }}>
        <div style={{ padding: 8, display: 'flex', gap: 24 }}>
          <div style={{ fontSize: 12 }}>
            <b>OS:</b> Windows 10/11 (64-bit)<br />
            <b>Runtime:</b> .NET 8.0<br />
          </div>
          <div style={{ fontSize: 12 }}>
            <b>Browser:</b> WebView2 Runtime<br />
            <b>Download:</b> ~50 MB installer<br />
          </div>
        </div>
      </Fieldset>
    </div>
  );
}

/* ─── Section: IDE ─── */
function IDESection() {
  return (
    <div style={{ padding: 16 }}>
      <SectionHeader icon={<Notepad variant="32x32_4" />} title="IDE & Code Editor" />

      <Fieldset legend="Monaco Editor Integration" style={{ marginBottom: 12 }}>
        <div style={{ padding: 8 }}>
          <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
            Full VS Code-style editing experience powered by the Monaco Editor engine,
            running inside a secure WebView2 container.
          </p>
          {[
            'Syntax highlighting for Python, Java, JavaScript, C#',
            'IntelliSense auto-completion',
            'Multi-file project support with file explorer',
            'Read-only starter files and editable solution files',
            'Resizable editor/task panel split layout',
          ].map((f, i) => (
            <FeatureItem key={i} text={f} />
          ))}
        </div>
      </Fieldset>

      <div style={{ display: 'flex', gap: 12 }}>
        <Fieldset legend="Task Panel" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            {[
              'Task navigator side panel',
              'Instructions with rich formatting',
              'Progress tracking per task',
              'CSV data viewer with tabs',
              'Auto-save functionality',
            ].map((f, i) => (
              <FeatureItem key={i} text={f} />
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="Code Grading" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            <p style={{ fontSize: 11, marginBottom: 8 }}>AI-powered multi-metric scoring:</p>
            <TechBar label="Code Quality" pct={0} />
            <TechBar label="Correctness" pct={0} />
            <TechBar label="Completion" pct={0} />
            <TechBar label="Efficiency" pct={0} />
            <p style={{ fontSize: 10, color: '#808080', marginTop: 4 }}>
              Scores generated per submission via GPT-4o
            </p>
          </div>
        </Fieldset>
      </div>
    </div>
  );
}

/* ─── Section: Languages ─── */
function LanguagesSection() {
  const langs = [
    { name: 'Python', features: 'Full syntax support, CSV parsing, pandas integration', pct: 95, color: '#3572A5' },
    { name: 'Java', features: 'Class-based projects, automatic multi-file compilation', pct: 90, color: '#B07219' },
    { name: 'JavaScript', features: 'ES6+ syntax, Node.js console output, module support', pct: 88, color: '#F7DF1E' },
    { name: 'C#', features: '.NET-style projects with proper class structure', pct: 85, color: '#178600' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <SectionHeader icon={<FileText variant="32x32_4" />} title="Supported Languages" />

      <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
        PeP5 supports four major programming languages, each with full syntax highlighting,
        compilation/interpretation, and AI-powered evaluation.
      </p>

      {langs.map((lang, i) => (
        <Fieldset key={i} legend={lang.name} style={{ marginBottom: 12 }}>
          <div style={{ padding: 8 }}>
            <div style={{ fontSize: 12, marginBottom: 6 }}>{lang.features}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, minWidth: 80 }}>Support Level:</span>
              <div style={{ flex: 1 }}><ProgressBar width={200} percent={lang.pct} /></div>
              <span style={{ fontSize: 11, fontWeight: 'bold' }}>{lang.pct}%</span>
            </div>
          </div>
        </Fieldset>
      ))}

      <Frame boxShadow="in" style={{ padding: 8, backgroundColor: '#ffffcc', fontSize: 11 }}>
        <b>Note:</b> Code execution is handled by the Piston API, providing sandboxed runtime
        environments for each language. No code runs on the examination server directly.
      </Frame>
    </div>
  );
}

/* ─── Section: Security ─── */
function SecuritySection() {
  return (
    <div style={{ padding: 16 }}>
      <SectionHeader icon={<Lock variant="32x32_4" />} title="Security Engine" />

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Fieldset legend="Anti-Cheat Engine" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            {[
              'Virtual Machine detection',
              'Debugger detection and blocking',
              'Multi-monitor detection',
              'Remote session blocking',
              'Process monitoring for forbidden apps',
              'Violation tracking with watermarking',
            ].map((f, i) => (
              <FeatureItem key={i} text={f} icon={<Lock variant="16x16_4" />} />
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="Violations Tracked" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ backgroundColor: '#000080', color: '#fff' }}>
                  <th style={{ padding: '3px 6px', textAlign: 'left' }}>Violation</th>
                  <th style={{ padding: '3px 6px', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Focus change', 'Log + Warning'],
                  ['Forbidden app', 'Block + Log'],
                  ['Screenshot attempt', 'Block + Log'],
                  ['Multi-monitor', 'Block exam'],
                  ['VM detected', 'Deny access'],
                  ['Remote session', 'Deny access'],
                ].map(([v, a], i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#e8e8e8' }}>
                    <td style={{ padding: '3px 6px' }}>{v}</td>
                    <td style={{ padding: '3px 6px', fontWeight: 'bold', color: '#800000' }}>{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Fieldset>
      </div>

      <Fieldset legend="Web Security">
        <div style={{ padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {[
            'Role-based access control (RBAC)',
            'CSRF protection',
            'Parameterized SQL queries',
            'HTTPS encryption',
            'ASP.NET Core Identity',
            'Secure session management',
          ].map((f, i) => (
            <Checkbox key={i} checked readOnly style={{ fontSize: 12 }}>{f}</Checkbox>
          ))}
        </div>
      </Fieldset>
    </div>
  );
}

/* ─── Section: Architecture ─── */
function ArchitectureSection() {
  const folders = [
    { name: 'Controllers/', desc: 'API endpoints and route handlers', icon: <FolderOpen variant="16x16_4" /> },
    { name: 'Models/', desc: 'Domain entities + ProgrammingExamModels', icon: <FolderOpen variant="16x16_4" /> },
    { name: 'Services/', desc: 'ProgrammingExamService, CodeExecutionService, OpenAIService', icon: <FolderOpen variant="16x16_4" /> },
    { name: 'Pages/Blazor/', desc: 'UI components organized by role', icon: <FolderOpen variant="16x16_4" /> },
    { name: 'PeP.ExamApp/', desc: 'WPF desktop application with security engine', icon: <Computer3 variant="16x16_4" /> },
  ];

  return (
    <div style={{ padding: 16 }}>
      <SectionHeader icon={<Settings variant="32x32_4" />} title="Architecture" />

      <Fieldset legend="Project Structure" style={{ marginBottom: 12 }}>
        <div style={{ padding: 8 }}>
          {folders.map((f, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 0',
              borderBottom: i < folders.length - 1 ? '1px dotted #c0c0c0' : 'none',
            }}>
              {f.icon}
              <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#000080', minWidth: 140, fontSize: 12 }}>
                {f.name}
              </span>
              <span style={{ fontSize: 12 }}>{f.desc}</span>
            </div>
          ))}
        </div>
      </Fieldset>

      <div style={{ display: 'flex', gap: 12 }}>
        <Fieldset legend="Data Flow" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            <FlowStep n={1} text="Teacher creates exam via Blazor UI" />
            <FlowArrow />
            <FlowStep n={2} text="Student joins with exam code" />
            <FlowArrow />
            <FlowStep n={3} text="Code submitted to Piston API" />
            <FlowArrow />
            <FlowStep n={4} text="GPT-4o evaluates & scores" />
            <FlowArrow />
            <FlowStep n={5} text="Results displayed with feedback" />
          </div>
        </Fieldset>

        <Fieldset legend="Database Schema" style={{ flex: 1 }}>
          <div style={{ padding: 8, fontSize: 11 }}>
            <TableRow label="Users" desc="Identity + role management" />
            <TableRow label="Courses" desc="Course enrollment data" />
            <TableRow label="Exams" desc="Traditional exam definitions" />
            <TableRow label="Questions" desc="Question bank entries" />
            <TableRow label="ProgrammingExams" desc="IDE exam configurations" />
            <TableRow label="Tasks" desc="Per-task code + evaluation" />
            <TableRow label="Attempts" desc="Student submissions + scores" />
          </div>
        </Fieldset>
      </div>
    </div>
  );
}

/* ─── Section: Deployment ─── */
function DeploymentSection() {
  return (
    <div style={{ padding: 16 }}>
      <SectionHeader icon={<Network variant="32x32_4" />} title="Deployment" />

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Fieldset legend="Google Cloud Platform" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            {[
              'Cloud Run for containerized web app',
              'Cloud SQL for database management',
              'Cloud Build for CI/CD pipeline',
              'Docker containerization',
              'Auto-scaling based on demand',
            ].map((f, i) => (
              <FeatureItem key={i} text={f} />
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="Estimated Monthly Cost" style={{ flex: 1 }}>
          <div style={{ padding: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <tbody>
                <tr style={{ backgroundColor: '#e8e8e8' }}>
                  <td style={{ padding: '3px 6px' }}>Cloud Run</td>
                  <td style={{ padding: '3px 6px', textAlign: 'right' }}>$20-40</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 6px' }}>Cloud SQL</td>
                  <td style={{ padding: '3px 6px', textAlign: 'right' }}>$30-50</td>
                </tr>
                <tr style={{ backgroundColor: '#e8e8e8' }}>
                  <td style={{ padding: '3px 6px' }}>Other (storage, network)</td>
                  <td style={{ padding: '3px 6px', textAlign: 'right' }}>$6-10</td>
                </tr>
                <tr style={{ fontWeight: 'bold', borderTop: '2px solid #000080' }}>
                  <td style={{ padding: '3px 6px' }}>Total</td>
                  <td style={{ padding: '3px 6px', textAlign: 'right', color: '#000080' }}>$56-100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Fieldset>
      </div>

      <Fieldset legend="Live Access">
        <div style={{ padding: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 13, marginBottom: 12 }}>The platform is live and accessible at:</p>
          <Frame boxShadow="in" style={{ padding: '8px 16px', backgroundColor: '#fff', display: 'inline-block', marginBottom: 12 }}>
            <a
              href="https://pep-webapp-795388481242.us-central1.run.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0000FF', textDecoration: 'underline', fontSize: 13, fontFamily: 'monospace' }}
            >
              https://pep-webapp-795388481242.us-central1.run.app
            </a>
          </Frame>
          <p style={{ fontSize: 11, color: '#808080' }}>
            ExamApp installer available for Windows 10/11 (64-bit) — ~50 MB download
          </p>
        </div>
      </Fieldset>
    </div>
  );
}

/* ─── Reusable small components ─── */
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {icon}
        <span style={{ fontSize: 16, fontWeight: 'bold', color: '#000080' }}>{title}</span>
      </div>
      <hr style={{ border: 'none', borderTop: '2px solid #000080', borderBottom: '1px solid #fff', margin: '0 0 12px' }} />
    </>
  );
}

function FeatureItem({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0', fontSize: 12 }}>
      {icon || <span style={{ color: '#000080' }}>{'\u25B8'}</span>}
      {text}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: 12, borderBottom: '1px dotted #c0c0c0' }}>
      <span style={{ color: '#808080' }}>{label}</span>
      <span style={{ fontWeight: 'bold' }}>{value}</span>
    </div>
  );
}

function TechBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <ProgressBar width={180} percent={pct} />
    </div>
  );
}

function FlowStep({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
      <Frame boxShadow="out" style={{
        width: 22, height: 22, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 'bold', color: '#000080',
        backgroundColor: '#e0e0e0', fontSize: 11, flexShrink: 0,
      }}>{n}</Frame>
      {text}
    </div>
  );
}

function FlowArrow() {
  return <div style={{ textAlign: 'center', color: '#808080', fontSize: 10, padding: '1px 0' }}>{'\u25BC'}</div>;
}

function TableRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '2px 0', borderBottom: '1px dotted #c0c0c0' }}>
      <span style={{ fontFamily: 'monospace', color: '#000080', fontWeight: 'bold', minWidth: 120 }}>{label}</span>
      <span>{desc}</span>
    </div>
  );
}

/* ─── Main Component ─── */
const sectionComponents: Record<Section, React.ReactNode> = {
  welcome: <WelcomeSection />,
  overview: <OverviewSection />,
  webapp: <WebAppSection />,
  examapp: <ExamAppSection />,
  ide: <IDESection />,
  languages: <LanguagesSection />,
  security: <SecuritySection />,
  architecture: <ArchitectureSection />,
  deployment: <DeploymentSection />,
};

export function ProjectsExplorer() {
  const [section, setSection] = useState<Section>('welcome');
  const idx = sectionOrder.indexOf(section);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      fontSize: 12,
    }}>
      <Banner title="PeP5 — Programming Examination Platform" subtitle="Secure Online Exams with AI-Powered Code Evaluation" />

      <Toolbar
        onPrev={() => setSection(sectionOrder[idx - 1])}
        onNext={() => setSection(sectionOrder[idx + 1])}
        canPrev={idx > 0}
        canNext={idx < sectionOrder.length - 1}
        onVisit={() => window.open('https://pep-webapp-795388481242.us-central1.run.app', '_blank')}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar active={section} onSelect={setSection} />
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#c0c0c0' }}>
          {sectionComponents[section]}
        </div>
      </div>

      <StatusBar
        section={sectionLabels[section]}
        current={idx + 1}
        total={sectionOrder.length}
      />
    </div>
  );
}
