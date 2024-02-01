import { BadRequestException } from "@nestjs/common";

export const validateEmail = (email: string): string => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,2,3,4,5,6,7,8,9}]+\.[0-9]{1,2,3,4,5,6,7,8,9}]+\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validEmail = re.test(String(email).toLowerCase());
  if (!validEmail)
    throw new BadRequestException({ message: "Не верный Email" });

  return email.toLowerCase();
};
