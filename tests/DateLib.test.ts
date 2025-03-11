import { assertEquals } from "https://deno.land/std@0.104.0/testing/asserts.ts";
import DateLib from "../src/_dates/DateLib.ts";

Deno.test("date lib add days", () => {
  const date = new Date("1999-12-31T00:00:00.000Z");
  const newDate = DateLib.addDays(date, 1);
  assertEquals(newDate.toISOString(), "2000-01-01T00:00:00.000Z");
});

Deno.test("date lib floor days", () => {
  const date = new Date("2025-03-14T00:00:00.000Z");
  const newDate = DateLib.floorDays(date);
  console.log(newDate);
  assertEquals(newDate.toISOString(), "2025-03-09T00:00:00.000Z");
});

Deno.test("date lib get dates in range", () => {
  const start = new Date("2025-03-13T00:00:00.000Z");
  const end = new Date("2025-04-02T00:00:00.000Z");
  const dates = DateLib.getDatesInRange(start, end);
  assertEquals(dates.length, 21);
});
