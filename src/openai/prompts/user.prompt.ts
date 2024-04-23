import { UserProfileEntity } from "src/user/entities/user-profile.entity";

export const userPrompt = (
  profile: Partial<UserProfileEntity>
): any[] => {
  return [
    { role: "user", content: `gender: ${profile.gender}` },
    { role: "user", content: `daily calories: ${profile.metabolism}` },
    { role: "user", content: `date of birth: ${profile.dob}` },
    { role: "user", content: `weight: ${profile.weight} KG` },
    { role: "user", content: `height: ${profile.height} CM` },
    { role: "user", content: `diet: ${profile.diet}` },
    { role: "user", content: `goals: ${profile.goal.join(", ")}` },
    { role: "user", content: `location: ${profile.location}` },
    { role: "user", content: `can't eat: ${profile.food_habits}` },
    {
      role: "user",
      content: `meals in a day: ${profile.mealTypes.join(", ")}`,
    },
  ];
};
