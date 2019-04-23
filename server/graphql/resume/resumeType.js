const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLInt } = graphql;
const { InfoType } = require('../info/infoType');
const Info = require('../../models/info');

const ResumeType = new GraphQLObjectType({
  name: "Resume",
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    info: { 
      type: InfoType,
      resolve(obj) {
        return Info.findById(obj.infoId);
      }
    },
    template: { type: GraphQLString },
    path: { type: GraphQLString },
    updateDate: { type: GraphQLString },
    publish: { type: GraphQLBoolean },
    share: { type: GraphQLString },
    tags: { type: GraphQLList(GraphQLString) },
    sum: { type: GraphQLInt },
    num: { type: GraphQLInt }
  })
});

module.exports = ResumeType;