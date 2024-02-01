import { Injectable } from "@nestjs/common";
import { UserEmailCodeEntity } from "../entities/user-email-code.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserEmailCodeService {
  constructor(
    @InjectRepository(UserEmailCodeEntity)
    private userEmailCodeRepository: Repository<UserEmailCodeEntity>
  ) {}

  @Transactional()
  async create(value: Partial<UserEmailCodeEntity>) {
    return await this.userEmailCodeRepository.save(
      this.userEmailCodeRepository.create(value)
    );
  }

  async findOne(
    value: FindOptionsWhere<UserEmailCodeEntity>
  ): Promise<UserEmailCodeEntity> {
    return await this.userEmailCodeRepository.findOne({ where: value });
  }

  @Transactional()
  async softDelete(id: string): Promise<DeleteResult> {
    return await this.userEmailCodeRepository.softDelete({ id });
  }
}
