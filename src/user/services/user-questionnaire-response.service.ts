import { Injectable } from "@nestjs/common";
import { UserQuestionnaireResponseEntity } from "../entities/user-questionnaire-response.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserQuestionnaireResponseService {
  constructor(
    @InjectRepository(UserQuestionnaireResponseEntity)
    private userQuestionnaireResponseRepository: Repository<UserQuestionnaireResponseEntity>
  ) {}

  async getQuestionnaireResponses(
    questionnaireId: string
  ): Promise<UserQuestionnaireResponseEntity[]> {
    return await this.userQuestionnaireResponseRepository.find({
      where: { questionnaireId },
    });
  }
}
