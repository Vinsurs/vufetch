# vufetch
[![npm version](https://badge.fury.io/js/vufetch.svg)](https://badge.fury.io/js/vufetch)
A fetch wrapper, supports timeout, interceptor and retry

# installation

```bash
npm install vufetch --save  
```

# usage
```javascript
import * as vufetch from 'vufetch'

const myFetch = vufetch.create({
    // common options
    baseURL: 'https://www.example.com',
    timeout: 10000,  // default 1 min
    // interceptors
    onRequest(options) {
        return options
    },
    onRequestError(err) {
        return Promise.reject(err)
    },
    onResponse(data) {
        // handle data
        // ...
        return data
    },
    onResponseError(err) {
        return Promise.reject(err)
    },
})
myFetch.get('/users', {
    retry: true,
})
.then(console.log)
.catch(err => {
    // we use AbortController API to abort request to fit timeout, so you can use error.aborted to judge whether the request is timeout
    if (err.aborted) {
        // ...
    }
    console.log(err)
})
```

# License

MIT