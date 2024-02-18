import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1708229998420 implements MigrationInterface {
    name = 'Migration1708229998420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."user_profiles_gender_enum" AS ENUM('MALE', 'FEMALE')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_profiles_goal_enum" AS ENUM(
                'weight_loss',
                'dietary_restrictions',
                'health_condition_performance',
                'fitness_athletic_performance',
                'energy_mood_improvement',
                'convenience_time_saving',
                'learning_new_recipes',
                'improving_digestive_health'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."UserRegionEnum" AS ENUM(
                'western_and_northern_europe_north_america',
                'mediterranean_middle_east_central_asia',
                'east_and_southeast_asia',
                'south_asia_africa',
                'latin_america_caribbean'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_profiles_activity_level_enum" AS ENUM('1000', '1375', '1550', '1725', '1900')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."ProfileMealTypeEnum" AS ENUM(
                'breakfast',
                'lunch',
                'dinner',
                'snack_1',
                'snack_2'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_profiles_diet_enum" AS ENUM(
                'mediterranean',
                'vegetarian',
                'vegan',
                'pescetarianism',
                'lacto_vegetarian',
                'ovo_vegetarian',
                'paleo',
                'keto',
                'all'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_profiles_family_relation_enum" AS ENUM(
                'Single',
                'Married',
                'Divorced',
                'Widowed',
                'Separated'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."PaymentMethodEnum" AS ENUM('russian_card', 'international_card')
        `);
        await queryRunner.query(`
            CREATE TABLE "user_profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "fullname" text,
                "telegramName" text,
                "avatar" character varying,
                "gender" "public"."user_profiles_gender_enum" NOT NULL DEFAULT 'MALE',
                "dob" text,
                "weight" integer,
                "height" integer,
                "metabolism" integer,
                "goal" "public"."user_profiles_goal_enum" array NOT NULL DEFAULT '{}',
                "location" "public"."UserRegionEnum",
                "food_habits" text,
                "activity_level" "public"."user_profiles_activity_level_enum",
                "mealTypes" "public"."ProfileMealTypeEnum" array NOT NULL DEFAULT '{}',
                "diet" "public"."user_profiles_diet_enum",
                "city" text,
                "environment" text,
                "family_relation" "public"."user_profiles_family_relation_enum",
                "children_count" integer,
                "occupation" text,
                "initial_request" text,
                "initial_complaints" text,
                "payment_method" "public"."PaymentMethodEnum" NOT NULL DEFAULT 'russian_card',
                CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_weights_weight_metric_enum" AS ENUM('KG', 'LB')
        `);
        await queryRunner.query(`
            CREATE TABLE "user_weights" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "weight" numeric(5, 2) NOT NULL,
                "weight_metric" "public"."user_weights_weight_metric_enum" NOT NULL DEFAULT 'KG',
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_c706b25a032e9440ddc219762c0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "analysis_values" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "value" numeric,
                "description" text,
                "date" TIMESTAMP WITH TIME ZONE,
                "analysisId" uuid NOT NULL,
                CONSTRAINT "PK_49b9d1f3ff0fe0a17738465a8ac" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "analysis" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "caption" text NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_300795d51c57ef52911ed65851f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_heights_height_metric_enum" AS ENUM('M', 'CM', 'FT', 'IN')
        `);
        await queryRunner.query(`
            CREATE TABLE "user_heights" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "height" integer NOT NULL,
                "height_metric" "public"."user_heights_height_metric_enum" NOT NULL DEFAULT 'CM',
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_44f7c5d92dea13cb994a93dc7f9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "caption" text NOT NULL,
                "description" text,
                "userId" uuid,
                CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_health_problems" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "description" text NOT NULL,
                "skipped" boolean NOT NULL DEFAULT false,
                "isAI" boolean NOT NULL DEFAULT false,
                "creatorId" uuid,
                "responseId" uuid NOT NULL,
                CONSTRAINT "PK_f05ba0bab875747bea289899b82" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_questionnaire_responses" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "questionnaireId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_759335e6eee62e07c8dbbdc4c21" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "questionnaires" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "caption" text NOT NULL,
                CONSTRAINT "PK_a01d7cdea895ed9796b29233610" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "question_groups" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "caption" text,
                "questionnaireId" uuid NOT NULL,
                CONSTRAINT "PK_ed2dbb62bbf024ce5d04504276f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "question_grades" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "answer" text NOT NULL,
                "grade" numeric NOT NULL,
                "questionId" uuid NOT NULL,
                CONSTRAINT "PK_4c954ece8da060b3766e1af8d63" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."questions_type_enum" AS ENUM('YESNO', 'GRADE', 'FREETEXT')
        `);
        await queryRunner.query(`
            CREATE TABLE "questions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "caption" text NOT NULL,
                "description" text,
                "type" "public"."questions_type_enum" NOT NULL DEFAULT 'FREETEXT',
                "groupId" uuid NOT NULL,
                CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_questionnaire_answers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "questionId" uuid NOT NULL,
                "answer" text,
                "grade" numeric,
                "responseId" uuid NOT NULL,
                CONSTRAINT "PK_5ea8b5e365fb3b88407e09703ab" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_hrzones" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "zone1" text NOT NULL,
                "zone2" text NOT NULL,
                "zone3" text NOT NULL,
                "zone4" text NOT NULL,
                "zone5" text NOT NULL,
                CONSTRAINT "PK_ddf994221637d0cdad49d18d0a1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "training_plans" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "creatorId" uuid NOT NULL,
                "typeId" uuid NOT NULL,
                "description" text NOT NULL,
                "date" date NOT NULL,
                "time" TIME WITH TIME ZONE,
                CONSTRAINT "PK_246975cb895b51662b90515a390" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_coach_profiles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "title" text NOT NULL,
                CONSTRAINT "PK_7b89d5dc8c318d6d3a4ce8905f2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."MealStatusEnum" AS ENUM(
                'created',
                'in_progress',
                'generated',
                'sent',
                'sent_failed'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."MealTypeEnum" AS ENUM(
                'breakfast',
                'lunch',
                'dinner',
                'snack_1',
                'snack_2'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "meals" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "status" "public"."MealStatusEnum" NOT NULL DEFAULT 'created',
                "type" "public"."MealTypeEnum" NOT NULL,
                "response" text,
                "image" text,
                "date" TIMESTAMP WITH TIME ZONE,
                "mealGroupId" uuid NOT NULL,
                "messageId" text,
                "runId" text,
                "url" text,
                CONSTRAINT "PK_e6f830ac9b463433b58ad6f1a59" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."MealGroupStatusEnum" AS ENUM(
                'created',
                'meals_queue',
                'meals_generation',
                'meal_generating',
                'ready_for_shopping',
                'shopping_list_in_progress',
                'awaiting_shopping_list',
                'ready_to_send',
                'complete',
                'failed'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "meal_groups" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "start" TIMESTAMP WITH TIME ZONE NOT NULL,
                "end" TIMESTAMP WITH TIME ZONE NOT NULL,
                "threadId" text,
                "status" "public"."MealGroupStatusEnum" NOT NULL DEFAULT 'created',
                "failMessage" text,
                "shoppingList" text,
                "shoppingListRunId" text,
                "subscriptionId" uuid NOT NULL,
                CONSTRAINT "PK_45c2c168cd56afaf543bb7e6cd7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."SubscriptionTypeEnum" AS ENUM('paid', 'free')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."SubscriptionStatusEnum" AS ENUM(
                'created',
                'paid',
                'not_paid',
                'in_progress',
                'processed',
                'expired',
                'failed'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "subscriptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "type" "public"."SubscriptionTypeEnum" NOT NULL DEFAULT 'paid',
                "status" "public"."SubscriptionStatusEnum" NOT NULL DEFAULT 'created',
                "provider_payment_charge_id" text,
                "telegram_payment_charge_id" text,
                "generations" integer NOT NULL,
                CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_telegramstate_enum" AS ENUM(
                'default',
                'start_init',
                'start_gender',
                'start_weight',
                'start_dob',
                'start_calories',
                'start_height',
                'start_email',
                'start_email_code',
                'start_coach',
                'start_food_type',
                'start_food_count',
                'start_goal',
                'start_modules',
                'start_food_habits',
                'start_activity_level',
                'start_location',
                'recipe_init',
                'recipe_diet',
                'recipe_ingredients',
                'recipe_calories',
                'weight_init',
                'weight_bmi',
                'pay_init',
                'free_init'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_telegramflow_enum" AS ENUM(
                'default',
                'start',
                'recipe',
                'pay',
                'motivation',
                'addweight',
                'addfood',
                'addactivity'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "email" character varying,
                "email_verified" boolean NOT NULL DEFAULT false,
                "auth0Id" text,
                "phone" text,
                "profileId" uuid,
                "telegramId" integer,
                "telegramUsername" text,
                "telegramState" "public"."users_telegramstate_enum" NOT NULL DEFAULT 'default',
                "telegramFlow" "public"."users_telegramflow_enum",
                CONSTRAINT "UQ_d7925ac1be04ad9d0f11c14d707" UNIQUE ("auth0Id"),
                CONSTRAINT "UQ_df18d17f84763558ac84192c754" UNIQUE ("telegramId"),
                CONSTRAINT "REL_b1bda35cdb9a2c1b777f5541d8" UNIQUE ("profileId"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "diary_foods" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "diaryId" uuid NOT NULL,
                "time" TIME WITH TIME ZONE NOT NULL,
                "eaten" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_36103932514301d7d058e455314" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "diaries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "date" date NOT NULL,
                "sleep" text,
                "energy" text,
                "emotion" text,
                "physical" text,
                "comment" text,
                CONSTRAINT "PK_ffd738e7d40dcfa59283dcaae87" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "diary_waters" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "value" integer NOT NULL,
                "diaryId" uuid NOT NULL,
                "time" TIME WITH TIME ZONE NOT NULL,
                CONSTRAINT "PK_d90a1b6fba3af5063b593dd79dc" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "trainings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "typeId" uuid NOT NULL,
                "distance" integer NOT NULL,
                "duration" integer NOT NULL,
                "hr" integer NOT NULL,
                "calories" integer NOT NULL,
                CONSTRAINT "PK_b67237502b175163e47dc85018d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "training_types" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "caption" text NOT NULL,
                CONSTRAINT "PK_a79a847b5d16cfbb514bb9305b0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_email_codes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "code" text NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_7a7a09306415c839f7abdf1715b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_coaches" (
                "clientId" uuid NOT NULL,
                "coachId" uuid NOT NULL,
                CONSTRAINT "PK_0fd15a381caef46822527704eba" PRIMARY KEY ("clientId", "coachId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_a0a62803e307407c524b059f0e" ON "user_coaches" ("clientId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_23f0922c133b209a889ffa81a4" ON "user_coaches" ("coachId")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_weights"
            ADD CONSTRAINT "FK_52a1d12efaab2946140fea97548" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "analysis_values"
            ADD CONSTRAINT "FK_41a50de11c635735765c9e7e591" FOREIGN KEY ("analysisId") REFERENCES "analysis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "analysis"
            ADD CONSTRAINT "FK_b17befb30bc9daf5b0fedbb283a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_heights"
            ADD CONSTRAINT "FK_69b1ee696a9c4292956dc1abaaf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_health_problems"
            ADD CONSTRAINT "FK_0eaff04f195952f6ae8d0345a96" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_health_problems"
            ADD CONSTRAINT "FK_be4dada18b5017cd49d8112ff53" FOREIGN KEY ("responseId") REFERENCES "user_questionnaire_responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_questionnaire_responses"
            ADD CONSTRAINT "FK_d2c2160622530dfd7f5bd2f1030" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "question_groups"
            ADD CONSTRAINT "FK_4cf05cce8733536648d412a1916" FOREIGN KEY ("questionnaireId") REFERENCES "questionnaires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "question_grades"
            ADD CONSTRAINT "FK_fe35dec2245293565f8825d6e92" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "questions"
            ADD CONSTRAINT "FK_09feeade34acdfb5d972a9fa9d6" FOREIGN KEY ("groupId") REFERENCES "question_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_questionnaire_answers"
            ADD CONSTRAINT "FK_c1feab1edcb18377e51da5ed556" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_questionnaire_answers"
            ADD CONSTRAINT "FK_0b74f8a0464988fc1726854e225" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_questionnaire_answers"
            ADD CONSTRAINT "FK_56db178ef9ab65eac669a01f7ff" FOREIGN KEY ("responseId") REFERENCES "user_questionnaire_responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_hrzones"
            ADD CONSTRAINT "FK_be86ce89d63ad424a14b0c701f6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "training_plans"
            ADD CONSTRAINT "FK_fcd44ba1f6a0cf0fbe9c7645715" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "training_plans"
            ADD CONSTRAINT "FK_926ca086365248594d09efb000d" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "meals"
            ADD CONSTRAINT "FK_2776790f38532329df87617c379" FOREIGN KEY ("mealGroupId") REFERENCES "meal_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "meals"
            ADD CONSTRAINT "FK_3111c7cf13da976d7ed18287811" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "meal_groups"
            ADD CONSTRAINT "FK_1db3d7ba61be621d952f449c0c7" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "diary_foods"
            ADD CONSTRAINT "FK_c6ecf647615b00392ede1c0b9ff" FOREIGN KEY ("diaryId") REFERENCES "diaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "diaries"
            ADD CONSTRAINT "FK_6454969d8c037fee60374c8527c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "diary_waters"
            ADD CONSTRAINT "FK_fc8a9819736e95f44eda7446f72" FOREIGN KEY ("diaryId") REFERENCES "diaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "trainings"
            ADD CONSTRAINT "FK_0c29a4986f24a6c82f07584e6d6" FOREIGN KEY ("typeId") REFERENCES "training_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_coaches"
            ADD CONSTRAINT "FK_a0a62803e307407c524b059f0e7" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_coaches"
            ADD CONSTRAINT "FK_23f0922c133b209a889ffa81a47" FOREIGN KEY ("coachId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_coaches" DROP CONSTRAINT "FK_23f0922c133b209a889ffa81a47"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_coaches" DROP CONSTRAINT "FK_a0a62803e307407c524b059f0e7"
        `);
        await queryRunner.query(`
            ALTER TABLE "trainings" DROP CONSTRAINT "FK_0c29a4986f24a6c82f07584e6d6"
        `);
        await queryRunner.query(`
            ALTER TABLE "diary_waters" DROP CONSTRAINT "FK_fc8a9819736e95f44eda7446f72"
        `);
        await queryRunner.query(`
            ALTER TABLE "diaries" DROP CONSTRAINT "FK_6454969d8c037fee60374c8527c"
        `);
        await queryRunner.query(`
            ALTER TABLE "diary_foods" DROP CONSTRAINT "FK_c6ecf647615b00392ede1c0b9ff"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"
        `);
        await queryRunner.query(`
            ALTER TABLE "meal_groups" DROP CONSTRAINT "FK_1db3d7ba61be621d952f449c0c7"
        `);
        await queryRunner.query(`
            ALTER TABLE "meals" DROP CONSTRAINT "FK_3111c7cf13da976d7ed18287811"
        `);
        await queryRunner.query(`
            ALTER TABLE "meals" DROP CONSTRAINT "FK_2776790f38532329df87617c379"
        `);
        await queryRunner.query(`
            ALTER TABLE "training_plans" DROP CONSTRAINT "FK_926ca086365248594d09efb000d"
        `);
        await queryRunner.query(`
            ALTER TABLE "training_plans" DROP CONSTRAINT "FK_fcd44ba1f6a0cf0fbe9c7645715"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_hrzones" DROP CONSTRAINT "FK_be86ce89d63ad424a14b0c701f6"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_questionnaire_answers" DROP CONSTRAINT "FK_56db178ef9ab65eac669a01f7ff"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_questionnaire_answers" DROP CONSTRAINT "FK_0b74f8a0464988fc1726854e225"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_questionnaire_answers" DROP CONSTRAINT "FK_c1feab1edcb18377e51da5ed556"
        `);
        await queryRunner.query(`
            ALTER TABLE "questions" DROP CONSTRAINT "FK_09feeade34acdfb5d972a9fa9d6"
        `);
        await queryRunner.query(`
            ALTER TABLE "question_grades" DROP CONSTRAINT "FK_fe35dec2245293565f8825d6e92"
        `);
        await queryRunner.query(`
            ALTER TABLE "question_groups" DROP CONSTRAINT "FK_4cf05cce8733536648d412a1916"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_questionnaire_responses" DROP CONSTRAINT "FK_d2c2160622530dfd7f5bd2f1030"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_health_problems" DROP CONSTRAINT "FK_be4dada18b5017cd49d8112ff53"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_health_problems" DROP CONSTRAINT "FK_0eaff04f195952f6ae8d0345a96"
        `);
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_heights" DROP CONSTRAINT "FK_69b1ee696a9c4292956dc1abaaf"
        `);
        await queryRunner.query(`
            ALTER TABLE "analysis" DROP CONSTRAINT "FK_b17befb30bc9daf5b0fedbb283a"
        `);
        await queryRunner.query(`
            ALTER TABLE "analysis_values" DROP CONSTRAINT "FK_41a50de11c635735765c9e7e591"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_weights" DROP CONSTRAINT "FK_52a1d12efaab2946140fea97548"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_23f0922c133b209a889ffa81a4"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a0a62803e307407c524b059f0e"
        `);
        await queryRunner.query(`
            DROP TABLE "user_coaches"
        `);
        await queryRunner.query(`
            DROP TABLE "user_email_codes"
        `);
        await queryRunner.query(`
            DROP TABLE "training_types"
        `);
        await queryRunner.query(`
            DROP TABLE "trainings"
        `);
        await queryRunner.query(`
            DROP TABLE "diary_waters"
        `);
        await queryRunner.query(`
            DROP TABLE "diaries"
        `);
        await queryRunner.query(`
            DROP TABLE "diary_foods"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_telegramflow_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_telegramstate_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "subscriptions"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."SubscriptionStatusEnum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."SubscriptionTypeEnum"
        `);
        await queryRunner.query(`
            DROP TABLE "meal_groups"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."MealGroupStatusEnum"
        `);
        await queryRunner.query(`
            DROP TABLE "meals"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."MealTypeEnum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."MealStatusEnum"
        `);
        await queryRunner.query(`
            DROP TABLE "user_coach_profiles"
        `);
        await queryRunner.query(`
            DROP TABLE "training_plans"
        `);
        await queryRunner.query(`
            DROP TABLE "user_hrzones"
        `);
        await queryRunner.query(`
            DROP TABLE "user_questionnaire_answers"
        `);
        await queryRunner.query(`
            DROP TABLE "questions"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."questions_type_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "question_grades"
        `);
        await queryRunner.query(`
            DROP TABLE "question_groups"
        `);
        await queryRunner.query(`
            DROP TABLE "questionnaires"
        `);
        await queryRunner.query(`
            DROP TABLE "user_questionnaire_responses"
        `);
        await queryRunner.query(`
            DROP TABLE "user_health_problems"
        `);
        await queryRunner.query(`
            DROP TABLE "notifications"
        `);
        await queryRunner.query(`
            DROP TABLE "user_heights"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_heights_height_metric_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "analysis"
        `);
        await queryRunner.query(`
            DROP TABLE "analysis_values"
        `);
        await queryRunner.query(`
            DROP TABLE "user_weights"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_weights_weight_metric_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "user_profiles"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."PaymentMethodEnum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_profiles_family_relation_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_profiles_diet_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."ProfileMealTypeEnum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_profiles_activity_level_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."UserRegionEnum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_profiles_goal_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_profiles_gender_enum"
        `);
    }

}
