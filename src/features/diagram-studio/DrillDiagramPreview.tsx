import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DrillDiagram, DiagramElement, DiagramPath } from "@/types";
import { cn } from "@/lib/utils";

// ─── Field SVG Backgrounds ─────────────────────────────────────────────────────

function BaseballDiamond({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const cx = width / 2;
  const cy = height * 0.75;
  const base = Math.min(width, height) * 0.3;

  const home = { x: cx, y: cy };
  const first = { x: cx + base, y: cy - base };
  const second = { x: cx, y: cy - base * 2 };
  const third = { x: cx - base, y: cy - base };

  const pts = `${home.x},${home.y} ${first.x},${first.y} ${second.x},${second.y} ${third.x},${third.y}`;

  return (
    <g>
      {/* Grass background */}
      <rect width={width} height={height} fill="#2d5a27" rx="4" />
      {/* Infield dirt */}
      <polygon points={pts} fill="#8b6914" opacity="0.8" />
      {/* Base paths */}
      <polygon points={pts} fill="none" stroke="#a07820" strokeWidth="1.5" />
      {/* Bases */}
      {[home, first, second, third].map((b, i) => (
        <rect
          key={i}
          x={b.x - 5}
          y={b.y - 5}
          width={10}
          height={10}
          fill="#f5f0e8"
          rx="1"
        />
      ))}
      {/* Pitcher's mound */}
      <circle cx={cx} cy={cy - base} r={8} fill="#8b6914" />
    </g>
  );
}

function BattingBoxField({ width, height }: { width: number; height: number }) {
  return (
    <g>
      <rect width={width} height={height} fill="#2d5a27" rx="4" />
      {/* Batter's box */}
      <rect
        x={width * 0.35}
        y={height * 0.3}
        width={width * 0.3}
        height={height * 0.4}
        fill="none"
        stroke="#f5f0e8"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      {/* Home plate */}
      <polygon
        points={`${width * 0.5},${height * 0.75} ${width * 0.44},${height * 0.68} ${width * 0.44},${height * 0.6} ${width * 0.56},${height * 0.6} ${width * 0.56},${height * 0.68}`}
        fill="#f5f0e8"
      />
    </g>
  );
}

function InfieldOnlyField({ width, height }: { width: number; height: number }) {
  const cx = width / 2;
  const cy = height * 0.8;
  const base = Math.min(width, height) * 0.35;
  const home = { x: cx, y: cy };
  const first = { x: cx + base, y: cy - base };
  const second = { x: cx, y: cy - base * 2 };
  const third = { x: cx - base, y: cy - base };
  const pts = `${home.x},${home.y} ${first.x},${first.y} ${second.x},${second.y} ${third.x},${third.y}`;

  return (
    <g>
      <rect width={width} height={height} fill="#2d5a27" rx="4" />
      <polygon points={pts} fill="#8b6914" opacity="0.7" />
      <polygon points={pts} fill="none" stroke="#a07820" strokeWidth="1.5" />
      {[home, first, second, third].map((b, i) => (
        <rect key={i} x={b.x - 5} y={b.y - 5} width={10} height={10} fill="#f5f0e8" rx="1" />
      ))}
      <circle cx={cx} cy={cy - base} r={6} fill="#8b6914" />
    </g>
  );
}

function FieldBackground({
  type,
  width,
  height,
}: {
  type: DrillDiagram["fieldType"];
  width: number;
  height: number;
}) {
  if (type === "batting") return <BattingBoxField width={width} height={height} />;
  if (type === "infield") return <InfieldOnlyField width={width} height={height} />;
  return <BaseballDiamond width={width} height={height} />;
}

// ─── Element Renderers ─────────────────────────────────────────────────────────

function ElementMarker({
  el,
  scaleX,
  scaleY,
}: {
  el: DiagramElement;
  scaleX: number;
  scaleY: number;
}) {
  const x = (el.x / 100) * (1 / scaleX);
  const y = (el.y / 100) * (1 / scaleY);
  const px = x * scaleX * 100;
  const py = y * scaleY * 100;

  const cx = (el.x / 100);
  const cy = (el.y / 100);

  if (el.type === "player") {
    return (
      <g transform={`translate(${cx * 300}, ${cy * 250})`}>
        <circle r={10} fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="white"
          fontWeight="bold"
        >
          {el.label?.[0] ?? "P"}
        </text>
        {el.label && (
          <text
            y={16}
            textAnchor="middle"
            fontSize="7"
            fill="white"
            fontWeight="500"
          >
            {el.label}
          </text>
        )}
      </g>
    );
  }

  if (el.type === "coach") {
    return (
      <g transform={`translate(${cx * 300}, ${cy * 250})`}>
        <circle r={10} fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="white"
          fontWeight="bold"
        >
          C
        </text>
        {el.label && (
          <text y={16} textAnchor="middle" fontSize="7" fill="white">
            {el.label}
          </text>
        )}
      </g>
    );
  }

  if (el.type === "cone") {
    return (
      <g transform={`translate(${cx * 300}, ${cy * 250})`}>
        <polygon
          points="-6,4 6,4 0,-8"
          fill="#f97316"
          stroke="#fff"
          strokeWidth="1"
        />
        {el.label && (
          <text y={14} textAnchor="middle" fontSize="7" fill="white">
            {el.label}
          </text>
        )}
      </g>
    );
  }

  return null;
  void px; void py;
}

function PathLine({
  path,
  isAnimating,
}: {
  path: DiagramPath;
  isAnimating: boolean;
}) {
  if (path.points.length < 2) return null;

  const d = path.points
    .map((p, i) => {
      const x = (p.x / 100) * 300;
      const y = (p.y / 100) * 250;
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");

  return (
    <path
      d={d}
      stroke={path.color ?? "#22c55e"}
      strokeWidth="2.5"
      fill="none"
      strokeDasharray={path.dashed ? "6 3" : undefined}
      markerEnd="url(#arrowhead)"
      opacity={0.9}
    >
      {isAnimating && path.animated && (
        <animate
          attributeName="stroke-dashoffset"
          from="100"
          to="0"
          dur="1.5s"
          repeatCount="indefinite"
        />
      )}
    </path>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface DrillDiagramPreviewProps {
  diagram: DrillDiagram;
  className?: string;
}

export function DrillDiagramPreview({
  diagram,
  className,
}: DrillDiagramPreviewProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentFrame = diagram.frames[frameIndex] ?? diagram.frames[0];

  useEffect(() => {
    if (isPlaying && diagram.frames.length > 1) {
      intervalRef.current = setInterval(() => {
        setFrameIndex((i) => {
          const next = (i + 1) % diagram.frames.length;
          if (next === 0) setIsPlaying(false);
          return next;
        });
      }, currentFrame.duration ?? 1500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, frameIndex, currentFrame.duration, diagram.frames.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setFrameIndex(0);
  };

  const viewBox = `0 0 300 250`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative rounded-lg overflow-hidden bg-field-grass">
        <svg
          viewBox={viewBox}
          className="w-full"
          style={{ maxHeight: "260px" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="6"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
            </marker>
          </defs>
          <FieldBackground
            type={diagram.fieldType}
            width={300}
            height={250}
          />
          {currentFrame.paths.map((path) => (
            <PathLine key={path.id} path={path} isAnimating={isPlaying} />
          ))}
          {currentFrame.elements.map((el) => (
            <ElementMarker key={el.id} el={el} scaleX={1} scaleY={1} />
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-muted-foreground">{currentFrame.label}</span>
        <div className="flex gap-1">
          {diagram.frames.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          {diagram.frames.length > 1 && (
            <span className="text-xs text-muted-foreground self-center">
              {frameIndex + 1}/{diagram.frames.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
