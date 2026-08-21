interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div";
  glitchOnHover?: boolean;
}

export const GlitchText = ({
  text,
  className = "",
  as: Component = "span",
  glitchOnHover = false,
}: GlitchTextProps) => {
  return (
    <Component
      className={`glitch-text ${glitchOnHover ? "glitch-hover" : ""} ${className}`}
      data-text={text}
    >
      {text}
    </Component>
  );
};
