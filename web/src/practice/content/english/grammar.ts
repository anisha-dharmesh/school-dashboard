// English grammar for Class 3: nouns, pronouns, articles, verbs, opposites.
// Every question is generated from the small word banks below, so words and
// sentences change each time while the level stays the one taught in class.
import type { Chapter } from "../../types";
import { findQuiz, mcq, oddQuiz, pairQuiz, pick, pickN, pluralQuiz, slots, sortQuiz, type Pair } from "../../grammar";

const N = 10;

const BOYS = ["Ravi", "Aman", "Rohan", "Arjun", "Karan", "Sam"];
const GIRLS = ["Meena", "Tina", "Riya", "Sita", "Priya", "Neha"];
const ANIMALS = ["dog", "cat", "cow", "horse", "parrot", "rabbit"];

// ---------------------------------------------------------------- Nouns

const COMMON_PROPER = {
  "Common noun": ["boy", "girl", "city", "dog", "river", "teacher", "school", "pencil", "mountain", "country", "doctor", "garden"],
  "Proper noun": ["Delhi", "Aman", "Ganga", "India", "Tommy", "Mumbai", "Meena", "Himalayas", "Pune", "Sita"],
};

const PLURALS: Pair[] = [
  ["cat", "cats"], ["dog", "dogs"], ["book", "books"], ["pen", "pens"], ["toy", "toys"],
  ["box", "boxes"], ["bus", "buses"], ["dish", "dishes"], ["watch", "watches"],
  ["baby", "babies"], ["city", "cities"], ["fly", "flies"],
  ["child", "children"], ["man", "men"], ["woman", "women"], ["foot", "feet"], ["tooth", "teeth"], ["mouse", "mice"],
  ["leaf", "leaves"], ["wolf", "wolves"], ["knife", "knives"], ["shelf", "shelves"],
];

const MALE_FEMALE: Pair[] = [
  ["boy", "girl"], ["man", "woman"], ["king", "queen"], ["father", "mother"], ["brother", "sister"], ["uncle", "aunt"],
  ["prince", "princess"], ["son", "daughter"], ["grandfather", "grandmother"], ["bull", "cow"], ["cock", "hen"],
  ["horse", "mare"], ["peacock", "peahen"], ["lion", "lioness"], ["tiger", "tigress"], ["actor", "actress"],
  ["waiter", "waitress"], ["nephew", "niece"], ["husband", "wife"],
];

const nouns: Chapter = {
  id: "nouns",
  number: 1,
  title: "Nouns",
  source: "English grammar, Class 3",
  exercises: [
    {
      id: "common-proper",
      title: "Common or proper noun",
      description: "Names of people, places and things",
      questions: slots(N, (id) =>
        sortQuiz(id, COMMON_PROPER, {
          instruction: "Is it a common noun or a proper noun?",
          ask: (w) => `${w}`,
          why: (w, label) =>
            label === "Proper noun"
              ? [`'${w}' is the name of one particular person, place or thing, so it is a proper noun.`, "A proper noun always begins with a capital letter."]
              : [`'${w}' is a general name for every person, place or thing of that kind, so it is a common noun.`],
        }),
      ),
    },
    {
      id: "plurals",
      title: "Singular and plural",
      description: "One and many, including words like child → children",
      questions: slots(N, (id) =>
        pluralQuiz(id, PLURALS, {
          instruction: "Choose the plural",
          ask: (sg) => `One ${sg} but many ___.`,
          why: (sg, pl) => [`The plural of '${sg}' is '${pl}'.`],
        }),
      ),
    },
    {
      id: "male-female",
      title: "Male and female",
      description: "Pairs like king and queen",
      questions: slots(N, (id) =>
        pairQuiz(id, MALE_FEMALE, {
          instruction: "Choose the right word",
          ask: (from, side) => (side === 0 ? `What is the female of '${from}'?` : `What is the male of '${from}'?`),
          why: (a, b, side) => [side === 0 ? `The female of '${a}' is '${b}'.` : `The male of '${a}' is '${b}'.`],
        }),
      ),
    },
  ],
};

// ------------------------------------------------------------ Pronouns

