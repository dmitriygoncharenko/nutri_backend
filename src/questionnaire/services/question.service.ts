import { Injectable } from "@nestjs/common";
import { QuestionEntity } from "../entities/question.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>
  ) {}

  async getQuestionsByGroupId(groupId: string): Promise<QuestionEntity[]> {
    return await this.questionRepository.find({ where: { groupId } });
  }

  @Transactional()
  async save(question: QuestionEntity) {
    let entity = {
      ...new QuestionEntity(),
      ...question,
    };
    if (!entity.id) {
      entity = this.questionRepository.create(entity);
    }
    return await this.questionRepository.save(entity);
  }

  async findOne(id: string): Promise<QuestionEntity> {
    return await this.questionRepository
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.grades", "grade")
      .where("question.id = :id", { id })
      .getOne();
  }

  @Transactional()
  async delete(id: string): Promise<UpdateResult> {
    return await this.questionRepository.softDelete(id);
  }
}
