import {LoginHandler} from "../../src/Handlers/LoginHandler";
import {HTTP_CODES, HTTP_METHODS} from "../../src/Domain/Server";

describe('LoginHandler', () => {

    describe('handleRequest', () => {
        let loginHandler: LoginHandler;

        const requestMock = {
            method: ''
        };
        const responseMock = {
            writeHead: jest.fn()
        };
        const authorizerMock = {};

        beforeEach(() => {
            loginHandler = new LoginHandler(
                requestMock as any, // DO NOT USE THIS OUTSIDE OF TESTS
                responseMock as any,
                authorizerMock as any
            )
        });

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
    })
})