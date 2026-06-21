import { useState, useRef, useEffect, useCallback } from "react";

// ─── Design tokens ───────────────────────────────────────────────
const T = {
  bg:       "#0A0D14",
  surface:  "#111520",
  panel:    "#161C2D",
  border:   "#1E2840",
  accent:   "#FF3D6B",   // signal red
  accentB:  "#3D6BFF",   // electric blue
  accentG:  "#3DFFB0",   // mint
  muted:    "#4A5568",
  text:     "#E8EDF5",
  textSoft: "#8896AA",
  fontDisplay: "'Space Grotesk', 'Inter', sans-serif",
  fontBody:    "'Inter', system-ui, sans-serif",
  fontMono:    "'JetBrains Mono', 'Fira Code', monospace",
};

// ─── Inline styles ───────────────────────────────────────────────
const S = {
  app: {
    background: T.bg,
    minHeight: "100vh",
    color: T.text,
    fontFamily: T.fontBody,
    fontSize: 14,
  },
  shell: {
    display: "flex",
    minHeight: "100vh",
  },
  // ── Sidebar ──
  sidebar: {
    width: 228,
    flexShrink: 0,
    background: T.surface,
    borderRight: `1px solid ${T.border}`,
    display: "flex",
    flexDirection: "column",
    padding: "0 0 24px 0",
  },
  logo: {
    padding: "28px 20px 20px",
    borderBottom: `1px solid ${T.border}`,
  },
  logoMark: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: `linear-gradient(135deg, ${T.accent}, ${T.accentB})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  logoText: {
    fontFamily: T.fontDisplay,
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: "-0.3px",
    color: T.text,
  },
  logoSub: {
    fontSize: 11,
    color: T.muted,
    letterSpacing: "0.4px",
  },
  navSection: {
    padding: "16px 12px 8px",
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "1.2px",
    color: T.muted,
    textTransform: "uppercase",
    padding: "0 8px",
    marginBottom: 6,
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? T.text : T.textSoft,
    background: active ? T.panel : "transparent",
    border: active ? `1px solid ${T.border}` : "1px solid transparent",
    transition: "all 0.15s",
    marginBottom: 2,
  }),
  navBadge: (color) => ({
    marginLeft: "auto",
    fontSize: 10,
    fontWeight: 700,
    color: color || T.accentG,
    background: `${color || T.accentG}20`,
    padding: "2px 6px",
    borderRadius: 99,
  }),
  // ── Main content ──
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  topbar: {
    padding: "16px 28px",
    borderBottom: `1px solid ${T.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: T.surface,
    gap: 16,
  },
  pageTitle: {
    fontFamily: T.fontDisplay,
    fontWeight: 700,
    fontSize: 18,
    color: T.text,
    letterSpacing: "-0.3px",
  },
  pageContent: {
    flex: 1,
    padding: "24px 28px",
    overflowY: "auto",
  },
  // ── Cards ──
  card: (extra) => ({
    background: T.panel,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "20px 22px",
    ...extra,
  }),
  cardTitle: {
    fontFamily: T.fontDisplay,
    fontWeight: 600,
    fontSize: 15,
    color: T.text,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  // ── Inputs ──
  inputWrap: {
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: T.textSoft,
    marginBottom: 5,
    letterSpacing: "0.2px",
  },
  input: {
    width: "100%",
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: T.text,
    fontSize: 13,
    fontFamily: T.fontBody,
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: T.text,
    fontSize: 13,
    fontFamily: T.fontMono,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: 80,
  },
  select: {
    width: "100%",
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: T.text,
    fontSize: 13,
    fontFamily: T.fontBody,
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  // ── Buttons ──
  btn: (variant, extra) => {
    const variants = {
      primary: { background: `linear-gradient(135deg, ${T.accent}, #D4224F)`, color: "#fff", border: "none" },
      secondary: { background: T.surface, color: T.text, border: `1px solid ${T.border}` },
      ghost: { background: "transparent", color: T.textSoft, border: "1px solid transparent" },
      blue: { background: `linear-gradient(135deg, ${T.accentB}, #2651D4)`, color: "#fff", border: "none" },
      mint: { background: `${T.accentG}18`, color: T.accentG, border: `1px solid ${T.accentG}40` },
    };
    return {
      padding: "9px 16px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: T.fontBody,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      transition: "opacity 0.15s",
      ...variants[variant],
      ...extra,
    };
  },
  // ── Tags / pills ──
  tag: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 11,
    fontWeight: 600,
    color: color || T.accentG,
    background: `${color || T.accentG}18`,
    border: `1px solid ${color || T.accentG}30`,
    padding: "3px 8px",
    borderRadius: 99,
  }),
  // ── Progress / status ──
  progressBar: (pct, color) => ({
    height: 4,
    borderRadius: 99,
    background: T.border,
    overflow: "hidden",
    position: "relative",
  }),
  progressFill: (pct, color) => ({
    height: "100%",
    width: `${pct}%`,
    background: color || `linear-gradient(90deg, ${T.accent}, ${T.accentB})`,
    borderRadius: 99,
    transition: "width 0.5s ease",
  }),
  // ── Divider ──
  divider: { height: 1, background: T.border, margin: "16px 0" },
  // ── Grid ──
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  // ── Stat block ──
  stat: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: "14px 16px",
  },
  statNum: {
    fontFamily: T.fontDisplay,
    fontWeight: 700,
    fontSize: 26,
    color: T.text,
    lineHeight: 1,
    marginBottom: 4,
  },
  statLabel: { fontSize: 11, color: T.textSoft, letterSpacing: "0.3px" },
  // ── Scrollable list ──
  scrollList: {
    maxHeight: 280,
    overflowY: "auto",
    paddingRight: 4,
  },
  // ── Code block ──
  codeBlock: {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "14px 16px",
    fontFamily: T.fontMono,
    fontSize: 12,
    color: T.textSoft,
    overflowX: "auto",
    lineHeight: 1.6,
  },
  // ── Chat bubble ──
  bubble: (role) => ({
    background: role === "user" ? `${T.accentB}18` : T.surface,
    border: `1px solid ${role === "user" ? `${T.accentB}40` : T.border}`,
    borderRadius: role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
    padding: "10px 14px",
    maxWidth: "82%",
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    fontSize: 13,
    lineHeight: 1.55,
    color: T.text,
    marginBottom: 10,
  }),
};

