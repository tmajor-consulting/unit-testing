import { SessionTokenDBAccess } from '../../src/Authorization/SessionTokenDBAccess';
import * as Nedb from 'nedb';
import Mock = jest.Mock;
import {SessionToken} from "../../src/Domain/Server";

jest.mock('nedb');


describe('SessionTokenDBAccess', () => {
    let sessionTokenDBAccess: SessionTokenDBAccess;

    const nedbMock = {
        loadDatabase: jest.fn(),
        insert: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(() => {
        sessionTokenDBAccess = new SessionTokenDBAccess(nedbMock as any);

        expect(nedbMock.loadDatabase).toHaveBeenCalledTimes(1)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('storeSessionToken', () => {
        const mockSessionToken: SessionToken = {
            accessRights: [1, 2],
            expirationTime: new Date(60 * 60 * 1000),
            userName: 'mockedUserName',
            valid: true,
            tokenId: 'mockedTokenId'
        }

        it('should store session token without error', async () => {
            nedbMock.insert.mockImplementationOnce(
                (mockToken: any, mockCallback: any) => {
                    mockCallback();
                }
            )

            await sessionTokenDBAccess.storeSessionToken(mockSessionToken);

            expect(nedbMock.insert).toHaveBeenCalledWith(mockSessionToken, expect.any(Function))
        });

        it('should handle errors', async () => {
            const errorMessage = 'Oups, something went wrong!'

            nedbMock.insert.mockImplementationOnce(
                (mockToken: any, mockCallback: any) => {
                    mockCallback(new Error(errorMessage));
                }
            )

            await expect(sessionTokenDBAccess.storeSessionToken(mockSessionToken)).rejects.toThrowError(errorMessage);

            expect(nedbMock.insert).toHaveBeenCalledWith(mockSessionToken, expect.any(Function))
        });
    })

})