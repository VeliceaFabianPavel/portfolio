import { useState } from 'react';
import { Frame, Button } from '@react95/core';
import { Globe, User } from '@react95/icons';
import { personalInfo } from '../../data/portfolio';

type Page = 'home' | 'github' | 'linkedin' | 'twitter';

const pages: Record<Page, { title: string; url: string }> = {
  home: { title: 'Home', url: `http://www.${personalInfo.website}` },
  github: { title: 'GitHub', url: personalInfo.socials.github },
  linkedin: { title: 'LinkedIn', url: personalInfo.socials.linkedin },
  twitter: { title: 'Twitter / X', url: personalInfo.socials.twitter },
};

export function BrowserApp() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [history, setHistory] = useState<Page[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (page: Page) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(page);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPage(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPage(history[historyIndex + 1]);
    }
  };

  const visitorCount = String(Math.floor(Math.random() * 9000) + 1337).padStart(6, '0');

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      fontSize: '12px',
    }}>
      {/* Toolbar */}
      <Frame style={{
        display: 'flex',
        gap: '2px',
        padding: '2px',
        borderBottom: '1px solid #808080',
      }}>
        <Button onClick={goBack} disabled={historyIndex <= 0} style={{ fontSize: '11px', padding: '2px 6px' }}>Back</Button>
        <Button onClick={goForward} disabled={historyIndex >= history.length - 1} style={{ fontSize: '11px', padding: '2px 6px' }}>Forward</Button>
        <Button onClick={() => navigate('home')} style={{ fontSize: '11px', padding: '2px 6px' }}>Home</Button>
      </Frame>

      {/* Address bar */}
      <Frame style={{
        display: 'flex',
        gap: '4px',
        padding: '2px 4px',
        alignItems: 'center',
        borderBottom: '1px solid #808080',
      }}>
        <span style={{ fontSize: '11px', flexShrink: 0 }}>Address:</span>
        <Frame boxShadow="$in" style={{ flex: 1, padding: '1px 4px', backgroundColor: '#fff' }}>
          {pages[currentPage].url}
        </Frame>
      </Frame>

      {/* Page content */}
      <Frame boxShadow="$in" style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: '16px',
        overflow: 'auto',
      }}>
        {currentPage === 'home' ? (
          <div style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#008080',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #000080',
              }}>
                <span style={{ fontSize: '36px', color: '#fff', fontWeight: 'bold', fontFamily: 'Arial' }}>
                  {personalInfo.name[0]}
                </span>
              </div>
              <h2 style={{ margin: 0, color: '#000080', fontSize: '20px' }}>{personalInfo.name}</h2>
              <p style={{ color: '#666', margin: '4px 0 0' }}>{personalInfo.title}</p>
            </div>

            <hr style={{ border: 'none', height: '2px', background: '#000080', margin: '16px 0' }} />

            <p style={{ lineHeight: '1.8', textAlign: 'center', marginBottom: '20px' }}>
              Welcome to my corner of the World Wide Web!<br />
              I build things for the internet.
            </p>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', color: '#000080', marginBottom: '10px' }}>My Links:</p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('github'); }}
                  style={{ color: '#0000FF', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe variant="16x16_4" /> GitHub Profile
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('linkedin'); }}
                  style={{ color: '#0000FF', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User variant="16x16_4" /> LinkedIn Profile
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('twitter'); }}
                  style={{ color: '#0000FF', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe variant="16x16_4" /> Twitter / X
                </a>
              </div>
            </div>

            {/* Hit counter */}
            <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#000',
                color: '#0f0',
                padding: '3px 10px',
                fontFamily: '"Courier New", monospace',
                fontSize: '13px',
                letterSpacing: '2px',
              }}>
                Visitors: {visitorCount}
              </div>
              <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                Best viewed in Internet Explorer 4.0 at 800x600
              </div>
            </div>
          </div>
        ) : (
          /* External link pages */
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Globe variant="32x32_4" />
            <h2 style={{ color: '#000080', margin: '12px 0 8px', fontSize: '16px' }}>
              {pages[currentPage].title}
            </h2>
            <p style={{ marginBottom: '16px', color: '#444' }}>
              This link points to an external website.
            </p>
            <a
              href={pages[currentPage].url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#0000FF',
                textDecoration: 'underline',
                fontSize: '13px',
              }}
            >
              {pages[currentPage].url}
            </a>
            <p style={{ marginTop: '12px', fontSize: '11px', color: '#808080' }}>
              Click the link above to open in a new window.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Button onClick={() => navigate('home')}>Back to Home</Button>
            </div>
          </div>
        )}
      </Frame>

      {/* Status bar */}
      <Frame boxShadow="$in" style={{ padding: '2px 6px', fontSize: '11px', color: '#666', flexShrink: 0 }}>
        Done
      </Frame>
    </div>
  );
}
