import { Server } from './Server/Server';

export class App {
    
    private server: Server;

    public constructor() {
        this.server = new Server();
    }
    public launchApp() {
        this.server.startServer();
    }

}

new App().launchApp();