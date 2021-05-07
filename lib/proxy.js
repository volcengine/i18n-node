const assert = require('assert');
const Cache = require('./cache');
const fetch = require('node-fetch');

const timeout = 5000;

const cache = new Cache();

class Proxy {
    constructor(options) {
        this.options = options
    }
    async get(key, authToken) {
        assert(key, 'invalid key');

        console.log(`https://starling-public.snssdk.com/v1/key/${key}`)
        const res = await fetch(`https://starling-public.snssdk.com/v1/key/${key}`, {
            method: 'POST',
            timeout,
            headers: {
                'Authorization': `${authToken}`,
                'Content-Type': 'application/json'
            },
            ...this.options
        });

        const result = await res.json();

        cache.set(key, result.data.value);
        return result.data.value;
    }
}

module.exports = Proxy;