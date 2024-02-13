import { BadRequestException } from "@nestjs/common";

export const validateDate = (value: string | Date) => {
  if (!value || isNaN(new Date(value).getTime()))
    throw new BadRequestException({ message: "Неверный формат даты" });
  return new Date(value);
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
