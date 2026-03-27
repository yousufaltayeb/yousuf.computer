"use client";

import { AnimatePresence, motion } from "framer-motion";
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
    event: "Moved to Sudan for a CS degree.",
  },
  {
    year: 2023,
    event: "War broke out.",
  },
  {
    year: 2023,
    event: "Moved back to Saudi with nothing but a laptop and a decision.",
  },
  {
    year: 2023,
    event: "Enrolled at University of the People and started The Odin Project. Didn't quit this time.",
  },
  {
    year: 2024,
    event: "Spent more time in King Fahad Library than at home. Four-hour commute, but it was worth it.",
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
    event: "﴿وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ﴾\nهود ٨٨",
    rtl: true,
  },
];

export default function HeadingSlider() {
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState(0);
  const [x, setX] = useState(0);
  const el = useRef<HTMLDivElement>(null);

  const index =
    width > 0 ? Math.round((x / width) * (history.length - 1)) : 0;

  const handleChange = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!el.current) return;
      const { left } = el.current.getBoundingClientRect();
      const clientX =
        "touches" in e ? e.touches[0].clientX : e.clientX;
      setX(Math.max(0, Math.min(clientX - left, width)));
    },
    [width]
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

  useEffect(() => {
    if (el.current) {
      setWidth(el.current.offsetWidth);
    }
    return () => {
      window.removeEventListener("mousemove", handleChange);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleChange, handleMouseUp]);

  return (
    <div className="text-center h-full relative flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ ...springConfig }}
          key={index}
          className="md:text-xl mb-4 max-w-[500px] mx-auto whitespace-pre-line"
          dir={history[index].rtl ? "rtl" : undefined}
        >
          {history[index].event}
        </motion.h3>
      </AnimatePresence>
      <div
        ref={el}
        className="inline-flex items-end justify-between gap-2 ml-[-1px] absolute bottom-0"
        style={{ cursor: isDragging ? "grabbing" : "pointer" }}
        onMouseDown={handleMouseDown}
        onTouchMove={handleChange as unknown as React.TouchEventHandler}
        onTouchStart={handleChange as unknown as React.TouchEventHandler}
      >
        {history.map((_, i) => (
          <div
            key={i}
            className={`${
              i === index ? "opacity-100" : "opacity-25"
            } w-[1px] rounded-full transition-all bg-contrast`}
            style={{ height: i % 2 === 0 ? "18px" : "12px" }}
            onClick={() => setX((width / (history.length - 1)) * i)}
          />
        ))}
        <div
          className="absolute w-[1px] bg-contrast rounded-full before:content-[''] before:absolute before:top-[0px] before:left-[-4px] before:text-xs before:text-contrast before:w-[9px] before:h-[9px] before:rounded-full before:border-[#000] before:border before:bg-acid"
          style={{
            height: 32,
            left: Math.max(0, Math.min(x, width)),
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
