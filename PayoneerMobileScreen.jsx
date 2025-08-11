import React, { useEffect, useState } from "react";

/* ---------------------------
   Fonts (your GitHub raws)
   --------------------------- */
const FontFace = () => (
  <>
    <link
      rel="preload"
      as="font"
      href="https://github.com/kalinakalina/payo/raw/refs/heads/main/avenir-next-world-regular.otf"
      type="font/otf"
      crossOrigin="anonymous"
    />
    <link
      rel="preload"
      as="font"
      href="https://github.com/kalinakalina/payo/raw/refs/heads/main/avenir-next-world-demi.otf"
      type="font/otf"
      crossOrigin="anonymous"
    />
    <style
      dangerouslySetInnerHTML={{
        __html: `
@font-face {
  font-family: 'Avenir Next World';
  src: url('https://github.com/kalinakalina/payo/raw/refs/heads/main/avenir-next-world-regular.otf') format('opentype');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Avenir Next World';
  src: url('https://github.com/kalinakalina/payo/raw/refs/heads/main/avenir-next-world-demi.otf') format('opentype');
  font-weight: 600; font-style: normal; font-display: swap;
}
`,
      }}
    />
  </>
);

/* ---------------------------
   Design tokens
   --------------------------- */
const T = {
  color: {
    primary: "#FF4800",
    success: "#1CD293",
    warning: "#EAA300",
    error:   "#EF4C5B",
    info:    "#069FDF",
    bg:      "#FFFFFF",
    surface: "#FFFFFF",
    elevated:"#F5F5F5",
    border:  "#E0E0E0",
    text:    "#252526",
    text2:   "#6F6F70",
    disabled:"#B6B6B6",
  },
  font: "Avenir Next World, -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  radius: { card: 16, chip: 8 },
  shadowCard: "0 2px 12px rgba(0,0,0,0.08)",
  gridW: 390,
};

/* ---------------------------
   Shell (white background)
   --------------------------- */
