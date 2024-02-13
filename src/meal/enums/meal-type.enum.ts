export enum MealTypeEnum {
  "BREAKFAST" = "breakfast",
  "LUNCH" = "lunch",
  "DINNER" = "dinner",
  "SNACK_1" = "snack_1",
  "SNACK_2" = "snack_2",
}

export const getMealTypeLabels = (): Record<MealTypeEnum, string> => ({
  [MealTypeEnum.BREAKFAST]: "☕️ Завтрак",
  [MealTypeEnum.SNACK_1]: "🍏 Перекус между завтраком и обедом",
  [MealTypeEnum.LUNCH]: "🍖 Обед",
  [MealTypeEnum.SNACK_2]: "🍎 Перекус между обедом и ужином",
  [MealTypeEnum.DINNER]: "🍲 Ужин",
});
