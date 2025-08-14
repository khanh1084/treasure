import { Box, Stack, Typography } from "@mui/material";
import { RunDetail } from "../../store/store";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  run: RunDetail | null;
};

export function VisualizationPanel({ run }: Props) {
  const [t, setT] = useState(0); // progress 0..1 along polyline
  const reqRef = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;
    setT(0);
    const start = performance.now();
    const totalMs = 4000;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / totalMs);
      setT(p);
      if (p < 1) reqRef.current = requestAnimationFrame(tick);
    };
    reqRef.current = requestAnimationFrame(tick);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [run?.id]);

  const size = 600;
  const cellSize = useMemo(() => {
    if (!run) return 0;
    return Math.min(size / run.n, size / run.m);
  }, [run]);

  const points = run?.path?.map((p) => ({ x: p.x - 0.5, y: p.y - 0.5 })) || [];

  const polyPoints = points
    .map((p) => `${p.y * cellSize},${p.x * cellSize}`)
    .join(" ");

  const shipPos = useMemo(() => {
    if (points.length === 0) return null;
    // interpolate along segments by t
    const lens = [] as number[];
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const L = Math.hypot(dx, dy);
      lens.push(L);
      total += L;
    }
    let d = t * total;
    for (let i = 1; i < points.length; i++) {
      if (d <= lens[i - 1]) {
        const r = d / lens[i - 1];
        const ax = points[i - 1].x + (points[i].x - points[i - 1].x) * r;
        const ay = points[i - 1].y + (points[i].y - points[i - 1].y) * r;
        return { x: ay * cellSize, y: ax * cellSize };
      }
      d -= lens[i - 1];
    }
    const last = points[points.length - 1];
    return { x: last.y * cellSize, y: last.x * cellSize };
  }, [points, t, cellSize]);

  if (!run) {
    return <Typography>Chưa có dữ liệu</Typography>;
  }

  return (
    <Stack spacing={1} sx={{ height: "100%" }}>
      <Typography variant="h6">
        Bản đồ & Hành trình — Min fuel: {run.minFuel.toFixed(5)}
      </Typography>
      <Box sx={{ overflow: "auto" }}>
        <svg width={size} height={size} style={{ border: "1px solid #ddd" }}>
          {/* grid */}
          {Array.from({ length: run.n }).map((_, i) =>
            Array.from({ length: run.m }).map((_, j) => (
              <g key={`${i}-${j}`}>
                <rect
                  x={j * cellSize}
                  y={i * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill={(i + j) % 2 ? "#f8f8f8" : "#ffffff"}
                  stroke="#eee"
                />
                <text
                  x={j * cellSize + cellSize / 2}
                  y={i * cellSize + cellSize / 2}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize={Math.max(10, cellSize / 4)}
                  fill="#666"
                >
                  {run.matrix[i][j]}
                </text>
              </g>
            ))
          )}

          {/* path */}
          {points.length >= 2 && (
            <polyline
              points={polyPoints}
              fill="none"
              stroke="#1976d2"
              strokeWidth={3}
            />
          )}

          {/* start, treasure, ship */}
          {/* start at (1,1) */}
          <circle
            cx={0.5 * cellSize}
            cy={0.5 * cellSize}
            r={cellSize * 0.15}
            fill="#43a047"
          />
          {/* treasure at last path point */}
          {points.length > 0 && (
            <rect
              x={points[points.length - 1].y * cellSize - cellSize * 0.15}
              y={points[points.length - 1].x * cellSize - cellSize * 0.15}
              width={cellSize * 0.3}
              height={cellSize * 0.3}
              fill="#f9a825"
              stroke="#a57500"
            />
          )}
          {/* ship */}
          {shipPos && (
            <g transform={`translate(${shipPos.x}, ${shipPos.y})`}>
              <circle r={cellSize * 0.12} fill="#d32f2f" />
              <polygon
                points={`${-cellSize * 0.12},0 0,${-cellSize * 0.25} ${
                  cellSize * 0.12
                },0`}
                fill="#ff5252"
              />
            </g>
          )}
        </svg>
      </Box>
    </Stack>
  );
}
