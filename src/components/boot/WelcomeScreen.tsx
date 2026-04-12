import { useState } from 'react';
import { Modal, TitleBar, Button, Input, Alert } from '@react95/core';
import { Msrating105 } from '@react95/icons';
import { loadBackground, getBackgroundStyle } from '../../wallpapers';
import startupSound from '../../assets/the-microsoft-sound.wav';
import { playChord } from '../../sounds';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const handleOk = () => {
    if (password === 'portfolio') {
      const audio = new Audio(startupSound);
      audio.play().catch(() => {});
      onComplete();
    } else {
      playChord();
      setShowError(true);
      setPassword('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleOk();
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      ...getBackgroundStyle(loadBackground()),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: 480 }}>
        <Modal
          title="Welcome to Windows"
          style={{ width: 480, position: 'relative' }}
          titleBarOptions={[
            <TitleBar.Close key="close" onClick={() => {}} />,
          ]}
        >
          <div style={{
            padding: '12px 16px 16px',
            fontFamily: '"MS Sans Serif", Arial, sans-serif',
            fontSize: 12,
          }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 4 }}>
              <div style={{ flexShrink: 0, paddingTop: 4, transform: 'scale(1.5)', transformOrigin: 'top left', marginRight: 16 }}>
                <Msrating105 variant="32x32_4" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 8 }}>
                  Type a user name and password to log on to Windows.
                </div>
                <div style={{ fontSize: 12, color: '#000', marginBottom: 12 }}>
                  The password is <b>portfolio</b>!
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <label style={{ width: 80, textAlign: 'right' }}>User name:</label>
                  <Input
                    value="fabian"
                    readOnly
                    style={{ flex: 1 }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ width: 80, textAlign: 'right' }}>Password:</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ flex: 1 }}
                    autoFocus
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                <Button onClick={handleOk} style={{ width: 76 }}>OK</Button>
                <Button onClick={() => {}} style={{ width: 76 }}>Cancel</Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      {showError && (
        <Alert
          title="Logon Message"
          type="error"
          message="Incorrect password."
          buttons={[{ value: 'OK', onClick: () => setShowError(false) }]}
          closeAlert={() => setShowError(false)}
          dragOptions={{
            defaultPosition: {
              x: Math.floor(window.innerWidth / 2) - 150,
              y: Math.floor(window.innerHeight / 2) - 60,
            },
          }}
          style={{ zIndex: 9999 }}
        />
      )}
    </div>
  );
}
