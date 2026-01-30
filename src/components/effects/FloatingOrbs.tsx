export const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large Primary Orb */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-float-slow"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
          top: '-10%',
          right: '-10%',
          filter: 'blur(60px)',
        }}
      />

      {/* Secondary Orb */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full animate-float-reverse"
        style={{
          background: 'radial-gradient(circle, rgba(191, 0, 255, 0.12) 0%, transparent 70%)',
          bottom: '10%',
          left: '-5%',
          filter: 'blur(80px)',
          animationDelay: '2s',
        }}
      />

      {/* Accent Orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full animate-float-slow"
        style={{
          background: 'radial-gradient(circle, rgba(255, 0, 170, 0.1) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(100px)',
          animationDelay: '4s',
        }}
      />

      {/* Small floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/50 animate-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

// Animated grid lines component
export const GridLines = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Horizontal scanning line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-horizontal" />

      {/* Vertical accent lines */}
      <div className="absolute top-0 bottom-0 left-[20%] w-px bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
      <div className="absolute top-0 bottom-0 right-[20%] w-px bg-gradient-to-b from-transparent via-secondary/5 to-secondary/10" />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-secondary/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-accent/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/20" />
    </div>
  );
};

// Noise texture overlay
export const NoiseOverlay = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
};