// ─── Mock data ───────────────────────────────────────────────────
const MOCK_VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "The Future of AI Agents in 2025", channel: "@AIInsider", views: "284K", date: "Jun 12", sentiment: "positive", score: 94 },
  { id: "L_jWHffIx5E", title: "Building RAG Systems That Actually Work", channel: "@MLEngineer", views: "156K", date: "Jun 10", sentiment: "neutral", score: 88 },
  { id: "kJQP7kiw5Fk", title: "Why LLMs Hallucinate (and how to fix it)", channel: "@DeepMLab", views: "312K", date: "Jun 08", sentiment: "positive", score: 91 },
  { id: "9bZkp7q19f0", title: "Vector DBs Compared: Pinecone vs Weaviate vs Qdrant", channel: "@DevOpsAI", views: "98K", date: "Jun 07", sentiment: "neutral", score: 79 },
  { id: "JGwWNGJdvx8", title: "Fine-tuning Llama 3 on Custom Datasets", channel: "@AIInsider", views: "201K", date: "Jun 05", sentiment: "positive", score: 86 },
  { id: "fJ9rUzIMcZQ", title: "Cursor vs Copilot: Real Developer Workflows", channel: "@CodeCraft", views: "445K", date: "Jun 03", sentiment: "positive", score: 97 },
];

const MOCK_TRENDS = [
  { topic: "Agentic AI Workflows", velocity: 94, videos: 18, delta: "+31%" },
  { topic: "Multimodal LLMs", velocity: 87, videos: 14, delta: "+24%" },
  { topic: "RAG Optimization", velocity: 81, videos: 22, delta: "+18%" },
  { topic: "On-device Models", velocity: 76, videos: 9, delta: "+41%" },
  { topic: "Prompt Engineering", velocity: 68, videos: 31, delta: "-7%" },
  { topic: "Fine-tuning Efficiency", velocity: 63, videos: 11, delta: "+15%" },
];

const MOCK_KEYWORDS = [
  { word: "agent", freq: 847, trend: "up" },
  { word: "retrieval", freq: 624, trend: "up" },
  { word: "context window", freq: 519, trend: "up" },
  { word: "benchmark", freq: 412, trend: "flat" },
  { word: "hallucination", freq: 388, trend: "down" },
  { word: "latency", freq: 301, trend: "flat" },
  { word: "embedding", freq: 287, trend: "up" },
  { word: "inference", freq: 256, trend: "up" },
];

const SENTIMENT_DATA = { positive: 61, neutral: 28, negative: 11 };

// ─── Helpers ─────────────────────────────────────────────────────
function Icon({ name, size = 14, color }) {
  const icons = {
    yt: "▶",
    trend: "📈",
    search: "🔍",
    chat: "💬",
    download: "⬇",
    add: "+",
    trash: "✕",
    run: "▶",
    stop: "⏹",
    spark: "✦",
    home: "⌂",
    setting: "⚙",
    compare: "⇔",
    insights: "◈",
    agent: "⬡",
    alert: "⚠",
    check: "✓",
    up: "↑",
    down: "↓",
    flat: "→",
    export: "↗",
    refresh: "↺",
    pin: "⬤",
    topic: "◉",
    keyword: "⟨⟩",
    sentiment: "◑",
    copy: "⎘",
    eye: "◎",
  };
  return (
    <span style={{ fontSize: size, color, lineHeight: 1, userSelect: "none" }}>
      {icons[name] || "·"}
    </span>
  );
}

function Pill({ children, color }) {
  return <span style={S.tag(color)}>{children}</span>;
}

function ProgressBar({ value, color, label }) {
  return (
    <div>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: T.textSoft }}>{label}</span>
          <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{value}%</span>
        </div>
      )}
      <div style={S.progressBar(value, color)}>
        <div style={S.progressFill(value, color)} />
      </div>
    </div>
  );
}

function Divider() {
  return <div style={S.divider} />;
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={S.stat}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ ...S.statNum, color: color || T.text }}>{value}</div>
      <div style={S.statLabel}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: T.accentG, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── Animated dot loader ─────────────────────────────────────────
function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: "50%",
          background: T.accent,
          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes pulse { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </span>
  );
}

// ─── Channel tag with remove ─────────────────────────────────────
function ChannelTag({ url, onRemove }) {
  const short = url.replace("https://www.youtube.com/", "").replace("https://youtube.com/", "");
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 8, padding: "6px 10px", marginBottom: 6,
    }}>
      <span style={{ fontSize: 12, color: T.accentB }}>▶</span>
      <span style={{ fontSize: 12, color: T.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{short}</span>
      <button onClick={onRemove} style={{
        background: "none", border: "none", color: T.muted, cursor: "pointer",
        fontSize: 11, padding: "1px 3px", borderRadius: 4,
      }}>✕</button>
    </div>
  );
}

