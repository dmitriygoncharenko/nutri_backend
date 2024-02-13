import { ChatCompletionMessageParam } from "openai/resources";
import { MealTypeEnum } from "src/meal/enums/meal-type.enum";
import { UserEntity } from "src/user/entities/user.entity";

export const mealGenerationPrompt = (
  type: MealTypeEnum,
  calories: number,
  eatenMealTypes: MealTypeEnum[],
  user: UserEntity
): ChatCompletionMessageParam[] => {
  return [
    { role: "system", content: "Answer on Russian language" },
    {
      role: "system",
      content: `You are a health-coach assistance. You provide meal plan for people based on their physical parameters and eat habits. Generate a detailed and professional recipe of meal. Include sensory descriptions, precise cooking instructions, and plating suggestions.`,
    },
    {
      role: "system",
      content: `Ingredients of meals should be possible to buy in ${user?.profile?.location}.`,
    },
    {
      role: "system",
      content: `
        meal types: 
            - breakfast;
            - snack_1 - snack between breakfast and lunch;
            - lunch;
            - snack_2 - snack between lunch and dinner;
            - dinner.
    `,
    },
    {
      role: "system",
      content: `
        Create recipe as a JSON object with the following fields: 
            1. title - create a short name for the recipe, should be adopted to the cuisine, up to 2-5 words;
            2. intro - a short description of the recipe, up to 15 words;
            3. description - a long description of the recipe. Emphasize the quality of ingredients. Additionally, provide chef's tips for cooking and a brief background story or inspiration for this dish;
            4. ingredients - an array of objects, each object containing fields:
                - name - the name of the ingredient,
                - quantity - the quantity of the ingredient in the recipe in numbers,
                - metric - mesurement for quantity of ingredient, gramms, spoons, cups, bottles, etc.,
            5. steps - an array of steps for preparing the food. Try to describe steps very detailed. Don't add number of the step to the text. Provide chef's tips if applicable.
            6. calories - amount of done food calorie in kkal.
            7. fats - amount of fats in done food in gramms.
            8. protein - amount of protein in done food in gramms.
            9. carbo - amount of carbo in done food in gramms.
            10. cookTime - time in minutes to make food.
            11. type - one of the value from the array [breakfast, snack_1, lunch, snack_2, dinner];
            12. elements - an array of micro and macro nutrition elements.
        `,
    },
    {
      role: "user",
      content: `
        User physical parameters:
            diet - ${user?.profile?.diet};
            user eats ${user?.profile?.mealTypes.join(", ")} in a day;
            user day calories needs ${user?.profile?.metabolism};
            ${
              user?.profile?.food_habits
                ? "user can't eat " + user?.profile?.food_habits
                : "user has no any food habits"
            };
    `,
    },
    {
      role: "user",
      content: eatenMealTypes.length
        ? `User already have ate ${eatenMealTypes.join(
            ", "
          )} for ${calories} calories today`
        : "User have ate nothing today",
    },
    { role: "user", content: `Create ${type} meal type recipe now.` },
  ];
};
