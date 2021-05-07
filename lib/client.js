const Auth = require('./auth');
const assert = require('assert');
const Proxy = require('./proxy');
const Cache = require('./cache');
const schedule = require('node-schedule');

const Canary = "canary";
const ModelGray = "gray";
const ModeTest  = "test";
const ModeNormal = "normal";
class Client {
    constructor(appKey, projectName, namespace, options = {}) {
        assert(appKey, `appKey is required`);
        assert(projectName, `projectName is required`);
        assert(namespace, `namespace is required`);
        this.appKey = appKey;
        this.projectName = projectName;
        this.namespace = namespace;
        this.options = options;
        const { fetchOptions = {} } = options
        this.cache = new Cache();
        this.proxy = new Proxy(fetchOptions);
        const auth = new Auth();
        this.authToken = auth.CreateAuthToken(appKey, projectName);
    }

    /**
     * 生成key
     * @param {String} projectName 
     * @param {String} namespace 
     */
    _generate_key(projectName, namespace, locale, test) {
        if (test) {
            return `${ModeTest}/${projectName}/${namespace}/${locale}`;
        } else {
            return `${ModeNormal}/${projectName}/${namespace}/${locale}`;
        }
    }

    /**
     * 获取数据
     * @param {String} key 
     */
    async _getData(key) {
        return await this.getFromCache(key);
    }

    async getFromCache(key) {
        let value = this.cache.get(key);

        if(!value) {
            value = await this.proxy.get(key, this.authToken);
            this.NewAsyncCache(key, value);
        }

        return value;
    }

    NewAsyncCache(key, value) {
        schedule.scheduleJob('*/20 * * * * *', () => {
            this.proxy.get(key, this.authToken);
        });
    }

    /**
     * 获取全部数据
     * @param {String} locale 
     * @param {Boolean} test
     */
    async _getPack(locale, test) {
        const key = this._generate_key(this.projectName, this.namespace, locale, test);

        const data = await this._getData(key);
        if (!data || data.length <= 11) {
            return;
        }
        const rawData = JSON.parse(data.substring(11));

        return rawData;
    }


    /**
     * 获取单个数据
     * @param {String} locale 
     * @param {String} key 
     * @param {Boolean} test
     */
    async _getText(locale, key, test) {
        const raw_data = await this._getPack(locale, test);

        if (raw_data) {
            return raw_data["data"][key];
        } else {
            return;
        }
    }

    /**
     * 根据locale和key获取一个文案
     * @param {String} locale 
     * @param {String} key 
     */
    async getText(locale, key) {
        assert(locale, `locale is required`);
        assert(key, `key is required`);

        const lang = locale.split('-')[0];
        const region = locale.split('-')[1];

        let raw_data = await this._getText(locale, key);
        // 当所传的locale没有值且有region时降级获取lang
        if(!raw_data && region) raw_data = await this._getText(lang, key);
        return raw_data;
    }

    async getTextByTest(locale, key) {
        assert(locale, `locale is required`);
        assert(key, `key is required`);

        let raw_data = await this._getText(locale, key, true);
        return raw_data;
    }

    /**
     * 根据 locale获取该语言包下面的所有文案
     * @param {String} locale 
     */
    async getPackage(locale) {
        assert(locale, `locale is required`);

        const lang = locale.split('-')[0];
        const region = locale.split('-')[1];

        let raw_data = await this._getPack(locale);
        // 当所传的locale没有值且有region时降级获取lang
        if(!raw_data && region) raw_data = await this._getPack(lang);
        return raw_data;
    }

    /**
     * 根据 locale获取该语言包下面的所有文案，支持降级，顺序从左到右
     * @param {Array} locales
     */
    async GetPackageWithFallback(locales) {
        if (locales.length === 0 || !Array.isArray(locales)) {
            return;
        } else {
            for (var locale of locales) {
                let raw_data = await this._getPack(locale);
                if (raw_data) return raw_data;
            }
        }
    }

    async getPackageByTest(locale) {
        assert(locale, `locale is required`);

        let raw_data = await this._getPack(locale, true);
        return raw_data;
    }
}

module.exports = Client;