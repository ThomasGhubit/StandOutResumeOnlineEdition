const fs = require('fs');

// read file
const readFile = fPath => new Promise((resolve, reject) => {
  fs.readFile(fPath, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

// type in file
const writeFile = (fPath, data) => new Promise((resolve, reject) => {
  fs.writeFile(fPath, data, 'utf8', (err) => {
    if (err) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
});

// read Json file and parser
const readJsonFile = fPath => new Promise((resolve, reject) => {
  fs.readFile(fPath, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      try {
        const jsonContent = JSON.parse(data);
        resolve(jsonContent);
      } catch (e) {
        reject(e);
      }
    }
  });
});

const deleteFile = fPath => new Promise((resolve, reject) => {
  fs.stat(fPath, (err, stats) => {
    if (err) {
      reject(err);
    } else if (stats.isFile()) {
      fs.unlink(fPath, err => {
        if (err) reject(err);
        else resolve();
      });
    }
  });
});

var ID = function () {
  return Math.random().toString(36).substr(2, 9);
};

module.exports = {
  readFile,
  writeFile,
  readJsonFile,
  deleteFile,
  ID
};