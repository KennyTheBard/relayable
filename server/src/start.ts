import cors from 'cors';
import express, { Request, Response, Router } from 'express';
import http from 'http';
import { ErrorHandlerMiddleware } from './middleware';
import { ResponseData, SocketManager } from './socket/socket-manager';


(async () => {
   
   const app = express();
   const httpServer = new http.Server(app);

   const socketServer = new SocketManager(httpServer);

   // add middleware
   app.use(express.json());
   app.use(cors());
   app.use(new ErrorHandlerMiddleware().use);

   const router = Router();
   router.all('*', async (req: Request, res: Response) => {
      console.log(req.url);
      await socketServer.sendRequest(req, (data: ResponseData) => {
         res.status(data.status)
            .contentType(data.contentType)
            .send(data.body);
      })
   });

   app.use('/', router)

   app.listen(3000, () => {
      console.log(`Server starting on port 3000`);
   });

})();
