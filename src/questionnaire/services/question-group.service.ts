import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionGroupEntity } from "../entities/question-group.entity";
import { Repository } from "typeorm";

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
      .loadRelationCountAndMap("g.questionCount", "g.questions")
      .where("g.id = :groupId", { groupId })
      .getOne();
  }

  async save(questionGroup: Partial<QuestionGroupEntity>) {
    if (questionGroup.id) {
      return await this.questionGroupRepository.save(questionGroup);
    } else {
      return await this.questionGroupRepository.save(
        this.questionGroupRepository.create(questionGroup)
      );
    }
  }
}
