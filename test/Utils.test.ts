import { Utils } from "../src/Utils";

describe('Utils', () => {
    it('should return uppercase string', function () {
        const result = Utils.toUpperCase('testString');

        expect(result).toEqual('TESTSTRING');
    });

    it('should parse simple url', function () {
        const parsedUrl = Utils.parseUrl('http://localhost:1337/login');

        expect(parsedUrl.href).toEqual('http://localhost:1337/login')
        expect(parsedUrl.port).toEqual('1337')
        expect(parsedUrl.protocol).toEqual('http:')
    });

    it('should parse rul with query', function () {
        const parsedUrl = Utils.parseUrl('http://localhost:1337/login?user=user&pass=pass');
        const expectedQuery = {
            user: 'user',
            pass: 'pass'
        }

        expect(parsedUrl.query).toEqual(expectedQuery);
    });

    it('should throw error on empty url', function () {
        expect(() => Utils.parseUrl('')).toThrowError()
    });
})