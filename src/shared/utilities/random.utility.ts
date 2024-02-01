import { BadRequestException } from "@nestjs/common";

export const randomNumber = (
  value:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
): string => {
  if (value < 1)
    throw new BadRequestException({
      message: "Wrong parameter for randomNumber func",
    });
  return Math.random().toString().split("").splice(3, value).join("");
};
