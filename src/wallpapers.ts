// Win95-style wallpaper definitions
// Uses actual PNG images from assets/wallpapers

import imgBlocks from './assets/wallpapers/Blocks.png';
import imgBubbles from './assets/wallpapers/Bubbles.png';
import imgClouds from './assets/wallpapers/Clouds.png';
import imgForest from './assets/wallpapers/Forest.png';
import imgGoldWeave from './assets/wallpapers/GoldWeave.png';
import imgStrawMat from './assets/wallpapers/StrawMat.png';
import imgTiles from './assets/wallpapers/Tiles.png';

export interface WallpaperOption {
  name: string;
  type: 'tile' | 'stretch';
  src: string;
}

export const wallpapers: WallpaperOption[] = [
  { name: 'Blocks', type: 'tile', src: imgBlocks },
  { name: 'Bubbles', type: 'tile', src: imgBubbles },
  { name: 'Clouds', type: 'stretch', src: imgClouds },
  { name: 'Forest', type: 'tile', src: imgForest },
  { name: 'Gold Weave', type: 'tile', src: imgGoldWeave },
  { name: 'Straw Mat', type: 'tile', src: imgStrawMat },
  { name: 'Tiles', type: 'tile', src: imgTiles },
];

// Win95 default 16 colors
export const win95Colors = [
  { name: 'Teal (Default)', value: '#008080' },
  { name: 'Black', value: '#000000' },
  { name: 'Dark Red', value: '#800000' },
  { name: 'Dark Green', value: '#008000' },
  { name: 'Olive', value: '#808000' },
  { name: 'Navy', value: '#000080' },
  { name: 'Purple', value: '#800080' },
  { name: 'Dark Cyan', value: '#008080' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Gray', value: '#808080' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Magenta', value: '#FF00FF' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'White', value: '#FFFFFF' },
];

export interface DesktopBackground {
  type: 'color' | 'wallpaper';
  value: string; // color hex or wallpaper name
}

const STORAGE_KEY = 'win95-desktop-bg';

export function loadBackground(): DesktopBackground {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { type: 'color', value: '#008080' };
}

export function saveBackground(bg: DesktopBackground): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bg));
}

export function getBackgroundStyle(bg: DesktopBackground): React.CSSProperties {
  if (bg.type === 'color') {
    return { backgroundColor: bg.value };
  }
  const wp = wallpapers.find(w => w.name === bg.value);
  if (!wp) return { backgroundColor: '#008080' };
  if (wp.type === 'stretch') {
    return {
      backgroundImage: `url("${wp.src}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }
  return {
    backgroundImage: `url("${wp.src}")`,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
  };
}
