import { useEffect, useState } from "react";

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

// Scramble text effect - decodes text character by character
interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export const ScrambleText = ({
  text,
  className = "",
  delay = 0,
  speed = 50,
}: ScrambleTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    let iterations = 0;

    const startScramble = () => {
      const interval = setInterval(() => {
        if (currentIndex >= text.length) {
          clearInterval(interval);
          setIsComplete(true);
          return;
        }

        setDisplayText((_prev) => {
          const revealed = text.slice(0, currentIndex);
          const scrambled = text
            .slice(currentIndex)
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i === 0 && iterations > 3) {
                currentIndex++;
                iterations = 0;
                return char;
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

          return revealed + scrambled;
        });

        iterations++;
      }, speed);

      return () => clearInterval(interval);
    };

    timeout = setTimeout(startScramble, delay);
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span className={`terminal-text ${className} ${isComplete ? "" : "opacity-90"}`}>
      {displayText ||
        text
          .split("")
          .map(() => "_")
          .join("")}
    </span>
  );
};

// Typewriter effect
interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
}

export const Typewriter = ({
  text,
  className = "",
  speed = 80,
  delay = 0,
  cursor = true,
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;

    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index >= text.length) {
          clearInterval(interval);
          return;
        }
        setDisplayText(text.slice(0, index + 1));
        index++;
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  useEffect(() => {
    if (!cursor) return;
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [cursor]);

  return (
    <span className={`terminal-text ${className}`}>
      {displayText}
      {cursor && (
        <span className={`text-primary ${showCursor ? "opacity-100" : "opacity-0"}`}>|</span>
      )}
    </span>
  );
};
