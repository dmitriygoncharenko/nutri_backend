import { Module } from "@nestjs/common";
import { RestService } from "./services/rest.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [RestService],
  exports: [RestService],
})
export class RestModule {}
