export type FetchInput = string | URL
export type Fetchinterceptor = {
  onRequest?: (requestOptions: RequestOptions) => RequestOptions | Promise<RequestOptions>
  onRequestError?: (requestError: FetchRequestError) => Promise<FetchRequestError>
  onResponse?: (response: FetchResponseData) => FetchResponseData | Promise<FetchResponseData>
  onResponseError?: (responseError: FetchResponseError) => Promise<FetchResponseError>
}
export type ExtraOptions = {
  url: FetchInput
  baseUrl?: FetchInput
  /** 
   * @default 60000
   */
  timeout?: number
  /**
   * @default false
   */
  retry?: boolean
  /**
   * @default 'json'
   */
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  query?: RequestQuery
}
export type FetchCreateOptions = Omit<FetchOptions, "url">
export type RequestQuery = Record<string, any>
export type RequestDataOption = RequestInit["body"] | RequestQuery
export type RequestOptions = Omit<RequestInit, 'signal'> & ExtraOptions
export type FetchOptions = RequestOptions & Fetchinterceptor
export type FetchOptionsOmit = Omit<FetchOptions, "method"|"query"|"body"|"url">
export type FetchResponseData<T = any> = {
  data: T
  headers: Headers
  status: number
  statusText: string
  config: FetchOptions
}
export type FetchRequestError = {
  aborted: boolean
  message: string
  config: FetchOptions
}
export type FetchResponseError = {
  status: number
  statusText: string
  headers: Headers
  config: FetchOptions
}