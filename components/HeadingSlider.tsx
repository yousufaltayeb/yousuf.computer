"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

const springConfig = {
  damping: 15,
  stiffness: 180,
  mass: 0.15,
};

const history = [
  {
    year: 2001,
    event: "Born. Didn't do too much that year.",
  },
  {
    year: 2017,
    event: "Installed Atom. Watched one HTML video. Quit.",
  },
  {
    year: 2019,
    event: "Watched all of CS50. Wrote zero lines of code.",
  },
  {
    year: 2019,
    event: "Joined stc.",
  },
  {
    year: 2020,
    event: "First real code. Small Python scripts. Decided coding wasn't for me.",
  },
  {
    year: 2022,
    event: "Enrolled at University of London.",
  },
  {
    year: 2023,
    event: "Life got complicated. Changed continents, then hard-reset in Riyadh.",
  },
  {
    year: 2023,
    event: "Enrolled at University of the People and started The Odin Project. Didn't quit this time.",
  },
  {
    year: 2024,
    event: "Spent a lot of time studying in public libraries.",
  },
  {
    year: 2025,
    event: "Switched to Linux and Vim. I use Linux btw.",
  },
  {
    year: 2025,
    event: "Finished my degree. First riyal from code. Eight years after that HTML video.",
  },
  {
    year: 2026,
    event: "First dev job. Building a SaaS. Turns out coding was for me.",
  },
  {
    year: "",
    event: "\u{FE3F}\u0648\u064E\u0645\u064E\u0627 \u062A\u064E\u0648\u0652\u0641\u0650\u064A\u0642\u0650\u064A \u0625\u0650\u0644\u0651\u064E\u0627 \u0628\u0650\u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u06DA \u0639\u064E\u0644\u064E\u064A\u0652\u0647\u0650 \u062A\u064E\u0648\u064E\u0643\u0651\u064E\u0644\u0652\u062A\u064F \u0648\u064E\u0625\u0650\u0644\u064E\u064A\u0652\u0647\u0650 \u0623\u064F\u0646\u0650\u064A\u0628\u064F\u{FE40}\n\u0647\u0648\u062F \u0668\u0668",
    rtl: true,
  },
];

export default function HeadingSlider() {
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const el = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // x is derived — stays correct when width changes on resize
  const x = width > 0 ? (width / (history.length - 1)) * index : 0;

  const handleChange = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!el.current) return;
      const { left, width: elWidth } = el.current.getBoundingClientRect();
      const clientX =
        "touches" in e ? e.touches[0].clientX : e.clientX;
      const newX = Math.max(0, Math.min(clientX - left, elWidth));
      setIndex(Math.round((newX / elWidth) * (history.length - 1)));
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleChange);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleChange]);

  function handleMouseDown() {
    setIsDragging(true);
    window.addEventListener("mousemove", handleChange);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    let newIndex = index;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        newIndex = Math.min(index + 1, history.length - 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        newIndex = Math.max(index - 1, 0);
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = history.length - 1;
        break;
      default:
        return;
    }
    setIndex(newIndex);
  }

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    if (el.current) {
      observer.observe(el.current);
      setWidth(el.current.offsetWidth);
    }
    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleChange);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleChange, handleMouseUp]);

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { ...springConfig },
      };

  return (
    <div className="text-center h-full relative flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.p
          {...motionProps}
          key={index}
          className="md:text-xl mb-4 max-w-[500px] mx-auto whitespace-pre-line"
          dir={history[index].rtl ? "rtl" : undefined}
          aria-live="polite"
        >
          {history[index].event}
        </motion.p>
      </AnimatePresence>
      <div
        ref={el}
        role="slider"
        tabIndex={0}
        aria-label="Timeline"
        aria-valuenow={index}
        aria-valuemin={0}
        aria-valuemax={history.length - 1}
        aria-valuetext={`${history[index].year ? history[index].year + ": " : ""}${history[index].event}`}
        className="flex w-full items-end justify-between absolute bottom-0"
        style={{ cursor: isDragging ? "grabbing" : "pointer" }}
        onMouseDown={handleMouseDown}
        onTouchMove={handleChange as unknown as React.TouchEventHandler}
        onTouchStart={handleChange as unknown as React.TouchEventHandler}
        onKeyDown={handleKeyDown}
      >
        {history.map((_, i) => (
          <div
            key={i}
            className="relative flex items-center justify-center"
            style={{ width: 24, minHeight: 24 }}
            onClick={() => setIndex(i)}
          >
            <div
              className={`${
                i === index ? "opacity-100" : "opacity-25"
              } w-[1px] rounded-full transition-all bg-contrast`}
              style={{ height: i % 2 === 0 ? 18 : 12 }}
            />
          </div>
        ))}
        <div
          className="absolute w-[1px] bg-contrast rounded-full before:content-[''] before:absolute before:top-[0px] before:left-[-4px] before:text-xs before:text-contrast before:w-[9px] before:h-[9px] before:rounded-full before:border-[#000] before:border before:bg-acid"
          style={{
            height: 32,
            left: Math.max(0, Math.min(x, width)),
            pointerEvents: "none",
          }}
        >
          <span
            className="absolute top-[-24px] text-xs text-contrast"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            {history[index].year}
          </span>
        </div>
      </div>
    </div>
  );
}
