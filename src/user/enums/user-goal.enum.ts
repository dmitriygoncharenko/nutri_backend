export enum UserGoalEnum {
  WEIGHT_LOSS = "weight_loss",
  DIETARY_RESTRICTIONS = "dietary_restrictions",
  HEALTH_CONDITION_PERFORMANCE = "health_condition_performance",
  FITNESS_ATHLETIC_PERFORMANCE = "fitness_athletic_performance",
  ENERGY_MOOD_IMPROVEMENT = "energy_mood_improvement",
  CONVENIENCE_TIME_SAVING = "convenience_time_saving",
  LEARNING_NEW_RECIPES = "learning_new_recipes",
  IMPROVING_DIGESTIVE_HEALTH = "improving_digestive_health",
}

export const getUserGoalLabels = (): Record<UserGoalEnum, string> => {
  return {
    [UserGoalEnum.WEIGHT_LOSS]: "❤️ Снижение веса",
    [UserGoalEnum.DIETARY_RESTRICTIONS]:
      "👆 Соблюдение диетических ограничений",
    [UserGoalEnum.HEALTH_CONDITION_PERFORMANCE]:
      "🧘‍♀️ Улучшение состояния здоровья",
    [UserGoalEnum.FITNESS_ATHLETIC_PERFORMANCE]:
      "💪 Улучшение физических показателей",
    [UserGoalEnum.ENERGY_MOOD_IMPROVEMENT]: "⚡ Улучшение энергии и настроения",
    [UserGoalEnum.CONVENIENCE_TIME_SAVING]: "⏱ Удобство и экономия времени",
    [UserGoalEnum.LEARNING_NEW_RECIPES]: "👩‍🍳 Изучение новых рецептов",
    [UserGoalEnum.IMPROVING_DIGESTIVE_HEALTH]: "🌿 Улучшение пищеварения",
  };
};
