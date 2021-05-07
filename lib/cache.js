const lruCache = require('lru-cache');

const MAX_SIZE = 500;
const Cache = new lruCache(MAX_SIZE);

class cache {
    set(key ,value) {
        Cache.set(key, value);
    }

    get(key) {
        return Cache.get(key);
    }

    reset() {
        Cache.reset();
    }
}

module.exports = cache;