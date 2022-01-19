import { Manager } from "socket.io-client";

(async () => {

   const manager = new Manager("ws://example.com", {
      reconnectionDelayMax: 10000,
   });
   const socket = manager.socket("/");

   socket.on("connect", () => {
      socket.on("request", (msg: string) => {
         console.log(msg);
      });
   });

})();

