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
    return await this.questionnaireRepository.find();
  }

  async findOne(id: string): Promise<QuestionnaireEntity> {
    return await this.questionnaireRepository.findOne({ where: { id } });
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
