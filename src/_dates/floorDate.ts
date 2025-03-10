/**
 * Floor a date to the most recent Sunday on or before
 * @param date The date to floor
 * @returns The new floored date
 */
export default function floorDate(date: Date) {
  const newDate = new Date(date.getTime());
  newDate.setDate(newDate.getDate() - newDate.getDay());
  return newDate;
}
