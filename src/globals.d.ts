import Color from "./models/entities/Color.ts";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Entity interfaces
 */

export interface IColor {
  id: number;
  name: string;
  hex: string;
}

export interface IShiftContext {
  id: number;
  name: string;
  ageGroup: string;
  location: string;
  description: string;
}

export interface IShiftContextNote {
  shiftContextId: number;
  date: Date;
  note: string;
  colorId: number;
}

export interface IShiftContextPreference {
  teamMemberId: number;
  shiftContextId: number;
}

export interface ISubstitute {
  teamMemberId: number;
  date: Date;
}

export interface ITeamMember {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phone: string;
  isExternal: boolean;
  maxWeeklyHours: number;
  maxWeeklyDays: number;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface ITimeSlot {
  id: number;
  shiftContextId: number;
  startDateTime: Date;
  endDateTime: Date;
  requiresAdult: boolean;
  teamMemberId: number;
  note: string;
  colorId: number;
}

/**
 * Data layer
 */

export interface IShiftContextNoteRow {
  shiftContextId: number;
  shiftContextName: string;
  date: string;
  note: string;
  colorId: number;
  colorName: string;
  colorHex: string;
}

/**
 * Repositories
 */

export interface IColorRepository {
  validateColor(color: Color): Promise<string[]>;
  getColors(): Promise<Color[]>;
  getColor(id: number): Promise<Color | null>;
  addColor(color: Color): Promise<number>;
  updateColor(color: Color): Promise<void>;
  deleteColor(id: number): Promise<void>;
}
