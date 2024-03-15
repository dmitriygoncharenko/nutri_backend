import { Injectable } from "@nestjs/common";
import { RestService } from "src/rest/services/rest.service";
import { SubscriptionService } from "./subscription.service";
import { yookassaConfig } from "src/config/yookassa.config";
import { Transactional } from "typeorm-transactional";
import {
  ICreatePayment,
  IReceipt,
  Payment,
  YooCheckout,
} from "@a2seven/yoo-checkout";
import { ApiBasicAuth } from "@nestjs/swagger";
import { createBasicAuthToken } from "src/rest/utilities/basic-auth-token.utility";
import { UserProfileEntity } from "src/user/entities/user-profile.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { AxiosResponse } from "axios";

@Injectable()
export class YookassaService {
  constructor(private readonly restService: RestService) {}

  async getPayment(paymentId: string): Promise<Payment> {
    const { shopId, secretKey } = yookassaConfig();
    const Authorization = createBasicAuthToken(shopId, secretKey);
    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
      Authorization,
    };
    const response = (await this.restService.get(
      `https://api.yookassa.ru/v3/payments/${paymentId}`,
      { headers }
    )) as AxiosResponse<Payment>;
    return response.data;
  }

  @Transactional()
  async createPayment(
    amount: string,
    description: string,
    subscriptionId: string,
    user: UserEntity
  ): Promise<Payment> {
    console.log("🚀 ~ YookassaService ~ user:", user);
    try {
      const { shopId, secretKey } = yookassaConfig();
      const Authorization = createBasicAuthToken(shopId, secretKey);
      const headers = {
        Authorization,
        "Idempotence-Key": String(new Date().getTime()),
        "Content-Type": "application/json",
      };
      const receipt = {
        customer: {
          email: user.email,
        },
        items: [
          {
            description,
            quantity: "1",
            amount: {
              value: amount,
              currency: "RUB",
            },
            vat_code: "1",
          },
        ],
      };

      const payload = {
        amount: {
          value: amount,
          currency: "RUB",
        },
        capture: true,
        metadata: {
          subscriptionId,
        },
        confirmation: {
          type: "redirect",
          return_url: "https://nutrinetic.ru/payment?status=success",
        },
        receipt,
        description,
      };

      const response = (await this.restService.post(
        "https://api.yookassa.ru/v3/payments",
        payload,
        { headers }
      )) as AxiosResponse<Payment>;
      console.log("🚀 ~ YookassaService ~ response:", response);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
}
