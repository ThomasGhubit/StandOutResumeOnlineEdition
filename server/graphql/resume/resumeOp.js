const { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLEnumType, GraphQLUnionType, GraphQLObjectType } = require('graphql');
const resumeGraphQLType = require('./resumeType');
const Resume = require('../../models/resume');
const Info = require('../../models/info');
const Share = require('../../models/share');
const Tag = require('../../models/tag');
const { createResume } = require('../../resume/create');
const { ID } = require('../../controller/util');

const resumeFailType = new GraphQLObjectType({
  name: "resumeFailType",
  fields: () => ({
    failType: { type: GraphQLInt },
    infoId: { type: GraphQLString }
  })
});
const resumeQueryResult = new GraphQLUnionType({
  name: "resumeQueryResult",
  types: [resumeGraphQLType, resumeFailType],
  resolveType(value) {
    if (value.failType) {
      return resumeFailType;
    } else {
      return resumeGraphQLType;
    }
  }
});

const ResumeQuery = new GraphQLObjectType({
  name: 'ResumeQuery',
  fields: {
    // retrive all user information
    resumes: {
      type: GraphQLList(resumeGraphQLType),
      resolve(parent, args, ctx) {
        return Resume.find({
          userId: ctx.session.userId
        }).sort({
          updateDate: -1
        });
      }
    },
    // retrieve user resume, default most recent updated resuem
    resume: {
      type: resumeQueryResult,
      args: {
        infoId: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        let info;
        if (!args.infoId || args.infoId == "") {
          // retrieve most recent infomation
          const infos = await Info.find({
            userId: ctx.session.userId
          }).sort({
            updateDate: -1
          });

          info = infos[0];
        } else {
          info = await Info.findOne({
            _id: args.infoId,
            userId: ctx.session.userId
          });
        }

        let infoId = args.infoId ? args.infoId : info._id;

        // find corresponding resume
        let resume = await Resume.findOne({
          infoId: infoId,
          userId: ctx.session.userId
        });

        // return fail when resume is empty or expired
        if (resume == null) {
          return {
            failType: 1,
            infoId: infoId
          };
        } else if (resume.updateDate < info.updateDate && info.edited) {
          return {
            failType: 2,
            infoId: infoId
          };
        } else {
          return resume;
        }
      }
    },
    publish_resumes: {
      type: GraphQLList(resumeGraphQLType),
      args: {
        tags: { type: GraphQLList(GraphQLString) }
      },
      resolve(parent, args, ctx) {
        if (args.tags.length == 0) {
          return Resume.find({
            publish: true
          }).sort({
            updateDate: -1
          }).limit(6);
        } else {
          return Resume.find({
            publish: true
          }).where("tags").in(args.tags)
          .sort({
            updateDate: -1
          }).limit(6);
        }
        
      }
    }
  }
});

const resumeMutationResult = new GraphQLEnumType({
  name: "resumeMutataionResult",
  values: {
    success: { value: 0 },
    error: { value: 1 }
  }
});

const ResumeMutation = new GraphQLObjectType({
  name: "ResumeMutation",
  fields: {
    // if infoId empty，default retrieve most recent updated resume
    resume: {
      type: resumeMutationResult,
      args: {
        infoId: { type: GraphQLString },
      },
      async resolve(parent, args, ctx) {
        // retrieve resume information
        let resume = await Resume.findOne({
          infoId: args.infoId,
          userId: ctx.session.userId
        });
        let info = await Info.findOne({
          _id: args.infoId,
          userId: ctx.session.userId
        });

        // if resume is never created
        if (resume == null) {
          // create resume
          // default template apollo
          await createResume(args.infoId, 'apollo', info);
          resume = await Resume.create({
            userId: ctx.session.userId,
            infoId: args.infoId,
            template: 'apollo',
            path: `resumes/${args.infoId}`,
            updateDate: info.updateDate,
            publish: false,
            share: "",
            tags: []
          });
        } 
        // check resume updating time
        else if (resume.updateDate < info.updateDate && info.edited) {
          // update resume
          await createResume(args.infoId, resume.template, info);
          resume.updateDate = info.updateDate;
          await resume.save();
        }
        
        return 0;
      }
    },
    resume_template_change: {
      type: resumeMutationResult,
      args: {
        infoId: { type: GraphQLString },
        template: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        let resume = await Resume.findOne({
          infoId: args.infoId,
          userId: ctx.session.userId
        });
        let info = await Info.findOne({
          _id: args.infoId,
          userId: ctx.session.userId
        });

        if (resume == null) return 1;

        await createResume(args.infoId, args.template, info);
        resume.template = args.template;
        await resume.save();

        return 0;
      }
    },
    resume_publish: {
      type: resumeMutationResult,
      args: {
        infoId: { type: GraphQLString },
        publish: { type: GraphQLBoolean },
        tags: { type: GraphQLList(GraphQLString) }
      },
      async resolve(parent, args, ctx) {
        // admin has the authority to unpublish a resume
        let resume = !ctx.session.isAdmin 
          ? await Resume.findOne({
            infoId: args.infoId,
            userId: ctx.session.userId
          })
          : await Resume.findOne({
            infoId: args.infoId
          });

        if (resume == null) return 1;

        let old_tags = resume.tags;
        let removed_tags = old_tags.filter((tag) => args.tags.indexOf(tag) == -1);
        let added_tags = args.tags.filter((tag) => old_tags.indexOf(tag) == -1);

        // remove tag
        removed_tags.forEach(async (tagName) => {
          let tag = await Tag.findOne({
            name: tagName
          });
          tag.total -= 1;
          await tag.save();
        });
        // add new tag
        added_tags.forEach(async (tagName) => {
          let tag = await Tag.findOne({
            name: tagName
          });

          if (tag == null) {
            await Tag.create({
              name: tagName,
              total: 1
            })
          } else {
            tag.total += 1;
            await tag.save();
          }
        });

        resume.publish = args.publish;
        resume.tags = args.tags;
        await resume.save();

        return 0;
      }
    },
    resume_share: {
      type: GraphQLString,
      args: {
        infoId: { type: GraphQLString },
      },
      async resolve(parent, args, ctx) {
        let resume = await Resume.findOne({
          infoId: args.infoId,
          userId: ctx.session.userId
        });
        let shareId = resume.share ? resume.share : ID();
        let share = await Share.findOne({
          shareId
        });

        let out = new Date();

        // shareId is occupied
        while(share != null && share.infoId != args.infoId && share.out > out) {
          shareId = ID();
          share = await Share.findOne({
            shareId
          });
        }

        // three day outdated
        out.setDate(out.getDate() + 3);

        // create a new shareId
        if (share == null) {
          share = await Share.create({
            shareId,
            out,
            infoId: args.infoId
          });

          if (share == null) return "";
        } 
        // shareId is outdated
        else {
          share.infoId = args.infoId;
          share.out = out;
          await share.save();
        }

        resume.share = shareId;
        await resume.save();

        return shareId;
      }
    },
    resume_rating: {
      type: resumeMutationResult,
      args: {
        id: { type: GraphQLString },
        point: { type: GraphQLInt }
      },
      async resolve(parent, args, ctx) {
        let resume = await Resume.findById(args.id);

        if (resume == null) return 1;

        if (!resume.sum || !resume.num) {
          resume.num = 1;
          resume.sum = args.point;
        } else {
          let total = resume.sum * resume.num;
          resume.num += 1;
          resume.sum = (total + args.point) / resume.num;
        }

        await resume.save();

        return 0;
      }
    }
  }
});

module.exports = {
  ResumeQuery,
  ResumeMutation
};