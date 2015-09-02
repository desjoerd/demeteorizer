const FindNodeVersion = require('./find-node-version');
const Fs = require('fs');
const Path = require('path');
const Hoek = require('hoek');

module.exports = function (options, done) {
  Hoek.assert(options !== undefined, 'options is required');
  Hoek.assert(Fs.existsSync(options.directory), 'Output directory not found');

  var packagePath = Path.resolve(
    options.directory,
    'bundle',
    'programs',
    'server',
    'package.json');

  //
  // Manual parsing of the package.json allows mocking of the read.
  //
  var packageContents = JSON.parse(Fs.readFileSync(packagePath));

  packageContents.engines = { node: FindNodeVersion(options) };
  packageContents.main = '../../main.js';
  packageContents.scripts = { start: 'node ../../main' };

  //
  // The generated package.json is read-only, but removing it prior to writing
  //    will allow updates.
  //
  Fs.unlinkSync(packagePath);
  Fs.writeFile(packagePath, JSON.stringify(packageContents, null, 2), done);
};