type Phrase = readonly [singular: string, plural: string];
const PERSON_DOES: Phrase[] = [
  ["plays in the park", "play in the park"],
  ["reads a book", "read a book"],
  ["sings a song", "sing a song"],
  ["draws a picture", "draw a picture"],
  ["walks to school", "walk to school"],
  ["drinks milk", "drink milk"],
  ["helps mother", "help mother"],
];
const ANIMAL_DOES: Phrase[] = [
  ["runs fast", "run fast"],
  ["jumps high", "jump high"],
  ["drinks water", "drink water"],
  ["sleeps a lot", "sleep a lot"],
];
const PRONOUN_OPTIONS = ["He", "She", "It", "They", "We"];

function pronounFill(id: string) {
  return mcq(id, () => {
    const kind = pick(["boy", "girl", "animal", "group", "we"] as const);
    let subject: string;
    let pronoun: string;
    let why: string;
    if (kind === "boy") {
      subject = pick(BOYS);
      pronoun = "He";
      why = `'${subject}' is one boy, so we say 'he'.`;
    } else if (kind === "girl") {
      subject = pick(GIRLS);
      pronoun = "She";
      why = `'${subject}' is one girl, so we say 'she'.`;
    } else if (kind === "animal") {
      subject = `The ${pick(ANIMALS)}`;
      pronoun = "It";
      why = `${subject} is one animal, so we say 'it'.`;
    } else if (kind === "group") {
      subject = pick([`${pick(BOYS)} and ${pick(GIRLS)}`, "The boys", "The girls", `The ${pick(ANIMALS)}s`]);
      pronoun = "They";
      why = `${subject} is more than one, so we say 'they'.`;
    } else {
      subject = `${pick(GIRLS)} and I`;
      pronoun = "We";
      why = `'${subject}' includes me, so we say 'we'.`;
    }
    const plural = pronoun === "They" || pronoun === "We";
    const [a, b] = pickN(kind === "animal" ? ANIMAL_DOES : PERSON_DOES, 2);
    const i = plural ? 1 : 0;
    return {
      instruction: "Choose the pronoun that takes the place of the name",
      prompt: `${subject} ${a[i]}. ___ also ${b[i]}.`,
      correct: pronoun,
      wrong: pickN(PRONOUN_OPTIONS, 2, [pronoun]),
      solution: [why],
    };
  });
}

const VERB_OBJECT: readonly (readonly [base: string, s: string, object: string])[] = [
  ["eat", "eats", "an apple"], ["drink", "drinks", "milk"], ["read", "reads", "a book"],
  ["draw", "draws", "a picture"], ["sing", "sings", "a song"], ["like", "likes", "ice cream"],
];
const SUBJECT_PRONOUNS: readonly (readonly [string, boolean])[] = [
  ["He", true], ["She", true], ["It", true], ["They", false], ["We", false], ["I", false], ["You", false],
];

function findPronoun(id: string) {
  return mcq(id, () => {
    const [pronoun, singular] = pick(SUBJECT_PRONOUNS);
    const [base, s, object] = pick(VERB_OBJECT);
    const verb = singular ? s : base;
    const noun = object.split(" ").slice(-1)[0];
    return {
      instruction: "Pick the pronoun",
      prompt: `${pronoun} ${verb} ${object}.`,
      correct: pronoun,
      wrong: [verb, noun],
      solution: [`'${pronoun}' is a pronoun. A pronoun is used in place of a noun.`, `'${verb}' is the action word (verb) and '${noun}' is a noun.`],
    };
  });
}

const pronouns: Chapter = {
  id: "pronouns",
  number: 2,
  title: "Pronouns",
  source: "English grammar, Class 3",
  exercises: [
    {
      id: "fill-pronoun",
      title: "Fill in the pronoun",
      description: "he, she, it, they, we",
      questions: slots(N, pronounFill),
    },
    {
      id: "find-pronoun",
      title: "Find the pronoun",
      description: "Pick the pronoun in a sentence",
      questions: slots(N, findPronoun),
    },
  ],
};

// ------------------------------------------------------------ Articles

const CONSONANT_NOUNS = ["book", "pen", "cat", "dog", "ball", "doll", "bag", "kite", "table", "chair", "girl", "boy", "tree", "fish", "cup", "bus", "car", "hen", "pig", "rat"];
const VOWEL_NOUNS = ["apple", "egg", "orange", "umbrella", "ant", "owl", "elephant", "ice-cream", "eagle", "onion", "axe", "ink-pot"];
const THE_THINGS = ["sun", "moon", "sky"];
const THE_SENTENCES = [
  (t: string) => `___ ${t} is very bright.`,
  (t: string) => `We can see ___ ${t} from here.`,
  (t: string) => `Look at ___ ${t}!`,
];
const ADJECTIVES = ["red", "new", "big", "small", "nice"];

