const path = require('path');
const Handlebars = require('handlebars');
const { readJsonFile } = require('./util');
const Info = require('../models/info');
const Tag = require('../models/tag');

// acquire template by json file 
const getTemplates = async (ctx) => {
  try {
    const templates = path.resolve(__dirname, '../../templates/templates.json');
    const templatesContent = await readJsonFile(templates);
    ctx.response.body = {
      status: { code: 0, msg: 'success' },
      data: { templates: templatesContent }
    };
  } catch (e) {
    console.log('server error: ', e);
    ctx.response.body = {
      status: { code: 1000, msg: 'server error' }
    };
  }
};

// acquire user information by userid
const getRecentInfo = async (ctx) => {
  try {
    const infos = await Info.find({
      userId: ctx.session.userId
    }).sort({
      updateDate: -1
    });
  
    const info = infos[0];
    ctx.response.body = {
      status: { code: 0, msg: 'success' },
      data: { infoId: info._id }
    }
  } catch (e) {
    console.log('server error: ', e);
    ctx.response.body = {
      status: { code: 1000, msg: 'server error' }
    };
  }
}

// acquire most popular tags
const getHotTags = async (ctx) => {
  try {
    const tags = await Tag.find().sort({
      total: -1
    }).limit(Number.parseInt(ctx.query.num)).select("name");

    ctx.response.body = {
      status: { code: 0, msg: 'success' },
      data: { hots: tags }
    }
  } catch (e) {
    console.log('server error: ', e);
    ctx.response.body = {
      status: { code: 1000, msg: 'server error' }
    };
  }
}

module.exports = {
  'GET /api/getTemplates': getTemplates,
  'GET /api/getRecentInfo': getRecentInfo,
  'GET /api/getHotTags': getHotTags
};