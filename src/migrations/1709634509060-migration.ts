import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1709634509060 implements MigrationInterface {
    name = 'Migration1709634509060'

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
                'no_special_diet'
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
            CREATE TYPE "public"."MealWeekStatusEnum" AS ENUM(
                'created',
                'generated',
                'complete',
                'ingredients_sent'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "meal_weeks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "start" TIMESTAMP WITH TIME ZONE NOT NULL,
                "end" TIMESTAMP WITH TIME ZONE NOT NULL,
                "status" "public"."MealWeekStatusEnum" NOT NULL DEFAULT 'created',
                "ingredients" jsonb NOT NULL DEFAULT '[]',
                "userId" uuid NOT NULL,
                "subscriptionId" uuid NOT NULL,
                CONSTRAINT "PK_0996260eadac60f7cb1484a9477" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."MealDayStatusEnum" AS ENUM(
                'created',
                'generated',
                'ingredients_running',
                'ingredients_generated'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "meal_days" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "threadId" text,
                "status" "public"."MealDayStatusEnum" NOT NULL DEFAULT 'created',
                "failMessage" text,
                "ingredients" text,
                "ingredientsRunId" text,
                "mealWeekId" uuid NOT NULL,
                CONSTRAINT "PK_78b97cd147689a62b738885a4c8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."MealStatusEnum" AS ENUM(
                'created',
                'running',
                'generated',
                'image_generated',
                'sent',
                'failed'
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
                "failMessage" text,
                "image" text,
                "mealDayId" uuid NOT NULL,
                "messageId" text,
                "runId" text,
                "url" text,
                CONSTRAINT "PK_e6f830ac9b463433b58ad6f1a59" PRIMARY KEY ("id")
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
            CREATE TYPE "public"."SubscriptionTypeEnum" AS ENUM('paid', 'free')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."SubscriptionStatusEnum" AS ENUM(
                'created',
                'paid',
                'canceled',
                'in_progress',
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
                "failMessage" text,
                "paymentId" text,
                "generations" integer NOT NULL,
                CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")
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
            ALTER TABLE "meal_weeks"
            ADD CONSTRAINT "FK_43c2209a81291e19c6a493933c3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "meal_weeks"
            ADD CONSTRAINT "FK_bb36800abeec90891a2aaceeeb7" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "meal_days"
            ADD CONSTRAINT "FK_49d6b041e341ac8ddae34800fd2" FOREIGN KEY ("mealWeekId") REFERENCES "meal_weeks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "meals"
            ADD CONSTRAINT "FK_ff2177e87fb4ea7ac96c05320a6" FOREIGN KEY ("mealDayId") REFERENCES "meal_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "meals"
            ADD CONSTRAINT "FK_3111c7cf13da976d7ed18287811" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"
        `);
        await queryRunner.query(`
            ALTER TABLE "meals" DROP CONSTRAINT "FK_3111c7cf13da976d7ed18287811"
        `);
        await queryRunner.query(`
            ALTER TABLE "meals" DROP CONSTRAINT "FK_ff2177e87fb4ea7ac96c05320a6"
        `);
        await queryRunner.query(`
            ALTER TABLE "meal_days" DROP CONSTRAINT "FK_49d6b041e341ac8ddae34800fd2"
        `);
        await queryRunner.query(`
            ALTER TABLE "meal_weeks" DROP CONSTRAINT "FK_bb36800abeec90891a2aaceeeb7"
        `);
        await queryRunner.query(`
            ALTER TABLE "meal_weeks" DROP CONSTRAINT "FK_43c2209a81291e19c6a493933c3"
        `);
        await queryRunner.query(`
            DROP TABLE "user_email_codes"
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
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_telegramflow_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_telegramstate_enum"
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
            DROP TABLE "meal_days"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."MealDayStatusEnum"
        `);
        await queryRunner.query(`
            DROP TABLE "meal_weeks"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."MealWeekStatusEnum"
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
