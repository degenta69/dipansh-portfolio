export default function ArchitectureDiagram({
  nodes,
  caption,
}: {
  nodes: string[];
  caption: string;
}) {
  const width = Math.max(320, nodes.length * 180);
  return (
    <figure className="illustrative-diagram">
      <svg
        className="content-figure-svg"
        viewBox={`0 0 ${width} 120`}
        role="img"
        aria-labelledby="diagram-title diagram-desc"
      >
        <title id="diagram-title">Illustrative diagram</title>
        <desc id="diagram-desc">{caption}</desc>
        {nodes.map((node, index) => {
          const x = 16 + index * 180;
          return (
            <g key={node}>
              {index > 0 ? (
                <path
                  d={`M ${x - 28} 60 L ${x} 60`}
                  className="map-edge"
                  pathLength={1}
                />
              ) : null}
              <rect
                className="map-node-shape map-node-shape--linked"
                x={x}
                y={28}
                width={148}
                height={64}
                rx={8}
              />
              <text
                className="map-node-label"
                x={x + 74}
                y={66}
                textAnchor="middle"
              >
                {node}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="illustrative-list">
        {nodes.map((node) => (
          <li key={node}>{node}</li>
        ))}
      </ol>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
