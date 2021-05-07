export = Client;
declare interface StarlingServerResponse {
    data: {
        [key: string]: string;
    };
    version: number;
}

declare class Client {
    constructor(appKey: string, projectName: string, namespace: string, options?: Object);
    getFromCache(key: string): StarlingServerResponse | undefined;
    getPackageByTest(locale: string): StarlingServerResponse | undefined;
    getText(locale: string, key: string): string | undefined;
    getPackage(locale: string): StarlingServerResponse | undefined;
    GetPackageWithFallback(locales: string[]): StarlingServerResponse | undefined;
}