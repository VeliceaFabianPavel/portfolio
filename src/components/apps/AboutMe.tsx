import { useState } from 'react';
import { Frame, Fieldset } from '@react95/core';
import { Computer, Globe } from '@react95/icons';
import { personalInfo, workExperience, education, publications } from '../../data/portfolio';

type Tab = 'General' | 'Experience' | 'Education' | 'Publications' | 'Links';
const tabs: Tab[] = ['General', 'Experience', 'Education', 'Publications', 'Links'];

function TabBar({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: -1, zIndex: 1 }}>
      {tabs.map(tab => (
        <div
          key={tab}
          onClick={() => onSelect(tab)}
          style={{
            padding: '3px 10px',
            fontSize: 11,
            cursor: 'pointer',
            backgroundColor: active === tab ? '#c0c0c0' : '#a0a0a0',
            border: '1px solid #808080',
            borderBottom: active === tab ? '1px solid #c0c0c0' : '1px solid #808080',
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            fontWeight: active === tab ? 'bold' : 'normal',
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

export function AboutMe() {
  const [tab, setTab] = useState<Tab>('General');
  const hr = { border: 'none', borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '8px 0' } as const;

  return (
    <div style={{ fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: 12, padding: 8 }}>
      <TabBar active={tab} onSelect={setTab} />
      <Frame boxShadow="in" style={{ padding: 12, backgroundColor: '#c0c0c0' }}>
        {tab === 'General' && (
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>
              <Frame boxShadow="in" style={{ padding: 8, backgroundColor: '#fff' }}>
                <Computer variant="32x32_4" />
              </Frame>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#000080', marginBottom: 2 }}>
                {personalInfo.name}
              </div>
              <div style={{ fontSize: 13, color: '#444', marginBottom: 8 }}>{personalInfo.title}</div>
              <hr style={hr} />
              <div style={{ lineHeight: 2 }}>
                <div><b>Role:</b> {personalInfo.title}</div>
                <div><b>Location:</b> {personalInfo.location}</div>
                <div><b>Nationality:</b> {personalInfo.nationality}</div>
                <div><b>Email:</b> {personalInfo.email}</div>
                <div><b>Phone:</b> {personalInfo.phone}</div>
                <div><b>GitHub:</b> <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" style={{ color: '#0000FF', textDecoration: 'underline' }}>github.com/InfinityAtom</a></div>
              </div>
              <hr style={hr} />
              <Fieldset legend="Languages">
                <div style={{ padding: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span><b>Romanian</b> — Native</span>
                  </div>
                  <div><b>English:</b> C2 Listening, C1 Reading, B2 Speaking, C2 Writing</div>
                </div>
              </Fieldset>
            </div>
          </div>
        )}

        {tab === 'Experience' && (
          <div>
            <div style={{ fontWeight: 'bold', color: '#000080', marginBottom: 8 }}>Work Experience</div>
            {workExperience.map((job, i) => (
              <Fieldset key={i} legend={job.company} style={{ marginBottom: 8 }}>
                <div style={{ padding: 8 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 13 }}>{job.title}</div>
                  <div style={{ color: '#808080', fontSize: 11, marginTop: 2 }}>{job.period} | {job.location}</div>
                </div>
              </Fieldset>
            ))}
          </div>
        )}

        {tab === 'Education' && (
          <div>
            <div style={{ fontWeight: 'bold', color: '#000080', marginBottom: 8 }}>Education & Training</div>
            {education.map((edu, i) => (
              <Fieldset key={i} legend={edu.period} style={{ marginBottom: 8 }}>
                <div style={{ padding: 8 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 12 }}>{edu.degree}</div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>{edu.institution}</div>
                  <div style={{ color: '#808080', fontSize: 11 }}>{edu.location}</div>
                </div>
              </Fieldset>
            ))}
          </div>
        )}

        {tab === 'Publications' && (
          <div>
            <div style={{ fontWeight: 'bold', color: '#000080', marginBottom: 8 }}>Publications</div>
            {publications.map((pub, i) => (
              <Fieldset key={i} legend={`Publication ${i + 1}`} style={{ marginBottom: 8 }}>
                <div style={{ padding: 8 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 12, color: '#000080' }}>{pub.title}</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>{pub.authors}</div>
                  <div style={{ fontSize: 11, fontStyle: 'italic', color: '#444' }}>{pub.venue}</div>
                  {pub.doi && (
                    <a href={pub.doi} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#0000FF', textDecoration: 'underline', fontSize: 11, display: 'block', marginTop: 4 }}>
                      {pub.doi}
                    </a>
                  )}
                </div>
              </Fieldset>
            ))}
          </div>
        )}

        {tab === 'Links' && (
          <div>
            <div style={{ fontWeight: 'bold', color: '#000080', marginBottom: 12 }}>Links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
                style={{ color: '#0000FF', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe variant="16x16_4" /> GitHub — github.com/InfinityAtom
              </a>
              <a href="https://github.com/InfinityAtom/PeP5" target="_blank" rel="noopener noreferrer"
                style={{ color: '#0000FF', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe variant="16x16_4" /> PeP5 Repository
              </a>
              <a href="https://pep-webapp-795388481242.us-central1.run.app" target="_blank" rel="noopener noreferrer"
                style={{ color: '#0000FF', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe variant="16x16_4" /> PeP5 Live Demo
              </a>
              <a href="https://doi.org/10.1007/978-3-031-83520-9_33" target="_blank" rel="noopener noreferrer"
                style={{ color: '#0000FF', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe variant="16x16_4" /> PeP5 Publication (Springer)
              </a>
            </div>
          </div>
        )}
      </Frame>
    </div>
  );
}
