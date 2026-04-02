import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Customized,
} from 'recharts';

// ──── Types ────

interface OHLCDay {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  base: number;
  body: number;
  isUp: boolean;
}

type TimeframeKey = '1M' | '3M' | '6M' | '1Y' | 'ALL';

const TIMEFRAMES: { key: TimeframeKey; label: string; days: number }[] = [
  { key: '1M', label: '1 Oy', days: 30 },
  { key: '3M', label: '3 Oy', days: 90 },
  { key: '6M', label: '6 Oy', days: 180 },
  { key: '1Y', label: '1 Yil', days: 365 },
  { key: 'ALL', label: 'Barchasi', days: 9999 },
];

const MIN_VISIBLE = 20;
const MAX_VISIBLE = 500;
const MOMENTUM_FRICTION = 0.92;
const MOMENTUM_MIN = 0.3;

// ──── Helpers ────

const formatSum = (v: number) => {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + ' mlrd';
  if (abs >= 1_000_000) return (v / 1_000_000).toFixed(1) + ' mln';
  if (abs >= 1_000) return (v / 1_000).toFixed(0) + ' ming';
  return v.toFixed(0);
};

const formatSumFull = (v: number) =>
  new Intl.NumberFormat('uz-UZ').format(Math.round(v)) + " so'm";

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

// ──── Data generation ────

function generateHistoricalData(days: number = 1825): OHLCDay[] {
  const data: OHLCDay[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let basePrice = 245_000_000;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = basePrice * 0.03;
    const trend = Math.sin(i / 60) * basePrice * 0.005;
    const open = basePrice + trend + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.48) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const o = Math.round(open);
    const c = Math.round(close);
    const h = Math.round(high);
    const l = Math.round(low);
    const isUp = c >= o;

    data.push({
      date: `${year}-${month}-${day}`,
      open: o,
      high: h,
      low: l,
      close: c,
      base: Math.min(o, c),
      body: Math.abs(c - o) || 1,
      isUp,
    });
    basePrice = close;
  }
  return data;
}

// ──── Wick renderer ────

function WickLayer(props: any) {
  const { formattedGraphicalItems, yAxisMap } = props;
  if (!yAxisMap || !formattedGraphicalItems) return null;

  const yAxis = Object.values(yAxisMap)[0] as any;
  if (!yAxis?.scale) return null;
  const yScale = yAxis.scale;

  const bodyBar = formattedGraphicalItems[1];
  if (!bodyBar?.props?.data) return null;
  const items = bodyBar.props.data;

  return (
    <g>
      {items.map((item: any, i: number) => {
        const d: OHLCDay = item.payload;
        if (!d) return null;
        const cx = item.x + item.width / 2;
        const color = d.isUp ? '#26a69a' : '#ef5350';
        return (
          <line
            key={i}
            x1={cx}
            y1={yScale(d.high)}
            x2={cx}
            y2={yScale(d.low)}
            stroke={color}
            strokeWidth={1}
          />
        );
      })}
    </g>
  );
}

// ──── Custom tooltip (memoized) ────

const CustomTooltip = memo(function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]?.payload) return null;
  const d: OHLCDay = payload[0].payload;
  const color = d.isUp ? '#26a69a' : '#ef5350';

  return (
    <div className="rounded-lg border bg-card p-3 shadow-md text-sm space-y-1">
      <p className="font-medium text-muted-foreground">{formatDateShort(d.date)}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-xs">
        <span className="text-muted-foreground">Ochilish:</span>
        <span style={{ color }}>{formatSum(d.open)}</span>
        <span className="text-muted-foreground">Yuqori:</span>
        <span style={{ color }}>{formatSum(d.high)}</span>
        <span className="text-muted-foreground">Past:</span>
        <span style={{ color }}>{formatSum(d.low)}</span>
        <span className="text-muted-foreground">Yopilish:</span>
        <span className="font-semibold" style={{ color }}>{formatSum(d.close)}</span>
      </div>
    </div>
  );
});

