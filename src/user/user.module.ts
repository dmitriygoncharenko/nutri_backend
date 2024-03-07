import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { HttpModule } from "@nestjs/axios";
import { UserProfileService } from "./services/user-profile.service";
import { UserEmailCodeEntity } from "./entities/user-email-code.entity";
import { UserEmailCodeService } from "./services/user-code.service";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserEmailCodeEntity,
      UserProfileEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserProfileService, UserEmailCodeService],
  exports: [UserService, UserProfileService, UserEmailCodeService],
})
export class UserModule {}
