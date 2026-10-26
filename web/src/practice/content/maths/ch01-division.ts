// Mathematics-3 (Term-2), Chapter 1: Division (textbook pp. 59-71).
//
// Not included, because they have no single checkable answer: the Warm Up
// fact-family houses (several equations per house), the number-card Maths Lab
// Activity, the Mental Maths matching table, the Puzzle (place the digits 0-9)
// and the Chunking method "Try these" worked layout -- the sums from it are
// kept as ordinary divisions.
import type { Chapter, Question } from "../../types";
import { choice, numeric } from "../../measure";
import { divide, divideByTen, wordDivide, wordDivideWithRemainder } from "../../divide";

const letters = "abcdefghijklmnopqrstuvwxyz";
const numbered = (pairs: [number, number][], build: (id: string, n: number, d: number) => Question, start = 1): Question[] =>
  pairs.map(([n, d], i) => build(String(start + i), n, d));
const lettered = (n: number, pairs: [number, number][], build: (id: string, n: number, d: number) => Question): Question[] =>
  pairs.map(([a, b], i) => build(`${n}${letters[i]}`, a, b));

const ROLES = ["Dividend", "Divisor", "Quotient"];
const role = (id: string, a: number, b: number, c: number, which: 0 | 1 | 2): Question =>
  choice(id, `In ${a} ÷ ${b} = ${c}, what is ${[a, b, c][which]}?`, ROLES, which, [`In ${a} ÷ ${b} = ${c}: ${a} is the dividend, ${b} is the divisor and ${c} is the quotient.`], "Choose the correct option");

