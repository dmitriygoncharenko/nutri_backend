import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { Transactional } from "typeorm-transactional";
import config from "../../config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { UserAuth0Interface } from "../interfaces/user-auth0.interface";
import { UserProfileEntity } from "../entities/user-profile.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserProfileEntity)
    private userProfileRepository: Repository<UserProfileEntity>,
    private httpService: HttpService
  ) {}

  @Transactional()
  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = await this.userRepository.save({
      ...this.userRepository.create(user),
      profile: this.userProfileRepository.create(user.profile),
    });
    return newUser;
  }

  // @Transactional()
  // async createWithProfile(
  //   user: Partial<UserEntity>,
  //   userProfile: Partial<UserProfileEntity>
  // ): Promise<UserEntity> {
  //   return await this.user;
  // }

  async findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOne(options);
  }

  async update(
    id: string,
    updatedUser: Partial<UserEntity>
  ): Promise<UserEntity> {
    await this.userRepository.update(id, updatedUser);
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  @Transactional()
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getUserClients(coachId: string): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.coaches", "coach")
      .leftJoinAndSelect("user.profile", "profile")
      .where("coach.id = :coachId", { coachId })
      .getMany();
  }

  async authMe(accessToken: string): Promise<UserEntity> {
    const { auth0Config } = config();
    console.log(
      "`${auth0Config.domain}userinfo`",
      `${auth0Config.domain}userinfo`
    );
    const { data } = (await firstValueFrom(
      this.httpService.get(`${auth0Config.domain}userinfo`, {
        headers: { Authorization: accessToken },
      })
    )) as AxiosResponse<UserAuth0Interface>;
    console.log("🚀 ~ UserService ~ authMe ~ data:", data);
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (!user) {
      const user = await this.create({
        email: data.email,
        profile: {
          fullname:
            data.given_name || data.nickname + data.family_name
              ? ` ${data.family_name}`
              : "",
          avatar: data.picture,
        },
      });
    }
    return user;
  }
}
