import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
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
    profile: Partial<UserProfileEntity>
  ): Promise<UserProfileEntity> {
    return await this.userProfileRepository.save(
      this.userProfileRepository.create(profile)
    );
  }

  async update(
    userProfileId: string,
    updatedProfile: Partial<UserProfileEntity>
  ) {
    return await this.userProfileRepository.update(
      userProfileId,
      updatedProfile
    );
  }

  async findOne(
    where: FindOptionsWhere<UserProfileEntity>
  ): Promise<UserProfileEntity> {
    return await this.userProfileRepository.findOne({ where });
  }
}
