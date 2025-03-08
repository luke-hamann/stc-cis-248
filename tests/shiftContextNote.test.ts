import { assertEquals } from "https://deno.land/std@0.104.0/testing/asserts.ts";
import ShiftContextNote from "../src/models/entities/ShiftContextNote.ts";

function dummyShiftContextNote() {
  return new ShiftContextNote(
    0,
    null,
    new Date(2000, 5, 17, 10, 23, 42, 180),
    "",
    0,
    null,
  );
}

Deno.test("shift context note date string", () => {
  const shiftContextNote = dummyShiftContextNote();
  assertEquals(shiftContextNote.dateString, "2000-06-17");
});

Deno.test("shift context note date string empty", () => {
  const shiftContextNote = dummyShiftContextNote();
  shiftContextNote.date = null;
  assertEquals(shiftContextNote.dateString, "");
});
