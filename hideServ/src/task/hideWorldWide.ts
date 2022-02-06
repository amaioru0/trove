const { pick } = require('lodash');

// import Promise from "bluebird";
const { promisify } = require('util');
const fs = require('fs');
// const readFileAsync = promisify(fs.readFile)
// const writeFileAsync = promisify(fs.writeFile)
// const existsAsync = promisify(fs.exists)
// const path = require('path');
const fsp = require('fs').promises;
// const fsx = require('fs-extra');
const randomFile = require('select-random-file')
const _ = require('lodash');

const randomLocation = require('random-location')
const randomLocationP = promisify(randomFile);

// const Geonames = require('geonames.js')

// const geonames = new Geonames({ username: 'boobo33', lan: 'en', encoding: 'JSON' });

function generateRandomInteger(min: number, max: number) {
  return Math.floor(min + Math.random()*(max + 1 - min))
}

/// hide in continent 

const hideInContinent = async (continent: any, number: number) => {
  for(let i = 0; i < number; i++) {
    const dir = `${__dirname}/states/${continent}`
    const pickedRandomFile = await randomLocationP(dir);
    console.log(`The random file is: ${pickedRandomFile}.`)
    const randomCountryData = await fsp.readFile(`${__dirname}/states/${continent}/${pickedRandomFile}`);
    const randomCountry = JSON.parse(randomCountryData)
    let randomState = undefined;

    if(randomCountry.geonames === undefined) throw("randomCountry.geonames is undefined")
    randomState = _.sample(randomCountry.geonames)
    // console.log(randomState)
    if(randomState === undefined) throw("randomState is undefined")
      const radius = 100000;
      const randomStatePoint = {
        //@ts-ignore
        latitude: randomState.lat,
        //@ts-ignore
        longitude: randomState.lng
      }      
      const randomPoint = randomLocation.randomCirclePoint(randomStatePoint, radius)
      return randomPoint;
  }
}

// hide world wide

const hideWorldWide = async (number: number) => {
  const continents = ['Africa', 'Antarctica', 'Europe', ,'Asia', 'North America', 'South America', 'United States']
  for(let i = 0; i < number; i++) {
    const randomContinent = _.sample(continents)
    if(randomContinent !== undefined) {
      const location = await hideInContinent(randomContinent, 1)
      return location;
    }
  }
}


export default hideWorldWide;
