import { useState } from 'react';
import { Frame, Button, Tabs, Tab } from '@react95/core';
import {
  wallpapers,
  win95Colors,
  getBackgroundStyle,
  type DesktopBackground,
} from '../../wallpapers';

interface DisplayAppProps {
  current: DesktopBackground;
  onApply: (bg: DesktopBackground) => void;
}

export function DisplayApp({ current, onApply }: DisplayAppProps) {
  const [selected, setSelected] = useState<DesktopBackground>(current);

  const previewStyle = getBackgroundStyle(selected);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      fontSize: '11px',
      padding: '8px',
    }}>
      <Tabs defaultActiveTab="Background">
        <Tab title="Background">
          <div style={{ padding: '8px' }}>
            {/* Preview monitor */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '180px',
                height: '140px',
                border: '3px solid #808080',
                borderRadius: '8px 8px 0 0',
                backgroundColor: '#C0C0C0',
                padding: '14px 14px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <Frame
                  boxShadow="$in"
                  style={{
                    width: '150px',
                    height: '100px',
                    ...previewStyle,
                  }}
                />
              </div>
            </div>

            {/* Selection area */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Wallpaper list */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Wallpaper:</div>
                <Frame boxShadow="$in" style={{
                  height: '120px',
                  overflow: 'auto',
                  backgroundColor: '#fff',
                  padding: '2px',
                }}>
                  {/* None option */}
                  <div
                    onClick={() => setSelected({ type: 'color', value: selected.type === 'color' ? selected.value : '#008080' })}
                    style={{
                      padding: '1px 4px',
                      cursor: 'pointer',
                      backgroundColor: selected.type === 'color' ? '#000080' : 'transparent',
                      color: selected.type === 'color' ? '#fff' : '#000',
                    }}
                  >
                    (None)
                  </div>
                  {wallpapers.map(wp => (
                    <div
                      key={wp.name}
                      onClick={() => setSelected({ type: 'wallpaper', value: wp.name })}
                      style={{
                        padding: '1px 4px',
                        cursor: 'pointer',
                        backgroundColor: selected.type === 'wallpaper' && selected.value === wp.name ? '#000080' : 'transparent',
                        color: selected.type === 'wallpaper' && selected.value === wp.name ? '#fff' : '#000',
                      }}
                    >
                      {wp.name}
                    </div>
                  ))}
                </Frame>
              </div>

              {/* Color picker */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Background Color:</div>
                <Frame boxShadow="$in" style={{
                  height: '120px',
                  overflow: 'auto',
                  backgroundColor: '#fff',
                  padding: '2px',
                }}>
                  {win95Colors.map(c => (
                    <div
                      key={c.name}
                      onClick={() => setSelected({ type: 'color', value: c.value })}
                      style={{
                        padding: '1px 4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: selected.type === 'color' && selected.value === c.value ? '#000080' : 'transparent',
                        color: selected.type === 'color' && selected.value === c.value ? '#fff' : '#000',
                      }}
                    >
                      <span style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        backgroundColor: c.value,
                        border: '1px solid #000',
                        flexShrink: 0,
                      }} />
                      {c.name}
                    </div>
                  ))}
                </Frame>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '6px',
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid #808080',
      }}>
        <Button onClick={() => onApply(selected)} style={{ width: '75px' }}>OK</Button>
        <Button onClick={() => onApply(selected)} style={{ width: '75px' }}>Apply</Button>
      </div>
    </div>
  );
}
