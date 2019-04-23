const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    username: { type: GraphQLString },
    admin: { type: GraphQLBoolean }
  })
});

module.exports = UserType;