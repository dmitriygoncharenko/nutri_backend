import { Injectable } from "@nestjs/common";
import { RestService } from "src/rest/services/rest.service";
import {
  TelegraphPageInterface,
  TelegraphPageResponseInterface,
} from "../interfaces/telegraph.interface";
import { telegramConfig } from "src/config/telegram.config";

@Injectable()
export class TelegraphService {
  constructor(private readonly restService: RestService) {}

  async createPage(
    page: TelegraphPageInterface
  ): Promise<TelegraphPageResponseInterface> {
    const { accessToken } = telegramConfig().telegraph;
    const params: TelegraphPageInterface = {
      access_token: accessToken,
      author_name: "NUTRINETIC",
      author_url: "https://t.me/nutri_lab_bot",
      return_content: true,
      ...page,
    };
    //@ts-ignore
    const { data } = await this.restService.post(
      "https://api.telegra.ph/createPage",
      {
        ...params,
        content: JSON.stringify(page.content),
      }
    );
    console.log("🚀 ~ TelegraphService ~ data:", data);
    return data as TelegraphPageResponseInterface;
  }
}
