"use client";

import { useState, useEffect } from "react";

function useWindowSize() {
  const isWindowClient = typeof window === "object";
  const [windowSize, setWindowSize] = useState(
    isWindowClient ? window.innerWidth : 0 // Default to 0 if window is not defined
  );

  useEffect(() => {
    function setSize() {
      setWindowSize(window.innerWidth);
    }

    if (isWindowClient) {
      window.addEventListener("resize", setSize);
      return () => window.removeEventListener("resize", setSize);
    }
  }, [isWindowClient]);

  return windowSize; // Always returns a number
}

export default useWindowSize;
