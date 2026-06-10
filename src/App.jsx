import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

const STORAGE_KEY = "kink-questionnaire-data";
const STORAGE_VERSION = "3.0";
import questionsV3 from "@/data/questionnaires/v3.json";

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


////////////
  const groupedQuestions = useMemo(() => {
  return activeQuestions.reduce((acc, item) => {
    const category = item.Category || "Uncategorized";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(item);

    return acc;
  }, {});
  }, [activeQuestions]);
/////////////////
///////////////
  const activeQuestions = useMemo(() => {
    if (qversion === "3.0") {
      return questionsv3;
    }

//    if (qversion === "1.0") {
//      return questions;
//    }

    // No explicit version set
//    if (hasSharedData) {
      // Shared URLs without version are assumed legacy
//      return questions;
//    }

    // New questionnaires default to v2
    return questionsv3;
  }, [qversion, hasSharedData]);

  const defaultAnswers = useMemo(() => {
    const initial = {};

    activeQuestions.forEach((q) => {
      initial[q.id] = 1;
    });

    return initial;
  }, [activeQuestions]);

  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load questionnaire
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");

    // Shared URL takes precedence
    if (encoded) {
      const decoded = decodeAnswers(encoded);

      if (decoded) {
        if (decoded.version) {
          setVersion(decoded.version);
        }
        setAnswers(decoded.answers || {});
        setName(decoded.name || "");
      }
      setInitialized(true);
      return;
    }

    // Local questionnaire
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

    // Brand new questionnaire
    setVersion(STORAGE_VERSION);
    setAnswers(defaultAnswers);
    setInitialized(true);
  }, []);

  // When question set changes and answers are empty,
  // initialize defaults for that version.
  //useEffect(() => {
  //  if (Object.keys(answers).length === 0) {
  //    setAnswers(defaultAnswers);
  //  }
  //}, [defaultAnswers]);

  // Auto-save only when not viewing shared data
  useEffect(() => {
    if (hasSharedData) return;
    if (!qversion) return;

    const payload = {
      name,
      answers,
      qversion,
      savedAt: Date.now(),
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(payload)
    );
  }, [answers, name, qversion, hasSharedData]);

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

    const encoded = encodeAnswers(payload);

    return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
  }, [answers, name, qversion]);

  const compatibilityScore = useMemo(() => {
    const values = Object.values(answers);

    const total = values.reduce(
      (sum, value) => sum + Number(value),
      0
    );

    return Math.round(
      (total / (activeQuestions.length * 5)) * 100
    );
  }, [answers, activeQuestions]);

  // Rest of component continues here...

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-black" style={{ color: "#000000" }}>
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
            </div>
        </div>

        <Card className="bg-white border border-slate-200 rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-600">Your Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div className="space-y-6">

{Object.entries(groupedQuestions).map(([category, items]) => (
  <div key={category} className="space-y-4">
    
    {/* Category Header */}
    <div className="pt-6 pb-2 border-b border-slate-300">
      <h2 className="text-lg font-bold text-slate-800">
        {category}
      </h2>
    </div>

    {/* Questions in category */}
    {items.map((item) => {
      const key = item.id;

      return (
        <div
          key={key}
          className="space-y-3 border-b border-slate-200 pb-5"
        >
          <div className="relative group">
            <h3
              className="text-sm md:text-base font-medium leading-snug text-black cursor-help"
              title={item.Definition} style={{ color: "#000000" }}
            >
              {item.Question}
            </h3>

            {/* hover tooltip */}
            <div className="absolute left-0 top-full mt-2 w-72 p-3 text-xs text-white bg-slate-900 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              {item.Definition}
            </div>
          </div>

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
    })}
  </div>
))}
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 rounded-3xl">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">
                  Overall Interest Score
                </div>
                <div className="text-3xl font-bold">
                  {compatibilityScore}%
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-slate-600">
                Shareable Link
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-xs md:text-sm break-all text-slate-700 border border-slate-300">
                {shareUrl}
              </div>

              <Button
                onClick={copyLink}
                className="w-full rounded-xl text-base py-6 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {copied ? (
                  <div className="flex items-center gap-2">
                    <Check size={18} />
                    Copied
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Copy size={18} />
                    Copy Share Link
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
