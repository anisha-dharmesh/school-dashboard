// Mathematics-3, Lesson 9: Measurement (textbook pp. 120-130).
//
// Not included, because they have no single checkable answer: Critical
// Thinking Q2 (weight combinations), the marble Puzzle and Real Life Connect
// (which route is "shortest" depends on whether Ravi returns home).
import type { Chapter, Question } from "../../types";
import { add, choice, KG_G, KM_M, L_ML, M_CM, measure, numeric, sub, toBig, toSmall, type Measure } from "../../measure";

const letters = "abcdefghijklmnopqrstuvwxyz";
const lettered = <T,>(n: number, items: T[], build: (id: string, item: T) => Question): Question[] =>
  items.map((item, i) => build(`${n}${letters[i]}`, item));

const UNITS = ["m", "cm", "kg", "g", "l", "ml"];
const unitMatch = (id: string, prompt: string, unit: string, why: string) =>
  choice(id, prompt, UNITS, UNITS.indexOf(unit), [why], "Match with the appropriate unit of measurement");

export const measurement: Chapter = {
  id: "ch09-measurement",
  number: 9,
  title: "Measurement",
  source: "Mathematics-3",
  exercises: [
    {
      id: "warm-up",
      title: "Warm Up",
      description: "Match each thing with its unit",
      page: 120,
      questions: [
        unitMatch("1", "Weight of a boy", "kg", "A boy is heavy. Heavier things are weighed in kilograms (kg)."),
        unitMatch("2", "Length of a comb", "cm", "A comb is short. Short lengths are measured in centimetres (cm)."),
        unitMatch("3", "Height of a tower", "m", "A tower is very tall. Heights like this are measured in metres (m)."),
        unitMatch("4", "Capacity of a cup", "ml", "A cup holds only a little liquid. Small quantities are measured in millilitres (ml)."),
        unitMatch("5", "Weight of a chocolate", "g", "A chocolate is light. Lighter things are weighed in grams (g)."),
        unitMatch("6", "Capacity of a bucket", "l", "A bucket holds a lot of water. Bigger quantities are measured in litres (l)."),
      ],
    },
    {
      id: "ex-1",
      title: "Exercise 1",
      description: "Convert units of length",
      page: 122,
      questions: [
        ...lettered<Measure>(1, [[7, 0], [12, 0], [11, 9], [25, 20], [6, 18], [17, 28]], (id, m) => toSmall(id, M_CM, m)),
        ...lettered<Measure>(2, [[3, 0], [5, 0], [9, 291], [1, 19], [4, 15], [6, 218]], (id, m) => toSmall(id, KM_M, m)),
        ...lettered(3, [438, 736, 893, 3856, 6128, 1829], (id, t) => toBig(id, M_CM, t)),
        ...lettered(4, [1230, 2815, 7603, 6300, 8345, 9987], (id, t) => toBig(id, KM_M, t)),
      ],
    },
    {
      id: "ex-2",
      title: "Exercise 2",
      description: "Convert units of weight",
      page: 124,
      questions: [
        ...lettered<Measure>(1, [[6, 0], [8, 0], [8, 295], [3, 25], [7, 101], [4, 9]], (id, m) => toSmall(id, KG_G, m)),
        ...lettered(2, [3546, 7676, 4030, 1006, 5042, 8490], (id, t) => toBig(id, KG_G, t)),
      ],
    },
    {
      id: "ex-3",
      title: "Exercise 3",
      description: "Convert units of capacity",
      page: 125,
      questions: [
        ...lettered<Measure>(1, [[7, 0], [9, 0], [4, 750], [6, 265], [5, 175], [8, 750], [3, 330], [4, 404], [8, 210]], (id, m) => toSmall(id, L_ML, m)),
        ...lettered(2, [3540, 4338, 7878, 1005, 6556, 2222, 9356, 3477, 6412], (id, t) => toBig(id, L_ML, t)),
      ],
    },
    {
      id: "ex-4",
      title: "Exercise 4",
      description: "Add and subtract metric measures, word problems",
      page: 128,
      questions: [
        add("1a", KM_M, [[4, 210], [2, 215]]),
        add("1b", KG_G, [[3, 170], [2, 480]]),
        add("1c", L_ML, [[3, 562], [2, 695]]),
        sub("2a", M_CM, [9, 28], [3, 16]),
        sub("2b", L_ML, [4, 572], [2, 170]),
        sub("2c", KG_G, [9, 75], [3, 498]),
        add("3", KM_M, [[5, 580], [1, 750], [0, 250]], {
          prompt: "Charu travelled 5 km 580 m by bus, 1 km 750 m by rickshaw and 250 m on foot. What distance did she travel in total?",
          label: "Total distance",
        }),
        sub("4", M_CM, [3, 25], [0, 48], {
          prompt: "Deepa jumps a length of 3 m 25 cm. Priya jumps 48 cm less than Deepa. What is the length that Priya jumps?",
          label: "Priya's jump",
        }),
        add("5", M_CM, [[4, 50], [6, 25], [5, 70]], {
          prompt: "Three pieces of wire of lengths 4 m 50 cm, 6 m 25 cm and 5 m 70 cm are tied together. What is the total length of the wire?",
          label: "Total length",
        }),
        add("6", KG_G, [[1, 500], [2, 500], [2, 0]], {
          prompt: "Sohan bought 1 kg 500 g potatoes, 2 kg 500 g tomatoes and 2 kg onions. Find the total weight of the vegetables bought by Sohan.",
          label: "Total weight",
        }),
        sub("7", KG_G, [3, 350], [1, 200], {
          prompt: "The weight of a bag is 1 kg 200 g more than the weight of the other bag. If the weight of the first bag is 3 kg 350 g, find the weight of the second bag.",
          label: "Weight of the second bag",
        }),
        sub("8", KG_G, [6, 0], [4, 540], {
          prompt: "Mrs Khanna bought 6 kg rice for a month. What quantity of rice is left at the end of the month if the family consumed 4 kg 540 g rice in the month?",
          label: "Rice left",
        }),
        add("9", KG_G, [[6, 285], [2, 345]], {
          prompt: "A box of fruit holds 6 kg 285 g of fruits. Some more fruits weighing 2 kg 345 g are put into the box. Find the total weight of the fruits in the box.",
          label: "Total weight",
        }),
        sub("10", L_ML, [9, 200], [6, 600], {
          prompt: "The capacity of a vessel is 9 l 200 ml. It contains 6 l 600 ml water. Find the quantity of water that can be added to the vessel.",
          label: "Water that can be added",
        }),
        add("11", L_ML, [[1, 250], [4, 750]], {
          prompt: "Arun bought 1 l 250 ml milk in the morning and 4 l 750 ml milk in the evening. What was the total quantity of milk bought by Arun?",
          label: "Total milk",
        }),
      ],
    },
    {
      id: "mental-maths",
      title: "Mental Maths Corner",
      description: "Fill in the blanks",
      page: 129,
      questions: [
        numeric("1", "2 kg − ______ g = 1 kg 500 g", "g", 500, ["2 kg = 2000 g and 1 kg 500 g = 1500 g", "2000 g − 1500 g = 500 g"], "Fill in the blank"),
        measure("2", "6840 cm = ______ m ______ cm", M_CM, [68, 40], ["100 cm = 1 m", "6840 cm = 6800 cm + 40 cm = 68 m + 40 cm = 68 m 40 cm"], "Fill in the blanks"),
        numeric("3", "5 l 50 ml = ______ ml", "ml", 5050, ["1 l = 1000 ml", "5 l 50 ml = 5 × 1000 ml + 50 ml = 5000 ml + 50 ml = 5050 ml"], "Fill in the blank"),
        numeric("4", "200 ml + 400 ml + ______ ml = 1 l", "ml", 400, ["1 l = 1000 ml", "200 ml + 400 ml = 600 ml", "1000 ml − 600 ml = 400 ml"], "Fill in the blank"),
        measure("5", "3025 m = ______ km ______ m", KM_M, [3, 25], ["1000 m = 1 km", "3025 m = 3000 m + 25 m = 3 km + 25 m = 3 km 25 m"], "Fill in the blanks"),
        numeric("6", "1 kg 480 g = ______ g", "g", 1480, ["1 kg = 1000 g", "1 kg 480 g = 1000 g + 480 g = 1480 g"], "Fill in the blank"),
      ],
    },
    {
      id: "critical-thinking",
      title: "Critical Thinking",
      description: "Rods and a bucket of water",
      page: 129,
      questions: [
        measure(
          "1a",
          "Rod A is 4 m 3 cm longer than Rod C. Rod C is 3 m 5 cm shorter than Rod B. If Rod C is 5 m long, what is the length of Rod A?",
          M_CM,
          [9, 3],
          ["Rod A = Rod C + 4 m 3 cm = 5 m + 4 m 3 cm", ...add("x", M_CM, [[5, 0], [4, 3]]).solution],
        ),
        measure(
          "1b",
          "Rod A is 4 m 3 cm longer than Rod C. Rod C is 3 m 5 cm shorter than Rod B. If Rod C is 5 m long, what is the length of Rod B?",
          M_CM,
          [8, 5],
          ["Rod C is 3 m 5 cm shorter than Rod B, so Rod B = Rod C + 3 m 5 cm = 5 m + 3 m 5 cm", ...add("x", M_CM, [[5, 0], [3, 5]]).solution],
        ),
        choice(
          "1c",
          "Rod A is 9 m 3 cm, Rod B is 8 m 5 cm and Rod C is 5 m. Which rod is the longest?",
          ["Rod A", "Rod B", "Rod C"],
          0,
          ["9 m 3 cm is more than 8 m 5 cm, and both are more than 5 m.", "So Rod A is the longest."],
        ),
        measure(
          "3",
          "Rahul poured 250 ml of water in an empty bucket. Sourav poured twice of what Rahul poured. Sachin poured twice of what Sourav poured. Anil poured twice of what Sachin poured. What is the total quantity of water in the bucket?",
          L_ML,
          [3, 750],
          [
            "Rahul = 250 ml",
            "Sourav = 2 × 250 ml = 500 ml",
            "Sachin = 2 × 500 ml = 1000 ml",
            "Anil = 2 × 1000 ml = 2000 ml",
            "Total = 250 ml + 500 ml + 1000 ml + 2000 ml = 3750 ml",
            "3750 ml = 3000 ml + 750 ml = 3 l 750 ml",
          ],
        ),
      ],
    },
    {
      id: "review",
      title: "Review Exercise",
      description: "Choose the correct option, solve",
      page: 129,
      questions: [
        choice("1a", "95 m 40 cm equals", ["954 cm", "9540 cm", "4095 cm"], 1, ["1 m = 100 cm", "95 m 40 cm = 95 × 100 cm + 40 cm = 9500 cm + 40 cm = 9540 cm"], "Choose the correct option"),
        choice("1b", "3 kg 6 g equals", ["3060 g", "3006 g", "3600 g"], 1, ["1 kg = 1000 g", "3 kg 6 g = 3 × 1000 g + 6 g = 3000 g + 6 g = 3006 g"], "Choose the correct option"),
        choice("1c", "7 l 45 ml equals", ["4507 ml", "7450 ml", "7045 ml"], 2, ["1 l = 1000 ml", "7 l 45 ml = 7 × 1000 ml + 45 ml = 7000 ml + 45 ml = 7045 ml"], "Choose the correct option"),
        add("2a", M_CM, [[18, 80], [32, 42]], { instruction: "Solve" }),
        sub("2b", KM_M, [7, 100], [5, 850], { instruction: "Solve" }),
        add("2c", KG_G, [[6, 480], [2, 520]], { instruction: "Solve" }),
        sub("2d", KG_G, [8, 480], [6, 320], { instruction: "Solve" }),
        add("2e", L_ML, [[7, 615], [1, 705]], { instruction: "Solve" }),
        sub("2f", L_ML, [8, 250], [5, 750], { instruction: "Solve" }),
        add("3", KG_G, [[2, 500], [3, 0], [0, 500], [2, 0]], {
          prompt: "Gaurav buys 2 kg 500 g tomatoes, 3 kg potatoes, 500 g onions and 2 kg fruits. Find the total weight of vegetables and fruits bought by Gaurav.",
          label: "Total weight",
        }),
        sub("4", L_ML, [2, 0], [1, 575], {
          prompt: "Shreya takes 2 l water to school. What is the quantity of water left in the bottle if Shreya drinks 1 l 575 ml water?",
          label: "Water left",
        }),
        add("5", M_CM, [[5, 60], [4, 75]], {
          prompt: "Arushi bought 5 m 60 cm cloth for her dress and 4 m 75 cm for her sister's dress. What is the total length of the cloth bought by her?",
          label: "Total length",
        }),
      ],
    },
    {
      id: "value-and-challenge",
      title: "Value Corner & Challenge",
      description: "Sweets on Diwali, the climbing monkey",
      page: 130,
      questions: [
        (() => {
          const given = add("x", KG_G, [[5, 200], [4, 500]]);
          const left = sub("x", KG_G, [15, 0], [9, 700]);
          return measure(
            "value-corner",
            "On Diwali, Roshan bought 15 kg sweets. He distributed 5 kg 200 g sweets to his friends and 4 kg 500 g to his relatives. Find the weight of sweets left with him.",
            KG_G,
            [5, 300],
            ["First find how much he gave away.", ...given.solution, "Now subtract this from 15 kg.", ...left.solution],
          );
        })(),
        numeric(
          "monkey",
          "A monkey is trying to reach the top of a pole of height 100 m. In each minute, it covers a distance of 30 m but slips 20 m downwards. In how many minutes will it reach the top?",
          "minutes",
          8,
          [
            "Each minute it climbs 30 m and slips 20 m, so it gains 30 − 20 = 10 m by the end of a minute.",
            "After 7 minutes it is at 7 × 10 m = 70 m.",
            "In the 8th minute it climbs 30 m: 70 m + 30 m = 100 m. It reaches the top before it can slip back.",
            "So it reaches the top in 8 minutes.",
          ],
        ),
      ],
    },
  ],
};
