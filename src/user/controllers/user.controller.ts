import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";
import { UserResponseDto } from "../dtos/user-response.dto";
import { UserRequest } from "src/shared/interfaces/user-request.interface";
import { UserService } from "../services/user.service";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":userId")
  @ApiOperation({
    summary: "Get user by id",
  })
  @ApiResponse({ status: 200, description: "Success", type: UserResponseDto })
  async getUser(@Param("id") id: string): Promise<UserEntity> {
    return await this.userService.findOne({ id });
  }
}
