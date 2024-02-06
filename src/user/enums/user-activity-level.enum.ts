export enum UserActivityLevelEnum {
  SEDENTARY = 1,
  LIGHTLY_ACTIVE = 1.375,
  MODERATELY_ACTIVE = 1.55,
  VERY_ACTIVE = 1.725,
  EXTRA_ACTIVE = 1.9,
}

export const getUserActivityLevelLabels = (): Record<
  UserActivityLevelEnum,
  string
> => ({
  [UserActivityLevelEnum.SEDENTARY]:
    "👨‍💻 Низкая активность (мало физических упражнений или их отсутствие)",
  [UserActivityLevelEnum.LIGHTLY_ACTIVE]:
    "🏌️‍♂️ Лёгкая активность (легкие физические упражнения/спорт 1–3 дня в неделю)",
  [UserActivityLevelEnum.MODERATELY_ACTIVE]:
    "🚴‍♀️ Умеренно активный (умеренные физические нагрузки/занятия спортом 3–5 дней в неделю)",
  [UserActivityLevelEnum.VERY_ACTIVE]:
    "🥷 Очень активный (тяжелые упражнения/спорт 6–7 дней в неделю)",
  [UserActivityLevelEnum.EXTRA_ACTIVE]:
    "🔥 Сверхактивный (очень тяжелые упражнения/спорт и физическая работа или 2 тренировки в день)",
});
