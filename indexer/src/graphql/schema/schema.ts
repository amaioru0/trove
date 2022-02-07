const path = require('path');
const { makeExecutableSchema } = require('graphql-tools');
const { fileLoader, mergeTypes, mergeResolvers } = require ('merge-graphql-schemas');

const typesArray = fileLoader(path.join(__dirname, '../types'), { recursive: true });
const allTypes = mergeTypes(typesArray);
const resolversArray = fileLoader(path.join(__dirname, '../resolvers'));
const allResolvers = mergeResolvers(resolversArray);
//@ts-ignore
const schema = makeExecutableSchema({
    typeDefs: allTypes,
    resolvers: allResolvers
});

module.exports = schema;
