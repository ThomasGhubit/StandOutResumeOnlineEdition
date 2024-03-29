const { GraphQLObjectType, GraphQLString, GraphQLEnumType, GraphQLList } = require("graphql");
const { 
  InfoType, InfoInputBasicType, InfoInputEducationType, InfoInputEmploymentType,
  InfoInputSkillType, InfoInputProjectType, InfoInputAwardType, InfoInputActivityType,
  InfoInputVolunteeringType
} = require('./infoType');
const Info = require('../../models/info');
const Resume = require('../../models/resume');
const { deleteFile } = require('../../controller/util');

const InfoQuery = new GraphQLObjectType({
  name: 'InfoQuery',
  fields: {
    // return curent user all information, sort based on time
    infos: {
      type: GraphQLList(InfoType),
      resolve(parent, args, ctx) {
        return Info.find({
          userId: ctx.session.userId
        }).sort({
          updateDate: -1
        });
      }
    },
    // return user information
    info: {
      type: InfoType,
      args: {
        id: { type: GraphQLString}
      },
      resolve(parent, args, ctx) {
        return Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });
      }
    }
  }
});

// return value of result
const infoMutationResult = new GraphQLEnumType({
  name: "infoMutationResult",
  values: {
    success: { value: 0 },
    error: { value : 1 }
  }
});

const InfoMutation = new GraphQLObjectType({
  name: "InfoMutation",
  fields: {
    // add new resume information
    addInfo: {
      type: infoMutationResult,
      args: {
        name: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.create({
          userId: ctx.session.userId,
          name: args.name,
          updateDate: new Date(),
          edited: true
        });

        if (info == null) return 1;

        return 0;
      }
    },
    // basic information editing
    editBasic: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        basic: { type: InfoInputBasicType }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.basic = args.basic;

        await info.save();

        return 0;
      }
    },
    // summary editing
    editSummary: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        summary: { type: GraphQLList(GraphQLString) }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.summary = args.summary;

        await info.save();

        return 0;
      }
    },
    // education editing
    editEducation: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        education: { type: GraphQLList(InfoInputEducationType) }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.education = args.education;

        await info.save();

        return 0;
      }
    },
    // employment editing
    editEmployment: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        employment: { type: GraphQLList(InfoInputEmploymentType) }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.employment = args.employment;

        await info.save();

        return 0;
      }
    },
    // skill editing
    editSkill: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        skill: { type: GraphQLList(InfoInputSkillType) }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.skill = args.skill;

        await info.save();

        return 0;
      }
    },
    // project editing
    editProject: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        project: { type: GraphQLList(InfoInputProjectType) }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.project = args.project;

        await info.save();

        return 0;
      }
    },
    // award editing
    editAward: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        award: { type: GraphQLList(InfoInputAwardType) }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.award = args.award;

        await info.save();

        return 0;
      }
    },
    // activity editing
    editActivity: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        activity: { type: GraphQLList(InfoInputActivityType) }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.activity = args.activity;

        await info.save();

        return 0;
      }
    },
    // volunteer editing
    editVolunteering: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        volunteering: { type: GraphQLList(InfoInputVolunteeringType) }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.volunteering = args.volunteering;

        await info.save();

        return 0;
      }
    },
    // update the resume without sending the message
    updateInfoDate: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = false;

        await info.save();

        return 0;
      }
    },
    renameInfo: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        const info = await Info.findOne({
          userId: ctx.session.userId,
          _id: args.id
        });

        if (info == null) return 1;

        info.updateDate = new Date();
        info.edited = true;
        info.name = args.name;

        await info.save();

        return 0;
      }
    },
    // delete corresponding resume file
    deleteInfo: {
      type: infoMutationResult,
      args: {
        id: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        const infoResult = await Info.deleteOne({
          userId: ctx.session.userId,
          _id: args.id
        });
        if (infoResult.ok != 1) return 1;

        const resume = await Resume.findOne({
          userId: ctx.session.userId,
          infoId: args.id
        });
        if (resume == null) return 1;

        // delete file with suffix
        await deleteFile(resume.path + '.html');

        const resumeResult = await Resume.deleteOne({
          userId: ctx.session.userId,
          infoId: args.id
        });
        if (resumeResult.ok != 1) return 1;

        return 0;
      }
    }
  }
});

module.exports = {
  InfoQuery,
  InfoMutation
};