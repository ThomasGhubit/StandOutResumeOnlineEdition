const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const modelToHtml = require('./modelToHtml');
const { readFile, writeFile } = require('../controller/util');

const createResume = async (id, templateName, model) => {
  const templateFile = path.resolve(__dirname, `../../templates/${templateName}/index.html`);
  const resumeFolder = path.resolve(__dirname, '../../resumes');
  if (!fs.existsSync(resumeFolder)) {
    fs.mkdirSync(resumeFolder);
  }

  // create resume html
  const source = await readFile(templateFile);
  const template = Handlebars.compile(source);
  const modelHtml = modelToHtml(model);
  const ds = modelHtml.fillData();
  const result = template(ds);

  // write into files
  let resumeHtml = path.resolve(__dirname, `../../resumes/${id}.html`);
  let writeRes = writeFile(resumeHtml, result);
};

module.exports = {
  createResume
};