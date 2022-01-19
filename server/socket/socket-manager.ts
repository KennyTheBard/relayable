import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Request, Response } from 'express';
import AwaitLock from 'await-lock';
import { v4 as uuid } from 'uuid';


export class SocketManager {
   private readonly server: SocketServer;
   private readonly relaySocketLock: AwaitLock = new AwaitLock();
   private readonly onResponseFnMap: Map<string, OnResponseFn> = new Map();
   private relaySocket: Socket = null;

   constructor(
      httpServer: HttpServer
   ) {
      this.server = new SocketServer(httpServer);

      this.server.on('connect', async (localSocket) => {
         await this.onConnect(localSocket);

         localSocket.on('response', (msg: string) => {
            console.log(msg);
            
            const response = this.parseResponse(msg);
            this.onResponseFnMap.get(response.id)(response);
         });

         localSocket.on('disconnect', () => {
            this.onDisconnect(localSocket);
         });
      });
   }

   public async sendRequest(request: Request, onResponse: OnResponseFn): Promise<boolean> {
      await this.relaySocketLock.acquireAsync();
      try {
         if (!this.relaySocket) {
            return false;
         }

         const id = uuid();
         this.onResponseFnMap.set(id, onResponse);

         return this.relaySocket.emit('request', {
            message: this.serilizeRequest(id, request),
            id: this.relaySocket.id
         });
      } finally {
         this.relaySocketLock.release();
      }
   }

   private async onConnect(localSocket: Socket) {
      await this.relaySocketLock.acquireAsync();
      try {
         if (this.relaySocket) {
            localSocket.disconnect();
            return;
         }
         this.relaySocket = localSocket;
      } finally {
         this.relaySocketLock.release();
      }
   }

   private async onDisconnect(localSocket: Socket) {
      await this.relaySocketLock.acquireAsync();
      try {
         if (this.relaySocket === localSocket) {
            this.relaySocket = null;
         }
      } finally {
         this.relaySocketLock.release();
      }
   }

   private serilizeRequest(id: string, request: Request): string {
      return JSON.stringify({
         id,
         request: {
            url: request.url,
            params: request.params,
            query: request.query,
            headers: request.headers,
            body: request.body
         }
      });
   }

   private parseResponse(response: string): RelayResponse {
      return JSON.parse(response);
   }
}

export type OnResponseFn = (response: RelayResponse) => void;

export type RelayResponse = {
   id: string;
   response: {
      statusCode: number;
      statusMessage: string;
      body: string;
   }
};