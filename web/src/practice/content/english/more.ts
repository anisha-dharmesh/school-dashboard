// More English grammar, modelled on the question styles in the MTG Olympiad
// Prep-Guide (Class 2): object pronouns, this/that/these/those, verb
// agreement, helping verbs with time cues, modals, the/no-article rules,
// adjectives and degrees of comparison. Unlike a name swap, each generator
// varies the sentence frame, the word class and which answer is right.
import type { Exercise } from "../../types";
import { mcq, pick, pickN, slots, sortQuiz } from "../../grammar";

const N = 10;
const BOYS = ["Ravi", "Aman", "Rohan", "Arjun", "Karan", "Sam", "Kabir", "Dev"];
const GIRLS = ["Meena", "Tina", "Riya", "Sita", "Priya", "Neha", "Isha", "Tara"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ------------------------------------------------------------ Pronouns

interface Who {
  text: string;
  subj: string;
  obj: string;
  plural: boolean;
  thing: boolean;
  why: string;
}

function who(): Who {
  switch (pick(["boy", "girl", "pair", "group", "thing", "things"] as const)) {
    case "boy":
      return { text: pick([...BOYS, "my brother", "my uncle", "the boy", "Mr. Sharma"]), subj: "He", obj: "him", plural: false, thing: false, why: "one boy or man" };
    case "girl":
      return { text: pick([...GIRLS, "my sister", "the girl", "Mrs. Khanna", "my aunt"]), subj: "She", obj: "her", plural: false, thing: false, why: "one girl or woman" };
    case "pair":
      return { text: `${pick(BOYS)} and ${pick(GIRLS)}`, subj: "They", obj: "them", plural: true, thing: false, why: "more than one person" };
    case "group":
      return { text: pick(["the boys", "the girls", "my friends", "the children"]), subj: "They", obj: "them", plural: true, thing: false, why: "more than one person" };
    case "thing":
      return { text: pick(["the kite", "my pencil box", "the umbrella", "the toy car", "the mug", "the balloon"]), subj: "It", obj: "it", plural: false, thing: true, why: "one thing" };
    default:
      return { text: pick(["the books", "the toys", "the pencils", "the kites", "the apples"]), subj: "They", obj: "them", plural: true, thing: true, why: "more than one thing" };
  }
}

const PERSON_SUBJECT: ((pl: boolean) => string)[] = [
  (pl) => `${pl ? "are" : "is"} playing in the garden`,
  (pl) => `${pl ? "were" : "was"} late for school`,
  () => "won the race",
  (pl) => (pl ? "like ice cream" : "likes ice cream"),
  () => "went to the market",
];
const THING_SUBJECT: ((pl: boolean) => string)[] = [
  (pl) => `${pl ? "are" : "is"} on the table`,
  (pl) => `${pl ? "were" : "was"} very heavy`,
  () => "fell down",
  (pl) => (pl ? "look" : "looks") + " new",
];
const PERSON_OBJECT = [
  (w: string) => `Everyone clapped for ${w}.`,
  (w: string) => `I called ${w} yesterday.`,
  (w: string) => `The teacher praised ${w}.`,
  (w: string) => `Please help ${w} cross the road.`,
  (w: string) => `Dad took a photo of ${w}.`,
];
const THING_OBJECT = [
  (w: string) => `Did you see ${w}?`,
  (w: string) => `Please bring ${w} to me.`,
  (w: string) => `I put ${w} on the shelf.`,
  (w: string) => `Dad fixed ${w} yesterday.`,
];

const SUBJECT_PRONOUNS = ["He", "She", "It", "They", "We"];
const OBJECT_PRONOUNS = ["him", "her", "it", "them", "us"];

function subjectPronoun(id: string) {
  return mcq(id, () => {
    const w = who();
    const sentence = `${cap(w.text).toUpperCase()} ${pick(w.thing ? THING_SUBJECT : PERSON_SUBJECT)(w.plural)}.`;
    return {
      instruction: "Choose the pronoun that can replace the words in CAPITALS",
      prompt: sentence,
      correct: w.subj,
      wrong: pickN(SUBJECT_PRONOUNS, 3, [w.subj]),
      solution: [`'${cap(w.text)}' means ${w.why}, so we use '${w.subj.toLowerCase()}'.`],
    };
  });
}

function objectPronoun(id: string) {
  return mcq(id, () => {
    const w = who();
    const sentence = pick(w.thing ? THING_OBJECT : PERSON_OBJECT)(w.text.toUpperCase());
    return {
      instruction: "Choose the pronoun that can replace the words in CAPITALS",
      prompt: sentence,
      correct: w.obj,
      wrong: pickN(OBJECT_PRONOUNS, 3, [w.obj]),
      solution: [
        `'${w.text}' means ${w.why}.`,
        `The words come after the action word, so we use '${w.obj}' (not '${w.subj.toLowerCase()}').`,
      ],
    };
  });
}

const NEAR_THINGS: readonly (readonly [string, string])[] = [
  ["book", "books"], ["pen", "pens"], ["apple", "apples"], ["bag", "bags"], ["parrot", "parrots"],
  ["chair", "chairs"], ["flower", "flowers"], ["toy", "toys"], ["cousin", "cousins"], ["friend", "friends"],
];
const NEAR_PLACES = ["in my hand", "on my desk", "right here"];
const FAR_PLACES = ["over there", "across the room", "far away"];

function thisThat(id: string) {
  return mcq(id, () => {
    const [one, many] = pick(NEAR_THINGS);
    const plural = Math.random() < 0.5;
    const near = Math.random() < 0.5;
    const correct = near ? (plural ? "These" : "This") : plural ? "Those" : "That";
    return {
      instruction: "Choose this, that, these or those",
      prompt: `___ ${plural ? many : one} ${pick(near ? NEAR_PLACES : FAR_PLACES)} ${plural ? "are" : "is"} mine.`,
      correct,
      options: ["This", "That", "These", "Those"],
      solution: [
        `The ${plural ? "things are more than one" : "thing is just one"} and ${near ? "near" : "far"}, so we use '${correct.toLowerCase()}'.`,
        "This and that are for one; these and those are for many. This and these are near; that and those are far.",
      ],
    };
  });
}

export const pronounExercises: Exercise[] = [
  { id: "replace-subject", title: "Replace the noun (he, she, it, they)", description: "Who is doing the action", questions: slots(N, subjectPronoun) },
  { id: "replace-object", title: "him, her, it, them", description: "Who the action is done to", questions: slots(N, objectPronoun) },
  { id: "this-that", title: "this, that, these, those", description: "Near or far, one or many", questions: slots(N, thisThat) },
];

// --------------------------------------------------------------- Verbs

type Entry = readonly [text: string, plural: boolean];
const AGREE_SUBJECTS: Entry[] = [
  ["I", true], ["You", true], ["We", true], ["They", true], ["He", false], ["She", false], ["It", false],
  ["Bunty", false], ["My mother", false], ["The boy", false], ["The farmers", true], ["The athletes", true],
  ["The kids", true], ["Rohan and Meena", true], ["The teacher", false],
];
const ACTIONS: readonly (readonly [base: string, s: string, ing: string, rest: string])[] = [
  ["read", "reads", "reading", "an English book every day"],
  ["play", "plays", "playing", "cricket in the park"],
  ["write", "writes", "writing", "neatly in the notebook"],
  ["help", "helps", "helping", "the old lady"],
  ["run", "runs", "running", "on the track"],
  ["wash", "washes", "washing", "the dishes after dinner"],
  ["carry", "carries", "carrying", "the heavy bags"],
  ["watch", "watches", "watching", "cartoons in the evening"],
  ["brush", "brushes", "brushing", "the teeth twice a day"],
  ["work", "works", "working", "hard in the fields"],
];

function agree(id: string) {
  return mcq(id, () => {
    const [subject, plural] = pick(AGREE_SUBJECTS);
    const [base, s, ing, rest] = pick(ACTIONS);
    return {
      instruction: "Choose the correct verb",
      prompt: `${subject} ___ ${rest}.`,
      correct: plural ? base : s,
      wrong: [plural ? s : base, ing, `${plural ? "is" : "are"} ${base}`],
      solution: plural
        ? [`'${subject}' is I, you, we, they or more than one, so the verb has no -s: '${base}'.`]
        : [`'${subject}' is one person or thing, so the verb takes -s or -es: '${s}'.`],
    };
  });
}

const BE_SUBJECTS: readonly (readonly [text: string, present: string, past: string])[] = [
  ["I", "am", "was"], ["He", "is", "was"], ["She", "is", "was"], ["It", "is", "was"], ["We", "are", "were"],
  ["You", "are", "were"], ["They", "are", "were"], ["Sumit", "is", "was"], ["My sister", "is", "was"],
  ["The kids", "are", "were"], ["Jaya and Sumit", "are", "were"], ["The farmers", "are", "were"],
];
const DOING = ["waiting for the bus", "flying kites", "playing in the park", "celebrating our victory", "coming for the party", "reading a story", "banging at the door"];
const BE_WORDS = ["am", "is", "are", "was", "were"];

function beWithTime(id: string) {
  return mcq(id, () => {
    const [subject, present, past] = pick(BE_SUBJECTS);
    const now = Math.random() < 0.5;
    const cue = now ? pick(["now", "right now"]) : pick(["yesterday", "last night"]);
    const correct = now ? present : past;
    return {
      instruction: "Choose am, is, are, was or were",
      prompt: `${subject} ___ ${pick(DOING)} ${cue}.`,
      correct,
      wrong: pickN(BE_WORDS, 3, [correct]),
      solution: [
        `'${cue}' tells us the action is ${now ? "happening at this time, so use am, is or are" : "over, so use was or were"}.`,
        `With '${subject}' we say '${correct}'.`,
      ],
    };
  });
}

const SOUNDS: readonly (readonly [animal: string, does: string])[] = [
  ["cat", "purrs"], ["dog", "barks"], ["lion", "roars"], ["cow", "moos"], ["horse", "neighs"],
  ["duck", "quacks"], ["frog", "croaks"], ["bee", "buzzes"], ["snake", "hisses"], ["crow", "caws"],
];

function animalAction(id: string) {
  return mcq(id, () => {
    const [animal, does] = pick(SOUNDS);
    return {
      instruction: "Choose the correct action word",
      prompt: `A ${animal} ___.`,
      correct: does,
      wrong: pickN(SOUNDS.map((s) => s[1]), 3, [does]),
      solution: [`A ${animal} ${does}. The action word ends in -s because there is one ${animal}.`],
    };
  });
}

const VERBS = ["run", "jump", "sleep", "eat", "write", "swim", "climb", "sing", "dance", "throw", "draw", "cook", "pay", "shave", "guide"];
const NOT_VERBS = ["nearby", "daily", "hence", "much", "late", "red", "great", "only", "kind", "soft", "happy", "quickly", "tall", "away", "never", "boldly"];

function whichIsVerb(id: string) {
  return mcq(id, () => {
    const verb = pick(VERBS);
    return {
      instruction: "Choose the option which is a verb",
      prompt: "Which word is a verb (an action word)?",
      correct: verb,
      wrong: pickN(NOT_VERBS, 3),
      solution: [`'${verb}' tells what someone does, so it is a verb. The other words describe or tell us more; they do not show an action.`],
    };
  });
}

const MODALS: readonly (readonly [prompt: string, answer: string, why: string])[] = [
  ["You ___ follow the traffic rules.", "should", "'should' tells us what is right to do."],
  ["We ___ respect our elders.", "should", "'should' tells us what is right to do."],
  ["___ I come in, please?", "May", "'May' is used to ask for permission."],
  ["___ you pass the salt, please?", "Could", "'Could' is used to ask politely."],
  ["It ___ rain this evening, so take an umbrella.", "may", "'may' shows something is possible."],
  ["You ___ brush your teeth twice a day.", "should", "'should' tells us what is right to do."],
];

function modal(id: string) {
  return mcq(id, () => {
    const [prompt, answer, why] = pick(MODALS);
    const caps = prompt.startsWith("___");
    const bes = caps ? ["Is", "Was", "Are", "Am"] : ["is", "was", "are", "am"];
    return {
      instruction: "Choose the correct helping word",
      prompt,
      correct: answer,
      wrong: pickN(bes, 3),
      solution: [why, "Words like should, may and could are used before an action word."],
    };
  });
}

export const verbExercises: Exercise[] = [
  { id: "agreement", title: "Choose the right verb form", description: "play or plays? Match the verb to who does it", questions: slots(N, agree) },
  { id: "now-or-then", title: "Now or yesterday?", description: "am/is/are or was/were from the time word", questions: slots(N, beWithTime) },
  { id: "animal-action", title: "What does the animal do?", description: "purrs, barks, roars ...", questions: slots(N, animalAction) },
  { id: "which-verb", title: "Which word is a verb?", description: "Spot the action word among other words", questions: slots(N, whichIsVerb) },
  { id: "modals", title: "should, may, could", description: "Helping words", questions: slots(N, modal) },
];

// ------------------------------------------------------------ Articles

// [word, article, note]: the article depends on the SOUND, not the letter.
const SOUND_NOUNS: readonly (readonly [string, string, string?])[] = [
  ["umbrella", "an"], ["egg", "an"], ["orange", "an"], ["ostrich", "an"], ["ice cream", "an"], ["onion", "an"],
  ["unicorn", "a", "starts with the consonant sound 'yoo'"], ["university", "a", "starts with the consonant sound 'yoo'"],
  ["uniform", "a", "starts with the consonant sound 'yoo'"], ["European", "a", "starts with the consonant sound 'yoo'"],
  ["user", "a", "starts with the consonant sound 'yoo'"], ["hour", "an", "has a silent 'h', so it starts with a vowel sound"],
  ["heir", "an", "has a silent 'h', so it starts with a vowel sound"], ["horse", "a"], ["bungalow", "a"], ["laptop", "a"],
  ["hospital", "a"], ["tomato", "a"],
];
const ADJECTIVES: readonly (readonly [string, string, string?])[] = [
  ["red", "a"], ["small", "a"], ["old", "an"], ["interesting", "an"], ["excellent", "an"], ["big", "a"],
  ["honest", "an", "has a silent 'h', so it starts with a vowel sound"], ["useful", "a", "starts with the consonant sound 'yoo'"],
];
const CONCRETE = ["book", "bag", "kite", "umbrella", "egg", "apple", "elephant", "laptop", "bungalow", "tomato"];
const FRAMES = [
  (p: string) => `I need ___ ${p}.`,
  (p: string) => `There is ___ ${p} near my school.`,
  (p: string) => `My uncle owns ___ ${p}.`,
  (p: string) => `She saw ___ ${p} in the shop.`,
  (p: string) => `My brother bought ___ ${p} for me.`,
];
const ARTICLES = ["a", "an", "the", "no article"];

function soundArticle(id: string) {
  return mcq(id, () => {
    let first: string;
    let article: string;
    let note: string | undefined;
    let phrase: string;
    if (Math.random() < 0.5) {
      [first, article, note] = pick(SOUND_NOUNS);
      phrase = first;
    } else {
      [first, article, note] = pick(ADJECTIVES);
      phrase = `${first} ${pick(CONCRETE)}`;
    }
    const sound = note ?? (article === "an" ? "starts with a vowel sound" : "starts with a consonant sound");
    return {
      instruction: "Choose the correct article",
      prompt: pick(FRAMES)(phrase),
      correct: article,
      options: ARTICLES,
      solution: [`'${first}' ${sound}.`, `So we use '${article}'. (We go by the sound, not the spelling.)`],
    };
  });
}

interface TheSet {
  rule: string;
  items: readonly string[];
  frames: readonly ((x: string) => string)[];
}
const THE_SETS: TheSet[] = [
  { rule: "names of rivers", items: ["Ganges", "Yamuna", "Nile", "Godavari"], frames: [(x) => `We saw boats on ___ ${x}.`, (x) => `___ ${x} is a long river.`] },
  { rule: "names of mountain ranges", items: ["Himalayas", "Alps", "Andes", "Rockies"], frames: [(x) => `Have you ever seen ___ ${x}?`, (x) => `___ ${x} have snow on top.`] },
  { rule: "names of famous buildings", items: ["Taj Mahal", "Red Fort", "Qutub Minar", "Gateway of India"], frames: [(x) => `We visited ___ ${x} in the holidays.`, (x) => `___ ${x} is very old.`] },
  { rule: "names of newspapers", items: ["Tribune", "Hindu", "New York Times", "Times of India"], frames: [(x) => `My father reads ___ ${x} every morning.`] },
  { rule: "names of religious books", items: ["Quran", "Bible", "Ramayana", "Mahabharata"], frames: [(x) => `My grandmother reads ___ ${x} daily.`] },
  { rule: "things that are the only one of their kind", items: ["sun", "moon", "sky", "earth"], frames: [(x) => `___ ${x} looks beautiful today.`, (x) => `Look at ___ ${x}!`] },
];

const NAMES_NONE = ["Rajshree", ...BOYS, ...GIRLS];
const LANGUAGES = ["English", "Hindi", "Marathi", "Gujarati", "Tamil"];
const ABSTRACT = ["honesty", "bravery", "kindness", "love", "happiness", "friendship"];
const CITIES = ["Shimla", "Delhi", "Mumbai", "Pune", "Jaipur"];

function startsBlank(prompt: string, options: readonly string[]) {
  return prompt.startsWith("___") ? options.map(cap) : [...options];
}

function theArticle(id: string) {
  return mcq(id, () => {
    const set = pick(THE_SETS);
    const x = pick(set.items);
    const prompt = pick(set.frames)(x);
    const options = startsBlank(prompt, ARTICLES);
    return {
      instruction: "Choose the correct article",
      prompt,
      correct: options[2],
      options,
      solution: [`We use 'the' before ${set.rule}.`, `So: ${prompt.replace("___", options[2])}`],
    };
  });
}

function noArticle(id: string) {
  return mcq(id, () => {
    const kind = pick(["name", "language", "abstract", "city"] as const);
    let prompt: string;
    let rule: string;
    if (kind === "name") {
      prompt = `___ ${pick(NAMES_NONE)} is my best friend.`;
      rule = "We do not use an article before the name of a person.";
    } else if (kind === "language") {
      prompt = `She speaks ___ ${pick(LANGUAGES)} very well.`;
      rule = "We do not use an article before the name of a language.";
    } else if (kind === "abstract") {
      prompt = `___ ${pick(ABSTRACT)} is a good quality.`;
      rule = "We do not use an article before a feeling or quality (an abstract noun).";
    } else {
      prompt = `Have you ever been to ___ ${pick(CITIES)}?`;
      rule = "We do not use an article before the name of a city.";
    }
    const options = startsBlank(prompt, ARTICLES);
    return {
      instruction: "Choose the correct article",
      prompt,
      correct: options[3],
      options,
      solution: [rule, "So the blank stays empty: no article."],
    };
  });
}

function correctSentence(id: string) {
  return mcq(id, () => {
    const nouns = pickN(SOUND_NOUNS, 4);
    const sentence = (noun: readonly [string, string, string?], right: boolean) => {
      const art = right ? noun[1] : noun[1] === "a" ? "an" : "a";
      return `I saw ${art} ${noun[0]}.`;
    };
    const [good, ...bad] = nouns;
    return {
      instruction: "Choose the sentence that uses the article correctly",
      prompt: "Which sentence is correct?",
      correct: sentence(good, true),
      wrong: bad.map((n) => sentence(n, false)),
      solution: [`'${good[0]}' ${good[2] ?? (good[1] === "an" ? "starts with a vowel sound" : "starts with a consonant sound")}, so we say '${good[1]} ${good[0]}'.`],
    };
  });
}

export const articleExercises: Exercise[] = [
  { id: "sound", title: "a or an by sound", description: "unicorn, hour, honest, umbrella ...", questions: slots(N, soundArticle) },
  { id: "the-rules", title: "Where we use 'the'", description: "Rivers, mountains, buildings, newspapers, holy books", questions: slots(N, theArticle) },
  { id: "no-article", title: "No article", description: "Names, languages, feelings, cities", questions: slots(N, noArticle) },
  { id: "correct-sentence", title: "Which sentence is correct?", description: "Spot the right article", questions: slots(N, correctSentence) },
];

// ----------------------------------------------------------- Adjectives

const WORD_CLASSES = {
  Noun: ["girl", "box", "rope", "baby", "officer", "rose", "ribbon", "tree", "mango", "pillow"],
  Verb: ["run", "jump", "sleep", "eat", "write", "swim", "sing", "throw"],
  Adjective: ["happy", "heavy", "long", "cute", "honest", "red", "blue", "tall", "sweet", "soft", "brave"],
};

const DESCRIBED: readonly (readonly [adj: string, noun: string])[] = [
  ["happy", "girl"], ["heavy", "box"], ["long", "rope"], ["cute", "baby"], ["kind", "officer"], ["red", "rose"],
  ["blue", "ribbon"], ["tall", "tree"], ["sweet", "mango"], ["soft", "pillow"], ["brave", "soldier"], ["tiny", "mouse"],
];
const FIND_FRAMES = [
  (n: string, a: string, o: string) => `${n} saw a ${a} ${o}.`,
  (n: string, a: string, o: string) => `${n} has a ${a} ${o}.`,
  (n: string, a: string, o: string) => `${n} found a ${a} ${o} in the garden.`,
  (n: string, a: string, o: string) => `There is a ${a} ${o} near ${n}.`,
];
const VERB_WORDS = ["saw", "has", "found", "is"];

function findAdjective(id: string) {
  return mcq(id, () => {
    const [adj, noun] = pick(DESCRIBED);
    const name = pick([...BOYS, ...GIRLS]);
    const frame = pick(FIND_FRAMES);
    const sentence = frame(name, adj, noun);
    const verb = VERB_WORDS.find((v) => sentence.includes(` ${v} `)) ?? "saw";
    return {
      instruction: "Pick the adjective (describing word)",
      prompt: sentence,
      correct: adj,
      wrong: [noun, verb, name],
      solution: [`'${adj}' tells us what kind of ${noun} it is, so it is an adjective.`, `'${noun}' is a noun and '${name}' is a name.`],
    };
  });
}

// [positive, comparative, superlative, how] where "long" words use more/most.
const DEGREES: readonly (readonly [string, string, string, "short" | "long" | "irregular"])[] = [
  ["tall", "taller", "tallest", "short"], ["short", "shorter", "shortest", "short"], ["strong", "stronger", "strongest", "short"],
  ["fast", "faster", "fastest", "short"], ["slow", "slower", "slowest", "short"], ["young", "younger", "youngest", "short"],
  ["old", "older", "oldest", "short"], ["kind", "kinder", "kindest", "short"], ["clever", "cleverer", "cleverest", "short"],
  ["brave", "braver", "bravest", "short"], ["happy", "happier", "happiest", "short"], ["heavy", "heavier", "heaviest", "short"],
  ["intelligent", "more intelligent", "most intelligent", "long"], ["careful", "more careful", "most careful", "long"],
  ["good", "better", "best", "irregular"],
];

function degreeFill(id: string) {
  return mcq(id, () => {
    const [pos, comp, sup, how] = pick(DEGREES);
    const [a, b] = pickN([...BOYS, ...GIRLS], 2);
    const superlative = Math.random() < 0.5;
    const correct = superlative ? sup : comp;
    const wrongForm = how === "long" ? `${pos}er` : `more ${pos}`;
    return {
      instruction: superlative ? "Choose the adjective for the most (three or more)" : "Choose the adjective to compare two",
      prompt: superlative ? `${a} is the ___ in the class.` : `${a} is ___ than ${b}.`,
      correct,
      wrong: [pos, superlative ? comp : sup, wrongForm],
      solution: superlative
        ? [`We compare more than two, so we use the superlative with 'the': '${sup}'.`]
        : [`We compare two people, so we use the comparative with 'than': '${comp}'.`],
    };
  });
}

function nameDegree(id: string) {
  return mcq(id, () => {
    const [pos, comp, sup] = pick(DEGREES);
    const [a, b] = pickN([...BOYS, ...GIRLS], 2);
    const which = pick([0, 1, 2] as const);
    const prompt = [`${a} is ${pos}.`, `${a} is ${comp} than ${b}.`, `${a} is the ${sup} in the class.`][which];
    const answer = ["Positive", "Comparative", "Superlative"][which];
    return {
      instruction: "Which degree of the adjective is used?",
      prompt,
      correct: answer,
      options: ["Positive", "Comparative", "Superlative"],
      solution: [
        ["Only one person is described, with no comparison: positive degree.", "Two people are compared: comparative degree (-er / more, followed by 'than').", "Three or more are compared: superlative degree (-est / most, with 'the')."][which],
      ],
    };
  });
}

export const adjectiveExercises: Exercise[] = [
  { id: "find-adjective", title: "Find the adjective", description: "The describing word in a sentence", questions: slots(N, findAdjective) },
  {
    id: "word-class",
    title: "Noun, verb or adjective?",
    description: "Sort a word into its kind",
    questions: slots(N, (id) =>
      sortQuiz(id, WORD_CLASSES, {
        instruction: "What kind of word is it?",
        ask: (w) => `'${w}' is a ...`,
        why: (w, label) => [`'${w}' is ${label === "Adjective" ? "an" : "a"} ${label.toLowerCase()}.`],
      }),
    ),
  },
  { id: "degrees-fill", title: "Compare with -er and -est", description: "taller, tallest, more careful", questions: slots(N, degreeFill) },
  { id: "name-degree", title: "Name the degree", description: "Positive, comparative or superlative", questions: slots(N, nameDegree) },
];
