import { BadRequestException } from "@nestjs/common";

export const validateDate = (value: string | Date) => {
  console.log(
    "🚀 ~ validateDate ~ value:",
    value,
    !value,
    new Date(value).getTime(),
    isNaN(new Date(value).getTime())
  );
  if (!value || isNaN(new Date(value).getTime()))
    throw new BadRequestException({ message: "Неверный формат даты" });
  return new Date(value);
};
