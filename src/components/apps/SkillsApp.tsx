import { useState } from 'react';
import { Frame, ProgressBar, Fieldset } from '@react95/core';
import { skills } from '../../data/portfolio';

export function SkillsApp() {
  const [activeTab, setActiveTab] = useState(skills[0].category);

  const activeCategory = skills.find(s => s.category === activeTab)!;

  return (
    <div style={{ fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: 12, padding: 8 }}>
      <div style={{ display: 'flex', gap: 0, marginBottom: -1, zIndex: 1 }}>
        {skills.map(cat => (
          <div
            key={cat.category}
            onClick={() => setActiveTab(cat.category)}
            style={{
              padding: '3px 10px',
              fontSize: 11,
              cursor: 'pointer',
              backgroundColor: activeTab === cat.category ? '#c0c0c0' : '#a0a0a0',
              border: '1px solid #808080',
              borderBottom: activeTab === cat.category ? '1px solid #c0c0c0' : '1px solid #808080',
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              fontWeight: activeTab === cat.category ? 'bold' : 'normal',
            }}
          >
            {cat.category}
          </div>
        ))}
      </div>

      <Frame boxShadow="in" style={{ padding: 12, backgroundColor: '#c0c0c0' }}>
        <Fieldset legend={`${activeCategory.category} Skills`} style={{ padding: 12 }}>
          {activeCategory.items.map(skill => (
            <div key={skill.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 'bold' }}>{skill.name}</span>
                <span style={{ color: '#666' }}>{skill.level}%</span>
              </div>
              <ProgressBar percent={skill.level} />
            </div>
          ))}
        </Fieldset>

        <div style={{
          marginTop: 12,
          padding: 8,
          backgroundColor: '#ffffcc',
          border: '1px solid #cccc00',
          fontSize: 11,
          lineHeight: 1.5,
        }}>
          <b>Tip:</b> These skill levels are self-assessed and represent
          proficiency relative to production-level usage. Always learning more!
        </div>
      </Frame>
    </div>
  );
}
