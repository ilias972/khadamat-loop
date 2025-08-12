import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

interface ProviderAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  city?: string;
  onSubmit?: () => void;
}

interface Suggestion {
  id: string;
  slug?: string;
  displayName: string;
  mainCity?: string;
  topServices?: string[];
}

function normalize(str: string) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[ؤئ]/g, "ء")
    .replace(/ة/g, "ه");
}

export default function ProviderAutocomplete({
  value,
  onChange,
  city,
  onSubmit,
}: ProviderAutocompleteProps) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
   const handler = setTimeout(async () => {
     try {
       const params = new URLSearchParams({
         q: normalize(value),
         limit: "8",
       });
       if (city) params.append("city", city);
        const timeout = setTimeout(() => controller.abort(), 1200);
        try {
          const res = await fetch(`/api/providers/suggest?${params.toString()}`, {
            signal: controller.signal,
          });
          const json = await res.json();
          setSuggestions(json.data?.items || []);
        } finally {
          clearTimeout(timeout);
        }
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      }
    }, 250);
    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [value, city]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setShow(true);
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        const p = suggestions[activeIndex];
        setLocation(`/providers/${p.slug || p.id}`);
      } else {
        onSubmit?.();
      }
      setShow(false);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={t("providers.search.byNamePlaceholder")}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShow(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-controls="provider-suggestions"
        aria-activedescendant={
          activeIndex >= 0 ? `provider-option-${activeIndex}` : undefined
        }
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
      {show && value && (
        <ul
          id="provider-suggestions"
          role="listbox"
          className="absolute left-0 top-full z-10 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-56 overflow-auto"
        >
          {suggestions.length > 0 ? (
            suggestions.map((p, idx) => (
              <li
                key={p.id}
                id={`provider-option-${idx}`}
                role="option"
                aria-selected={activeIndex === idx}
                className={`px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-700 ${
                  activeIndex === idx ? "bg-orange-50" : ""
                }`}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={() =>
                  setLocation(`/providers/${p.slug || p.id}`)
                }
              >
                <div className="flex justify-between">
                  <span>{p.displayName}</span>
                  {p.mainCity && (
                    <span className="text-sm text-gray-500">{p.mainCity}</span>
                  )}
                </div>
                {p.topServices && p.topServices.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {p.topServices.slice(0, 2).join(", ")}
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-700">
              {t("providers.search.noResults")}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