function aOrAn(id: string) {
  return mcq(id, () => {
    const an = Math.random() < 0.5;
    const noun = pick(an ? VOWEL_NOUNS : CONSONANT_NOUNS);
    const sentence = pick([
      (n: string) => `This is ___ ${n}.`,
      (n: string) => `I can see ___ ${n}.`,
      (n: string) => `She has ___ ${n}.`,
      (n: string) => `There is ___ ${n} in the box.`,
    ]);
    return {
      instruction: "Choose a or an",
      prompt: sentence(noun),
      correct: an ? "an" : "a",
      options: ["a", "an"],
      solution: [
        an
          ? `'${noun}' begins with a vowel sound (a, e, i, o, u), so we use 'an'.`
          : `'${noun}' begins with a consonant sound, so we use 'a'.`,
      ],
    };
  });
}

function theQuiz(id: string) {
  return mcq(id, () => {
    const options = ["a", "an", "the"];
    if (Math.random() < 0.5) {
      const thing = pick(THE_THINGS);
      return {
        instruction: "Choose a, an or the",
        prompt: pick(THE_SENTENCES)(thing),
        correct: "the",
        options,
        solution: [`There is only one ${thing}, so we use 'the'.`],
      };
    }
    const an = Math.random() < 0.5;
    const noun = pick(an ? VOWEL_NOUNS.slice(0, 6) : CONSONANT_NOUNS);
    return {
      instruction: "Choose a, an or the",
      prompt: `I have ${an ? "an" : "a"} ${noun}. ___ ${noun} is ${pick(ADJECTIVES)}.`,
      correct: "the",
      options,
      solution: [`We are talking about the same ${noun} again, so we use 'the'.`],
    };
  });
}

const articles: Chapter = {
  id: "articles",
  number: 3,
  title: "Articles",
  source: "English grammar, Class 3",
  exercises: [
    {
      id: "a-an",
      title: "a or an",
      description: "Use 'an' before a vowel sound",
      questions: slots(N, aOrAn),
    },
    {
      id: "the",
      title: "a, an or the",
      description: "When to use 'the'",
      questions: slots(N, theQuiz),
    },
  ],
};

// --------------------------------------------------------------- Verbs

const VERB_SENTENCES: readonly (readonly string[])[] = [
  ["The dog barks loudly.", "dog", "barks", "loudly"],
  ["Riya sings a song.", "Riya", "sings", "song"],
  ["Birds fly in the sky.", "Birds", "fly", "sky"],
  ["The boy kicks the ball.", "boy", "kicks", "ball"],
  ["Mother cooks food.", "Mother", "cooks", "food"],
  ["The cat drinks milk.", "cat", "drinks", "milk"],
  ["Ravi reads a book.", "Ravi", "reads", "book"],
  ["The children play in the park.", "children", "play", "park"],
  ["Fish swim in water.", "Fish", "swim", "water"],
  ["The girl draws a picture.", "girl", "draws", "picture"],
  ["Cows eat grass.", "Cows", "eat", "grass"],
  ["The baby laughs happily.", "baby", "laughs", "happily"],
  ["Sita writes a letter.", "Sita", "writes", "letter"],
  ["The horse runs fast.", "horse", "runs", "fast"],
];

type Subject = readonly [text: string, form: string];
const sentenceWith = (subjects: readonly Subject[], tails: readonly string[], options: readonly string[], rule: string[]) => (id: string) =>
  mcq(id, () => {
    const [subject, form] = pick(subjects);
    return {
      instruction: `Choose ${options.slice(0, -1).join(", ")} or ${options[options.length - 1]}`,
      prompt: `${subject} ___ ${pick(tails)}.`,
      correct: form,
      options,
      solution: [`With '${subject}' we say '${form}'.`, ...rule],
    };
  });

