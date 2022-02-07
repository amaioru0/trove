import mongoose from "mongoose";
import mongoosastic from 'mongoosastic'
import geohash  from "ngeohash";
const { omit, pick } = require('lodash');

const Schema = mongoose.Schema;

// event EntityReady(uint256 layerId, uint256 entityId, string name, EntityType entityType, TreasureType treasureType, string geohash, bool status, uint256 vaultId);


const entitySchema = new Schema(
  {
    layerId: {
      type: Number,
      required: false
    },
    entityId: {
      type: Number,
      required: false
    },   
    name: {
      type: String,
      required: false,
    },
    entityType: {
      type: Number,
      required: false
    },
    treasureType: {
      type: Number,
      required: false
    },
    geohash: {
        type: String,
        required: false,
    },
    status: {
      type: Boolean,
      required: false
    },
    vaultId: {
      type: Number,
      required: false
    },
    // es
    geo_location: {
      geo_point: {
        type: String,
        es_type: 'geo_point',
        // es_lat_lon: true,
        es_indexed: true
      },
      lat: { type: Number },
      lon: { type: Number }
    },

    },
  {
    timestamps: false,
    toObject: { getters: true },
    toJSON: { getters: true },
  }
);

entitySchema.methods.transform = function() {
  const entity = this;
  return pick(entity.toJSON(), ['layerId', 'entityId', 'name', 'entityType', 'treasureType', 'geohash', 'status', 'vaultId']);
};

entitySchema.pre('save', async function(next) {
  this.isDocUpdated = false;
  if (this.isModified()) {
      this.isDocUpdated = true;
  }
  if(!this.geohash) {
    this.status = false;
    next();
  }
  const latlon = geohash.decode(this.geohash);

  const geo_location = {
    lat: latlon.latitude,
    lon: latlon.longitude,
  }
  this.geo_location = geo_location;
  next();
});

entitySchema.plugin(mongoosastic, {
  host:"localhost",
  port: 9200,
  // protocol: "https",
  // auth: "username:password"
   curlDebug: true,
   hydrate:true,
   hydrateOptions: {lean: true}
})

const EntityModel = mongoose.model('Entity', entitySchema);

//@ts-ignore
EntityModel.createMapping(function(err, mapping){
  if(err){
    console.log('ElasticSearch error creating mapping (you can safely ignore this)');
    console.log(err);
  }else{
    console.log('ElasticSearch mapping created for Entity');
    // console.log(mapping);
  }
});

EntityModel.on('es-indexed', function (err, res) {
  console.log('ElasticSearch model added');
  console.log(err)
  console.log(res)
});

// index all documents //
  //@ts-ignore
  const stream = EntityModel.synchronize()
  let count = 0;

    stream.on('data', function(err, doc){
        count++;
        // console.log('indexing: '+ count+ ' done');
    });
    stream.on('close', function(){
        console.log('indexed ' + count + ' entities!');
    });

    stream.on('error', function(err){
        console.log(err);
    });



export default EntityModel;