// ─── Video card ──────────────────────────────────────────────────
function VideoCard({ video }) {
  const sentimentColor = { positive: T.accentG, neutral: T.accentB, negative: T.accent }[video.sentiment];
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 10, overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <div style={{
        height: 90,
        background: `linear-gradient(135deg, ${T.panel}, ${T.border})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `${T.accent}30`, border: `2px solid ${T.accent}50`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, color: T.accent,
        }}>▶</div>
        <div style={{
          position: "absolute", top: 8, right: 8,
          ...S.tag(sentimentColor), fontSize: 10,
        }}>{video.sentiment}</div>
        <div style={{
          position: "absolute", bottom: 8, right: 8,
          fontFamily: T.fontMono, fontSize: 10, color: T.textSoft,
        }}>{video.date}</div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.text, lineHeight: 1.4, marginBottom: 5 }}>
          {video.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: T.textSoft }}>{video.channel}</span>
          <span style={{ fontSize: 11, color: T.muted }}>{video.views} views</span>
        </div>
        <div style={{ marginTop: 8 }}>
          <ProgressBar value={video.score} color={`linear-gradient(90deg, ${T.accentB}, ${T.accentG})`} />
        </div>
      </div>
    </div>
  );
}

// ─── Agent step indicator ────────────────────────────────────────
function AgentStep({ label, status, detail }) {
  const dot = {
    idle: { color: T.muted, icon: "·" },
    running: { color: T.accent, icon: "●" },
    done: { color: T.accentG, icon: "✓" },
  }[status];
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        background: `${dot.color}20`,
        border: `1.5px solid ${dot.color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 9, color: dot.color, flexShrink: 0, marginTop: 1,
      }}>{status === "running" ? <LoadingDots /> : dot.icon}</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: status === "idle" ? T.muted : T.text }}>{label}</div>
        {detail && <div style={{ fontSize: 11, color: T.textSoft, marginTop: 2 }}>{detail}</div>}
      </div>
    </div>
  );
}

// ─── Screens ─────────────────────────────────────────────────────

