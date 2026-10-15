import { AUTHOR_NAME } from '@/lib/utils';

export interface Route {
  label: string;
  path: string;
  index?: boolean;
  primary?: boolean;
}

const routes: Route[] = [
  {
    index: true,
    label: AUTHOR_NAME,
    path: '/',
  },
  {
    label: 'Work',
    path: '/work',
  },
  {
    label: 'Résumé',
    path: '/resume',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
  {
    label: 'Projects',
    path: '/projects',
    primary: false,
  },
];

export default routes;
