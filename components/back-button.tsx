"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface BackButtonProps {
  children: React.ReactNode;
  className?: string;
}

export const BackButton = ({ children, className }: BackButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className={`${className} text-primary hover:underline inline-flex items-center gap-1 font-bold mb-5`}
    >
      <ChevronLeft size={18} />
      {children}
    </Button>
  );
};
