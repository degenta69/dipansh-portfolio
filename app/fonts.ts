import localFont from 'next/font/local';

/**
 * Fontsource supplies versioned files through npm; next/font/local adds
 * preload tags and metric-adjusted fallbacks without contacting Google during
 * the build. Latin variable files only, so a family does not preload every
 * script Fontsource ships. Licences: public/licenses/fonts/.
 */
export const plex = localFont({
  src: '../node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2',
  variable: '--font-plex',
  weight: '100 700',
  style: 'normal',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial'],
  adjustFontFallback: 'Arial',
});

export const sourceSerif = localFont({
  src: '../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2',
  variable: '--font-source-serif',
  weight: '200 900',
  style: 'normal',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman'],
  adjustFontFallback: 'Times New Roman',
});

export const jetbrainsMono = localFont({
  src: '../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  variable: '--font-jetbrains',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
  fallback: ['SFMono-Regular', 'Consolas'],
  adjustFontFallback: 'Arial',
});
