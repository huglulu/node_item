var Promise = require("bluebird"),
    fs = Promise.promisifyAll(require('fs-extra'));

var arr = __dirname;
var rot = arr.split('\\');
rot.splice(rot.length-1,1);
var dir = rot.join('\/');
console.log(dir);

function generateStructure(project,outs){
  return fs.copyAsync( dir + '/structure', project)
    .then(function(err){
      return err ?  console.error(err) : console.log('generate project success');
    })
}

module.exports = generateStructure;