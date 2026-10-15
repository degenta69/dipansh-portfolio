import {
  MAP_VIEW,
  type MapNode,
  mapAreas,
  mapEdges,
  mapNodes,
  nodeById,
} from '@/data/systems-map';

import SystemsMapEnhancer from './SystemsMapEnhancer';

function accessibleName(node: MapNode): string {
  const state = node.stateLabel ? ` ${node.stateLabel}.` : '';
  return `${node.label}. ${node.description}${state}`;
}

function edgePath(edgeId: string): string | null {
  const edge = mapEdges.find((item) => item.id === edgeId);
  if (!edge) return null;
  const from = nodeById(edge.from);
  const to = nodeById(edge.to);
  if (!from || !to) return null;

  const fromCx = from.x + from.width / 2;
  const toCx = to.x + to.width / 2;
  const vertical =
    to.y >= from.y + from.height - 2 && Math.abs(fromCx - toCx) < from.width;

  if (vertical) {
    return `M ${fromCx} ${from.y + from.height} L ${toCx} ${to.y}`;
  }

  const fromCy = from.y + from.height / 2;
  const toCy = to.y + to.height / 2;
  return `M ${from.x + from.width} ${fromCy} L ${to.x} ${toCy}`;
}

function NodeShape({ node }: { node: MapNode }) {
  const labelY = node.y + (node.detail || node.stateLabel ? 22 : 28);
  const detailY = node.y + (node.stateLabel ? 40 : 42);
  const stateY = node.y + node.height - 12;

  return (
    <>
      <rect
        className={[
          'map-node-shape',
          node.state === 'pending' ? 'map-node-shape--pending' : '',
          node.state === 'context' ? 'map-node-shape--context' : '',
          node.state === 'linked' ? 'map-node-shape--linked' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx={8}
      />
      <text
        className="map-node-label"
        x={node.x + node.width / 2}
        y={labelY}
        textAnchor="middle"
      >
        {node.label}
      </text>
      {node.detail ? (
        <text
          className="map-node-detail"
          x={node.x + node.width / 2}
          y={detailY}
          textAnchor="middle"
        >
          {node.detail}
        </text>
      ) : null}
      {node.stateLabel ? (
        <text
          className="map-node-state"
          x={node.x + node.width / 2}
          y={stateY}
          textAnchor="middle"
        >
          {node.stateLabel}
        </text>
      ) : null}
    </>
  );
}

const highlightCss = mapNodes
  .map(
    (node) => `
.systems-map:is(:has([data-node="${node.id}"]:hover), :has([data-node="${node.id}"]:focus-visible)) [data-edge~="${node.id}"] {
  stroke: var(--color-accent);
  stroke-width: 2.5px;
}
.systems-map:is(:has([data-node="${node.id}"]:hover), :has([data-node="${node.id}"]:focus-visible)) [data-preview="${node.id}"] {
  display: grid;
}
.systems-map:is(:has([data-node="${node.id}"]:hover), :has([data-node="${node.id}"]:focus-visible)) .systems-map-card--idle {
  display: none;
}`,
  )
  .join('\n');

export default function SystemsMap() {
  return (
    <figure className="systems-map" aria-labelledby="systems-map-caption">
      <style>{highlightCss}</style>
      <figcaption id="systems-map-caption" className="systems-map-caption">
        <span className="systems-map-kicker">Systems map</span>
        <span>4 separate areas · select a node</span>
      </figcaption>

      <div className="systems-map-stage">
        <svg
          className="systems-map-svg content-figure-svg"
          viewBox={`0 0 ${MAP_VIEW.width} ${MAP_VIEW.height}`}
          role="group"
          aria-label="Systems map. Four separate areas with no lines between them."
        >
          <title>Systems map of four separate areas</title>
          {mapAreas.map((area) => (
            <g key={area.id}>
              <rect
                className="map-area"
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                rx={12}
              />
              <text className="map-area-label" x={area.x + 16} y={area.y + 26}>
                {area.index} · {area.title}
              </text>
            </g>
          ))}

          {mapEdges.map((edge, index) => {
            const path = edgePath(edge.id);
            if (!path) return null;
            return (
              <path
                key={edge.id}
                className="map-edge"
                d={path}
                pathLength={1}
                data-edge={`${edge.from} ${edge.to}`}
                data-area={edge.areaId}
                style={{ animationDelay: `${index * 40}ms` }}
              />
            );
          })}

          {mapNodes.map((node) =>
            node.href ? (
              <a
                key={node.id}
                className="map-node"
                href={node.href}
                data-node={node.id}
                aria-label={accessibleName(node)}
              >
                <NodeShape node={node} />
              </a>
            ) : (
              <g
                key={node.id}
                className="map-node map-node--context"
                data-node={node.id}
              >
                <title>{accessibleName(node)}</title>
                <NodeShape node={node} />
              </g>
            ),
          )}
        </svg>

        <div className="systems-map-preview" aria-live="polite">
          <p
            className="systems-map-card systems-map-card--idle"
            data-preview="idle"
          >
            Select a node. Linked nodes open a draft case study.
          </p>
          {mapNodes.map((node) => (
            <p
              key={node.id}
              className="systems-map-card"
              data-preview={node.id}
            >
              <span className="systems-map-card-kicker">
                {mapAreas.find((area) => area.id === node.areaId)?.title}
                {node.stateLabel ? ` · ${node.stateLabel}` : ''}
              </span>
              <strong>{node.label}</strong>
              <span>{node.description}</span>
            </p>
          ))}
        </div>
        <p id="systems-map-live" className="sr-only" aria-live="polite" />
        <SystemsMapEnhancer />
      </div>

      <ol className="systems-map-list">
        {mapAreas.map((area) => (
          <li key={area.id} className="systems-map-area-card">
            <p className="systems-map-area-heading">
              {area.index} · {area.title}
            </p>
            <ul>
              {mapNodes
                .filter((node) => node.areaId === area.id)
                .map((node) => (
                  <li key={node.id}>
                    {node.href ? (
                      <a href={node.href}>
                        {node.label}
                        {node.stateLabel ? ` (${node.stateLabel})` : ''}
                        <span className="systems-map-list-desc">
                          {node.description}
                        </span>
                      </a>
                    ) : (
                      <span>
                        {node.label}
                        <span className="systems-map-list-desc">
                          {node.description}
                        </span>
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="systems-map-legend">
        <span className="systems-map-legend-linked">Links to a case study</span>
        <span className="systems-map-legend-pending">
          in progress / awaiting confirmation
        </span>
        <span>context only</span>
      </p>
      <p className="systems-map-note">
        No lines between areas: they are separate systems. The payments sketch
        is illustrative, not a reconstruction.
      </p>
    </figure>
  );
}
