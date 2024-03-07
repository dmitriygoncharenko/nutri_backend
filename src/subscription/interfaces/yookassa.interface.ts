export interface YookassaPaymentCallbackInterface {
  type: string;
  event: "payment.succeeded" | "payment.canceled";
  object: {
    id: string;
    status: "succeeded" | "canceled";
    paid: boolean;
    amount: {
      value: string;
      currency: string;
    };
    created_at: Date;
    description: string;
    expires_at: Date;
    refundable: boolean;
    test: boolean;
  };
}
