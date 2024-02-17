import { Injectable } from "@nestjs/common";
import { RestService } from "src/rest/services/rest.service";
import {
  TelegraphPageInterface,
  TelegraphPageResponseInterface,
} from "../interfaces/telegraph.interface";
import { telegraphConfig } from "src/config/telegraph.config";

@Injectable()
export class TelegraphService {
  constructor(private readonly restService: RestService) {}

  async createPage(
    page: TelegraphPageInterface
  ): Promise<TelegraphPageResponseInterface> {
    const { accessToken } = telegraphConfig();
    const params: TelegraphPageInterface = {
      access_token:
        "d3b25feccb89e508a9114afb82aa421fe2a9712b963b387cc5ad71e58722",
      author_name: "NUTRINETIC",
      author_url: "https://t.me/nutri_lab_bot",
      return_content: true,
      ...page,
    };
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
