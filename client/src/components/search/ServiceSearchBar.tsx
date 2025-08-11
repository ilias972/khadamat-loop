import { useState, useEffect, KeyboardEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Suggestion {
  id: number;
  slug: string;
  name_fr: string;
  name_ar: string;
  category_code: string;
}

export default function ServiceSearchBar() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (query.trim().length <= 2) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(() => {
      fetch(`/api/services/suggest?q=${encodeURIComponent(query.trim())}&locale=${language}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setSuggestions(res.data.suggestions);
          else setSuggestions([]);
        })
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(handle);
  }, [query, language]);

  const displayName = (s: Suggestion) => (language === "ar" ? s.name_ar : s.name_fr);

  const handleSelect = (s: Suggestion) => {
    window.location.href = `/providers?services=${s.slug}`;
  };

  const highlight = (name: string) => {
    const q = query.trim();
    if (!q) return name;
    const regex = new RegExp(`(${q})`, "i");
    return name.replace(regex, "<mark>$1</mark>");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      handleSelect(suggestions[active]);
    }
  };

  return (
    <div className="relative" dir={language === "ar" ? "rtl" : "ltr"}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        placeholder={t("filters.service.searchPlaceholder")}
        className="w-full border rounded px-4 py-2"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={suggestions.length > 0}
        aria-activedescendant={active >= 0 ? `suggestion-${active}` : undefined}
      />
      {query.trim().length > 2 && (
        <div className="absolute left-0 right-0 bg-white border mt-1 z-10 rounded shadow" role="listbox">
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <div
                id={`suggestion-${i}`}
                key={s.id}
                role="option"
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${i === active ? "bg-gray-100" : ""}`}
                onMouseDown={() => handleSelect(s)}
              >
                <span dangerouslySetInnerHTML={{ __html: highlight(displayName(s)) }} />
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500" role="alert">
              {t("filters.noResults")}
              <div className="mt-2 flex gap-2">
                <a href="/services" className="text-blue-600 hover:underline">
                  Voir tous les services
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
