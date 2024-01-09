import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionGroupEntity } from "../entities/question-group.entity";
import { Repository, UpdateResult } from "typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class QuestionGroupService {
  constructor(
    @InjectRepository(QuestionGroupEntity)
    private questionGroupRepository: Repository<QuestionGroupEntity>
  ) {}

  async findOne(groupId: string): Promise<QuestionGroupEntity> {
    return await this.questionGroupRepository
      .createQueryBuilder("g")
      .leftJoinAndSelect("g.questions", "question", "question.groupId = g.id", {
        groupId,
      })
      .orderBy("question.createdAt", "ASC")
      .loadRelationCountAndMap("g.questionCount", "g.questions")
      .where("g.id = :groupId", { groupId })
      .getOne();
  }

  @Transactional()
  async save(questionGroup: Partial<QuestionGroupEntity>) {
    let entity = {
      ...new QuestionGroupEntity(),
      ...questionGroup,
    };
    if (!entity.id) {
      entity = this.questionGroupRepository.create(entity);
    }
    return await this.questionGroupRepository.save(entity);
  }

  @Transactional()
  async delete(id: string): Promise<UpdateResult> {
    return await this.questionGroupRepository.softDelete(id);
  }
}
