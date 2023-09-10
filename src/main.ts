import type {
  FetchOptions,
  FetchInput,
  FetchResponseData,
  FetchResponseError,
  FetchRequestError,
  FetchOptionsOmit
} from "./type"

function mergeOptions(o: FetchOptions, p: FetchOptions): FetchOptions {
  o.headers = o.headers || {}
  if (o.headers instanceof Headers) {
    o.headers = Object.fromEntries(o.headers)
  }
  p.headers = p.headers || {}
  if (p.headers instanceof Headers) {
    p.headers = Object.fromEntries(p.headers)
  }
  const headers = new Headers({ ...o.headers, ...p.headers })
  return {
    ...o,
    ...p,
    headers
  }
}
function concatSearchString(input: FetchInput, query?: Record<string, string>) {
  if (query) {
    const keys = Object.keys(query)
    if (keys.length > 0) {
      input = input.toString()
      const search = keys.reduce((prev, next) => {
        // @ts-ignore
        prev.push(`${next}=${query[next]}`)
        return prev
      }, [] as string[])
      input = input.endsWith("?") ? input.concat(search.join("&")) : input.concat("?", search.join("&"))
    }
  }
  return input
}
export function create(options?: FetchOptions) {
  const supportedResponseType = ['json', 'text', 'blob', 'arrayBuffer', 'formData']
  options = Object.assign({
    timeout: 60000,
    retry: false,
    responseType: 'json'
  }, options || {})
  async function fetchFn<T = unknown>(input: FetchInput, fetchOptions?: FetchOptions) {
    const abortController = new AbortController()
    fetchOptions = fetchOptions || {}
    fetchOptions = mergeOptions(options as FetchOptions, fetchOptions as FetchOptions)
    if (fetchOptions.onRequest && typeof fetchOptions.onRequest === 'function') {
      fetchOptions = await fetchOptions.onRequest(fetchOptions)
    }
    const { baseUrl, timeout, retry, responseType, onRequest, onRequestError, onResponse, onResponseError, ...fetchInit } = fetchOptions
    if (baseUrl) {
      input = new URL(input, baseUrl)
    }
    return new Promise<FetchResponseData<T>>((resolve, reject) => {
      const abortTimer = setTimeout(() => {
        abortController.abort()
        clearTimeout(abortTimer)
      }, timeout);
      fetch(input, {
        ...fetchInit,
        signal: abortController.signal
      })
      .then(async res => {
        if (res.ok) {
          let _data: any = null
          if (responseType && supportedResponseType.includes(responseType)) {
            _data = await res[responseType]()
          } else {
            _data = await res.json()
          }
          let data: FetchResponseData<T> = {
            data: _data,
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            config: fetchOptions as FetchOptions
          }
          if (onResponse && typeof onResponse === 'function') {
            data = await onResponse(data)
          }
          resolve(data)
        } else {
          let err: FetchResponseError = {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            config: fetchOptions as FetchOptions
          }
          if (onResponseError && typeof onResponseError === 'function') {
            err = await onResponseError(err)
          }
          reject(err)
        }
      })
      .catch(async err => {
        if (retry) {
          fetchFn<T>(input, {
            ...fetchOptions,
            retry: false
          })
          .then(resolve, reject)
        } else {
          let _err: FetchRequestError = {
            aborted: 
              err.name === 'AbortError' ||
              err.name === 'AbortSignalError',
            message: err.message,
            config: fetchOptions as FetchOptions
          }
          if (onRequestError && typeof onRequestError === 'function') {
            _err = await onRequestError(_err)
          }
          reject(err)
        }
      })
    })
  }
  fetchFn.get = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "GET",
      ...fetchOptions
    })
  }
  fetchFn.post = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "POST",
      ...fetchOptions
    })
  }
  fetchFn.put = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "PUT",
      ...fetchOptions
    })
  }
  fetchFn.delete = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "DELETE",
      ...fetchOptions
    })
  }
  fetchFn.patch = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "PATCH",
      ...fetchOptions
    })
  }
  fetchFn.head = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "HEAD",
      ...fetchOptions
    })
  }
  fetchFn.trace = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "TRACE",
      ...fetchOptions
    })
  }
  fetchFn.options = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "OPTIONS",
      ...fetchOptions
    })
  }
  fetchFn.connect = <T = unknown>(input: FetchInput, options?: FetchOptionsOmit) => {
    options = options || {}
    const { query, ...fetchOptions } = options
    input = concatSearchString(input, query)
    return fetchFn<T>(input, {
      method: "CONNECT",
      ...fetchOptions
    })
  }
  return fetchFn
}