import {Authorizer} from '../../src/Authorization/Authorizer';
import { SessionTokenDBAccess } from '../../src/Authorization/SessionTokenDBAccess';
import { UserCredentialsDbAccess } from '../../src/Authorization/UserCredentialsDbAccess';
import {Account, SessionToken} from '../../src/Domain/Server';
import { mock } from 'jest-mock-extended';

let sessionTokenDBAccessMock = mock<SessionTokenDBAccess>();
let userCredentialsDBAccessMock = mock<UserCredentialsDbAccess>();

describe('Authorizer', () => {
    let authorizer: Authorizer;

    // jest-mock-extended doesn't allow this sort of test
    xit('should use mocked arguments in constructor correctly', function () {
        new Authorizer();

        expect(SessionTokenDBAccess).toHaveBeenCalled();
        expect(UserCredentialsDbAccess).toHaveBeenCalled();
    });


    describe('generateToken', () => {
        beforeEach(() => {
            authorizer = new Authorizer(
                sessionTokenDBAccessMock,
                userCredentialsDBAccessMock
            )
        })

        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should return a sessionToken for valid credentials', async () => {
            userCredentialsDBAccessMock.getUserCredential.mockResolvedValueOnce({
                username: 'mockedUserName',
                password: 'mockedPassword',
                accessRights: [1,2]
            })

            const mockedAccount: Account = {
                username: 'mockedUserName',
                password: 'mockedPassword'
            }

            const expectedSessionToken: SessionToken = {
                accessRights: [1, 2],
                expirationTime: new Date(60 * 60 * 1000),
                userName: 'mockedUserName',
                valid: true,
                tokenId: ''
            }

            jest.spyOn(global.Math, 'random').mockReturnValueOnce(0);
            jest.spyOn(global.Date, 'now').mockReturnValueOnce(0)

            const sessionToken = await authorizer.generateToken(mockedAccount);

            expect(sessionToken).toEqual(expectedSessionToken);
            expect(sessionTokenDBAccessMock.storeSessionToken).toHaveBeenCalledWith(sessionToken)
        });
    })
})