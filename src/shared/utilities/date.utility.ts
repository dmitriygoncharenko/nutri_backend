import { BadRequestException } from "@nestjs/common";

export const validateDate = (value: string | Date) => {
  if (!value || isNaN(new Date(value).getTime()))
    throw new BadRequestException({ message: "Неверный формат даты" });
  return new Date(value);
};

export const formatDateToShortDate = (date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  return new Intl.DateTimeFormat("ru-RU", options)
    .format(date)
    .replace(".", "");
};

export const daysLeftInWeek = () => {
  const today = new Date();
  let dayOfWeek = today.getDay();
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const daysLeft = 7 - dayOfWeek;

  return daysLeft;
};

export const getStartAndEndOfWeek = (
  date = new Date()
): { start: Date; end: Date } => {
  const dayOfWeek = date.getDay();
  const currentDay = date.getDate();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(
    currentYear,
    currentMonth,
    currentDay + diffToMonday
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  return {
    start: startOfWeek,
    end: endOfWeek,
  };
};

export const getDatesForTheRestOfWeek = (startDay: Date): Date[] => {
  let datesArray = [];
  const endOfWeek = new Date(startDay);
  endOfWeek.setHours(0, 0, 0, 0);
  endOfWeek.setDate(startDay.getDate() + (7 - startDay.getDay()));
  for (
    let date = new Date(new Date(startDay).setHours(0, 0, 0, 0));
    date <= endOfWeek;
    date.setDate(date.getDate() + 1)
  ) {
    datesArray.push(new Date(date));
  }

  return datesArray;
};

export const calculateAge = (dob: string): number => {
  // Parse the date of birth string into parts
  const parts = dob.split(".");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript Date
  const year = parseInt(parts[2], 10);

  // Create a date object for the date of birth
  const dobDate = new Date(year, month, day);

  // Get the current date
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();

  // If the current month is before the birth month, or it's the birth month but today's date is before the birth date, subtract one year from the age
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  return age;
};
