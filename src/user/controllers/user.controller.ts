import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserEntity } from "../entities/user.entity";
import { UserResponseDto } from "../dtos/user-response.dto";
import { UserRequest } from "src/shared/interfaces/user-request.interface";
import { UserService } from "../services/user.service";
import { UserClientQueryDto } from "../dtos/user-client-query.dto";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  @ApiOperation({ summary: "Get user account" })
  @ApiResponse({ status: 200, description: "Success", type: UserEntity })
  async getMe(@Headers() headers): Promise<UserEntity> {
    const token = headers.authorization;
    if (!token) throw new BadRequestException();
    return await this.userService.authMe(token);
  }

  @Get(":userId")
  @ApiOperation({
    summary: "Get user by id",
  })
  @ApiResponse({ status: 200, description: "Success", type: UserEntity })
  async getUser(@Param("id") id: string): Promise<UserEntity> {
    return await this.userService.findOne({ where: { id } });
  }

  @Get("clients")
  @ApiOperation({
    summary: "Get user clients",
  })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: UserEntity,
    isArray: true,
  })
  async getMyClients(
    @Query() query: UserClientQueryDto
  ): Promise<UserEntity[]> {
    return await this.userService.getUserClients(query.userId);
  }
}
