import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

import questionsV3 from "@/questionnaires/v3.json";

const STORAGE_KEY = "kink-questionnaire-data";
const STORAGE_VERSION = "3.0";

function encodeAnswers(obj) {
  return btoa(JSON.stringify(obj));
}

function decodeAnswers(str) {
  try {
    return JSON.parse(atob(str));
  } catch {
    return null;
  }
}

export default function QuestionnaireApp() {
  const hasSharedData = useMemo(() => {
    return new URLSearchParams(window.location.search).has("data");
  }, []);

  const [qversion, setVersion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [openCategories, setOpenCategories] = useState({});

  // ----------------------------
  // ACTIVE QUESTIONS (must come first)
  // ----------------------------
  const activeQuestions = useMemo(() => {
    if (qversion === "3.0") return questionsV3;
    return questionsV3;
  }, [qversion]);

  // ----------------------------
  // GROUP BY CATEGORY
  // ----------------------------
  const groupedQuestions = useMemo(() => {
    return activeQuestions.reduce((acc, item) => {
      const category = item.Category || "Uncategorized";

      if (!acc[category]) acc[category] = [];
      acc[category].push(item);

      return acc;
    }, {});
  }, [activeQuestions]);

  // ----------------------------
  // DEFAULT ANSWERS (stable IDs)
  // ----------------------------
  const defaultAnswers = useMemo(() => {
    const initial = {};

    activeQuestions.forEach((q) => {
      initial[q.id] = 1;
    });

    return initial;
  }, [activeQuestions]);

  // ----------------------------
  // LOAD DATA
  // ----------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");

    if (encoded) {
      const decoded = decodeAnswers(encoded);

      if (decoded) {
        setVersion(decoded.version || STORAGE_VERSION);
        setAnswers(decoded.answers || {});
        setName(decoded.name || "");
      }

      setInitialized(true);
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setVersion(parsed.qversion || STORAGE_VERSION);
        setAnswers(parsed.answers || {});
        setName(parsed.name || "");
      } catch (err) {
        console.error("Failed to parse local storage", err);
      }

      setInitialized(true);
      return;
    }

    setVersion(STORAGE_VERSION);
    setAnswers(defaultAnswers);
    setInitialized(true);
  }, [defaultAnswers]);

  // ----------------------------
  // AUTO SAVE
  // ----------------------------
  useEffect(() => {
    if (hasSharedData) return;
    if (!qversion) return;

    const payload = {
      name,
      answers,
      qversion,
      savedAt: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [answers, name, qversion, hasSharedData]);

  // ----------------------------
  // HANDLERS
  // ----------------------------
  const handleChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const shareUrl = useMemo(() => {
    const payload = {
      version: qversion,
      name,
      answers,
    };

    return `${window.location.origin}${window.location.pathname}?data=${encodeAnswers(payload)}`;
  }, [answers, name, qversion]);

  const compatibilityScore = useMemo(() => {
    const values = Object.values(answers);

    const total = values.reduce((sum, v) => sum + Number(v), 0);

    return Math.round(
      (total / (activeQuestions.length * 5)) * 100
    );
  }, [answers, activeQuestions]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // ----------------------------
  // Toggle Function
  // ----------------------------
  const toggleCategory = (category) => {
  setOpenCategories((prev) => ({
    ...prev,
    [category]: prev[category] === false ? true : !prev[category],
  }));
  };
  const expandAllCategories = () => {
  const expanded = {};

  Object.keys(groupedQuestions).forEach((category) => {
    expanded[category] = true;
  });

  setOpenCategories(expanded);
};

const collapseAllCategories = () => {
  const collapsed = {};

  Object.keys(groupedQuestions).forEach((category) => {
    collapsed[category] = false;
  });

  setOpenCategories(collapsed);
};

  // ----------------------------
  // Score Calc
  // ----------------------------
  const categoryScores = useMemo(() => {
  const result = {};

  Object.entries(groupedQuestions).forEach(([category, items]) => {
    const total = items.reduce((sum, item) => {
      const rating = answers[item.id] ?? 1;
      return sum + (rating - 1);
  }, 0);

    const max = items.length * 4;

    result[category] = Math.round((total / max) * 100);
  });

  return result;
  }, [groupedQuestions, answers]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-black"  style={{ color: "#000000" }}>
            Shared Kink Questionnaire
          </h1>

          <p>
            <div class="kink-header">Rate each item from:</div>
	 <ul class="kink-list">
           <li> 1 - Hard Limit - absolulely not under any circumstances</li>
           <li> 2 - Soft Limit - No desire to do this activity and but may permit if partner really wanted to do it </li>
           <li> 3 - Willing do do this activity but has no special appeal to you </li>
           <li> 4 - You like doing this activity and would like to experience it on a regular basis </li>
           <li> 5 - Is a wild turn-on for you and you would like it as often as possible </li>
         </ul>
          </p><p></p>
          <p>
            <span class="kink-header">The purpose of this questionnaire is to share your kinks with your partner.</span></p>
            <div class="kink-text">
            <p>After filling out the questionnaire in its entirety you will be given a link to copy below to share with your partner(s). 
            </p><p>The information from your survey is stored locally on your device. 
            </p><p>No information is store on any servers. There is no tracking on this page.</p>
            <div className="flex justify-center"> 
                    <Button type="button" variant="outline" className="bg-purple-600 hover:bg-purple-700 text-white" 
                    onClick={() => window.open("https://kinklessons.github.io/compare-questionnaire/", "_blank")}>
                    Compare Surveys
                  </Button>
            </div>
            </div>
        </div>
        {/* NAME INPUT */}
        <Card className="bg-white border border-slate-200 rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-6">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />

<div className="flex gap-2 flex-wrap">
  <Button
    type="button"
    variant="outline"
    onClick={expandAllCategories}
  >
    Expand All
  </Button>

  <Button
    type="button"
    variant="outline"
    onClick={collapseAllCategories}
  >
    Collapse All
  </Button>
</div>


            {/* QUESTIONS */}

            <div className="space-y-10">

              {Object.entries(groupedQuestions).map(([category, items]) => (
                <div key={category} className="space-y-4">

                  {/* CATEGORY HEADER */}
                  <div
                      className="pt-4 pb-2 border-b border-slate-300 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCategory(category)}
                  >
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-800" style={{ color: "#000000" }}>
                      {category}
                    </h2>
                    <span className="text-sm text-slate-500">
                      {categoryScores[category]}%
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {openCategories[category] === false ? "▼" : "▲"}
                  </div>
                </div>

                  {/* ITEMS */}
                  {openCategories[category] !== false && (
                   items.map((item) => {
                    const key = item.id;

                    return (
                      <div key={key} className="space-y-3 border-b border-slate-200 pb-5">

                        {/* QUESTION + HOVER */}
                        <div className="relative group">
                          <h3
                            className="text-sm md:text-base font-medium text-black cursor-help"
                            title={item.Definition}  style={{ color: "#000000" }}
                          >
                            {item.Question}
                          </h3>

                          <div className="absolute left-0 top-full mt-2 w-72 p-3 text-xs text-white bg-slate-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                            {item.Definition}
                          </div>
                          <div className="text-lg font-bold min-w-[24px] text-right text-indigo-600">
                           {answers[key] ?? 1}
                          </div>
                        </div>

                        {/* SLIDER */}
                        <Slider
                          value={[answers[key] ?? 1]}
                          min={1}
                          max={5}
                          step={1}
                          onValueChange={(value) =>
                            handleChange(key, value[0])
                          }
                        />

                        <div className="flex justify-between text-xs text-slate-500">
                          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                        </div>
                      </div>
                    );
                  })
                  )}
                </div>
              ))}

            </div>
          </CardContent>
        </Card>

        {/* SCORE + SHARE */}
        <Card className="bg-white border border-slate-200 rounded-3xl">
          <CardContent className="p-6 space-y-5">

            <div>
              <div className="text-sm text-slate-600">
                Overall Interest Score
              </div>
              <div className="text-3xl font-bold">
                {compatibilityScore}%
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-slate-600">
                Shareable Link
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-xs break-all border border-slate-300">
                {shareUrl}
              </div>

              <Button
                onClick={copyLink}
                className="w-full rounded-xl py-6 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {copied ? (
                  <span className="flex items-center gap-2">
                    <Check size={18} /> Copied
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Copy size={18} /> Copy Share Link
                  </span>
                )}
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