const Shell = ({ children }) => (
  <div
    style={{
      background: T.color.bg,
      minHeight: "100vh",
      padding: 24,
      fontFamily: T.font,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textRendering: "optimizeLegibility",
    }}
  >
    <div
      style={{
        width: T.gridW,
        minHeight: 780,
        margin: "0 auto",
        borderRadius: 24,
        overflow: "hidden",
        background: T.color.bg,
        outline: "1px solid #E4E6EA",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      {children}
    </div>
  </div>
);

/* ---------------------------
   Bottom nav (fixed asset)
   --------------------------- */
const Motion = { duration: { tapIn: 110, tapOut: 140 }, easing: { standard: "cubic-bezier(0.2, 0, 0, 1)" } };
const NavTokens = { bar: { width: 332, height: 42 }, slots: 4, highlight: { width: 44, height: 28, radius: 14, color: "rgba(0,0,0,0.14)", top: 6 } };

const RemoteSvg = ({ src, style }) => {
  const [markup, setMarkup] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    let active = true;
    fetch(src, { cache: "no-store" })
      .then(r => { if (!r.ok) throw new Error(\`HTTP \${r.status}\`); return r.text(); })
      .then(txt => { if (active) setMarkup(txt); })
      .catch(e => { if (active) setErr(e.message); });
    return () => { active = false; };
  }, [src]);
  if (err) return <div style={{ padding: 8, color: "#b00020" }}>Failed to load {src}: {err}</div>;
  if (!markup) return <div style={{ height: NavTokens.bar.height }} />;
  return <div style={style} dangerouslySetInnerHTML={{ __html: markup }} />;
};

const BottomBarWrap = ({ children }) => (
  <div style={{ position: "sticky", bottom: 0, zIndex: 50, background: "transparent", display: "flex", justifyContent: "center" }}>
    {children}
  </div>
);

const BOTTOM_SVG_URL =
  "https://raw.githubusercontent.com/kalinakalina/payo/7876078d40bd554c655f48dcc1fb98903b7e4e44/group%20(3).svg";

const labels = ["Home", "Activity", "Actions", "Cards"];

const BottomNavSVG = ({ selected = "Home", onSelect = () => {} }) => {
  const [pressed, setPressed] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const slotW = NavTokens.bar.width / NavTokens.slots;

  return (
    <BottomBarWrap>
      <div style={{ position: "relative", width: NavTokens.bar.width, height: NavTokens.bar.height }}>
        <RemoteSvg
          src={BOTTOM_SVG_URL}
          style={{ width: NavTokens.bar.width, height: NavTokens.bar.height, display: "block", pointerEvents: "none" }}
        />
        {labels.map((label, i) => {
          const isPressed = pressed === i;
          const isHover   = hovered === i;
          const isFocus   = focused === i;
          const hlLeft    = i * slotW + (slotW - NavTokens.highlight.width) / 2;
          return (
            <button
              key={label}
              aria-label={label}
              onPointerDown={() => setPressed(i)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(null)}
              onClick={() => onSelect(label)}
              style={{
                position: "absolute", top: 0, left: i * slotW,
                width: slotW, height: NavTokens.bar.height,
                background: "transparent", border: "none",
                cursor: "pointer", outline: "none",
                transform: isPressed ? "scale(0.98)" : "scale(1)",
                transition: \`transform \${isPressed ? Motion.duration.tapIn : Motion.duration.tapOut}ms \${Motion.easing.standard}\`,
                touchAction: "manipulation",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: NavTokens.highlight.top,
                  left: hlLeft - i * slotW,
                  width: NavTokens.highlight.width,
                  height: NavTokens.highlight.height,
                  borderRadius: NavTokens.highlight.radius,
                  background: NavTokens.highlight.color,
                  opacity: isPressed ? 1 : ((isHover || isFocus) ? 0.6 : 0),
                  transition: \`opacity \${isPressed ? Motion.duration.tapIn : Motion.duration.tapOut}ms \${Motion.easing.standard}\`,
                  pointerEvents: "none",
                  zIndex: 1,
                  willChange: "opacity",
                }}
              />
            </button>
          );
        })}
      </div>
    </BottomBarWrap>
  );
};

/* ---------------------------
   Assets (flags fixed)
   --------------------------- */
const FLAG = {
  US: "https://raw.githubusercontent.com/kalinakalina/payo/452ac83e38a32fbaeab29b415bde150b6ad78af1/usflag.svg",
  EU: "https://raw.githubusercontent.com/kalinakalina/payo/452ac83e38a32fbaeab29b415bde150b6ad78af1/euflag.svg",
  UK: "https://raw.githubusercontent.com/kalinakalina/payo/452ac83e38a32fbaeab29b415bde150b6ad78af1/ukflag.svg",
};

/* ---------------------------
   Primitives
   --------------------------- */
const Card = ({ children, style }) => (
  <div
    style={{
      background: T.color.surface,
      borderRadius: T.radius.card,
      boxShadow: T.shadowCard,
      padding: 16,
      ...style,
    }}
  >
    {children}
  </div>
);

const DotPager = ({ index = 1, total = 3 }) => (
  <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
    {new Array(total).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          width: 6, height: 6, borderRadius: 999,
          background: i === index ? "#C9C9C9" : "#E5E5E6",
        }}
      />
    ))}
  </div>
);

const DateChip = ({ text }) => (
  <div
    style={{
      alignSelf: "center",
      background: "#EFEFEF",
      color: T.color.text2,
      fontSize: 12,
      borderRadius: 8,
      padding: "8px 12px",
      fontWeight: 600,
      letterSpacing: 0.2,
    }}
  >
    {text}
  </div>
);

const Divider = () => <div style={{ height: 1, background: T.color.border, margin: "8px 0" }} />;

const Amount = ({ value, currency }) => {
  const negative = String(value).startsWith("-");
  if (negative) {
    return <div style={{ color: T.color.text, fontWeight: 700 }}>{value} {currency}</div>;
  }
  return (
    <div
      style={{
        background: T.color.success,
        color: "#fff",
        fontWeight: 700,
        padding: "6px 10px",
        borderRadius: T.radius.chip,
        lineHeight: 1,
      }}
    >
      {value} {currency}
    </div>
  );
};

const TxnRow = ({ title, status = "Completed", amount, currency }) => (
  <div style={{ padding: "12px 0" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
      <div style={{ color: T.color.text, fontWeight: 700 }}>{title}</div>
      <Amount value={amount} currency={currency} />
    </div>
    <div style={{ marginTop: 6, color: T.color.text2, fontSize: 14 }}>{status}</div>
  </div>
);

const BalanceCard = ({ flagSrc, caption, amount, code }) => (
  <Card style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12 }}>
    <img src={flagSrc} alt="" width={32} height={32} style={{ alignSelf: "center" }} />
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ color: T.color.text2, fontSize: 14 }}>{caption}</div>
      <div style={{ color: T.color.text, fontSize: 22, fontWeight: 800 }}>
        {amount} {code}
      </div>
    </div>
  </Card>
);

/* ---------------------------
   Screen (no top nav)
   --------------------------- */
const Body = () => (
  <div style={{ padding: "16px 16px 24px 16px" }}>
    {/* Balances */}
    <div style={{ display: "grid", gap: 14 }}>
      <BalanceCard flagSrc={FLAG.US} caption="USD card XXXX-1234" amount="240,000.00" code="USD" />
      <BalanceCard flagSrc={FLAG.EU} caption="EUR balance" amount="55,000.00" code="EUR" />
      <BalanceCard flagSrc={FLAG.UK} caption="GBP balance" amount="250.00" code="GBP" />
    </div>

    {/* Pager */}
    <div style={{ margin: "18px 0 14px" }}>
      <DotPager index={1} total={3} />
    </div>

    {/* Transactions */}
    <div style={{ display: "grid", gap: 14 }}>
      <DateChip text="24 Mar 2022" />

      <Card>
        <TxnRow title="Timothee Chalamet" amount="500.00" currency="USD" />
        <Divider />
        <TxnRow title="Bank of China" amount="-500.00" currency="USD" />
      </Card>

      <DateChip text="02 Mar 2022" />

      <Card>
        <TxnRow title="HSBC (1234)" amount="-500.00" currency="USD" />
      </Card>
    </div>
  </div>
);

/* ---------------------------
   App (export default)
   --------------------------- */
export default function App() {
  const [route, setRoute] = useState("Home");
  return (
    <>
      <FontFace />
      <Shell>
        <Body />
        <BottomNavSVG selected={route} onSelect={setRoute} />
      </Shell>
    </>
  );
}