// ──── Main component ────

export default function CandlestickChart() {
  // Store full data in ref, only bump a counter to trigger re-render
  const allDataRef = useRef(generateHistoricalData());
  const [tick, setTick] = useState(0);
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeKey>('1Y');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Simulated live WebSocket tick — mutate ref in place, bump counter
  useEffect(() => {
    const id = setInterval(() => {
      const data = allDataRef.current;
      const last = data[data.length - 1];
      const volatility = last.close * 0.004;
      const newClose = Math.round(last.close + (Math.random() - 0.48) * volatility);

      last.close = newClose;
      last.high = Math.max(last.high, newClose);
      last.low = Math.min(last.low, newClose);
      last.isUp = newClose >= last.open;
      last.base = Math.min(last.open, newClose);
      last.body = Math.abs(newClose - last.open) || 1;

      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Y-axis zoom state
  const [yZoomFactor, setYZoomFactor] = useState(1);
  const yAxisDragRef = useRef<{ startY: number; startZoom: number } | null>(null);

  // Pan/zoom state
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Smooth scrolling refs
  const floatEndRef = useRef<number | null>(null);
  const momentumRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const dragRef = useRef<{
    startX: number;
    startEnd: number;
    lastX: number;
    lastTime: number;
    velocity: number;
  } | null>(null);

  const sourceData = allDataRef.current;

  // Resolve CSS variable to a real color for SVG
  const gridColor = useRef('#e5e5e5');
  useEffect(() => {
    const root = document.documentElement;
    const raw = getComputedStyle(root).getPropertyValue('--border').trim();
    if (raw) {
      gridColor.current = `hsl(${raw})`;
    }
  }, []);

  // When timeframe changes, reset zoom/pan
  const handleTimeframe = useCallback((key: TimeframeKey) => {
    setActiveTimeframe(key);
    setVisibleCount(null);
    setEndIndex(null);
    setYZoomFactor(1);
    floatEndRef.current = null;
    momentumRef.current = 0;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
  }, []);

  // Compute the visible window
  const { chartData, windowStart, windowEnd } = useMemo(() => {
    // tick is used to trigger recomputation on live updates
    void tick;
    let count: number;
    if (visibleCount != null) {
      count = visibleCount;
    } else {
      const tf = TIMEFRAMES.find((t) => t.key === activeTimeframe);
      count = (!tf || tf.key === 'ALL') ? sourceData.length : Math.min(tf.days, sourceData.length);
    }
    count = Math.max(MIN_VISIBLE, Math.min(MAX_VISIBLE, count, sourceData.length));

    const end = endIndex != null ? Math.min(endIndex, sourceData.length) : sourceData.length;
    const start = Math.max(0, end - count);
    const actualEnd = start + count;

    return {
      chartData: sourceData.slice(start, actualEnd),
      windowStart: start,
      windowEnd: actualEnd,
    };
  }, [sourceData, activeTimeframe, visibleCount, endIndex, tick]);

  const lastCandle = chartData[chartData.length - 1];
  const prevCandle = chartData.length > 1 ? chartData[chartData.length - 2] : null;
  const change = prevCandle ? lastCandle.close - prevCandle.close : 0;
  const changePct = prevCandle ? (change / prevCandle.close) * 100 : 0;
  const isPositive = change >= 0;

  const [yMin, yMax] = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const d of chartData) {
      if (d.low < min) min = d.low;
      if (d.high > max) max = d.high;
    }
    const range = max - min;
    const mid = (max + min) / 2;
    const halfRange = (range * yZoomFactor) / 2;
    const pad = halfRange * 0.05;
    return [mid - halfRange - pad, mid + halfRange + pad];
  }, [chartData, yZoomFactor]);

  // Commit float position to state (clamped to integer)
  const commitEnd = useCallback((floatEnd: number) => {
    const currentCount = windowEnd - windowStart;
    const clamped = Math.max(currentCount, Math.min(sourceData.length, Math.round(floatEnd)));
    setEndIndex(clamped);
  }, [windowEnd, windowStart, sourceData.length]);

  // Momentum animation loop
  const runMomentum = useCallback(() => {
    const tick = () => {
      const v = momentumRef.current;
      if (Math.abs(v) < MOMENTUM_MIN) {
        momentumRef.current = 0;
        rafIdRef.current = null;
        return;
      }

      const currentFloat = floatEndRef.current ?? sourceData.length;
      const currentCount = windowEnd - windowStart;
      const nextFloat = Math.max(currentCount, Math.min(sourceData.length, currentFloat + v));
      floatEndRef.current = nextFloat;
      momentumRef.current = v * MOMENTUM_FRICTION;

      commitEnd(nextFloat);
      rafIdRef.current = requestAnimationFrame(tick);
    };
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(tick);
  }, [sourceData.length, windowEnd, windowStart, commitEnd]);

  // Mouse wheel: vertical = zoom, horizontal (shift or trackpad) = smooth scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();

    momentumRef.current = 0;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const currentCount = windowEnd - windowStart;
    const hasHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);

    if (hasHorizontal || e.shiftKey) {
      const delta = e.shiftKey ? e.deltaY : e.deltaX;
      const barsToScroll = delta * 0.05;
      const currentFloat = floatEndRef.current ?? (endIndex ?? sourceData.length);
      const nextFloat = Math.max(currentCount, Math.min(sourceData.length, currentFloat + barsToScroll));
      floatEndRef.current = nextFloat;

      if (endIndex == null) setEndIndex(sourceData.length);
      commitEnd(nextFloat);
    } else {
      const zoomStep = Math.max(2, Math.round(currentCount * 0.1));
      let newCount: number;
      if (e.deltaY > 0) {
        newCount = Math.min(MAX_VISIBLE, currentCount + zoomStep, sourceData.length);
      } else {
        newCount = Math.max(MIN_VISIBLE, currentCount - zoomStep);
      }
      setVisibleCount(newCount);
      if (endIndex == null) setEndIndex(sourceData.length);
    }
  }, [windowStart, windowEnd, sourceData.length, endIndex, commitEnd]);

  // Drag to pan with velocity tracking — throttled via rAF
  const dragRafRef = useRef<number | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    momentumRef.current = 0;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const currentEnd = floatEndRef.current ?? endIndex ?? sourceData.length;
    dragRef.current = {
      startX: e.clientX,
      startEnd: currentEnd,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };
  }, [endIndex, sourceData.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current || !chartContainerRef.current) return;

    // Throttle to one update per animation frame
    if (dragRafRef.current) return;
    const clientX = e.clientX;

    dragRafRef.current = requestAnimationFrame(() => {
      dragRafRef.current = null;
      if (!dragRef.current || !chartContainerRef.current) return;

      const now = performance.now();
      const dx = clientX - dragRef.current.startX;
      const containerWidth = chartContainerRef.current.clientWidth;
      const currentCount = windowEnd - windowStart;
      const barsPerPixel = currentCount / containerWidth;
      const newFloat = dragRef.current.startEnd - dx * barsPerPixel;

      const dt = now - dragRef.current.lastTime;
      if (dt > 0) {
        const instantVelocity = (dragRef.current.lastX - clientX) * barsPerPixel / dt;
        dragRef.current.velocity = dragRef.current.velocity * 0.7 + instantVelocity * 0.3;
      }
      dragRef.current.lastX = clientX;
      dragRef.current.lastTime = now;

      floatEndRef.current = newFloat;
      commitEnd(newFloat);
    });
  }, [windowStart, windowEnd, commitEnd]);

  const handleMouseUp = useCallback(() => {
    if (!dragRef.current) return;
    const v = dragRef.current.velocity * 16;
    dragRef.current = null;

    if (Math.abs(v) > MOMENTUM_MIN) {
      momentumRef.current = v;
      runMomentum();
    }
  }, [runMomentum]);

  // Y-axis drag to zoom
  const handleYAxisMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    yAxisDragRef.current = { startY: e.clientY, startZoom: yZoomFactor };

    const handleMove = (ev: MouseEvent) => {
      if (!yAxisDragRef.current) return;
      const dy = ev.clientY - yAxisDragRef.current.startY;
      const sensitivity = 0.005;
      const newZoom = Math.max(0.1, Math.min(5, yAxisDragRef.current.startZoom + dy * sensitivity));
      setYZoomFactor(newZoom);
    };

    const handleUp = () => {
      yAxisDragRef.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [yZoomFactor]);

  const handleYAxisDoubleClick = useCallback(() => {
    setYZoomFactor(1);
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-base">Balans</h3>
          <span className="font-mono text-sm font-bold">
            {formatSumFull(lastCandle?.close ?? 0)}
          </span>
          <span
            className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
              isPositive
                ? 'text-green-600 bg-green-500/10'
                : 'text-red-500 bg-red-500/10'
            }`}
          >
            {isPositive ? '+' : ''}
            {formatSum(change)} ({isPositive ? '+' : ''}
            {changePct.toFixed(2)}%)
          </span>
        </div>

        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.key}
              onClick={() => handleTimeframe(tf.key)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTimeframe === tf.key && visibleCount == null
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* OHLC info bar */}
      {(() => {
        const ohlc = hoveredIndex != null ? chartData[hoveredIndex] : lastCandle;
        const up = ohlc?.isUp;
        return (
          <div className="flex items-center gap-3 px-4 py-1.5 text-xs font-mono text-muted-foreground border-b">
            <span>
              O{' '}
              <span className={up ? 'text-green-600' : 'text-red-500'}>
                {formatSum(ohlc?.open ?? 0)}
              </span>
            </span>
            <span>
              H{' '}
              <span className={up ? 'text-green-600' : 'text-red-500'}>
                {formatSum(ohlc?.high ?? 0)}
              </span>
            </span>
            <span>
              L{' '}
              <span className={up ? 'text-green-600' : 'text-red-500'}>
                {formatSum(ohlc?.low ?? 0)}
              </span>
            </span>
            <span>
              C{' '}
              <span className={up ? 'text-green-600' : 'text-red-500'}>
                {formatSum(ohlc?.close ?? 0)}
              </span>
            </span>
          </div>
        );
      })()}

      {/* Chart */}
      <div className="flex-1 min-h-0 relative flex">
        <div
          ref={chartContainerRef}
          className="flex-1 min-h-0 cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
              barCategoryGap="20%"
              onMouseMove={(state: any) => {
                if (state?.activeTooltipIndex != null) {
                  setHoveredIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor.current}
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateShort}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: gridColor.current }}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                domain={[yMin, yMax]}
                tickFormatter={formatSum}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={70}
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
              <Bar
                dataKey="base"
                stackId="candle"
                fill="transparent"
                isAnimationActive={false}
              />
              <Bar
                dataKey="body"
                stackId="candle"
                isAnimationActive={false}
                radius={[2, 2, 2, 2]}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.isUp ? '#26a69a' : '#ef5350'}
                  />
                ))}
              </Bar>
              <Customized component={WickLayer} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Y-axis drag zone overlay (right side) */}
        <div
          className="absolute right-0 top-0 bottom-0 cursor-ns-resize hover:bg-muted/30 transition-colors"
          style={{ width: 70 }}
          onMouseDown={handleYAxisMouseDown}
          onDoubleClick={handleYAxisDoubleClick}
          title="Drag to zoom price axis, double-click to reset"
        />
      </div>
    </div>
  );
}
