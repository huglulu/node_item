#!/usr/bin/env node
// console.log('hello');

//复制structure文件
// var program = require('commander'),
//     gs = require('../lib/generateStructure');

// program
//   .version(require('../package.json').version)
//   .usage('[options] [project name]')
//   .parse(process.argv);

// var pname = program.args[0]

// gs(pname);



//生成删除特定文件夹或代码片段的副本
var program = require('commander'),
	Promise = require("bluebird"),
	gs = require('../lib/generateStructure'),
    wf = require('../lib/withoutFile');

program
  .version(require('../package.json').version)
  .usage('[options] [project name]')
  .option('-W, --without <str | array>', 'generate project without some models(value can be `sass`、`coffee`、`jade`)')
  .parse(process.argv);

var pname = program.args[0];
if (!pname) program.help();

var outs = program.without ? program.without.split(',') : [];

Promise.all([gs(pname)])
  .then(function(){
    return wf(pname,outs)
  })

