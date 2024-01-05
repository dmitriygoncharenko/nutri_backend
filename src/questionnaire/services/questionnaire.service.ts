import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionnaireEntity } from "../entities/questionnaire.entity";
import { Repository, UpdateResult } from "typeorm";
import { QuestionnaireSaveDto } from "../dtos/questionnaire-save.dto";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireEntity)
    private questionnaireRepository: Repository<QuestionnaireEntity>
  ) {}

  async findAll(): Promise<QuestionnaireEntity[]> {
    return await this.questionnaireRepository
      .createQueryBuilder("q")
      .loadRelationCountAndMap("q.groupCount", "q.groups")
      .getMany();
  }

  async findOne(id: string): Promise<QuestionnaireEntity> {
    const q = await this.questionnaireRepository
      .createQueryBuilder("q")
      .leftJoinAndSelect("q.groups", "group", "group.questionnaireId = q.id")
      .loadRelationCountAndMap("group.questionCount", "group.questions")
      .where("q.id = :id", { id })
      .getOne();

    return q;
  }

  @Transactional()
  async save(payload: QuestionnaireSaveDto): Promise<QuestionnaireEntity> {
    if (payload.id) {
      return await this.questionnaireRepository.save(payload);
    } else {
      return await this.questionnaireRepository.save(
        this.questionnaireRepository.create(payload)
      );
    }
  }

  @Transactional()
  async delete(id: string): Promise<UpdateResult> {
    return await this.questionnaireRepository.softDelete(id);
  }
}
