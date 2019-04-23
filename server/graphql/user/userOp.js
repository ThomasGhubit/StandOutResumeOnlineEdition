const crypto = require('crypto');
const { GraphQLObjectType, GraphQLString, GraphQLEnumType } = require("graphql");
const userGraphQLType = require('./userType');
const User = require('../../models/user');

function cryptPwd(password) {
  var md5 = crypto.createHash('md5');
  return md5.update(password).digest('hex');
}

// return user query result
const userQueryResult = new GraphQLEnumType({
  name: "userQueryResult",
  values: {
    success: { value: 0 },
    notFound: { value: 1 },
    notMatch: { value: 2 }
  }
});

const UserQuery = new GraphQLObjectType({
  name: 'UserQuery',
  fields: {
    // use email and password for login
    signin: {
      type: userQueryResult,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        // check if email has been used
        const user = await User.findOne({
          email: args.email
        });
        if (user == null) {
          return 1;
        }
        
        // check if password matches
        if (cryptPwd(args.password) !== user.password) {
          return 2;
        }

        // successfully login，record session
        ctx.session.userId = user.id;
        ctx.session.isAdmin = user.admin;

        return 0;
      }
    },
    // use userId in session to access user information
    user: {
      type: userGraphQLType,
      resolve(parent, args, ctx) {
        return User.findById(ctx.session.userId);
      }
    }
  }
});

// return user operation result
const userMutationResult = new GraphQLEnumType({
  name: "userMutationResult",
  values: {
    success: { value: 0 },
    error: { value: 1 },
    hasSigned: { value: 2}
  }
});

const UserMutation = new GraphQLObjectType({
  name: "UserMutation",
  fields: {
    // registration
    signup: {
      type: userMutationResult,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        // check email first
        const hasUser = await User.findOne({
          email: args.email
        });
        if (hasUser != null) {
          return 2;
        }

        const user = await User.create({
          email: args.email,
          password: cryptPwd(args.password),
          username: args.email.split('@')[0],
          admin: false
        });

        // successfully create user
        if (user != null) { 
          ctx.session.userId = user.id;
          ctx.session.isAdmin = false;
          return 0;
        }

        return 1;
      }
    }
  }
});

module.exports = {
  UserQuery,
  UserMutation
};