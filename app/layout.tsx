import type { Metadata } from 'next';

import { SiteSchema } from '@/components/Schema';
import Navigation from '@/components/Template/Navigation';
import { MAIN_CONTENT_ID } from '@/components/Template/PageWrapper';
import ScrollToTop from '@/components/Template/ScrollToTop';
import { sharedOpenGraph, sharedTwitter } from '@/lib/metadata';
import {
  THEME_COLOR_TOKEN,
  type ThemeColors,
  themeInitScript,
} from '@/lib/theme';
import { readColorToken } from '@/lib/tokens';
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils';
import { robotsPolicy } from '@/lib/visibility';
import { jetbrainsMono, plex, sourceSerif } from './fonts';
import './tailwind.css';

/**
 * The colour immediately under the browser's own chrome, per theme, read from
 * the stylesheets at build time rather than typed here so it cannot drift from
 * the tokens. `--color-bg-alt` is the page background the sticky header tints.
 */
const CHROME_COLORS: ThemeColors = {
  light: readColorToken(THEME_COLOR_TOKEN, 'light'),
  dark: readColorToken(THEME_COLOR_TOKEN, 'dark'),
};

/**
 * Without JavaScript the page is light, so the browser chrome is the light
 * paper colour only. A second noscript rule shows the primary links on a
 * narrow screen, where the stylesheet otherwise hides them in favour of the
 * client menu.
 */
const NO_SCRIPT_FALLBACK = `<meta name="theme-color" content="${CHROME_COLORS.light}"><style>@media (max-width: 735px){.nav-links{display:flex !important;flex-wrap:wrap;gap:0.75rem 1.25rem;}}</style>`;

export const metadata: Metadata = {
  title: {
    default: AUTHOR_NAME,
    template: `%s | ${AUTHOR_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    AUTHOR_NAME,
    'TypeScript',
    'Node.js',
    'React',
    'AWS',
    'payments',
    'full-stack',
  ],
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    ...sharedOpenGraph,
    type: 'website',
    url: `${SITE_URL}/`,
    title: AUTHOR_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    ...sharedTwitter,
    title: AUTHOR_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: robotsPolicy(),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plex.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_FALLBACK }} />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript(CHROME_COLORS) }}
        />
        <SiteSchema />
      </head>
      <body>
        <a href={`#${MAIN_CONTENT_ID}`} className="skip-link">
          Skip to content
        </a>
        <ScrollToTop />
        <div className="site-wrapper">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
