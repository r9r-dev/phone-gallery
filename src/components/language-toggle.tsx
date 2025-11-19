"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
      className="glass hover:glass-strong hover:neon-purple"
    >
      <span className="text-sm font-bold">
        {language === 'fr' ? 'FR' : 'EN'}
      </span>
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
