import type { FetchOptions, FetchInput, FetchResponseData, FetchOptionsOmit } from "./type";
export declare function create(options?: FetchOptions): {
    <T = unknown>(input: FetchInput, fetchOptions?: FetchOptions): Promise<FetchResponseData<T>>;
    get<T_1 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_1>>;
    post<T_2 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_2>>;
    put<T_3 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_3>>;
    delete<T_4 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_4>>;
    patch<T_5 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_5>>;
    head<T_6 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_6>>;
    trace<T_7 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_7>>;
    options<T_8 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_8>>;
    connect<T_9 = unknown>(input: FetchInput, options?: FetchOptionsOmit): Promise<FetchResponseData<T_9>>;
};
