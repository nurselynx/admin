import { format } from "date-fns";

function getOrdinalWeekday(dateInput: Date | string | number): string {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return ""; // invalid date safety

  const dayOfMonth = date.getDate();
  const weekNumber = Math.ceil(dayOfMonth / 7);

  const ordinal = ["First", "Second", "Third", "Fourth", "Fifth"][weekNumber - 1] || `${weekNumber}th`;
  const weekday = format(date, "EEEE");

  return `${ordinal} ${weekday}`;
}

export default getOrdinalWeekday;