const IS_ARE: Subject[] = [
  ["I", "am"], ["He", "is"], ["She", "is"], ["It", "is"], ["We", "are"], ["You", "are"], ["They", "are"],
  ["My mother", "is"], ["The cat", "is"], ["Ravi", "is"], ["My friend", "is"],
  ["The boys", "are"], ["Ravi and Meena", "are"], ["The birds", "are"],
];
const WAS_WERE: Subject[] = [
  ["I", "was"], ["He", "was"], ["She", "was"], ["It", "was"], ["We", "were"], ["You", "were"], ["They", "were"],
  ["My father", "was"], ["The dog", "was"], ["Ravi", "was"], ["The girls", "were"], ["Ravi and Meena", "were"],
];
const HAS_HAVE: Subject[] = [
  ["I", "have"], ["You", "have"], ["We", "have"], ["They", "have"], ["He", "has"], ["She", "has"], ["It", "has"],
  ["Ravi", "has"], ["My mother", "has"], ["The boys", "have"], ["Ravi and Meena", "have"],
];

const verbs: Chapter = {
  id: "verbs",
  number: 4,
  title: "Verbs",
  source: "English grammar, Class 3",
  exercises: [
    {
      id: "find-verb",
      title: "Find the verb",
      description: "The action word in a sentence",
      questions: slots(N, (id) =>
        findQuiz(id, VERB_SENTENCES, {
          instruction: "Pick the verb (the action word)",
          which: 2,
          why: (row) => [`'${row[2]}' tells us what is being done, so it is the verb.`],
        }),
      ),
    },
    {
      id: "am-is-are",
      title: "am, is, are",
      description: "Present tense",
      questions: slots(
        N,
        sentenceWith(IS_ARE, ["happy", "in the garden", "at school", "very kind", "at home", "ready"], ["am", "is", "are"], [
          "Use 'am' with I; 'is' with he, she, it and one person or thing; 'are' with we, you, they and more than one.",
        ]),
      ),
    },
    {
      id: "was-were",
      title: "was, were",
      description: "Past tense",
      questions: slots(
        N,
        sentenceWith(WAS_WERE, ["at school yesterday", "at home yesterday", "very happy yesterday", "in the garden yesterday", "tired yesterday"], ["was", "were"], [
          "Use 'was' with I, he, she, it and one person or thing; 'were' with we, you, they and more than one.",
        ]),
      ),
    },
    {
      id: "has-have",
      title: "has, have",
      description: "Having something",
      questions: slots(
        N,
        sentenceWith(HAS_HAVE, ["a red ball", "a new bag", "two pencils", "a small dog", "a big house"], ["has", "have"], [
          "Use 'has' with he, she, it and one person or thing; 'have' with I, you, we, they and more than one.",
        ]),
      ),
    },
  ],
};

// ----------------------------------------------------------- Opposites

const OPPOSITES: Pair[] = [
  ["hot", "cold"], ["big", "small"], ["up", "down"], ["in", "out"], ["day", "night"], ["happy", "sad"], ["old", "new"],
  ["fast", "slow"], ["hard", "soft"], ["open", "close"], ["empty", "full"], ["clean", "dirty"], ["near", "far"],
  ["early", "late"], ["heavy", "light"], ["long", "short"], ["right", "wrong"], ["love", "hate"], ["win", "lose"],
];

const opposites: Chapter = {
  id: "opposites",
  number: 5,
  title: "Opposites",
  source: "English grammar, Class 3",
  exercises: [
    {
      id: "opposite-words",
      title: "Opposite words",
      description: "hot → cold",
      questions: slots(N, (id) =>
        pairQuiz(id, OPPOSITES, {
          instruction: "Choose the opposite",
          ask: (w) => `What is the opposite of '${w}'?`,
          why: (a, b) => [`The opposite of '${a}' is '${b}'.`],
        }),
      ),
    },
    {
      id: "odd-word",
      title: "Odd one out",
      description: "Which word does not belong",
      questions: slots(N, (id) =>
        oddQuiz(
          id,
          { "naming words": ["boy", "dog", "city", "table", "river"], "action words": ["run", "jump", "eat", "sing", "write"], "pronouns": ["he", "she", "it", "they", "we"] },
          {
            instruction: "Choose the odd one out",
            ask: "Which word is different from the other three?",
            why: (odd, oddLabel, label) => [`Three of the words are ${label}. '${odd}' is one of the ${oddLabel}, so it is the odd one out.`],
          },
        ),
      ),
    },
  ],
};

export const englishGrammar: Chapter[] = [nouns, pronouns, articles, verbs, opposites];
