const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const { UserQuery, UserMutation } = require('./user/userOp');
const { InfoQuery, InfoMutation } = require('./info/infoOp');
const { ResumeQuery, ResumeMutation } = require('./resume/resumeOp');

const query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    users: {
      type: UserQuery,
      resolve: () => ({})
    },
    infos: {
      type: InfoQuery,
      resolve: () => ({})
    },
    resumes: {
      type: ResumeQuery,
      resolve: () => ({})
    }
  })
});

const mutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    users: {
      type: UserMutation,
      resolve: () => ({})
    },
    infos: {
      type: InfoMutation,
      resolve: () => ({})
    },
    resumes: {
      type: ResumeMutation,
      resolve: () => ({})
    }
  })
});

module.exports = new GraphQLSchema({
  query,
  mutation
});