import { Utils } from "../src/Utils";

describe('Utils', () => {
    it('should return empty string', function () {
        const result = Utils.toUpperCase('testString');
        expect(result).toEqual('');
    });
})