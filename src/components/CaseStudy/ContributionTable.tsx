import type { ContributionRow } from '@/data/case-studies';

import OwnershipBadge from './OwnershipBadge';

export default function ContributionTable({
  rows,
}: {
  rows: ContributionRow[];
}) {
  return (
    <div className="contribution-table-wrap">
      <table className="contribution-table">
        <caption>My role, pending confirmation</caption>
        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th scope="col">My level</th>
            <th scope="col">AI-assisted?</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature}>
              <th scope="row">{row.feature}</th>
              <td>
                <OwnershipBadge level={row.level} ai={row.aiAssisted} />
              </td>
              <td>{row.aiAssisted ? 'Yes' : 'Not confirmed'}</td>
              <td>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
