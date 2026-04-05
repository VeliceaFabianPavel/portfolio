import { TaskBar as R95TaskBar, List } from '@react95/core';
import {
  Computer,
  WindowsExplorer,
  HelpBook,
  Settings,
  Notepad,
  Mail,
  Mshtml32528,
  Winmine1,
  Computer3,
  Calculator,
} from '@react95/icons';

interface TaskBarProps {
  onOpenApp: (id: string) => void;
  onShutDown: () => void;
}

const sidebarStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 20,
  background: '#808080',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingBottom: 2,
};

const sidebarTextStyle: React.CSSProperties = {
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  color: 'white',
  fontSize: 18,
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontWeight: 'bold',
  letterSpacing: 0,
  whiteSpace: 'nowrap',
  textRendering: 'geometricPrecision',
};

const menuWrapperStyle: React.CSSProperties = {
  position: 'relative',
  paddingLeft: 20,
  marginLeft: -4,
};

export function TaskBar({ onOpenApp, onShutDown }: TaskBarProps) {
  return (
    <R95TaskBar
      list={
        <div style={menuWrapperStyle}>
          <div style={sidebarStyle}>
            <span style={sidebarTextStyle}>Windows 95</span>
          </div>
          <List>
            <List.Item
              icon={<Computer variant="32x32_4" />}
              onClick={() => onOpenApp('about')}
            >
              About Me
            </List.Item>
            <List.Item
              icon={<WindowsExplorer variant="32x32_4" />}
              onClick={() => onOpenApp('projects')}
            >
              My Projects
            </List.Item>
            <List.Item
              icon={<Settings variant="32x32_4" />}
              onClick={() => onOpenApp('skills')}
            >
              Skills.exe
            </List.Item>
            <List.Item
              icon={<Mail variant="32x32_4" />}
              onClick={() => onOpenApp('contact')}
            >
              Contact Me
            </List.Item>
            <List.Divider />
            <List.Item
              icon={<Notepad variant="32x32_4" />}
              onClick={() => onOpenApp('notepad')}
            >
              Resume.txt
            </List.Item>
            <List.Item
              icon={<Mshtml32528 variant="32x32_4" />}
              onClick={() => onOpenApp('browser')}
            >
              Internet Explorer
            </List.Item>
            <List.Item
              icon={<Winmine1 variant="32x32_4" />}
              onClick={() => onOpenApp('minesweeper')}
            >
              Minesweeper
            </List.Item>
            <List.Item
              icon={<Calculator variant="32x32_4" />}
              onClick={() => onOpenApp('calculator')}
            >
              Calculator
            </List.Item>
            <List.Divider />
            <List.Item
              icon={<HelpBook variant="32x32_4" />}
              onClick={() => onOpenApp('help')}
            >
              Help
            </List.Item>
            <List.Divider />
            <List.Item
              icon={<Computer3 variant="32x32_4" />}
              onClick={() => onShutDown()}
            >
              Shut Down...
            </List.Item>
          </List>
        </div>
      }
    />
  );
}
