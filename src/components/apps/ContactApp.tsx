import { useState } from 'react';
import { Frame, Input, TextArea, Button, Fieldset } from '@react95/core';
import { personalInfo } from '../../data/portfolio';

export function ContactApp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (name && email && message) {
      // Build mailto link
      const mailtoSubject = encodeURIComponent(subject || `Message from ${name}`);
      const mailtoBody = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
      window.open(`mailto:${personalInfo.email}?subject=${mailtoSubject}&body=${mailtoBody}`);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <div style={{
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      fontSize: '12px',
      padding: '4px',
    }}>
      {/* Toolbar */}
      <Frame boxShadow="in" style={{ padding: '3px 6px', marginBottom: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ color: '#000' }}>To: {personalInfo.email}</span>
      </Frame>

      <Fieldset legend="New Message" style={{ padding: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ width: '60px', textAlign: 'right' }}>From:</label>
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Your Name"
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ width: '60px', textAlign: 'right' }}>Email:</label>
            <Input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ width: '60px', textAlign: 'right' }}>Subject:</label>
            <Input
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
              placeholder="Hello!"
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <label style={{ width: '60px', textAlign: 'right', marginTop: '4px' }}>Body:</label>
            <TextArea
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              style={{ flex: 1, minHeight: '120px', resize: 'vertical' }}
            />
          </div>
        </div>
      </Fieldset>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
        {sent && (
          <span style={{ color: '#008000', alignSelf: 'center', fontSize: '11px' }}>
            Mail client opened!
          </span>
        )}
        <Button onClick={handleSend} disabled={!name || !email || !message}>
          Send
        </Button>
      </div>
    </div>
  );
}
