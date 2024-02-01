import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { Transactional } from "typeorm-transactional";
import config from "../../config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { UserAuth0Interface } from "../interfaces/user-auth0.interface";
import { UserProfileEntity } from "../entities/user-profile.entity";

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
    private httpService: HttpService
  ) {}

  async create(
    userId: string,
    profile: Partial<UserProfileEntity>
  ): Promise<UserProfileEntity> {
    return await this.userProfileRepository.save(
      this.userProfileRepository.create({ userId, ...profile })
    );
  }

  //   async update(
  //     id: string,
  //     updatedProfile: Partial<UserProfileEntity>
  //   ): Promise<UserProfileEntity> {
  //     await this.userProfileRepository.update(id, updatedProfile);
  //     const userProfile = await this.userProfileRepository.findOne({
  //       where: { id },
  //     });
  //     return userProfile;
  //   }
  update(userId: string, updatedProfile: Partial<UserProfileEntity>) {
    console.log("user profile updated");
  }
}
