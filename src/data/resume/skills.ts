export interface Skill {
  title: string;
  category: string[];
}

export interface Category {
  name: string;
}

const skills: Skill[] = [
  { title: 'TypeScript', category: ['Languages'] },
  { title: 'JavaScript', category: ['Languages'] },
  { title: 'React', category: ['Frontend'] },
  { title: 'Ionic', category: ['Frontend'] },
  { title: 'Node.js', category: ['Backend'] },
  { title: 'REST APIs', category: ['Backend'] },
  { title: 'Webhooks', category: ['Backend', 'Payments'] },
  { title: 'PostgreSQL', category: ['Data'] },
  { title: 'MongoDB', category: ['Data'] },
  { title: 'Redis', category: ['Data'] },
  { title: 'AWS Lambda', category: ['AWS'] },
  { title: 'SQS', category: ['AWS'] },
  { title: 'EventBridge', category: ['AWS'] },
  { title: 'MQTT', category: ['Messaging'] },
  { title: 'Payment integrations', category: ['Payments'] },
  { title: 'CI/CD', category: ['Delivery'] },
  { title: 'Docker', category: ['Delivery'] },
].map((skill) => ({ ...skill, category: [...skill.category].sort() }));

function buildCategories(skillsList: Skill[]): Category[] {
  const uniqueCategories = Array.from(
    new Set(skillsList.flatMap(({ category }) => category)),
  ).sort();

  return uniqueCategories.map((category) => ({ name: category }));
}

const categories: Category[] = buildCategories(skills);

export { categories, skills };
