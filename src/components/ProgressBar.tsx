"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { usePayment } from "@/hooks/usePayment";

export default function ProgressBar() {
  const { progress, setProgress } = usePayment();

  useEffect(() => {
    const timer = setTimeout(() => setProgress(35), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={progress} />;
}
