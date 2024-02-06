import { BadRequestException } from "@nestjs/common";

export const numberSuffix = (number: number, suffixWords: string[]) => {
  if (!suffixWords) return null;
  if (number == 1) return suffixWords[0];
  if (number > 1 && number < 5) return suffixWords[1];
  return suffixWords[2];
};

export const stringToNumber = (value: string, maxLength: number): number => {
  const number = parseInt(value.split(/ /)[0].replace(/[^0-9.,]+/g, ""));
  if (isNaN(number))
    throw new BadRequestException({
      message: "Введите число",
    });
  if (String(number).length > maxLength) {
    throw new BadRequestException({
      message: `Максимальная длина ${maxLength} ${numberSuffix(maxLength, [
        "цифр",
        "цифра",
        "цифр",
      ])}`,
    });
  }
  return number;
};
