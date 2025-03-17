import { assertEquals } from "https://deno.land/std@0.104.0/testing/asserts.ts";
import DateLib from "../src/_dates/DateLib.ts";

Deno.test("date lib add days positive", () => {
  const date = new Date(1999, 11, 31);

  const newDate = DateLib.addDays(date, 3);

  assertEquals(newDate.getFullYear(), 2000);
  assertEquals(newDate.getMonth(), 0);
  assertEquals(newDate.getDate(), 3);
});

Deno.test("date lib add days negative", () => {
  const date = new Date(1999, 11, 31);

  const newDate = DateLib.addDays(date, -5);

  assertEquals(newDate.getFullYear(), 1999);
  assertEquals(newDate.getMonth(), 11);
  assertEquals(newDate.getDate(), 26);
});

Deno.test("date lib floor days", () => {
  const date = new Date(2025, 2, 14);

  const newDate = DateLib.floorToSunday(date);

  assertEquals(newDate.getFullYear(), 2025);
  assertEquals(newDate.getMonth(), 2);
  assertEquals(newDate.getDate(), 9);
});

Deno.test("date lib get dates in range", () => {
  const start = new Date("2025-03-13");
  const end = new Date("2025-04-02");

  const dates = DateLib.getDatesInRange(start, end);

  assertEquals(dates.length, 21);
});
