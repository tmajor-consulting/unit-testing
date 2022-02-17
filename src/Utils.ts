import {parse, UrlWithParsedQuery} from "url";

export class Utils {
    public static toUpperCase(arg: string): string {
        return arg.toUpperCase();
    }

    public static parseUrl(url: string): UrlWithParsedQuery {
        return parse(url, true);
    }
}