import { ChatCompletionMessageParam } from "openai/resources";
import { UserProfileEntity } from "src/user/entities/user-profile.entity";
import { UserGoalEnum } from "src/user/enums/user-goal.enum";

export const calculateMetabolismPrompt = (
  userProfile: Partial<UserProfileEntity>
): ChatCompletionMessageParam[] => {
  console.log("userProfile", userProfile);
  return [
    {
      role: "system",
      content:
        "Answer in JSON object with following structure : {metabolism: number}",
    },
    {
      role: "system",
      content:
        "Calculate user BMR by Mifflin-St Jeor Equation formula based on user parameters and multiply it by Activity index. Decrease result if user wants loss weight.",
    },
    {
      role: "user",
      content: `
                Dob (Date format): ${userProfile.dob};
                Gender (male or female): ${userProfile.gender};
                Weight (kg): ${userProfile.weight};
                Height (cm): ${userProfile.height};
                Activity index (number): ${userProfile.activity_level / 1000};
                User wants loss weight (yes or no): ${
                  userProfile.goal.includes(UserGoalEnum.WEIGHT_LOSS)
                    ? "yes"
                    : "no"
                }
            `,
    },
  ];
};
