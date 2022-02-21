import { App } from '../src/App';
import { mocked } from 'ts-jest/utils'
import { Server } from '../src/Server/Server'

jest.mock('../src/Server/Server', () => {
    return {
        Server: jest.fn(() => {
            return {
                startServer: () => {
                    console.log('Starting mocked server');
                }
            }
        })
    }
})

describe('App', () => {
    it('should use mocked arguments in constructor correctly', function () {
        const mockedServer = mocked(Server, true);

        new App(); // should call console.log()
        expect(mockedServer).toHaveBeenCalled();
    });

    describe('launchApp', () => {
        it('should call startServer correctly', () => {
            const launchAppMock = jest.fn();
            App.prototype.launchApp = launchAppMock;

            new App().launchApp();

            expect(launchAppMock).toHaveBeenCalled();
        });
    })
})