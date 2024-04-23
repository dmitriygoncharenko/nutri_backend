import {Injectable} from "@nestjs/common";
import {Client} from "@notionhq/client";
import {notionConfig} from "../config/notion.config";
import {BlockObjectRequest, CreatePageResponse} from "@notionhq/client/build/src/api-endpoints";
import {convertDateToISO} from "../shared/utilities/date.utility";
import {markdownToBlocks} from '@tryfabric/martian';

@Injectable()
export class NotionService {
    private notionClient: Client;
    constructor() {
        this.notionClient = new Client({
            auth: notionConfig().token,
        });

    }

    async createPage(databaseId: string, title: string, coverImage: string, emoji: any, content: string, date: Date) {
        try {
            console.log(content, markdownToBlocks(content))

            const response:CreatePageResponse = await this.notionClient.pages.create({
                parent: { database_id: databaseId },
                cover: { external:{ url: coverImage } },
                icon: { emoji },
                properties: {
                    Name: { title: [{ text: { content: title, }}] },
                    Date: { date: { start: convertDateToISO(date) } }
                }
            });

            await this.notionClient.blocks.children.append({
                block_id: response.id,
                children: markdownToBlocks(content) as BlockObjectRequest[],
            });
            return response;
        } catch (error) {
            console.error('Error creating Notion page:', error);
            throw error;
        }
    }
}