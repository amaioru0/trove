require('dotenv').config()
import express from "express";
import { ethers } from "ethers";
import { TroveRegistry as TroveRegistryType } from './typechain/TroveRegistry'
const fs = require('fs').promises;
const path = require('path');
import mongoose from 'mongoose';
import keccak256 from 'keccak256';
import geohash  from "ngeohash";
import 'dotenv/config' 


import TreasureModel from './models/entity.model'


const privateKey = process.env.PRIVATEKEY;

(async () => {
  //@ts-ignore
  mongoose.connect("mongodb://localhost:27017/th_dev", { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
  console.log("Connected to MongoDB")


  //@ts-ignore
  const wallet = new ethers.Wallet(privateKey, wsProvider) 
  const rawData = await fs.readFile(path.join(__dirname, 'data', 'mumbai.json'));
  const data = JSON.parse(rawData);

  const troveRegistryContract = new ethers.Contract(data.contracts.TroveRegistry.address, data.contracts.TroveRegistry.abi, wallet) as TroveRegistryType;


  const wsProvider = new ethers.providers.WebSocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/mreBORU2DbTDLNPVt88CNrFYNzwvEOUV", { name: "mumbai", chainId: 80001 });

  let event = troveRegistryContract.interface.events["EntityReady"]
  console.log(event)
  
});
})();



// const app = express();
// const PORT = 8945;

// app.get("/", (req: express.Request, res: express.Response) => {
//   res.send("hideServ");
// });

// // app.get('/test', callD_alembert);


// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });
