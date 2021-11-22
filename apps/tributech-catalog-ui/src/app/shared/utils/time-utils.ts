export function formatAsISOString(date: string | number | Date): string {
  return new Date(date).toISOString();
}

/**
 * Take the given date and convert it into UTC time at midnight.
 * e.g. 2021-04-19T00:07:00.000+02:00 -> 2021-04-19T00:00:00.000Z
 */
export function convertToUTCMidnight(date: string | number | Date): Date {
  const tempDate = new Date(date);
  return new Date(
    Date.UTC(
      tempDate?.getUTCFullYear(),
      tempDate?.getUTCMonth(),
      tempDate?.getUTCDate()
    )
  );
}

export const MAX_DATE = new Date(2208898800000);

export function isInfiniteDate(date: Date): boolean {
  return (
    !date ||
    (date instanceof Date &&
      date.getUTCFullYear() === MAX_DATE.getUTCFullYear())
  );
}
