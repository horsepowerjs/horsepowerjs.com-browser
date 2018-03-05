"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const ts = require("typescript");
const escape = require("escape-string-regexp");
const uglify = require('uglify-es');
// declare var tsm: tsMiddleware
// declare module 'ts-middleware' {
//   export = tsm
// }
module.exports = function (options) {
  return async function (req, res, next) {
    if (path.parse(req.path).ext.match(/(\.min)?\.js$/)) {
      let projects = [];
      if (typeof options == 'string') {
        projects.push({ config: options });
      }
      else {
        options.projects && (projects = options.projects);
        options.project && typeof options.project != 'string' && projects.push(options.project);
        options.project && typeof options.project == 'string' && projects.push({ config: options.project });
      }
      let p = [];
      projects.forEach(project => {
        // TODO: Only compile files or files from projects that were requested
        p.push(compileProject(project, req.path));
      });
      await Promise.all(p);
    }
    next();
  };
};
async function minify(project) {
  return new Promise(resolve => {
    let cfg = JSON.parse(fs.readFileSync(project.config).toString());
    if (cfg.compilerOptions.outDir) {
      let g = path.join(path.resolve(path.parse(project.config).dir, cfg.compilerOptions.outDir), '**/*.js');
      glob(g, (err, files) => {
        files.forEach(file => {
          let code = fs.readFileSync(file).toString();
          let result = uglify.minify(code, project.uglify);
          fs.writeFileSync(file, result.code);
        });
      });
      return resolve(true);
    }
    else if (cfg.compilerOptions.outFile) {
      let file = path.resolve(path.parse(project.config).dir, cfg.compilerOptions.outFile);
      let result = uglify.minify(fs.readFileSync(file).toString(), project.uglify);
      fs.writeFileSync(file, result.code);
      return resolve(true);
    }
    return resolve(false);
  });
}
async function compileProject(project, reqPath) {
  let cfgDir = path.parse(project.config).dir;
  let cfg = JSON.parse(fs.readFileSync(project.config).toString()).compilerOptions;
  let outFile = path.resolve(path.parse(project.config).dir, cfg.outFile || '');
  if (outFile.match(new RegExp(`${escape(reqPath)}$`))) {
    let check = cfg.outDir || cfg.outFile || '';
    let tsDate = await getMtime(cfgDir, 'ts');
    let jsDate = await getMtime(path.resolve(cfgDir, check), 'js');
    if (!jsDate || (tsDate && jsDate && tsDate > jsDate)) {
      try {
        let config = readConfigFile(project.config);
        let result = ts.createProgram(config.fileNames, config.options);
        result.emit();
        if (project.shouldUglify !== false) {
          await minify(project);
        }
      }
      catch (e) {
        console.error(e.stdout.toString());
        console.error(e.stderr.toString());
      }
    }
  }
  return;
}
function getFiles(outDir) {
  return new Promise(resolve => {
    glob(outDir + '/**/*.ts', (err, files) => {
      resolve(files);
    });
  });
}
async function getMtime(dirPath, type) {
  return new Promise(resolve => {
    try {
      let stat = fs.statSync(dirPath);
      if (stat.isFile()) {
        return resolve(stat.mtime);
      }
      else if (stat.isDirectory()) {
        let lastMod = new Date(1970, 0);
        glob(path.join(dirPath, '**/*.' + type), (err, files) => {
          files.forEach(file => {
            let stat = fs.statSync(file);
            if (stat.isFile() && stat.mtime > lastMod) {
              lastMod = stat.mtime;
            }
          });
          return resolve(lastMod);
        });
      }
    }
    catch (e) {
      return resolve(null);
    }
  });
}
function readConfigFile(configFileName) {
  // Read config file
  const configFileText = fs.readFileSync(configFileName).toString();
  // Parse JSON, after removing comments. Just fancier JSON.parse
  const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
  const configObject = result.config;
  // Extract config information
  const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(configFileName));
  return configParseResult;
}
