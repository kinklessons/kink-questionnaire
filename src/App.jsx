import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

const STORAGE_KEY = "kink-questionnaire-data";
const STORAGE_VERSION = "2.0";
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
  'Sleep sacks',
  'Chamber pot use',
  'Creampie',
  'Cum - In ass',
  'Cum - In mouth',
  'Cum - In vagina',
  'Cum - On body',
  'Cutting - Blood play',
  'Golden showers (urinate on)',
  'Human Toilet',
  'Injections (Saline)',
  'Milking (made to produce breast milk)',
  'Pearl necklace (cum on chest/throat)',
  'Pearl shower (cum on face)',
  'Rimming (oral/anal play)',
  'Scat (brown showers)',
  'Swallowing semen',
  'Swallowing urine',
  'Boot worship',
  'Cock worship',
  'Corsets',
  'Cross dressing',
  'Diapers',
  'Foot worship',
  'Gas Masks',
  'High heels (wearing)',
  'High heel worship',
  'Leather (wearing)',
  'Lingerie (wearing)',
  'Pussy worship',
  'Rubber/latex clothing (wearing)',
  'Slutty clothing',
  'Spandex clothing',
  'Forced dressing',
  'Forced feminization',
  'Forced homosexuality',
  'Forced masturbation',
  'Forced nudity',
  'Forced servitude',
  'Humiliation in private',
  'Humiliation in public',
  'Lecturing for misbehaviors',
  'Shaving head hair',
  'Shaving or depilation of body hair',
  'Standing in corner (punishment)',
  'Verbal humiliation',
  'Breast whipping',
  'Caning - English',
  'Caning - Sensation',
  'Face slapping',
  'Punching',
  'Pussy punching',
  'Pussy kicking',
  'Pussy spanking (smacking)',
  'Pussy whipping',
  'Riding crops',
  'Spanking - Hairbrush',
  'Spanking - Hand',
  'Spanking - Leather slappers',
  'Spanking - Wooden paddles',
  'Spanking - (OTK) Over The Knee',
  'Whipping - Belt',
  'Whipping - Cat o 9 tails',
  'Whipping - Flogger',
  'Whipping - Single tail',
  'Wrestling',
  'Fantasy gang rape',
  'Group play - Multiple men "gang bang"',
  'Group play - Multiple women & men',
  'Group play - Orgy',
  'Shared (given to another only temp)',
  'Swapping (with one other couple)',
  'Swinging (multiple couples)',
  'Branding',
  'Scarification (cutting, making scars)',
  'Tattooing (inking)',
  'Abandonment (fantasy)',
  'Age play (not pedophilia)',
  'Animal roleplay',
  'Auctioned for charity',
  'Fear play',
  'Human puppy-dog play',
  'Infantilism (baby play)',
  'Initiation rites',
  'Interrogations',
  'Kidnapping',
  'Medical scenes',
  'Name change',
  'Pony play',
  'Psych ward play',
  'Prison scenes',
  'Prostitution fantasy',
  'Religious scenes',
  'Schoolroom scenes',
  'Switching roles (Top/bottom)',
  'Total Power Exchange (TPE)',
  'Other roleplaying',
  'Abrasion (scraping, sanding)',
  'Asphyxiation',
  'Ball stretching',
  'Biting (being bitten)',
  'Beating hard',
  'Beating soft',
  'Breath control (Choking)',
  'Breath control (Mild restriction)',
  'Clamps - Labia/clit area',
  'Clothespins',
  'Dilation',
  'Electricity - Internal (egg or probe)',
  'Electricity - TENS unit',
  'Electricity - Violet Wand',
  'Enemas - For cleansing',
  'Enemas - Retention/training',
  'Finger claws',
  'Fire cupping',
  'Fire play',
  'Hair pulling',
  'Hot wax - Dripping on body/genitals',
  'Hot waxing - Hair removal',
  'Ice cubes',
  'Kicking',
  'Knife play (blood drawn)',
  'Knife play (no blood)(sensation)',
  'Needle play',
  'Nipple clamps',
  'Nipple piercing',
  'Nipple play - Pulls, Tugs, Twists',
  'Pain - Mild',
  'Pain - Severe',
  'Piercing (permanant)',
  'Piercing (temporary)',
  'Punishment scene',
  'Riding the horse (crotch torture)',
  'Scratching',
  'Sensory deprivation',
  'Sleep deprivation',
  'Strapping (full body beating)',
  'Suction cups',
  'Teasing',
  'Tickling',
  'Vampire gloves',
  'Water torture (waterboarding)',
  'Wartenburg pinwheel',
  'Zippers - Clothespins',
  'Zippers - Clamps',
  'Zippers - Needles',
  'Bathroom use control (permission)',
  'Begging',
  'Chauffeuring (driving)',
  'Chores (domestic service/housework)',
  'Chosen clothing for',
  'Chosen food for',
  'Contract slave',
  'Daily diary',
  'Exercise - Forced/required',
  'Erotic dancing',
  'Eye contact restrictions',
  'Following orders',
  'Gor Slave Training (positions)',
  'Harems (serving with other subs)',
  'Hypnotism',
  'Kneeling',
  'Manicures',
  'Mantra and meditation',
  'Massage',
  'Pedicures & foot massages',
  'Personality modification',
  'Phone sex',
  'Rituals',
  'Serving as a maid',
  'Serving as furniture',
  'Serving as art',
  'Serving other Doms (supervised only)',
  'Speech restrictions (when, what, to whom)',
  'Uniform (wearing)',
  'Wearing symbolic jewelry',
  'Weight control',
  'Anal beads',
  'Anal play',
  'Anal plugs - Small',
  'Anal plugs - Medium',
  'Anal plugs - Large',
  'Anal plugs - Public, under clothes',
  'Anal sex',
  'Bestiality (sex with animals)',
  'Breast fucking',
  'Catheterization',
  'Cunnilingus (giving oral to a woman)',
  'Cunnilingus (receiving oral)',
  'Dildos - Anal',
  'Dildos - Oral',
  'Dildos - Vaginal',
  'Double penetration',
  'Fantasy rape play',
  'Fellatio (oral sex on a penis)',
  'Fisting - Anal',
  'Fisting - Vaginal',
  'Genital sex',
  'Masturbation',
  'Orgasm control',
  'Orgasm denial',
  'Sexual deprivation',
  'Sounding',
  'Speculums',
  'Strap-on-dildos (sucking on)',
  'Strap-on-dildos (penetrated by)',
  'Strap-on-dildos (wearing)',
  'Triple penetration',
  'Vibrator - Anal',
  'Vibrator - External genital',
  'Vibrator - Internal genital',
  'Examinations',
  'Exhibitionism (friends)',
  'Exhibitionism (strangers)',
  'Forced nudity (private)',
  'Forced nudity (around others)',
  'Modeling for erotic photos',
  'Outdoor scenes',
  'Video (watching others)',
  'Video (recordings of you)',
  'Voyeurism (watching others)',
  'Voyeurism (your Dom w/others)',
  'Abrasion',
  'Age Play',
  'Anal Plugs (small)',
  'Anal Plugs (large)',
  'Anal Plug (public under clothes)',
  'Animal Roles',
  'Arm & leg sleeves (armbinders)',
  'Aromas',
  'Bathroom use control',
  'Beastiality',
  'Beating (soft)',
  'Beating (hard)',
  'Blindfolding',
  'Being Serviced (sexual)',
  'Being bitten',
  'Breast/chest bondage',
  'Breath control',
  'Bondage (light)',
  'Bondage (heavy)',
  'Bondage (multi-day)',
  'Bondage (public under clothing)',
  'Brown showers (scat)',
  'Cages (locked inside)',
  'Caning',
  'Castration fantasy',
  'Cattle prod (electrical toy)',
  'Cells/Closets (locked inside of)',
  'Chains',
  'Chastity belts',
  'Chauffeuring',
  'Choking',
  'Chores (domestic service)',
  'Cock rings/straps',
  'Collars (worn in private)',
  'Collars (worn in public)',
  'Competitions (with other subs)',
  'Corsets (wearing casually)',
  'Corsets (trained waist reduction)',
  'Cuffs (leather)',
  'Cuffs (metal)',
  'Cutting',
  'Diapers (wearing)',
  'Diapers (wetting)',
  'Diapers (soiling)',
  'Dildos',
  'Electricity',
  'Enemas (for cleansing)',
  'Enemas (retention/punishment)',
  'Enforced chastity',
  'Erotic Dance (for audience)',
  'Exercise (forced/required)',
  'Fantasy Abandonment',
  'Fantasy rape',
  'Fear (being scared)',
  'Fisting (anal)',
  'Fisting (vaginal)',
  'Flame play',
  'Forced bedwetting',
  'Forced eating',
  'Forced heterosexuality',
  'Forced smoking',
  'Full head hoods',
  'Gags (cloth)',
  'Gags (inflatable)',
  'Gags (phallic)',
  'Gags (rubber)',
  'Gags (tape)',
  'Gates of Hell (male)',
  'Given away to another',
  'Dom (temp)',
  'Dom (perm)',
  'Golden Showers',
  'Gun play',
  'Hair brush spankings',
  'Hand Jobs (giving)',
  'Hand Jobs (receiving)',
  'Harems (serving w/other subs)',
  'Harnessing (leather)',
  'Harnessing (rope)',
  'Having food chosen for you',
  'Having clothing chosen for you',
  'Head (give fellatio/cunnilingus)',
  'Head (rcv fellation/cunnilingus)',
  'High Heel Wearing',
  'Homage with tongue (non-sexual)',
  'Hoods',
  'Hot oils (on genitals)',
  'Hot waxing',
  'Housework (doing)',
  'Human puppy dog',
  'Humiliation (private)',
  'Humiliation (public)',
  'Immobilization',
  'Infantilism',
  'Injections',
  'Intricate (Japanese)',
  'rope bondage',
  'Knife play',
  'Leather Clothing',
  'Lectures for misbehavior',
  'Licking (non-sexual)',
  'Manacles and Irons',
  'Manicures (giving)',
  'Massage (giving)',
  'Massage (receiving)',
  'Mouth bits',
  'Name change (for scene)',
  'Nipple rings (piercing)',
  'Nipple weights',
  'Oral/anal play (rimming)',
  'Over the knee spanking',
  'Pain (severe)',
  'Pain (mild)',
  'Persona training (in scene)',
  'Personal modification (rl)',
  'Phone sex (serving Dom)',
  'Phone sex (serving Dom’s friends)',
  'Phone sex (commercial provider)',
  'Piercing (temporary, play-pierce)',
  'Piercing (permanent) ',
  'Plastic surgery',
  'Prostitution (public pretense)',
  'Prostitution (actual)',
  'Pony slave',
  'Public exposure',
  'Pussy/cock whipping',
  'Riding the "horse" (crotch tort)',
  'Restrictive rules on',
  'behavior',
  'Rubber/latex clothing',
  'Rope body harness',
  'Saran wrap',
  'Scarification',
  'Scratching - getting',
  'Scratching - giving',
  'Serving',
  'Serving as ashtray',
  'Serving as a toilet (urine)',
  'Serving as a toilet (feces)',
  'Serving as waitress/waiter',
  'Serving orally (sexual)',
  'Serving other Doms (supervised)',
  'Serving other Doms (unsupervised)',
  'Sexual deprivation (short term)',
  'Sexual deprivation (long term)',
  'Shaving (body hair)',
  'Having (head hair)',
  'Skinny dipping',
  'Slutty clothing (private)',
  'Slutty clothing (public)',
  'Spanking',
  'Speech restrictions (when/what)',
  'Speculums (anal)',
  'Speculums (vaginal)',
  'Spitting',
  'Standing in corner',
  'Stocks',
  'Strapping (full body',
  'beating)',
  'Suspension (upright)',
  'Suspension (inverted)',
  'Supplying new partners for Dom',
  'Swallowing feces',
  'Tampon training (in ass)',
  'Tattooing',
  'TENS unit (electrical toy)',
  'Thumb cuffs (metal)',
  'Urethral Sounds (metal rods)',
  'Uniforms',
  'Including others',
  'Vaginal dildo',
  'Vibrator on genitals',
  'Violet wand (electrical toy)',
  'Water torture',
  'Waxing (hair removal)',
  'Weight gain (forced)',
  'Weight loss (forced)',
  'Whipping',
  'Wooden paddles'
];

