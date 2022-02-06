require('dotenv').config()
// import express from "express";
// import Web3 from 'web3';
import { ethers } from "ethers";
import { TroveRegistry as TroveRegistryType } from './typechain/TroveRegistry'
const fs = require('fs').promises;
const path = require('path');
const amqp = require('amqplib/callback_api');
// import utmToLatLng from './utils/utmToLatLng';
import hideWorldWide from './task/hideWorldWide';
// import MerkleTree from 'merkletreejs';
import keccak256 from 'keccak256';
import geohash  from "ngeohash";
// import CID from 'cids';
// const { ipfs } = require("./utils/ipfs");
import 'dotenv/config' 


const privateKey = process.env.PRIVATEKEY;

(async () => {
  //@ts-ignore
    const wsProvider = new ethers.providers.WebSocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/mreBORU2DbTDLNPVt88CNrFYNzwvEOUV", { name: "mumbai", chainId: 80001 });

    //@ts-ignore
    const wallet = new ethers.Wallet(privateKey, wsProvider) 
    const rawData = await fs.readFile(path.join(__dirname, 'data', 'mumbai.json'));
    const data = JSON.parse(rawData);

    const troveRegistryContract = new ethers.Contract(data.contracts.TroveRegistry.address, data.contracts.TroveRegistry.abi, wallet) as TroveRegistryType;
  
    // get random location function
    const getLocation = async () => {
      try {
        const result:any = await hideWorldWide(1)
        // const location = `${result.name}, ${result.countryName}`
        if(result !== undefined) console.log(result)
        if(result !== undefined) return result;
      } catch(err) {
        console.error(err)
        const location = await getLocation();
        return location;
      }
    }

  
    // listen to events on TroveRegistry
    troveRegistryContract.on("EntityAdded", async (layerId, entityId, name, entityType, treasureType) => {
      console.log(`New entity added on layer ${layerId} with id ${entityId}`)
      console.log(`Entity name: ${name}`)
      console.log(`Entity type: ${entityType}`)
      console.log(`Treasure Type: ${treasureType}`)

      const location = await getLocation();
      const entityGeohash = geohash.encode(location.latitude, location.longitude)
      console.log(`Geohash is ${entityGeohash}`)
      const tx = await troveRegistryContract.fullfillGeohash(layerId, entityId, entityGeohash)
      console.log(tx)
    })
    console.log("Listening to events...")


 
})();


