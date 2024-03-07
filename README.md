## PLAN

1. Payment system
2. Openai integration

## MVP

- Start
  //- Dynamic messages, like actions
- Free week (count how many days user has for paid subscription. what if subscription expired)
- Add step what you like and don't like
- Buy list
- Saving recipes
- Count calories
- Send motivations and audios
- Weight tracking (BMI)
- Support
- Country of living
- Nutritional Requirements: Based on their goals, health conditions, age, gender, and level of physical activity, calculate their caloric needs and the balance of macronutrients (carbohydrates, proteins, fats) and micronutrients (vitamins and minerals) needed.
- Activity level

4. Beta

- Add my meal by photo
- App
  - Charts
- Coaches
- Track activities
- Health Metrics: If applicable and available, health metrics like blood sugar levels, cholesterol levels, or any other relevant medical tests can further tailor the menu to support the user's health.
- Cooking Time and Skills: Assess the user's ability and willingness to cook, including how much time they can dedicate to meal preparation. This helps in suggesting recipes that match their cooking skill level and available time.
- Cuisine Preferences: Ask about preferred cuisines or flavors to ensure the menu includes familiar and enjoyable options.

# Find S:CREATED

- S: GENERATING
- MW: CREATED
- MD: CREATED
- M: CREATED

# Find TODAY BETWEEN MW.start/end:CREATED + MDs

- PROMISE.ALL => MDs:CREATED => MD:GENERATING + threadId => M:RUNNING runId

# Find M:RUNNING

- BULK UPDATE M:CHECKING_RUN
- PROMISE.ALL
- M:RUNNING
- M:GENERATED
- CHECK M.MD.Ms:GENERATED => M.MD:GENERATED
  => MD.tokens = thread.tokens
  => MD.threadId start generating ingredients
  => MD:INGREDIENTS_GENERATING runId
- M.MD:CREATED
- M:FAILED

# Find MD:INGREDIENTS_GENERATING

- MD:INGREDIENTS_CHECKING
- MD:INGREDIENTS_GENERATED
- MD:FAILED
- MD:INGREDIENTS_GENERATING

# Find MW:CREATED.MDs:INGREDIENTS_GENERATED

- MW:INGREDIENTS_GENERATING
- get all ingredients from all MD, combine, send to GPT to get unique
- MW:INGREDIENTS_GENERATED

# Find MWs:INGREDIENTS_GENERATED, AND TODAY >= MW.start AND TODAY <= MW.end

- PROMISE.ALL => SEND INGREDIENTS LIST => MW:INGREDIENTS_SENT/FAILED + MESSAGE

# Find MW:INGREDIENTS_SENT AND MD:INGREDIENTS_GENERATED TODAY === MD.date

- MD.Ms.find => !M:SENT === 0 ? MD:COMPLETE : PROMISE.ALL MD.Ms => M:SENT => MD:COMPLETE

# Find MW:INGREDIENTS_SENT + MDs

- IF MDs:COMPLETE => MW:COMPLETE

# S:GENERATING + MW:COMPLETE

- S:COMPLETE
