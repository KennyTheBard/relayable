import axios from 'axios';
import { Manager } from 'socket.io-client';

(async () => {

   const manager = new Manager('ws://localhost:3001', {
      reconnectionDelayMax: 10000,
   });
   const socket = manager.socket('/');

   socket.on('connect', () => {
      socket.on('request', (msg) => {
         const req = msg.message;
         console.log(req);

         setTimeout(() => socket.emit('response', {
            id: req.id,
            data: {
               status: 200,
               contentType: 'text/plain',
               body: 'example'
            }
         }), 1000);
      });
   });

   setInterval(() => axios.post('http://localhost:3000/test', {
      value: 'example'
   }), 2000);
   

})();

