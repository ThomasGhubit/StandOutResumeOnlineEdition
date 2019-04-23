// push html
const path = require('path');
const { readFile } = require('./util');
const Resume = require('../models/resume');
const Share = require('../models/share');

const html = (name, shouldLogin) => (async (ctx) => {
  try {
    // check registration
    let userId = ctx.session.userId || "";
    if (shouldLogin && userId == "") {
      ctx.redirect('/signin');
    } else if (!shouldLogin && userId != "") {
      if (ctx.session.isAdmin) {
        ctx.redirect('/admin');
      } else {
        ctx.redirect('/maker');
      }
    }

    const htmlPath = path.resolve(__dirname, `../../public/${name}.html`);
    const html = await readFile(htmlPath);
    ctx.response.body = html;
  } catch (e) {
    console.log('server error: ', e);
  }
});

const resume = async (ctx) => {
  try {
    // check publish
    const resume = await Resume.findOne({
      infoId: ctx.params.infoId
    });

    if (!resume.publish && resume.userId != ctx.session.userId) {
      ctx.response.body = "You don't have permission to view this resume!";
    } else {
      const htmlPath = path.resolve(__dirname, `../../resumes/${ctx.params.infoId}.html`);
      const html = await readFile(htmlPath);
      ctx.response.body = html;
    }
  } catch (e) {
    console.log('server error: ', e);
  }
}

const share = async (ctx) => {
  try {
    const share = await Share.findOne({
      shareId: ctx.params.shareId
    });
  
    if (share != null && share.out > new Date()) {
      const htmlPath = path.resolve(__dirname, `../../resumes/${share.infoId}.html`);
      const html = await readFile(htmlPath);
      ctx.response.body = html;
    } else {
      ctx.response.body = "You don't have permission to view this resume!";    
    }
  } catch (e) {
    console.log('server error: ', e);
  }
}

module.exports = {
  'GET /': html('index', false),
  'GET /signin': html('signin', false),
  'GET /signup': html('signup', false),
  'GET /maker': html('maker', true),
  'GET /admin': html('admin', true),
  'GET /resumes/:infoId': resume,
  'GET /share/:shareId': share
};