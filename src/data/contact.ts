import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

import profile from './profile.json';

export type ContactId = 'email' | 'github' | 'linkedin';

export interface ContactItem {
  id: ContactId;
  link: string;
  label: string;
  icon: IconDefinition;
}

/**
 * Email and LinkedIn are placeholders until a professional address and a
 * profile URL are confirmed. GitHub is the profile only — no project repo.
 */
const data: ContactItem[] = [
  {
    id: 'email',
    link: `mailto:${profile.email}`,
    label: 'Email (placeholder)',
    icon: faEnvelope,
  },
  {
    id: 'github',
    link: 'https://github.com/degenta69',
    label: 'GitHub',
    icon: faGithub,
  },
  {
    id: 'linkedin',
    link: 'https://example.com/linkedin-placeholder',
    label: 'LinkedIn (placeholder)',
    icon: faLinkedinIn,
  },
];

export default data;
