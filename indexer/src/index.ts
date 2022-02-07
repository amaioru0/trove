require('dotenv').config()
import express from "express";
import { ethers } from "ethers";
import { TroveRegistry as TroveRegistryType } from './typechain/TroveRegistry'
const fs = require('fs').promises;
const path = require('path');
import mongoose from 'mongoose';
import keccak256 from 'keccak256';
import 'dotenv/config' 

import EntityModel from './models/entity.model'

const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/schema/schema');




const privateKey = process.env.PRIVATEKEY;

const LAST_SYNC = 24670454;

(async () => {
  //@ts-ignore
  mongoose.connect("mongodb://localhost:27017/th_dev", { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
  console.log("Connected to MongoDB")

  const wsProvider = new ethers.providers.WebSocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/mreBORU2DbTDLNPVt88CNrFYNzwvEOUV", { name: "mumbai", chainId: 80001 });

  // await EntityModel.deleteMany({});
  const entities = await EntityModel.find({});
  console.log(entities)

  let BLOCK = 0;

  wsProvider.on("block", (block) => {
    BLOCK = block;
    console.log(BLOCK)
  });

  //@ts-ignore
  const wallet = new ethers.Wallet(privateKey, wsProvider) 
  const rawData = await fs.readFile(path.join(__dirname, 'data', 'mumbai.json'));
  const data = JSON.parse(rawData);

  const troveRegistryContract = new ethers.Contract(data.contracts.TroveRegistry.address, data.contracts.TroveRegistry.abi, wallet) as TroveRegistryType;
  const iface = new ethers.utils.Interface(data.contracts.TroveRegistry.abi);

  // console.log(troveRegistryContract.interface.events)
  const event = troveRegistryContract.interface.events["EntityReady(uint256,uint256,string,uint8,uint8,string,bool,uint256)"]

  const logs = await wsProvider.getLogs({
    fromBlock: LAST_SYNC,
    toBlock: "latest",
    address: data.contracts.TroveRegistry.address,
    //@ts-ignore
    topics: event.topics
  })

  let events = logs.map((log) => iface.parseLog(log))
  events.map((event) => {
    console.log(event)
    if(event.eventFragment.name == "EntityReady") {
    const entityToIndex = {
      layerId: parseInt(event.args[0].toString()),
      entityId: parseInt(event.args[1].toString()),
      name: event.args[2],
      entityType: event.args[3],
      treasureType: event.args[4],
      geohash: event.args[5],
      status: event.args[6],
      vaultId: event.args[7] ? parseInt(event.args[7].toString()) : 0
    }
    EntityModel.create(entityToIndex);
   }

  })
});
})();



// const app = express();
// const PORT = 8945;

// app.get("/", (req: express.Request, res: express.Response) => {
//   res.send("hideServ");
// });

// const server = new ApolloServer({
//   schema,
//   context: async ({ req, connection }) => {
//   },
//   playground: {
//     settings: {
//       'editor.cursorShape': 'line',
//     },
//   },
// });

// server.applyMiddleware({
//   app,
//   path: '/graphql',
//   cors: false,
// });

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

