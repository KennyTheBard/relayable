import express from 'express';
import http from 'http';
import { SocketManager } from '../socket/socket-manager';


(async () => {
   
   const app = express();
   const httpServer = new http.Server(app);

   const socketServer = new SocketManager(httpServer);

   app.listen(3000, () => {

   });

})();
