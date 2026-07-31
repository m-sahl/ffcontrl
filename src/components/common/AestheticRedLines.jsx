import React, { useMemo } from "react";

const AestheticRedLines = () => {
  // Generate dynamic random aesthetic vector paths
  const randomPaths = useMemo(() => {
    const seedRandom = (i) => {
      let x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const paths = [];
    const count = 14;

    for (let i = 0; i < count; i++) {
      const type = Math.floor(seedRandom(i * 1.5) * 4); // 0: line, 1: quad curve, 2: cubic curve, 3: ring
      const opacity = (0.05 + seedRandom(i * 2.3) * 0.12).toFixed(2);
      const strokeWidth = (0.8 + seedRandom(i * 3.1) * 1.4).toFixed(1);
      const isDashed = seedRandom(i * 4.7) > 0.35;
      const dashArray = `${Math.floor(seedRandom(i * 5.2) * 10 + 3)},${Math.floor(seedRandom(i * 6.8) * 12 + 4)}`;

      let d = "";
      let cx = 0, cy = 0, r = 0;

      if (type === 0) {
        // Straight line across random coordinates
        const x1 = Math.floor(seedRandom(i * 7.1) * 130 - 15);
        const y1 = Math.floor(seedRandom(i * 8.2) * 110 - 5);
        const x2 = Math.floor(seedRandom(i * 9.3) * 130 - 15);
        const y2 = Math.floor(seedRandom(i * 10.4) * 110 - 5);
        d = `M ${x1}% ${y1}% L ${x2}% ${y2}%`;
      } else if (type === 1) {
        // Quadratic bezier curve
        const x1 = Math.floor(seedRandom(i * 7.1) * 130 - 15);
        const y1 = Math.floor(seedRandom(i * 8.2) * 110 - 5);
        const qx = Math.floor(seedRandom(i * 9.3) * 130 - 15);
        const qy = Math.floor(seedRandom(i * 10.4) * 110 - 5);
        const x2 = Math.floor(seedRandom(i * 11.5) * 130 - 15);
        const y2 = Math.floor(seedRandom(i * 12.6) * 110 - 5);
        d = `M ${x1}% ${y1}% Q ${qx}% ${qy}% ${x2}% ${y2}%`;
      } else if (type === 2) {
        // Cubic bezier organic wave
        const x1 = Math.floor(seedRandom(i * 7.1) * 130 - 15);
        const y1 = Math.floor(seedRandom(i * 8.2) * 110 - 5);
        const c1x = Math.floor(seedRandom(i * 9.3) * 130 - 15);
        const c1y = Math.floor(seedRandom(i * 10.4) * 110 - 5);
        const c2x = Math.floor(seedRandom(i * 11.5) * 130 - 15);
        const c2y = Math.floor(seedRandom(i * 12.6) * 110 - 5);
        const x2 = Math.floor(seedRandom(i * 13.7) * 130 - 15);
        const y2 = Math.floor(seedRandom(i * 14.8) * 110 - 5);
        d = `M ${x1}% ${y1}% C ${c1x}% ${c1y}%, ${c2x}% ${c2y}%, ${x2}% ${y2}%`;
      } else {
        // Aesthetic dashed ring accent
        cx = Math.floor(seedRandom(i * 7.1) * 110 - 5);
        cy = Math.floor(seedRandom(i * 8.2) * 110 - 5);
        r = Math.floor(seedRandom(i * 9.3) * 140 + 30);
      }

      paths.push({ id: i, type, d, cx, cy, r, opacity, strokeWidth, isDashed, dashArray });
    }
    return paths;
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden"
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          width: "100vw",
          height: "100vh"
        }}
      >
        {randomPaths.map(p => {
          if (p.type === 3) {
            return (
              <circle
                key={p.id}
                cx={`${p.cx}%`}
                cy={`${p.cy}%`}
                r={p.r}
                fill="none"
                stroke="#f14d4d"
                strokeWidth={p.strokeWidth}
                strokeDasharray={p.isDashed ? p.dashArray : "none"}
                opacity={p.opacity}
              />
            );
          }
          return (
            <path
              key={p.id}
              d={p.d}
              fill="none"
              stroke="#f14d4d"
              strokeWidth={p.strokeWidth}
              strokeDasharray={p.isDashed ? p.dashArray : "none"}
              opacity={p.opacity}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default AestheticRedLines;
