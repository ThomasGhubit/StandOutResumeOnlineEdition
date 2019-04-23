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
    // 返回当前登录用户所有的信息，并根据更新时间降序排列
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
    // 返回当前登录用户所指定的信息
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

// 信息操作返回结果
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
    // 新增简历信息
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
    // 基本信息编辑
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
    // 总结编辑
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
    // 学历编辑
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
    // 就业编辑
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
    // 技能编辑
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
    // 项目编辑
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
    // 获奖编辑
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
    // 活动编辑
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
    // 志愿编辑
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
    // 修改信息更新时间但是不修改实际信息
    // 这里是为了实现 ReEdit 不传递信息即可实现重新编辑
    // 点击 ReEdit 后，会将信息更新时间修改为最新，但是 edited 设置为 false
    // 根据更新信息和 edited 双保险来保证简历不会冗余重新渲染
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
    // 注意不仅会删除 info 还会将关联的 resume 删除
    // 要删除对应的 resume 文件
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

        // 删除对应的文件，要加上文件后缀
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