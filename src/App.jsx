import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

const questions = [
  'Arm and leg sleeves ("armbinders")',
  'Breast bondage',
  'Blindfolds',
  'Bondage - Light',
  'Bondage - Heavy',
  'Bondage - All day/multi day',
  'Cages/Cells/Closets (Locked inside of)',
  'Chains (bound with)',
  'Chastity device/belts',
  'Collars - Worn in private',
  'Collars - Worn in public',
  'Cuffs - Leather',
  'Cuffs - Metal',
  'Cuffs - Handcuff Style',
  'Ear plugs (sound deprivation)',
  'Gags - Ball',
  'Gags - Bit',
  'Gags - Cloth',
  'Gags - Inflatable',
  'Gags - Phallic',
  'Gags - Ring',
  'Gags - Tape',
  'Harnessing - Leather',
  'Harnessing - Rope',
  'Hoods (full head)',
  'Immobilisation',
  'Leash',
  'Leather restraints',
  'Manacles & Irons',
  'Mummification',
  'Muzzles',
  'Rope bondage - Simple',
  'Rope bondage - Intricate (Shibari)',
  'Spreader Bars',
  'Stocks (head & hands)',
  'Straight jackets',
  'Suspension - Upright',
  'Suspension - Horizontal',
  'Suspension - Inverted',
  'Sleep sacks'
];

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
  const defaultAnswers = useMemo(() => {
    const initial = {};
    questions.forEach((q, i) => {
      initial[`q${i}`] = 3;
    });
    return initial;
  }, []);

  const [answers, setAnswers] = useState(defaultAnswers);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");

    if (encoded) {
      const decoded = decodeAnswers(encoded);

      if (decoded) {
        setAnswers(decoded.answers || defaultAnswers);
        setName(decoded.name || "");
      }
    }
  }, [defaultAnswers]);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const shareUrl = useMemo(() => {
    const payload = {
      name,
      answers,
    };

    const encoded = encodeAnswers(payload);

    return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
  }, [answers, name]);

  const compatibilityScore = useMemo(() => {
    const values = Object.values(answers);
    const total = values.reduce((a, b) => a + b, 0);
    return Math.round((total / (questions.length * 5)) * 100);
  }, [answers]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Shared Questionnaire
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Rate each item from 1 (not interested) to 5 (very interested)
          </p>
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
              {questions.map((question, index) => {
                const key = `q${index}`;

                return (
                  <div
                    key={key}
                    className="space-y-3 border-b border-slate-200 pb-5"
                  >
                    <div className="flex justify-between gap-4 items-center">
                      <h2 className="text-sm md:text-base font-medium leading-snug">
                        {question}
                      </h2>

                      <div className="text-lg font-bold min-w-[24px] text-right text-indigo-600">
                        {answers[key]}
                      </div>
                    </div>

                    <Slider
                      value={[answers[key]]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) =>
                        handleChange(key, value[0])
                      }
                    />

                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                );
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
