import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  @Transactional()
  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  async findOne(findData: {
    id?: string;
    email?: string;
    telegramChatId?: number;
  }): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { ...findData },
    });
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
}