const questionsv2 = [
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
  'Sleep sacks',
  'Chamber pot use',
  'Creampie',
  'Cum - In ass',
  'Cum - In mouth',
  'Cum - In vagina',
  'Cum - On body',
  'Cutting - Blood play',
  'Golden showers (urinate on)',
  'Human Toilet',
  'Injections (Saline)',
  'Milking (made to produce breast milk)',
  'Pearl necklace (cum on chest/throat)',
  'Pearl shower (cum on face)',
  'Rimming (oral/anal play)',
  'Scat (brown showers)',
  'Swallowing semen',
  'Swallowing urine',
  'Boot worship',
  'Cock worship',
  'Corsets',
  'Cross dressing',
  'Diapers',
  'Foot worship',
  'Gas Masks',
  'High heels (wearing)',
  'High heel worship',
  'Leather (wearing)',
  'Lingerie (wearing)',
  'Pussy worship',
  'Rubber/latex clothing (wearing)',
  'Slutty clothing',
  'Spandex clothing',
  'Forced dressing',
  'Forced feminization',
  'Forced homosexuality',
  'Forced masturbation',
  'Forced nudity',
  'Forced servitude',
  'Humiliation in private',
  'Humiliation in public',
  'Lecturing for misbehaviors',
  'Shaving head hair',
  'Shaving or depilation of body hair',
  'Standing in corner (punishment)',
  'Verbal humiliation',
  'Breast whipping',
  'Caning - English',
  'Caning - Sensation',
  'Face slapping',
  'Punching',
  'Pussy punching',
  'Pussy kicking',
  'Pussy spanking (smacking)',
  'Pussy whipping',
  'Riding crops',
  'Spanking - Hairbrush',
  'Spanking - Hand',
  'Spanking - Leather slappers',
  'Spanking - Wooden paddles',
  'Spanking - (OTK) Over The Knee',
  'Whipping - Belt',
  'Whipping - Cat o 9 tails',
  'Whipping - Flogger',
  'Whipping - Single tail',
  'Wrestling',
  'Fantasy gang rape',
  'Group play - Multiple men "gang bang"',
  'Group play - Multiple women & men',
  'Group play - Orgy',
  'Shared (given to another only temp)',
  'Swapping (with one other couple)',
  'Swinging (multiple couples)',
  'Branding',
  'Scarification (cutting, making scars)',
  'Tattooing (inking)',
  'Abandonment (fantasy)',
  'Age play (not pedophilia)',
  'Animal roleplay',
  'Auctioned for charity',
  'Fear play',
  'Human puppy-dog play',
  'Infantilism (baby play)',
  'Initiation rites',
  'Interrogations',
  'Kidnapping',
  'Medical scenes',
  'Name change',
  'Pony play',
  'Psych ward play',
  'Prison scenes',
  'Prostitution fantasy',
  'Religious scenes',
  'Schoolroom scenes',
  'Switching roles (Top/bottom)',
  'Total Power Exchange (TPE)',
  'Other roleplaying',
  'Abrasion (scraping, sanding)',
  'Asphyxiation',
  'Ball stretching',
  'Biting (being bitten)',
  'Beating hard',
  'Beating soft',
  'Breath control (Choking)',
  'Breath control (Mild restriction)',
  'Clamps - Labia/clit area',
  'Clothespins',
  'Dilation',
  'Electricity - Internal (egg or probe)',
  'Electricity - TENS unit',
  'Electricity - Violet Wand',
  'Enemas - For cleansing',
  'Enemas - Retention/training',
  'Finger claws',
  'Fire cupping',
  'Fire play',
  'Hair pulling',
  'Hot wax - Dripping on body/genitals',
  'Hot waxing - Hair removal',
  'Ice cubes',
  'Kicking',
  'Knife play (blood drawn)',
  'Knife play (no blood)(sensation)',
  'Needle play',
  'Nipple clamps',
  'Nipple piercing',
  'Nipple play - Pulls, Tugs, Twists',
  'Pain - Mild',
  'Pain - Severe',
  'Piercing (permanant)',
  'Piercing (temporary)',
  'Punishment scene',
  'Riding the horse (crotch torture)',
  'Scratching',
  'Sensory deprivation',
  'Sleep deprivation',
  'Strapping (full body beating)',
  'Suction cups',
  'Teasing',
  'Tickling',
  'Vampire gloves',
  'Water torture (waterboarding)',
  'Wartenburg pinwheel',
  'Zippers - Clothespins',
  'Zippers - Clamps',
  'Zippers - Needles',
  'Bathroom use control (permission)',
  'Begging',
  'Chauffeuring (driving)',
  'Chores (domestic service/housework)',
  'Chosen clothing for',
  'Chosen food for',
  'Contract slave',
  'Daily diary',
  'Exercise - Forced/required',
  'Erotic dancing',
  'Eye contact restrictions',
  'Following orders',
  'Gor Slave Training (positions)',
  'Harems (serving with other subs)',
  'Hypnotism',
  'Kneeling',
  'Manicures',
  'Mantra and meditation',
  'Massage',
  'Pedicures & foot massages',
  'Personality modification',
  'Phone sex',
  'Rituals',
  'Serving as a maid',
  'Serving as furniture',
  'Serving as art',
  'Serving other Doms (supervised only)',
  'Speech restrictions (when, what, to whom)',
  'Uniform (wearing)',
  'Wearing symbolic jewelry',
  'Weight control',
  'Anal beads',
  'Anal play',
  'Anal plugs - Small',
  'Anal plugs - Medium',
  'Anal plugs - Large',
  'Anal plugs - Public, under clothes',
  'Anal sex',
  'Bestiality (sex with animals)',
  'Breast fucking',
  'Catheterization',
  'Cunnilingus (giving oral to a woman)',
  'Cunnilingus (receiving oral)',
  'Dildos - Anal',
  'Dildos - Oral',
  'Dildos - Vaginal',
  'Double penetration',
  'Fantasy rape play',
  'Fisting - Vaginal',
  'Genital sex',
  'Masturbation',
  'Orgasm control',
  'Orgasm denial',
  'Sounding',
  'Speculums',
  'Strap-on-dildos (sucking on)',
  'Strap-on-dildos (penetrated by)',
  'Strap-on-dildos (wearing)',
  'Triple penetration',
  'Vibrator - Anal',
  'Vibrator - External genital',
  'Vibrator - Internal genital',
  'Examinations',
  'Exhibitionism (friends)',
  'Forced nudity (private)',
  'Forced nudity (around others)',
  'Modeling for erotic photos',
  'Outdoor scenes',
  'Video (watching others)',
  'Video (recordings of you)',
  'Voyeurism (watching others)',
  'Abrasion',
  'Age Play',
  'Anal Plugs (small)',
  'Anal Plugs (large)',
  'Aromas',
  'Bathroom use control',
  'Beating (soft)',
  'Beating (hard)',
  'Blindfolding',
  'Breath control',
  'Bondage (light)',
  'Bondage (multi-day)',
  'Brown showers (scat)',
  'Castration fantasy',
  'Cattle prod (electrical toy)',
  'Cells/Closets (locked inside of)',
  'Choking',
  'Cock rings/straps',
  'Collars (worn in private)',
  'Corsets (wearing casually)',
  'Corsets (trained waist reduction)',
  'Cuffs (metal)',
  'Diapers (wearing)',
  'Dildos',
  'Enforced chastity',
  'Erotic Dance (for audience)',
  'Exercise (forced/required)',
  'Fisting (vaginal)',
  'Forced bedwetting',
  'Forced eating',
  'Forced smoking',
  'Full head hoods',
  'Gags (cloth)',
  'Gags (inflatable)',
  'Gags (phallic)',
  'Gags (tape)',
  'Gates of Hell (male)',
  'Gun play',
  'Hair brush spankings',
  'Hand Jobs (receiving)',
  'Harems (serving w/other subs)',
  'Harnessing (leather)',
  'Harnessing (rope)',
  'Having clothing chosen for you',
  'Head (give fellatio/cunnilingus)',
  'Head (rcv fellation/cunnilingus)',
  'Injections',
  'Intricate (Japanese)',
  'Knife play',
  'Leather Clothing',
  'Lectures for misbehavior',
  'Licking (non-sexual)',
  'Manacles and Irons',
  'Massage (receiving)',
  'Oral/anal play (rimming)',
  'Pain (mild)',
  'Persona training (in scene)',
  'Phone sex (serving Dom’s friends)',
  'Piercing (temporary, play-pierce)',
  'Plastic surgery',
  'Prostitution (public pretense)',
  'Prostitution (actual)',
  'Public exposure',
  'Restrictive rules on',
  'behavior',
  'Rubber/latex clothing',
  'Rope body harness',
  'Saran wrap',
  'Scratching - getting',
  'Serving as a toilet (feces)',
  'Shaving (body hair)',
  'Slutty clothing (public)',
  'Spanking',
  'Speculums (anal)',
  'Speculums (vaginal)',
  'Spitting',
  'Standing in corner',
  'Stocks',
  'Strapping (full body',
  'beating)',
  'Suspension (upright)',
  'Suspension (inverted)',
  'Supplying new partners for Dom',
  'Swallowing feces',
  'Tampon training (in ass)',
  'Tattooing',
  'TENS unit (electrical toy)',
  'Thumb cuffs (metal)',
  'Urethral Sounds (metal rods)',
  'Uniforms',
  'Including others',
  'Vaginal dildo',
  'Vibrator on genitals',
  'Violet wand (electrical toy)',
  'Water torture',
  'Waxing (hair removal)',
  'Weight gain (forced)',
  'Weight loss (forced)',
  'Whipping',
  'Wooden paddles'
]

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

  const activeQuestions = useMemo(() => {
    if (qversion === "2.0") {
      return questionsv2;
    }

    if (qversion === "1.0") {
      return questions;
    }

    // No explicit version set
    if (hasSharedData) {
      // Shared URLs without version are assumed legacy
      return questions;
    }

    // New questionnaires default to v2
    return questionsv2;
  }, [qversion, hasSharedData]);

  const defaultAnswers = useMemo(() => {
    const initial = {};

    activeQuestions.forEach((q, i) => {
      initial[`q${i}`] = 3;
    });

    return initial;
  }, [activeQuestions]);

  const [qversion, setVersion] = useState({});
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

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

      return;
    }

    // Brand new questionnaire
    setVersion(STORAGE_VERSION);
    setAnswers(defaultAnswers);
  }, []);

  // When question set changes and answers are empty,
  // initialize defaults for that version.
  useEffect(() => {
    if (Object.keys(answers).length === 0) {
      setAnswers(defaultAnswers);
    }
  }, [defaultAnswers]);

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
          <p className="text-slate-600 text-sm md:text-base">
            Rate each item from 1 (Hard Limit) to 5 (very interested)
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
              {activeQuestions.map((question, index) => {
                const key = `q${index}`;

                return (
                  <div
                    key={key}
                    className="space-y-3 border-b border-slate-200 pb-5"
                  >
                    <div className="flex justify-between gap-4 items-center">
                      <h2 className="text-sm md:text-base font-medium leading-snug text-black" style={{ color: "#000000" }}>
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
