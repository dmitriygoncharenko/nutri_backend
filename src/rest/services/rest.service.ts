import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { map, catchError, lastValueFrom } from "rxjs";
import { AxiosRequestConfig } from "axios";

@Injectable()
export class RestService {
  constructor(private readonly httpService: HttpService) {}

  async get(path: string, requestConfig?: AxiosRequestConfig) {
    const request = this.httpService
      .get(path, requestConfig)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((err) => {
          throw new BadRequestException(JSON.stringify(err));
        })
      );

    const data = await lastValueFrom(request);

    return { data };
  }

  async post(path: string, payload: any, requestConfig?: AxiosRequestConfig) {
    const request = this.httpService
      .post(path, payload, requestConfig)
      .pipe(map((res) => res.data))
      .pipe(
        catchError((err) => {
          throw new BadRequestException(JSON.stringify(err));
        })
      );

    const data = await lastValueFrom(request);

    return { data };
  }
}
