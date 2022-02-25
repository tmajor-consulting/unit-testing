import { Server } from '../../src/Server/Server'
import { LoginHandler } from '../../src/Handlers/LoginHandler';
import { Authorizer } from '../../src/Authorization/Authorizer';
import { UsersDBAccess } from '../../src/Data/UsersDBAccess';
import { DataHandler } from '../../src/Handlers/DataHandler';

jest.mock('../../src/Handlers/LoginHandler');
jest.mock('../../src/Handlers/DataHandler');
jest.mock('../../src/Authorization/Authorizer');

const requestMock = {
    url: 'mockUrl'
};
const responseMock = {
    end: jest.fn()
};
const listenMock = {
    listen: jest.fn()
};

jest.mock('http', () => ({
    createServer: (cb: any) => {
        cb(requestMock, responseMock)
        return listenMock
    }
}))

describe('Server', () => {
    it('should create server on port 8080', function () {
        new Server().startServer();

        expect(listenMock.listen).toHaveBeenCalledWith(8080);
        expect(responseMock.end).toHaveBeenCalled();
    });

    it('should handle login requests', function () {
        requestMock.url = 'http://localhost:8080/login';
        new Server().startServer();

        const handleRequestSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest');
        expect(handleRequestSpy).toHaveBeenCalled();

        expect(LoginHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer))
    });

    it('should handle user requests', function () {
        requestMock.url = 'http://localhost:8080/users';
        new Server().startServer();

        const dataRequestSpy = jest.spyOn(DataHandler.prototype, 'handleRequest');
        expect(dataRequestSpy).toHaveBeenCalled();

        expect(DataHandler).toHaveBeenCalledWith(requestMock, responseMock, expect.any(Authorizer), expect.any(UsersDBAccess))
    });
})