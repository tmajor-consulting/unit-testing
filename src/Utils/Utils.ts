import {IncomingMessage} from "http";

import {parse, UrlWithParsedQuery} from "url";

export class Utils {
    public static toUpperCase(arg: string): string {
        return arg.toUpperCase();
    }

    public static parseUrl(url: string): UrlWithParsedQuery {
        if(!url) {
            throw new Error('Empty URL!');
        }
        return parse(url, true);
    }

    // Dummy object test example
    public static getRequestBasePath(req: IncomingMessage): string {
        const url = req.url;
        if (url) {
            const parsedUrl = this.parseUrl(url);
            if (parsedUrl.pathname) {
                return parsedUrl.pathname.split('/')[1];
            } else {
                return ''
            }
        } else {
            return '';
        }
    }

    public static async getRequestBody(request: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            request.on('data', (data: string) => {
                body += data;
            });
            request.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (jsonError) {
                    reject(jsonError)
                }
            });
            request.on('error', (error: any) => {
                reject(error)
            });
        });
    }
}