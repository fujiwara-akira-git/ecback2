// スマレジAPI連携ライブラリ
export interface SmaregiConfig {
  contractId: string
  accessToken: string
  baseUrl: string
}

export interface SmaregiProduct {
  productId: string
  productCode: string
  productName: string
  price: number
  categoryId?: string
  stockQuantity?: number
}

export interface SmaregiTransaction {
  transactionHeadId: string
  transactionDateTime: string
  total: number
  subtotal: number
  taxAmount: number
  items: SmaregiTransactionItem[]
}

export interface SmaregiTransactionItem {
  productId: string
  productCode: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface SmaregiStock {
  productId: string
  storeId: string
  stockQuantity: number
  reserveQuantity: number
  stockDivision: string
}

export class SmaregiAPI {
  private config: SmaregiConfig

  constructor(config: SmaregiConfig) {
    this.config = config
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
      'X-contract-id': this.config.contractId,
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`スマレジAPI Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('スマレジAPI Request Error:', error)
      throw error
    }
  }

  // 商品情報取得
  async getProducts(params?: {
    limit?: number
    page?: number
    categoryId?: string
  }): Promise<SmaregiProduct[]> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.categoryId) queryParams.set('categoryId', params.categoryId)

    const response = await this.request(`/pos/products?${queryParams}`)
    return response.data || []
  }

  // 商品作成
  async createProduct(product: Omit<SmaregiProduct, 'productId'>): Promise<SmaregiProduct> {
    const response = await this.request('/pos/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
    return response.data
  }

  // 商品更新
  async updateProduct(productId: string, product: Partial<SmaregiProduct>): Promise<SmaregiProduct> {
    const response = await this.request(`/pos/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
    return response.data
  }

  // 商品削除
  async deleteProduct(productId: string): Promise<void> {
    await this.request(`/pos/products/${productId}`, {
      method: 'DELETE',
    })
  }

  // 取引情報取得
  async getTransactions(params?: {
    limit?: number
    page?: number
    dateFrom?: string
    dateTo?: string
  }): Promise<SmaregiTransaction[]> {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.dateFrom) queryParams.set('dateFrom', params.dateFrom)
    if (params?.dateTo) queryParams.set('dateTo', params.dateTo)

    const response = await this.request(`/pos/transactions?${queryParams}`)
    return response.data || []
  }

  // 取引作成（売上登録）
  async createTransaction(transaction: {
    items: Array<{
      productId: string
      quantity: number
      unitPrice?: number
    }>
    paymentMethod?: string
    customerId?: string
  }): Promise<SmaregiTransaction> {
    const response = await this.request('/pos/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    })
    return response.data
  }

  // 在庫情報取得
  async getStock(params?: {
    storeId?: string
    productId?: string
  }): Promise<SmaregiStock[]> {
    const queryParams = new URLSearchParams()
    if (params?.storeId) queryParams.set('storeId', params.storeId)
    if (params?.productId) queryParams.set('productId', params.productId)

    const response = await this.request(`/pos/stocks?${queryParams}`)
    return response.data || []
  }

  // 在庫更新
  async updateStock(stockData: {
    productId: string
    storeId: string
    stockQuantity: number
    reason?: string
  }): Promise<SmaregiStock> {
    const response = await this.request('/pos/stocks', {
      method: 'PUT',
      body: JSON.stringify(stockData),
    })
    return response.data
  }

  // 顧客情報取得
  async getCustomers(params?: {
    limit?: number
    page?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.page) queryParams.set('page', params.page.toString())

    const response = await this.request(`/pos/customers?${queryParams}`)
    return response.data || []
  }

  // ヘルスチェック
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.request('/pos/health')
      return {
        status: 'connected',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'disconnected',
        timestamp: new Date().toISOString()
      }
    }
  }
}

// スマレジ設定管理
export const getSmaregiConfig = (): SmaregiConfig => {
  return {
    contractId: process.env.SMAREGI_CONTRACT_ID || '',
    accessToken: process.env.SMAREGI_ACCESS_TOKEN || '',
    baseUrl: process.env.SMAREGI_BASE_URL || 'https://api.smaregi.jp/v1'
  }
}

// デフォルトインスタンス
export const smaregi = new SmaregiAPI(getSmaregiConfig())