export const division: Chapter = {
  id: "ch01-division",
  number: 1,
  title: "Division",
  source: "Mathematics-3 (Term-2)",
  exercises: [
    {
      id: "warm-up",
      title: "Warm Up",
      description: "Fact families: multiplication gives division",
      page: 59,
      questions: [
        ...numbered([[70, 7], [70, 10], [63, 7], [63, 9], [72, 8], [72, 9]], (id, n, d) => divide(id, n, d, { quotientOnly: true, instruction: "Use the fact family to divide" })),
      ],
    },
    {
      id: "ex-1",
      title: "Exercise 1",
      description: "Dividend, divisor and quotient; one-step division",
      page: 61,
      questions: [
        role("1a1", 15, 5, 3, 0),
        role("1a2", 15, 5, 3, 1),
        role("1a3", 15, 5, 3, 2),
        role("1b1", 28, 7, 4, 0),
        role("1b2", 28, 7, 4, 1),
        role("1b3", 28, 7, 4, 2),
        role("1c1", 45, 9, 5, 0),
        role("1c2", 45, 9, 5, 1),
        role("1c3", 45, 9, 5, 2),
        ...lettered(2, [[42, 7], [28, 4], [36, 6]], (id, n, d) => divide(id, n, d, { quotientOnly: true, instruction: "Divide and write the quotient" })),
      ],
    },
    {
      id: "ex-2",
      title: "Exercise 2",
      description: "2-digit numbers, with remainders",
      page: 63,
      questions: numbered([[47, 5], [29, 4], [58, 6], [49, 5], [28, 3], [58, 7], [44, 7], [22, 4], [25, 3]], divide),
    },
    {
      id: "ex-3",
      title: "Exercise 3",
      description: "More 2-digit numbers",
      page: 65,
      questions: numbered([[38, 3], [45, 4], [86, 2], [77, 5], [82, 6], [58, 5], [69, 6], [72, 7]], divide),
    },
    {
      id: "ex-4",
      title: "Exercise 4",
      description: "Dividing 3-digit numbers",
      page: 66,
      questions: numbered(
        [[276, 2], [784, 7], [979, 4], [474, 4], [967, 8], [818, 6], [672, 3], [621, 3], [854, 8], [475, 5], [703, 2], [764, 7], [558, 6], [626, 5], [994, 9]],
        divide,
      ),
    },
    {
      id: "ex-5",
      title: "Exercise 5",
      description: "Dividing 4-digit numbers using long division",
      page: 67,
      questions: numbered(
        [[2315, 2], [9567, 8], [3348, 6], [3153, 3], [3312, 4], [1985, 2], [9526, 7], [8132, 8], [6543, 7], [5759, 5], [4292, 6], [2923, 3]],
        (id, n, d) => divide(id, n, d, { instruction: "Divide using long division" }),
      ),
    },
    {
      id: "ex-6",
      title: "Exercise 6",
      description: "Division in real life, word problems",
      page: 68,
      questions: [
        wordDivide("1", "Ayesha spends ₹96 on 8 pencils. How much money did she pay for each pencil?", 96, 8, "₹", "Cost of each pencil"),
        wordDivide("2", "Reena has to put 63 empty bottles in 3 crates. How many bottles will she put in each crate?", 63, 3, "bottles", "Bottles in each crate"),
        wordDivide("3", "A week has 7 days. How many weeks are there in 84 days?", 84, 7, "weeks", "Number of weeks"),
        wordDivide("4", "A bus has 52 seats. Find the total number of rows in the bus if each row has 4 seats.", 52, 4, "rows", "Number of rows"),
        wordDivideWithRemainder("5", "Aditya has 92 toy cars. He puts them equally in 6 boxes. How many toy cars will he put in each box? How many toy cars are left over?", 92, 6, "in each box", "left over"),
        wordDivide("6", "Reema sticks 5 pictures on a page. If she has 560 pictures, how many pages will she need?", 560, 5, "pages", "Pages needed"),
        wordDivideWithRemainder("7", "A fruitseller buys 435 apples. He arranges them equally in 9 boxes. How many apples does he put in each box? How many apples are left over?", 435, 9, "in each box", "left over"),
        wordDivideWithRemainder("8", "An auditorium has to be filled with 228 chairs. How many chairs are needed in each row if there are 7 rows in total? How many chairs are extra?", 228, 7, "in each row", "extra"),
        wordDivide("9", "Mrs Kapoor paid for a ring in 4 equal instalments. How much money did she pay each time if the total cost of the ring is ₹6124?", 6124, 4, "₹", "Each instalment"),
        wordDivideWithRemainder("10", "A box can hold 7 cans. There are 8539 cans to be packed. How many boxes are needed to pack the cans? How many cans will be left over?", 8539, 7, "boxes full", "cans left over"),
        wordDivide("real-life", "Manu runs a grocery store. He has 2259 g chilli powder. He has to fill the chilli powder in 9 packets such that each packet has the same quantity of chilli powder. What is the quantity of chilli powder in each packet?", 2259, 9, "g", "Chilli powder in each packet"),
      ],
    },
    {
      id: "ex-7",
      title: "Exercise 7",
      description: "Dividing by 1, by itself and by 10",
      page: 69,
      questions: [
        numeric("1a", "72 ÷ 72 = ______", "", 1, ["Any number divided by itself is 1.", "72 ÷ 72 = 1"], "Fill in the blank"),
        numeric("1b", "______ ÷ 1 = 824", "", 824, ["Any number divided by 1 is the number itself.", "824 ÷ 1 = 824"], "Fill in the blank"),
        numeric("1c", "______ ÷ 172 = 1", "", 172, ["Any number divided by itself is 1.", "172 ÷ 172 = 1"], "Fill in the blank"),
        numeric("1d", "______ ÷ 720 = 0", "", 0, ["When 0 is divided by any number (other than 0), the quotient is 0.", "0 ÷ 720 = 0"], "Fill in the blank"),
        numeric("1e", "0 ÷ 1175 = ______", "", 0, ["When 0 is divided by any number (other than 0), the quotient is 0.", "0 ÷ 1175 = 0"], "Fill in the blank"),
        numeric("1f", "2670 ÷ 1 = ______", "", 2670, ["Any number divided by 1 is the number itself.", "2670 ÷ 1 = 2670"], "Fill in the blank"),
        ...lettered(2, [[463, 10], [930, 10], [4320, 10], [1209, 10]], (id, n) => divideByTen(id, n)),
      ],
    },
    {
      id: "chunking",
      title: "Chunking Method: Try These",
      description: "70 ÷ 6, 91 ÷ 5, 273 ÷ 5, 189 ÷ 8",
      page: 69,
      questions: lettered(1, [[70, 6], [91, 5], [273, 5], [189, 8]], divide),
    },
    {
      id: "mental-maths",
      title: "Mental Maths Corner",
      description: "Quotient and remainder of each statement",
      page: 70,
      questions: numbered([[193, 6], [219, 7], [276, 8], [302, 9], [303, 10]], divide),
    },
    {
      id: "review",
      title: "Review Exercise",
      description: "Choose the correct option, divide, word problems",
      page: 70,
      questions: [
        choice("1a", "What do we have as the remainder if 96 is divided by 7?", ["5", "4", "3"], 0, ["96 ÷ 7: 7 × 13 = 91", "96 − 91 = 5, so the remainder is 5."], "Choose the correct option"),
        choice("1b", "How many groups of 8 are there in 96?", ["12", "14", "13"], 0, ["Number of groups = 96 ÷ 8", "8 × 12 = 96, so there are 12 groups."], "Choose the correct option"),
        ...lettered(2, [[56, 5], [382, 3], [563, 4], [825, 6], [5384, 7], [9298, 9]], divide),
        wordDivide("3", "A school has 2472 students. The students are divided equally into six houses. How many students are there in each house?", 2472, 6, "students", "Students in each house"),
        wordDivideWithRemainder("4", "A total of 1788 kg rice has to be packed equally in 7 bags. What will be the weight of rice in each bag? What will be the quantity of rice that is left over?", 1788, 7, "kg in each bag", "kg left over"),
        {
          id: "think-and-answer",
          prompt: "A batsman hit a century in a One Day cricket match. He scored 48 and 54 runs in 4s and 6s respectively. How many 4s and 6s did he hit?",
          answer: { kind: "parts", parts: [{ unit: "fours", value: 12 }, { unit: "sixes", value: 9 }], labelled: true },
          solution: ["Each four is 4 runs: number of 4s = 48 ÷ 4 = 12", "Each six is 6 runs: number of 6s = 54 ÷ 6 = 9"],
        },
        wordDivide("value-corner", "9 students of a college started teaching 1053 children during Saksharta Abhiyan. If each student is teaching the same number of children, how many children is each student teaching?", 1053, 9, "children", "Children taught by each student"),
      ],
    },
    {
      id: "critical-thinking",
      title: "Critical Thinking",
      description: "Divisible by 9 and by 8",
      page: 71,
      questions: [
        numeric("smallest-9", "What is the smallest 3-digit number exactly divisible by 9?", "", 108, ["The smallest 3-digit number is 100.", "100 ÷ 9 = 11 remainder 1, so 100 is 1 more than 99 (= 9 × 11).", "The next multiple of 9 is 9 × 12 = 108."]),
        numeric("greatest-8", "Find the greatest 4-digit number exactly divisible by 8.", "", 9992, ["The greatest 4-digit number is 9999.", "9999 ÷ 8 = 1249 remainder 7.", "9999 − 7 = 9992, and 9992 ÷ 8 = 1249 exactly."]),
      ],
    },
  ],
};
