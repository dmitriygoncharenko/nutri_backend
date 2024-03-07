export enum DietEnum {
  MEDITERRANEAN = "mediterranean",
  VEGETARIAN = "vegetarian",
  VEGAN = "vegan",
  PESCETARIANISM = "pescetarianism",
  LACTO_VEGETARIAN = "lacto_vegetarian",
  OVO_VEGETARIAN = "ovo_vegetarian",
  PALEO = "paleo",
  KETO = "keto",
  ALL = "no_special_diet",
}

export const getDietLabels = (): Record<DietEnum, string> => ({
  [DietEnum.MEDITERRANEAN]: "🐟 Средиземноморская диета",
  [DietEnum.VEGETARIAN]: "🥦 Вегетарианство",
  [DietEnum.VEGAN]: "🍎 Веганство",
  [DietEnum.PESCETARIANISM]: "🦐 Пескетарианство",
  [DietEnum.LACTO_VEGETARIAN]:
    "🥛 Лакто-вегетарианство (вегетарианство + молочные продукты)",
  [DietEnum.OVO_VEGETARIAN]: "🥚 Ово-вегетарианство (вегетарианство + яйца)",
  [DietEnum.PALEO]: "🥩 Палео",
  [DietEnum.KETO]: "🥑 Кето",
  [DietEnum.ALL]: "🤘 Я ем всё",
});
