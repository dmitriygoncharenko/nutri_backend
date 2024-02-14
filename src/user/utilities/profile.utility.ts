import { calculateAge } from "src/shared/utilities/date.utility";
import { UserProfileEntity } from "../entities/user-profile.entity";
import { UserGenderEnum } from "../enums/user-gender.enum";
import { UserGoalEnum } from "../enums/user-goal.enum";

export const calcMetabolism = (profile: Partial<UserProfileEntity>): number => {
  const age = calculateAge(profile.dob);
  console.log("🚀 ~ calcMetabolism ~ age:", age);
  if (!age || isNaN(age)) {
    return;
  }
  const formulas = {
    [UserGenderEnum.MALE]: () =>
      10 * profile.weight + 6.25 * profile.height - 5 * age + 5,
    [UserGenderEnum.FEMALE]: () =>
      10 * profile.weight + 6.25 * profile.height - 5 * age - 161,
  };

  let metabolism = formulas[profile.gender]() * (profile.activity_level / 1000);
  console.log("🚀 ~ calcMetabolism ~ metabolism:", metabolism);
  if (profile.goal.includes(UserGoalEnum.WEIGHT_LOSS)) {
    metabolism -= 1000;
  }
  return Math.round(metabolism);
};
