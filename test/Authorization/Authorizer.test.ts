import {Authorizer} from "../../src/Authorization/Authorizer";
import { SessionTokenDBAccess } from '../../src/Authorization/SessionTokenDBAccess';
import { UserCredentialsDbAccess } from '../../src/Authorization/UserCredentialsDbAccess';
import {Account, SessionToken} from "../../src/Domain/Server";

jest.mock('../../src/Authorization/SessionTokenDBAccess');
jest.mock('../../src/Authorization/UserCredentialsDbAccess');

describe('Authorizer', () => {
    let authorizer: Authorizer;

    it('should use mocked arguments in constructor correctly', function () {
        new Authorizer();

        expect(SessionTokenDBAccess).toHaveBeenCalled();
        expect(UserCredentialsDbAccess).toHaveBeenCalled();
    });


    describe('generateToken', () => {
        const sessionTokenDBAccessMock = {
            storeSessionToken: jest.fn(),
        };
        const userCredentialsDBAccessMock = {
            getUserCredential: jest.fn(),
        };

        beforeEach(() => {
            authorizer = new Authorizer(
                sessionTokenDBAccessMock as any,
                userCredentialsDBAccessMock as any
            )
        })

        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should return a sessionToken for valid credentials', async () => {
            userCredentialsDBAccessMock.getUserCredential.mockReturnValueOnce({
                username: 'mockedUserName',
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