// 1. SCRAPER SCREEN
function ScraperScreen() {
  const [channels, setChannels] = useState([
    "https://www.youtube.com/@AIInsider",
    "https://www.youtube.com/@MLEngineer",
  ]);
  const [newChannel, setNewChannel] = useState("");
  const [dateFrom, setDateFrom] = useState("2025-05-01");
  const [dateTo, setDateTo] = useState("2025-06-21");
  const [maxVideos, setMaxVideos] = useState("3");
  const [mode, setMode] = useState("full");
  const [status, setStatus] = useState("idle"); // idle | running | done
  const [steps, setSteps] = useState([
    { label: "Resolve channel IDs", status: "idle", detail: "" },
    { label: "Fetch video metadata via YouTube API v3", status: "idle", detail: "" },
    { label: "Extract transcripts", status: "idle", detail: "" },
    { label: "Save transcripts to disk", status: "idle", detail: "" },
  ]);

  const addChannel = () => {
    if (newChannel.trim() && !channels.includes(newChannel.trim())) {
      setChannels(c => [...c, newChannel.trim()]);
      setNewChannel("");
    }
  };

  const run = () => {
    if (!channels.length) return;
    setStatus("running");
    const delays = [600, 1400, 2400, 3200];
    delays.forEach((d, i) => {
      setTimeout(() => {
        setSteps(prev => prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "done" : idx === i ? "running" : "idle",
          detail: idx === i ? ["Resolving 2 handles…", `Fetched ${maxVideos} videos/channel`, "Processing captions…", `Saved ${channels.length * parseInt(maxVideos)} files`][i] : s.detail,
        })));
      }, d);
    });
    setTimeout(() => {
      setSteps(prev => prev.map(s => ({ ...s, status: "done" })));
      setStatus("done");
    }, 4400);
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...S.cardTitle, fontSize: 22, marginBottom: 4 }}>
          <span>📡</span> Data Scraper
        </div>
        <div style={{ fontSize: 13, color: T.textSoft }}>
          Pull video metadata and transcripts from YouTube channels using the YouTube Data API v3.
        </div>
      </div>

      <div style={S.grid2}>
        {/* Left: Config */}
        <div>
          <div style={S.card()}>
            <div style={S.cardTitle}>Channel Sources</div>
            {channels.map((c, i) => (
              <ChannelTag key={i} url={c} onRemove={() => setChannels(ch => ch.filter((_, idx) => idx !== i))} />
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                style={{ ...S.input, flex: 1 }}
                placeholder="https://www.youtube.com/@channel"
                value={newChannel}
                onChange={e => setNewChannel(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addChannel()}
              />
              <button style={S.btn("blue", { padding: "9px 13px" })} onClick={addChannel}>+</button>
            </div>
          </div>

          <div style={{ ...S.card(), marginTop: 14 }}>
            <div style={S.cardTitle}>Collection Settings</div>
            <div style={S.grid2}>
              <div style={S.inputWrap}>
                <label style={S.label}>From</label>
                <input type="date" style={S.input} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              </div>
              <div style={S.inputWrap}>
                <label style={S.label}>To</label>
                <input type="date" style={S.input} value={dateTo} onChange={e => setDateTo(e.target.value)} />
              </div>
            </div>
            <div style={S.inputWrap}>
              <label style={S.label}>Max videos per channel</label>
              <select style={S.select} value={maxVideos} onChange={e => setMaxVideos(e.target.value)}>
                {["1","2","3","5","10"].map(n => <option key={n} value={n}>{n} videos</option>)}
              </select>
            </div>
            <div style={S.inputWrap}>
              <label style={S.label}>Transcript mode</label>
              <select style={S.select} value={mode} onChange={e => setMode(e.target.value)}>
                <option value="full">Full transcript (deeper analysis)</option>
                <option value="quick">Quick mode — titles & descriptions only</option>
                <option value="fallback">Auto-fallback if no captions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Progress */}
        <div>
          <div style={S.card({ height: "100%", boxSizing: "border-box" })}>
            <div style={S.cardTitle}>Collection Progress</div>
            <div style={{ marginBottom: 20 }}>
              {steps.map((s, i) => <AgentStep key={i} {...s} />)}
            </div>
            <Divider />
            {status === "done" ? (
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <StatCard label="Videos collected" value={`${channels.length * parseInt(maxVideos)}`} icon="🎬" />
                  <StatCard label="Transcripts saved" value={`${Math.round(channels.length * parseInt(maxVideos) * 0.83)}`} icon="📝" />
                </div>
                <div style={{
                  ...S.codeBlock,
                  fontSize: 11, lineHeight: 1.7,
                }}>
                  {`✓ Channel resolved: @AIInsider → UC4JX40jDee_tINbkjycV4Sg
✓ Channel resolved: @MLEngineer → UCnUYZLuoy1rq1aVMwx4aTzw
✓ Fetched ${channels.length * parseInt(maxVideos)} videos (${dateFrom} → ${dateTo})
✓ Transcripts: ${Math.round(channels.length * parseInt(maxVideos) * 0.83)} saved, ${Math.round(channels.length * parseInt(maxVideos) * 0.17)} used fallback
✓ Ready for AI analysis`}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📡</div>
                <div style={{ fontSize: 13, color: T.textSoft, marginBottom: 16 }}>
                  Configure channels and click Collect to begin scraping.
                </div>
                <button
                  style={S.btn("primary", { fontSize: 14, padding: "11px 24px" })}
                  onClick={run}
                  disabled={status === "running"}
                >
                  {status === "running" ? <><LoadingDots /> Collecting…</> : "▶  Start Collection"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extended Feature 1: Multi-channel batch scheduling */}
      <div style={{ ...S.card({ marginTop: 20, borderColor: `${T.accentB}40` }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={S.tag(T.accentB)}>EXTENDED</span>
          <div style={S.cardTitle}>⏱ Scheduled Batch Collection</div>
        </div>
        <div style={{ fontSize: 13, color: T.textSoft, marginBottom: 16 }}>
          Automate recurring scrapes so your trend data stays fresh. Set a cadence and the scraper runs in the background, appending new data to existing runs.
        </div>
        <div style={S.grid3}>
          <div style={S.inputWrap}>
            <label style={S.label}>Frequency</label>
            <select style={S.select}>
              <option>Daily at 09:00</option>
              <option>Every 12 hours</option>
              <option>Weekly (Monday)</option>
              <option>Manual only</option>
            </select>
          </div>
          <div style={S.inputWrap}>
            <label style={S.label}>Lookback window</label>
            <select style={S.select}>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div style={S.inputWrap}>
            <label style={S.label}>On new video found</label>
            <select style={S.select}>
              <option>Auto-analyze immediately</option>
              <option>Queue for next batch</option>
              <option>Notify only</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={S.btn("blue")}>💾 Save Schedule</button>
          <div style={{ fontSize: 12, color: T.textSoft }}>Next run: Today at 09:00 UTC</div>
          <div style={{ marginLeft: "auto" }}>
            <Pill color={T.accentG}>● Active</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. ANALYSIS SCREEN
function AnalysisScreen() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [agentSteps, setAgentSteps] = useState([
    { label: "Analysis Agent — reading transcripts", status: "idle", detail: "" },
    { label: "Analysis Agent — extracting topics & sentiment", status: "idle", detail: "" },
    { label: "Synthesizer Agent — building summary", status: "idle", detail: "" },
    { label: "Synthesizer Agent — generating action items", status: "idle", detail: "" },
  ]);

  const run = () => {
    setRunning(true);
    setDone(false);
    const delays = [500, 1500, 2800, 4000];
    const details = [
      "Loading 6 transcript files…",
      "Identifying 12 unique topics across 6 videos",
      "Summarising key patterns…",
      "Distilling 5 actionable insights",
    ];
    delays.forEach((d, i) => {
      setTimeout(() => {
        setAgentSteps(prev => prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "done" : idx === i ? "running" : "idle",
          detail: idx < i ? details[idx] : idx === i ? details[i] : "",
        })));
      }, d);
    });
    setTimeout(() => {
      setAgentSteps(prev => prev.map((s, idx) => ({ ...s, status: "done", detail: details[idx] })));
      setRunning(false);
      setDone(true);
    }, 5200);
  };

  const report = `## YouTube Trend Analysis Report
**Period:** May 1 – Jun 21, 2025 · **Channels:** 2 · **Videos:** 6

### Key Themes Identified
1. **Agentic AI systems** are the dominant discussion thread — 4 of 6 videos reference multi-agent orchestration frameworks.
2. **RAG optimization** remains a top practitioner concern, with recurring questions about chunk sizing, re-ranking, and eval.
3. **Developer tooling** (Cursor, Copilot) is generating high engagement, suggesting audience is hands-on coders.

### Emerging Trends
- On-device model inference (Llama 3.2, Phi-3) mentioned in 3 videos as a cost-reduction strategy.
- "Context engineering" is becoming the preferred framing over "prompt engineering" — linguistic shift in the field.
- Benchmark skepticism: creators increasingly challenge popular leaderboards as unreliable proxies.

### Sentiment Summary
- Overall tone: **Positive / Optimistic** (61%)
- Constructive criticism: 28% — mostly around reliability and cost
- Negative signals: 11% — frustration with inference latency

### Actionable Insights
1. **Create content on agentic RAG** — topic velocity is rising and has strong viewer intent.
2. **Publish a comparison video** on developer tooling — highest engagement category.
3. **Cover on-device models** — underserved relative to interest signals.
4. **Use "context engineering"** terminology — aligns with emerging field vocabulary.
5. **Address the benchmark debate** — authenticity resonates with ML-savvy audiences.`;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...S.cardTitle, fontSize: 22, marginBottom: 4 }}>
          <span>🤖</span> AI Analysis Engine
        </div>
        <div style={{ fontSize: 13, color: T.textSoft }}>
          Two CrewAI agents collaborate — an Analysis Agent for deep pattern extraction, a Synthesizer Agent for actionable summaries.
        </div>
      </div>

      <div style={S.grid2}>
        {/* Left: Agent orchestration */}
        <div>
          <div style={S.card()}>
            <div style={S.cardTitle}>Agent Pipeline</div>
            <div style={{ marginBottom: 16 }}>
              {agentSteps.map((s, i) => <AgentStep key={i} {...s} />)}
            </div>
            <Divider />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={S.btn("primary", { flex: 1, justifyContent: "center" })}
                onClick={run}
                disabled={running}
              >
                {running ? <><LoadingDots /> Analyzing…</> : "▶  Run Analysis"}
              </button>
              {done && (
                <button style={S.btn("secondary")}>
                  ⬇ Export .md
                </button>
              )}
            </div>
          </div>

          {/* Agent definitions */}
          <div style={{ ...S.card(), marginTop: 14 }}>
            <div style={S.cardTitle}>Agent Roster</div>
            {[
              { name: "Analysis Agent", role: "YouTube Transcript Analyzer", model: "GPT-4o", color: T.accent },
              { name: "Synthesizer Agent", role: "Response Synthesizer", model: "GPT-4o", color: T.accentB },
            ].map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: i === 0 ? `1px solid ${T.border}` : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: `${a.color}20`, border: `1.5px solid ${a.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>⬡</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: T.textSoft }}>{a.role} · {a.model}</div>
                </div>
                <Pill color={a.color}>{a.model}</Pill>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Report output */}
        <div style={S.card({ overflow: "hidden" })}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={S.cardTitle}>Analysis Output</div>
            {done && <Pill color={T.accentG}>✓ Complete</Pill>}
          </div>
          {done ? (
            <div style={{ ...S.scrollList, maxHeight: 420 }}>
              {report.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return (
                  <div key={i} style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 8, marginTop: 4 }}>{line.slice(3)}</div>
                );
                if (line.startsWith("### ")) return (
                  <div key={i} style={{ fontSize: 13, fontWeight: 700, color: T.accentB, marginTop: 14, marginBottom: 6 }}>{line.slice(4)}</div>
                );
                if (line.startsWith("**")) return (
                  <div key={i} style={{ fontSize: 12, color: T.textSoft, marginBottom: 3, lineHeight: 1.5 }}
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, `<span style="color:${T.text};font-weight:600">$1</span>`) }} />
                );
                if (line.match(/^\d+\. /)) return (
                  <div key={i} style={{ fontSize: 12, color: T.textSoft, marginBottom: 4, paddingLeft: 10, lineHeight: 1.5 }}>• {line.replace(/^\d+\. /, "")}</div>
                );
                if (line.startsWith("- ")) return (
                  <div key={i} style={{ fontSize: 12, color: T.textSoft, marginBottom: 3, paddingLeft: 10, lineHeight: 1.5 }}>• {line.slice(2)}</div>
                );
                return line ? (
                  <div key={i} style={{ fontSize: 12, color: T.textSoft, marginBottom: 3, lineHeight: 1.5 }}>{line}</div>
                ) : <div key={i} style={{ height: 6 }} />;
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: T.muted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 13 }}>Run the analysis pipeline to see the report here.</div>
            </div>
          )}
        </div>
      </div>

      {/* Extended Feature 1: Comparative Multi-Run Analysis */}
      <div style={{ ...S.card({ marginTop: 20, borderColor: `${T.accentG}40` }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={S.tag(T.accentG)}>EXTENDED</span>
          <div style={S.cardTitle}>⇔ Comparative Run Analysis</div>
        </div>
        <div style={{ fontSize: 13, color: T.textSoft, marginBottom: 16 }}>
          Compare two analysis runs side-by-side to see how trends evolved between time periods. Select two saved runs to generate a delta report.
        </div>
        <div style={S.grid2}>
          <div style={S.inputWrap}>
            <label style={S.label}>Run A (baseline)</label>
            <select style={S.select}>
              <option>Run #3 — May 1–15, 2025</option>
              <option>Run #2 — Apr 15–30, 2025</option>
              <option>Run #1 — Apr 1–14, 2025</option>
            </select>
          </div>
          <div style={S.inputWrap}>
            <label style={S.label}>Run B (compare)</label>
            <select style={S.select}>
              <option>Run #4 — May 16–31, 2025 (latest)</option>
              <option>Run #3 — May 1–15, 2025</option>
            </select>
          </div>
        </div>
        {[
          { topic: "Agentic AI", a: 62, b: 94, dir: "up" },
          { topic: "Fine-tuning", a: 78, b: 63, dir: "down" },
          { topic: "RAG", a: 70, b: 81, dir: "up" },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 120, fontSize: 12, color: T.text }}>{row.topic}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                <div style={{ height: 6, borderRadius: 99, flex: row.a, background: `${T.accentB}50` }} />
                <div style={{ height: 6, borderRadius: 99, flex: 100 - row.a, background: T.border }} />
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <div style={{ height: 6, borderRadius: 99, flex: row.b, background: T.accentG }} />
                <div style={{ height: 6, borderRadius: 99, flex: 100 - row.b, background: T.border }} />
              </div>
            </div>
            <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: row.dir === "up" ? T.accentG : T.accent, textAlign: "right" }}>
              {row.dir === "up" ? "↑" : "↓"} {Math.abs(row.b - row.a)}%
            </div>
          </div>
        ))}
        <button style={S.btn("mint", { marginTop: 4 })}>⇔ Generate Delta Report</button>
      </div>
    </div>
  );
}

// 3. TRENDS SCREEN
function TrendsScreen() {
  const [filter, setFilter] = useState("all");

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...S.cardTitle, fontSize: 22, marginBottom: 4 }}>
          <span>📈</span> Trend Intelligence
        </div>
        <div style={{ fontSize: 13, color: T.textSoft }}>
          Real-time trend velocity, keyword frequency, and sentiment breakdown from your latest analysis run.
        </div>
      </div>

      {/* Stats row */}
      <div style={{ ...S.grid3, marginBottom: 20 }}>
        <StatCard label="Topics identified" value="12" icon="◉" sub="+4 new this run" />
        <StatCard label="Keywords extracted" value="847" icon="⟨⟩" sub="across 6 transcripts" />
        <StatCard label="Avg. sentiment" value="Positive" icon="◑" color={T.accentG} sub="61% positive signal" />
      </div>

      <div style={S.grid2}>
        {/* Trend velocity */}
        <div style={S.card()}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={S.cardTitle}>Topic Velocity</div>
            <div style={{ display: "flex", gap: 6 }}>
              {["all", "rising", "falling"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  ...S.btn(filter === f ? "blue" : "ghost", { padding: "4px 10px", fontSize: 11 }),
                }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {MOCK_TRENDS.filter(t => {
            if (filter === "rising") return t.delta.startsWith("+");
            if (filter === "falling") return t.delta.startsWith("-");
            return true;
          }).map((t, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{t.topic}</span>
                  <span style={{ ...S.tag(t.delta.startsWith("+") ? T.accentG : T.accent), fontSize: 10 }}>{t.delta}</span>
                </div>
                <span style={{ fontSize: 11, color: T.muted }}>{t.videos} videos</span>
              </div>
              <ProgressBar
                value={t.velocity}
                color={t.delta.startsWith("+")
                  ? `linear-gradient(90deg, ${T.accentB}, ${T.accentG})`
                  : `linear-gradient(90deg, ${T.accent}80, ${T.accent}40)`}
              />
            </div>
          ))}
        </div>

        {/* Keywords */}
        <div style={S.card()}>
          <div style={S.cardTitle}>Top Keywords</div>
          <div style={S.scrollList}>
            {MOCK_KEYWORDS.map((kw, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 0",
                borderBottom: `1px solid ${T.border}`,
              }}>
                <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accentB, width: 20, textAlign: "right" }}>#{i + 1}</span>
                <span style={{ flex: 1, fontSize: 13, color: T.text, fontWeight: 500 }}>{kw.word}</span>
                <div style={{ width: 80 }}>
                  <div style={{ height: 3, borderRadius: 99, background: T.border }}>
                    <div style={{
                      height: "100%",
                      width: `${(kw.freq / 847) * 100}%`,
                      borderRadius: 99,
                      background: T.accentB,
                    }} />
                  </div>
                </div>
                <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.muted, width: 36, textAlign: "right" }}>{kw.freq}</span>
                <span style={{ fontSize: 12, color: kw.trend === "up" ? T.accentG : kw.trend === "down" ? T.accent : T.muted }}>
                  {kw.trend === "up" ? "↑" : kw.trend === "down" ? "↓" : "→"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment */}
      <div style={{ ...S.card({ marginTop: 16 }) }}>
        <div style={S.cardTitle}>Sentiment Breakdown</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            {[
              { label: "Positive", value: SENTIMENT_DATA.positive, color: T.accentG },
              { label: "Neutral", value: SENTIMENT_DATA.neutral, color: T.accentB },
              { label: "Negative", value: SENTIMENT_DATA.negative, color: T.accent },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <ProgressBar label={s.label} value={s.value} color={s.color} />
              </div>
            ))}
          </div>
          {/* Donut-like visual */}
          <div style={{ width: 120, flexShrink: 0, textAlign: "center" }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%", margin: "0 auto",
              background: `conic-gradient(
                ${T.accentG} 0deg ${SENTIMENT_DATA.positive * 3.6}deg,
                ${T.accentB} ${SENTIMENT_DATA.positive * 3.6}deg ${(SENTIMENT_DATA.positive + SENTIMENT_DATA.neutral) * 3.6}deg,
                ${T.accent} ${(SENTIMENT_DATA.positive + SENTIMENT_DATA.neutral) * 3.6}deg 360deg
              )`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: T.panel,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: T.fontDisplay, fontWeight: 700, fontSize: 15, color: T.text,
              }}>
                {SENTIMENT_DATA.positive}%
              </div>
            </div>
            <div style={{ fontSize: 11, color: T.textSoft, marginTop: 8 }}>Overall positive</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. VIDEO BROWSER SCREEN
function VideosScreen() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_VIDEOS.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.channel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...S.cardTitle, fontSize: 22, marginBottom: 4 }}>
          <span>🎬</span> Video Library
        </div>
        <div style={{ fontSize: 13, color: T.textSoft }}>
          Browse and inspect all videos collected in the current session.
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input
          style={{ ...S.input, flex: 1 }}
          placeholder="Search by title or channel…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={{ ...S.select, width: 160 }}>
          <option>All sentiments</option>
          <option>Positive only</option>
          <option>Neutral only</option>
          <option>Negative only</option>
        </select>
        <select style={{ ...S.select, width: 140 }}>
          <option>Sort: Score ↓</option>
          <option>Sort: Date ↓</option>
          <option>Sort: Views ↓</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {filtered.map(v => <VideoCard key={v.id} video={v} />)}
      </div>

      {!filtered.length && (
        <div style={{ textAlign: "center", padding: "60px 0", color: T.muted }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <div style={{ fontSize: 13 }}>No videos match that search.</div>
        </div>
      )}
    </div>
  );
}

// 5. AI CHAT SCREEN (extended feature)
function ChatScreen() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I've analyzed 6 videos across 2 channels. Ask me anything about the trends, topics, or specific videos — or ask me to compare channels, explain a topic, or generate content ideas." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const RESPONSES = {
    default: "Based on the transcripts, the most prominent theme is **agentic AI workflows** — it appears in 4 out of 6 videos with positive framing and high engagement signals.",
    trend: "The fastest-rising trend right now is **on-device model inference**. Mentions increased 41% vs. the previous run, driven primarily by the Llama 3.2 and Phi-3 coverage.",
    compare: "Comparing @AIInsider and @MLEngineer: @AIInsider focuses more on conceptual depth (average transcript 2,400 words), while @MLEngineer skews practical/code-heavy (shorter transcripts, more code blocks). @AIInsider's videos skew more positive in sentiment.",
    content: "Based on the gap analysis, here are 3 strong content opportunities: \n1. **Agentic RAG deep-dive** — topic velocity 94, no dedicated video from either channel\n2. **Benchmark skepticism explainer** — audience is asking why popular leaderboards are misleading\n3. **On-device vs. cloud cost comparison** — quantitative, shareable, SEO-friendly",
    sentiment: "Overall sentiment: 61% positive, 28% neutral, 11% negative. The negative signals cluster around **inference latency** and **RAG hallucination** — both mentioned as pain points. The most optimistic content is about developer tooling (Cursor, Copilot) and on-device models.",
  };

  const pick = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("trend") || m.includes("rising") || m.includes("velocity")) return RESPONSES.trend;
    if (m.includes("compar") || m.includes("channel")) return RESPONSES.compare;
    if (m.includes("content") || m.includes("idea") || m.includes("creat")) return RESPONSES.content;
    if (m.includes("sentiment") || m.includes("tone") || m.includes("feeling")) return RESPONSES.sentiment;
    return RESPONSES.default;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    // Call the Anthropic API
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are an AI assistant embedded in a YouTube Trend Analysis tool. 
The user has analyzed 6 videos from 2 channels (@AIInsider, @MLEngineer) covering the period May 1 – Jun 21, 2025.
Key findings from the analysis:
- Top trending topics: Agentic AI Workflows (94 velocity, +31%), Multimodal LLMs (87, +24%), RAG Optimization (81, +18%), On-device Models (76, +41%)
- Top keywords: agent (847), retrieval (624), context window (519), benchmark (412), hallucination (388)
- Sentiment: 61% positive, 28% neutral, 11% negative
- Negative signals cluster around inference latency and RAG hallucination
- @AIInsider: conceptual/deep content, positive tone. @MLEngineer: practical/code-heavy
Answer concisely and specifically based on this data. Keep responses under 120 words.`,
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || pick(userMsg);
      setMessages(m => [...m, { role: "assistant", text }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: pick(userMsg) }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const suggestions = ["What's the fastest rising trend?", "Compare the two channels", "Give me content ideas", "Summarise the sentiment"];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ ...S.cardTitle, fontSize: 22 }}><span>💬</span> Ask the Analysis</div>
          <span style={S.tag(T.accentG)}>EXTENDED</span>
        </div>
        <div style={{ fontSize: 13, color: T.textSoft }}>
          Chat directly with Claude about your analysis results. Ask follow-up questions, request content ideas, or dig into specific trends.
        </div>
      </div>

      <div style={S.card({ display: "flex", flexDirection: "column", height: 520 })}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", paddingBottom: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={S.bubble(m.role)}>
              {m.role === "assistant" && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.accent}, ${T.accentB})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9,
                  }}>✦</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.accentB }}>Trend AI</span>
                </div>
              )}
              <div style={{ fontSize: 13, lineHeight: 1.55, color: T.text, whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{
                  __html: m.text.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${T.text}">$1</strong>`)
                }} />
            </div>
          ))}
          {loading && (
            <div style={{ ...S.bubble("assistant"), width: 60 }}>
              <LoadingDots />
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length < 3 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 10, borderTop: `1px solid ${T.border}`, marginBottom: 10 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => { setInput(s); }}
                style={S.btn("secondary", { fontSize: 11, padding: "5px 10px" })}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ display: "flex", gap: 8, paddingTop: 10, borderTop: `1px solid ${T.border}`, marginTop: 4 }}>
          <input
            style={{ ...S.input, flex: 1 }}
            placeholder="Ask about trends, keywords, sentiment, content ideas…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
          />
          <button style={S.btn("primary", { padding: "9px 16px" })} onClick={send} disabled={loading}>
            {loading ? <LoadingDots /> : "Send ↑"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. EXPORT SCREEN
function ExportScreen() {
  const [format, setFormat] = useState("markdown");
  const [copied, setCopied] = useState(false);

  const sampleMd = `# YouTube Trend Analysis Report
**Generated:** June 21, 2025 · **Channels:** 2 · **Videos:** 6

## Executive Summary
Agentic AI and RAG optimization dominate the content landscape...

## Top Trends
1. Agentic AI Workflows — velocity 94 (+31%)
2. On-device Models — velocity 76 (+41%)
...`;

  const copy = () => {
    navigator.clipboard.writeText(sampleMd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...S.cardTitle, fontSize: 22, marginBottom: 4 }}>
          <span>⬇</span> Export & Share
        </div>
        <div style={{ fontSize: 13, color: T.textSoft }}>
          Download your analysis report in your preferred format.
        </div>
      </div>

      <div style={S.grid2}>
        <div>
          <div style={S.card()}>
            <div style={S.cardTitle}>Export Format</div>
            {[
              { id: "markdown", label: "Markdown (.md)", desc: "Clean portable text with headers" },
              { id: "json", label: "JSON (.json)", desc: "Structured data for downstream tools" },
              { id: "csv", label: "CSV (.csv)", desc: "Spreadsheet-friendly trend table" },
              { id: "pdf", label: "PDF report", desc: "Print-ready formatted document" },
            ].map(f => (
              <div key={f.id}
                onClick={() => setFormat(f.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 8, cursor: "pointer", marginBottom: 6,
                  background: format === f.id ? `${T.accentB}15` : T.surface,
                  border: `1px solid ${format === f.id ? T.accentB : T.border}`,
                  transition: "all 0.15s",
                }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: `2px solid ${format === f.id ? T.accentB : T.muted}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {format === f.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accentB }} />}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: T.textSoft }}>{f.desc}</div>
                </div>
              </div>
            ))}
            <Divider />
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btn("primary", { flex: 1, justifyContent: "center" })}>⬇ Download</button>
              <button style={S.btn("secondary")} onClick={copy}>
                {copied ? "✓ Copied" : "⎘ Copy"}
              </button>
            </div>
          </div>
        </div>

        <div style={S.card()}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={S.cardTitle}>Preview</div>
            <Pill color={T.accentB}>{format.toUpperCase()}</Pill>
          </div>
          <div style={{ ...S.codeBlock, maxHeight: 320, overflowY: "auto", fontSize: 11 }}>
            {format === "markdown" && sampleMd}
            {format === "json" && `{
  "report": {
    "generated": "2025-06-21",
    "channels": ["@AIInsider","@MLEngineer"],
    "videos_analyzed": 6,
    "top_trends": [
      {"topic":"Agentic AI","velocity":94,"delta":"+31%"},
      {"topic":"On-device Models","velocity":76,"delta":"+41%"}
    ],
    "sentiment": {"positive":61,"neutral":28,"negative":11}
  }
}`}
            {format === "csv" && `topic,velocity,delta,videos\nAgentic AI,94,+31%,18\nMultimodal LLMs,87,+24%,14\nRAG Optimization,81,+18%,22`}
            {format === "pdf" && "[PDF preview not available in browser — click Download to generate]"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Navigation config ───────────────────────────────────────────
const NAV = [
  { id: "scraper",  label: "Data Scraper",       icon: "📡", section: "collect" },
  { id: "analysis", label: "AI Analysis",         icon: "🤖", section: "analyze" },
  { id: "trends",   label: "Trend Intelligence",  icon: "📈", section: "analyze" },
  { id: "videos",   label: "Video Library",       icon: "🎬", section: "analyze" },
  { id: "chat",     label: "Ask the Analysis",    icon: "💬", badge: "NEW", badgeColor: T.accentG, section: "extended" },
  { id: "export",   label: "Export & Share",      icon: "⬇", section: "share" },
];

// ─── Root app ────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("scraper");

  const sections = {
    collect:  "Collect",
    analyze:  "Analyze",
    extended: "Extended",
    share:    "Share",
  };

  const grouped = Object.fromEntries(
    Object.keys(sections).map(s => [s, NAV.filter(n => n.section === s)])
  );

  const titles = {
    scraper: "Data Scraper",
    analysis: "AI Analysis Engine",
    trends: "Trend Intelligence",
    videos: "Video Library",
    chat: "Ask the Analysis",
    export: "Export & Share",
  };

  const screens = {
    scraper: <ScraperScreen />,
    analysis: <AnalysisScreen />,
    trends: <TrendsScreen />,
    videos: <VideosScreen />,
    chat: <ChatScreen />,
    export: <ExportScreen />,
  };

  return (
    <div style={S.app}>
      <style>{`
        * { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2840; border-radius: 99px; }
        select option { background: #111520; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
        @keyframes pulse { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={S.shell}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.logo}>
            <div style={S.logoMark}>
              <div style={S.logoIcon}>▶</div>
              <div>
                <div style={S.logoText}>TrendScope</div>
              </div>
            </div>
            <div style={S.logoSub}>YouTube Intelligence Platform</div>
          </div>

          {Object.entries(grouped).map(([sec, items]) => items.length ? (
            <div key={sec} style={S.navSection}>
              <div style={S.navLabel}>{sections[sec]}</div>
              {items.map(n => (
                <div key={n.id} style={S.navItem(page === n.id)} onClick={() => setPage(n.id)}>
                  <span style={{ fontSize: 14 }}>{n.icon}</span>
                  <span>{n.label}</span>
                  {n.badge && <span style={S.navBadge(n.badgeColor)}>{n.badge}</span>}
                </div>
              ))}
            </div>
          ) : null)}

          {/* Bottom status */}
          <div style={{ marginTop: "auto", padding: "0 16px" }}>
            <div style={{
              background: T.panel, border: `1px solid ${T.border}`,
              borderRadius: 9, padding: "10px 12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accentG }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>Last run</span>
              </div>
              <div style={{ fontSize: 11, color: T.textSoft }}>Jun 21 · 6 videos · 2 channels</div>
              <div style={{ marginTop: 8 }}>
                <ProgressBar value={83} color={T.accentG} />
              </div>
              <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>83% transcripts available</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={S.main}>
          <div style={S.topbar}>
            <div style={S.pageTitle}>{titles[page]}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btn("secondary", { padding: "7px 12px", fontSize: 12 })}>↺ Refresh</button>
              <button style={S.btn("primary", { padding: "7px 14px", fontSize: 12 })}>▶ New Run</button>
            </div>
          </div>
          <div style={S.pageContent}>
            {screens[page]}
          </div>
        </div>
      </div>
    </div>
  );
}