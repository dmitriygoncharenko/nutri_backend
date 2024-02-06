export enum UserFoodCountEnum {
  "BREAKFAST" = "breakfast",
  "LUNCH" = "lunch",
  "DINNER" = "dinner",
  "SNACK_1" = "snack_1",
  "SNACK_2" = "snack_2",
}

export const getUserFoodCountLabels = (): Record<
  UserFoodCountEnum,
  string
> => ({
  [UserFoodCountEnum.BREAKFAST]: "☕️ Завтрак",
  [UserFoodCountEnum.SNACK_1]: "🍏 Перекус между завтраком и обедом",
  [UserFoodCountEnum.LUNCH]: "🍖 Обед",
  [UserFoodCountEnum.SNACK_2]: "🍎 Перекус между обедом и ужином",
  [UserFoodCountEnum.DINNER]: "🍲 Ужин",
});
