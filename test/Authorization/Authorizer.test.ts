import {Authorizer} from "../../src/Authorization/Authorizer";
import { SessionTokenDBAccess } from '../../src/Authorization/SessionTokenDBAccess';
import { UserCredentialsDbAccess } from '../../src/Authorization/UserCredentialsDbAccess';

jest.mock('../../src/Authorization/SessionTokenDBAccess');
jest.mock('../../src/Authorization/UserCredentialsDbAccess');

describe('Authorizer', () => {
    let authorizer: Authorizer;

    it('should use mocked arguments in constructor correctly', function () {
        new Authorizer();

        expect(SessionTokenDBAccess).toHaveBeenCalled();
        expect(UserCredentialsDbAccess).toHaveBeenCalled();
    });
})