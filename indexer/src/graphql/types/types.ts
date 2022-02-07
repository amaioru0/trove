//@ts-ignore
const schema = `
scalar ObjectID

type Query  {
    getAll(layer: Float!): [Entity]
    geoQuery(topLeftLat: Float, topLeftLng: Float, bottomRightLat: Float, bottomRightLng: Float, layer: Float): [Entity] 
}

type Entity {
    layerId: Float,
    entityId: Float,
    name: String,
    entityType: Float,
    treasureType: Float,
    geohash: String,
    status: Boolean,
    vaultId: Float,
    lat: Float,
    lng: Float
}


schema {
    query: Query
}
`;

module.exports = schema;
