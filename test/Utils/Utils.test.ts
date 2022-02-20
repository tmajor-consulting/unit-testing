import { Utils } from "../../src/Utils/Utils";
import {IncomingMessage} from "http";

describe('Utils', () => {

    describe('toUpperCase', () => {
        it('should return uppercase string', function () {
            const result = Utils.toUpperCase('testString');

            expect(result).toEqual('TESTSTRING');
        });
    })

    describe('parseUrl', () => {
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
            expect(() => Utils.parseUrl('')).toThrowError('Empty URL')
        });
    })

    describe('getRequestBasePath', () => {
        it('should return base path for a valid request',  () => {
            const url = 'http://localhost:8080/login';

            const result = Utils.getRequestBasePath(url);

            expect(result).toEqual('login');
        });

    })
})