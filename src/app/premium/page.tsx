
"use client";

import { PremiumView } from "@/components/views/PremiumView";
import { useState, useEffect, useCallback } from "react";

export default function PremiumPage() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(localStorage.getItem('is_pro') === 'true');
  }, []);

  const handleProChange = useCallback((status: boolean) => {
    setIsPro(status);
    localStorage.setItem('is_pro', status.toString());
  }, []);

  return <PremiumView isPro={isPro} onProChange={handleProChange} />;
}
