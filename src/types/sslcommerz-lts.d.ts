declare module 'sslcommerz-lts' {
  class SSLCommerz {
    constructor(store_id: string, store_passwd: string, isLive: boolean);
    init(data: any): Promise<any>;
  }

  export = SSLCommerz;
}
