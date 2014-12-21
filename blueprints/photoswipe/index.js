'use strict';

var fs    = require('fs');
var chalk = require('chalk');

module.exports = {

  description: 'Adds Photoswipe lib from bower and generate custom src',

  normalizeEntityName: function() {/* generator with no args */},

  afterInstall: function(options) {
    this.addBowerPackageToProject('photoswipe', '4.0.1');

    // we need to make a build without the history module.
    var fsDir    = options.project.bowerDirectory  + '/photoswipe';
    var fsFile   = fsDir + '/dist/photoswipe-ember.js';
    var srcFiles = [
      'framework-bridge',
      'core',
      'down-move-up-handlers',
      'items-controller',
      'tap',
      'desktop-zoom'
      //'history'
    ];
    var newContents = "(function (root, factory) { \n"+
      "\tif (typeof define === 'function' && define.amd) {\n" +
        "\t\tdefine(factory);\n" +
      "\t} else if (typeof exports === 'object') {\n" +
        "\t\tmodule.exports = factory();\n" +
      "\t} else {\n" +
        "\t\troot.PhotoSwipe = factory();\n" +
      "\t}\n" +
    "})(this, function () {\n\n" +
      "\t'use strict';\n"+
      "\tvar PhotoSwipe = function(template, UiClass, items, options){\n";

    var file, data;
    srcFiles.forEach(function(name) {
      file        = fsDir + '/src/js/' + name + '.js';
      newContents += fs.readFileSync(file);
    });

    newContents+= "\tframework.extend(self, publicMethods); };\n";
    newContents+= "\treturn PhotoSwipe;\n";
    newContents+= "});";

    fs.writeFileSync(fsFile, newContents);

    // done!
    console.log(chalk.green('\n[ember-cli-photoswipe]: Done!'));
  }
};
