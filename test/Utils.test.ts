import { Utils } from "../src/Utils";

describe('Utils', () => {
    it('should return uppercase string', function () {
        const result = Utils.toUpperCase('testString');
        expect(result).toEqual('TESTSTRING');
    });
})