export enum UserFoodTypeEnum {
  MEDITERRANEAN = "mediterranean",
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
  PESCETARIANISM = "pescetarianism",
  LACTO_VEGETARIAN = "lacto_vegetarian",
  OVO_VEGETARIAN = "ovo_vegetarian",
  PALEO = "paleo",
  KETO = "keto",
  ALL = "all",
}

export const getUserFoodTypeLabels = (): Record<UserFoodTypeEnum, string> => ({
  [UserFoodTypeEnum.MEDITERRANEAN]: "🐟 Средиземноморская диета",
  [UserFoodTypeEnum.VEGETARIAN]: "🥦 Вегетарианство",
  [UserFoodTypeEnum.VEGAN]: "🍎 Веганство",
  [UserFoodTypeEnum.PESCETARIANISM]: "🦐 Пескетарианство",
  [UserFoodTypeEnum.LACTO_VEGETARIAN]:
    "🥛 Лакто-вегетарианство (вегетарианство + молочные продукты)",
  [UserFoodTypeEnum.OVO_VEGETARIAN]:
    "🥚 Ово-вегетарианство (вегетарианство + яйца)",
  [UserFoodTypeEnum.PALEO]: "🥩 Палео",
  [UserFoodTypeEnum.KETO]: "🥑 Кето",
  [UserFoodTypeEnum.ALL]: "🤘 Я ем всё",
});
