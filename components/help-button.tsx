"use client";

import { HelpCircle } from "lucide-react";

export const HelpButton = () => {
  const handleClick = () => {
    window.open("/help", "_blank");
  };

  return (
    <button
      className="fixed bottom-4 right-10 w-12 h-12 bg-neutral-800 text-primary-foreground rounded-full flex items-center justify-center hover:bg-neutral-800/90 focus:outline-none"
      aria-label="Help"
      onClick={handleClick}
    >
      <HelpCircle className="size-10" />
    </button>
  );
};
