const ones = [
  "",
  "bir",
  "ikki",
  "uch",
  "to‘rt",
  "besh",
  "olti",
  "yetti",
  "sakkiz",
  "to‘qqiz",
];
const tens = [
  "",
  "o‘n",
  "yigirma",
  "o‘ttiz",
  "qirq",
  "ellik",
  "oltmish",
  "yetmish",
  "sakson",
  "to‘qson",
];
const scales = ["", "ming", "million", "milliard", "trillion"];

const chunkify = (number: number) => {
  const chunks = [];
  while (number > 0) {
    chunks.unshift(number % 1000);
    number = Math.floor(number / 1000);
  }
  return chunks;
};

const chunkToWord = (chunk: number) => {
  if (chunk === 0) return "";

  let result = "";
  const hundred = Math.floor(chunk / 100);
  const remainder = chunk % 100;
  const ten = Math.floor(remainder / 10);
  const one = remainder % 10;

  if (hundred > 0) {
    result += ones[hundred] + " yuz ";
  }

  if (ten === 1) {
    result += tens[1] + " " + ones[one];
  } else {
    if (ten > 1) {
      result += tens[ten];
      if (one > 0) result += " ";
    }
    if (one > 0 || (ten === 0 && hundred === 0)) {
      result += ones[one];
    }
  }

  return result.trim();
};

export function numberToWord(n: unknown) {
  const num = Number(n);
  if (Number.isNaN(num)) return "";
  if (num === 0) return "";
  if (num > 1_000_000_000_000)
    return "Cheklov: faqat trilliongacha bo‘lgan sonlar qo‘llab-quvvatlanadi";

  const chunks = chunkify(num);
  let words = "";
  const chunkCount = chunks.length;

  chunks.forEach((chunk, index) => {
    if (chunk > 0) {
      const scaleIndex = chunkCount - index - 1;

      words += chunkToWord(chunk) + " " + scales[scaleIndex] + " ";
    }
  });

  return words.trim();
}
