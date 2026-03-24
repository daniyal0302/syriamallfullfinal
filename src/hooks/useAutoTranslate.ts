import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

// In-memory cache to avoid redundant API calls within the same session
const translationCache = new Map<string, string>();

// Debounced batch queue to collect individual translation requests
let batchQueue: Array<{ text: string; resolve: (val: string) => void }> = [];
let batchTimer: ReturnType<typeof setTimeout> | null = null;

function queueTranslation(text: string): Promise<string> {
  return new Promise((resolve) => {
    batchQueue.push({ text, resolve });
    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(flushBatch, 150); // collect for 150ms then send
  });
}

async function flushBatch() {
  const items = [...batchQueue];
  batchQueue = [];
  batchTimer = null;
  if (items.length === 0) return;

  const texts = items.map((i) => i.text);
  try {
    const { data, error } = await supabase.functions.invoke("auto-translate", {
      body: { texts, targetLang: "ar" },
    });
    if (error) throw error;
    const translations = data?.translations || [];
    items.forEach((item, idx) => {
      const result = translations[idx] || item.text;
      translationCache.set(item.text, result);
      item.resolve(result);
    });
  } catch (err) {
    console.error("Batch translate failed:", err);
    items.forEach((item) => item.resolve(item.text));
  }
}

export function useAutoTranslate(text: string, existingTranslation?: string | null): string {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState<string>(existingTranslation || text);
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    if (!isArabic) {
      setTranslated(text);
      return;
    }

    if (existingTranslation) {
      setTranslated(existingTranslation);
      return;
    }

    if (!text) return;

    const cached = translationCache.get(text);
    if (cached) {
      setTranslated(cached);
      return;
    }

    queueTranslation(text).then(setTranslated);
  }, [text, existingTranslation, isArabic]);

  return isArabic ? translated : text;
}

// Batch translate multiple texts at once
export function useAutoTranslateBatch(
  items: Array<{ text: string; existingTranslation?: string | null }>
): string[] {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [translations, setTranslations] = useState<string[]>(
    items.map((i) => i.existingTranslation || i.text)
  );
  const pendingRef = useRef(false);

  useEffect(() => {
    if (!isArabic) {
      setTranslations(items.map((i) => i.text));
      return;
    }

    // Use existing translations or cache where available
    const result = items.map((i) => {
      if (i.existingTranslation) return i.existingTranslation;
      const cached = translationCache.get(i.text);
      if (cached) return cached;
      return null;
    });

    const needsTranslation = result
      .map((r, idx) => (r === null ? idx : -1))
      .filter((idx) => idx !== -1);

    if (needsTranslation.length === 0) {
      setTranslations(result as string[]);
      return;
    }

    if (pendingRef.current) return;
    pendingRef.current = true;

    const translate = async () => {
      try {
        const textsToTranslate = needsTranslation.map((idx) => items[idx].text);
        const { data, error } = await supabase.functions.invoke("auto-translate", {
          body: { texts: textsToTranslate, targetLang: "ar" },
        });

        if (error) throw error;

        const translated = data?.translations || [];
        const finalResult = [...result];
        needsTranslation.forEach((origIdx, i) => {
          const t = translated[i] || items[origIdx].text;
          translationCache.set(items[origIdx].text, t);
          finalResult[origIdx] = t;
        });

        setTranslations(finalResult as string[]);
      } catch (err) {
        console.error("Batch translate failed:", err);
        setTranslations(items.map((i) => i.existingTranslation || i.text));
      } finally {
        pendingRef.current = false;
      }
    };

    translate();
  }, [isArabic, items.map((i) => i.text).join("|")]);

  return translations;
}
