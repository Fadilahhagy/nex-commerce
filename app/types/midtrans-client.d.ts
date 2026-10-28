declare module "midtrans-client" {
  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CreateTransactionOptions {
    transaction_details: TransactionDetails;
    credit_card?: {
      secure?: boolean;
    };
  }

  interface TransactionResponse {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(options: SnapOptions);

    createTransaction(
      parameters: CreateTransactionOptions
    ): Promise<TransactionResponse>;
  }

  const MidtransClient: {
    Snap: typeof Snap;
  };

  export default MidtransClient;
}