import momentHijri from "moment-hijri";
import { format } from "date-fns";
import Calendar from "date-bengali-revised";

export const arabicDate = (today) => {
  const months = [
    "মহরম",
    "সফর",
    "রবিউল আউয়াল",
    "রবিউস সানি",
    "জমাদিউল আউয়াল",
    "জমাদিউস সানি",
    "রজব",
    "শাবান",
    "রমজান",
    "শাওয়াল",
    "জিলকদ",
    "জিলহজ্জ",
  ];

  const numbers = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };

  const year = momentHijri(today)
    .iYear()
    .toString()
    .split("")
    .map((digit) => numbers[digit])
    .join("");
  const month = months[momentHijri(today).iMonth()];
  const date = momentHijri(today)
    .iDate()
    .toString()
    .split("")
    .map((digit) => numbers[digit])
    .join("");

  return `${date} ${month} ${year}`;
};

export const englishDate = (today) => {
  const date = format(today, "d");
  const month = format(today, "LLLL");
  const year = format(today, "u");

  return `${date} ${month} ${year}`;
};

export const banglaDate = (today) => {
  const cal = new Calendar();
  const bnDateObj = cal?.fromDate(today);

  const calendar = new Calendar(bnDateObj.year, bnDateObj.month, bnDateObj.day);

  return calendar?.format("D MMMM Y");
};

export const dayName = (today) => {
  const cal = new Calendar();
  const bnDateObj = cal.fromDate(today);

  const calendar = new Calendar(bnDateObj.year, bnDateObj.month, bnDateObj.day);

  return calendar.format("dddd");
};
