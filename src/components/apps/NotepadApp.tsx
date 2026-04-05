import { useState } from 'react';
import { Frame } from '@react95/core';
import { resumeText } from '../../data/portfolio';

export function NotepadApp() {
  const [text, setText] = useState(resumeText);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      fontSize: '12px',
    }}>
      {/* Menu bar simulation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '2px 4px',
        borderBottom: '1px solid #808080',
        fontSize: '12px',
        backgroundColor: '#c0c0c0',
      }}>
        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>File</span>
        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Edit</span>
        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Search</span>
        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Help</span>
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: '4px 6px',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '13px',
          lineHeight: '1.4',
          backgroundColor: '#fff',
          color: '#000',
          boxSizing: 'border-box',
        }}
        spellCheck={false}
      />

      {/* Status bar */}
      <Frame boxShadow="in" style={{
        padding: '2px 6px',
        fontSize: '11px',
        color: '#666',
        flexShrink: 0,
      }}>
        Ln 1, Col 1 | {text.split('\n').length} lines
      </Frame>
    </div>
  );
}
