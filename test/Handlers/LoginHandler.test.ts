import { LoginHandler } from '../../src/Handlers/LoginHandler';
import { HTTP_CODES, HTTP_METHODS, SessionToken } from '../../src/Domain/Server';
import { Utils } from '../../src/Utils/Utils';
import { ServerResponse, IncomingMessage } from 'http';
import { Authorizer } from '../../src/Authorization/Authorizer';
import { mock } from 'jest-mock-extended';

let requestMock = mock<IncomingMessage>();
let responseMock = mock<ServerResponse>();
let authorizerMock = mock<Authorizer>();

describe('LoginHandler', () => {

    describe('handleRequest', () => {
        let loginHandler: LoginHandler;

        const getRequestBodyMock = jest.fn();

        beforeEach(() => {
            loginHandler = new LoginHandler(
                requestMock,
                responseMock,
                authorizerMock
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

        it('should respond with token on valid POST request', async () => {
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

            authorizerMock.generateToken.mockResolvedValueOnce(mockSessionToken)

            await loginHandler.handleRequest();

            expect(responseMock.statusCode).toEqual(HTTP_CODES.CREATED);
            expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toHaveBeenCalledWith(JSON.stringify(mockSessionToken));
        });

        it('should respond with NOT_FOUND if there is no token', async () => {
            requestMock.method = HTTP_METHODS.POST;

            getRequestBodyMock.mockReturnValueOnce({
                username: 'mockedUsername',
                password: 'mockedPassword'
            });

            authorizerMock.generateToken.mockReturnValueOnce(null)

            await loginHandler.handleRequest();

            expect(responseMock.statusCode).toEqual(HTTP_CODES.NOT_fOUND);
            expect(responseMock.write).toHaveBeenCalledWith('wrong username or password');
        });

        it('should respond with INTERNAL_SERVER_ERROR in case of error', async () => {
            requestMock.method = HTTP_METHODS.POST;

            const errorMessage = 'Oups, something went wrong!'
            getRequestBodyMock.mockRejectedValueOnce(new Error(errorMessage))
            await loginHandler.handleRequest();

            expect(responseMock.statusCode).toEqual(HTTP_CODES.INTERNAL_SERVER_ERROR);
            expect(responseMock.write).toHaveBeenCalledWith('Internal error: ' + errorMessage);
        });
    })
})