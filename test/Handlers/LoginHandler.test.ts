import {LoginHandler} from "../../src/Handlers/LoginHandler";
import {HTTP_CODES, HTTP_METHODS, SessionToken} from "../../src/Domain/Server";
import {Utils} from "../../src/Utils/Utils";

describe('LoginHandler', () => {

    describe('handleRequest', () => {
        let loginHandler: LoginHandler;

        const requestMock = {
            method: ''
        };
        const responseMock = {
            writeHead: jest.fn(),
            write: jest.fn(),
            statusCode: 0
        };
        const authorizerMock = {
            generateToken: jest.fn()
        };

        const getRequestBodyMock = jest.fn();

        beforeEach(() => {
            loginHandler = new LoginHandler(
                requestMock as any, // DO NOT USE THIS OUTSIDE OF TESTS
                responseMock as any,
                authorizerMock as any
            )
            Utils.getRequestBody = getRequestBodyMock;
        });

        afterEach(() => {
            jest.clearAllMocks();
        })

        it('should respond with OK for OPTIONS call', async() => {
            requestMock.method = HTTP_METHODS.OPTIONS;
            await loginHandler.handleRequest();
            expect(responseMock.writeHead).toHaveBeenCalledTimes(1);
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK);
        });

        it('should break on not handled http methods', async () => {
            requestMock.method = 'randomMethod';
            await loginHandler.handleRequest();

            expect(responseMock.writeHead).not.toHaveBeenCalled();
        });

        it.only('should respond with token on valid POST request', async () => {
            requestMock.method = HTTP_METHODS.POST;

            getRequestBodyMock.mockReturnValueOnce({
                username: 'mockedUsername',
                password: 'mockedPassword'
            });

            const mockSessionToken: SessionToken = {
                accessRights: [1,2],
                expirationTime: new Date(),
                tokenId: 'mockedTokenId',
                userName: 'mockedUserName',
                valid: true
            }

            authorizerMock.generateToken.mockReturnValueOnce(mockSessionToken)

            await loginHandler.handleRequest();

            expect(responseMock.statusCode).toEqual(HTTP_CODES.CREATED);
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(mockSessionToken));

        });
    })
})