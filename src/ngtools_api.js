"use strict";
exports.__esModule = true;
var path = require("path");
exports.DEFAULT_ERROR_CODE = 100;
exports.UNKNOWN_ERROR_CODE = 500;
exports.SOURCE = 'angular';
function _error(api, fn) {
    throw new Error('Could not find API ' + api + ', function ' + fn);
}
function getApiMember(api, func, apiName) {
    return api && api[func] || _error(apiName, func.toString());
}
// Manually check for Compiler CLI availability and supported version.
// This is needed because @ngtools/webpack does not depend directly on @angular/compiler-cli, since
// it is installed as part of global Angular CLI installs and compiler-cli is not of its
// dependencies.
function CompilerCliIsSupported() {
    var version;
    // Check that Angular is available.
    try {
        version = require('@angular/compiler-cli').VERSION;
    }
    catch (e) {
        throw new Error('The "@angular/compiler-cli" package was not properly installed. Error: ' + e);
    }
    // Check that Angular is also not part of this module's node_modules (it should be the project's).
    var compilerCliPath = require.resolve('@angular/compiler-cli');
    if (compilerCliPath.startsWith(path.dirname(__dirname))) {
        throw new Error('The @ngtools/webpack plugin now relies on the project @angular/compiler-cli. '
            + 'Please clean your node_modules and reinstall.');
    }
    // Throw if we're less than 5.x
    if (Number(version.major) < 5) {
        throw new Error('Version of @angular/compiler-cli needs to be 5.0.0 or greater. '
            + ("Current version is \"" + version.full + "\"."));
    }
}
exports.CompilerCliIsSupported = CompilerCliIsSupported;
// These imports do not exist on a global install for Angular CLI, so we cannot use a static ES6
// import.
var compilerCli = null;
try {
    compilerCli = require('@angular/compiler-cli');
}
catch (_a) {
    // Don't throw an error if the private API does not exist.
    // Instead, the `CompilerCliIsSupported` method should return throw and indicate the
    // plugin cannot be used.
}
exports.VERSION = getApiMember(compilerCli, 'VERSION', 'compiler-cli');
exports.__NGTOOLS_PRIVATE_API_2 = getApiMember(compilerCli, '__NGTOOLS_PRIVATE_API_2', 'compiler-cli');
exports.readConfiguration = getApiMember(compilerCli, 'readConfiguration', 'compiler-cli');
// These imports do not exist on Angular versions lower than 5, so we cannot use a static ES6
// import.
var ngtools2 = null;
try {
    ngtools2 = require('@angular/compiler-cli/ngtools2');
}
catch (_b) {
    // Don't throw an error if the private API does not exist.
}
exports.createProgram = getApiMember(ngtools2, 'createProgram', 'ngtools2');
exports.createCompilerHost = getApiMember(ngtools2, 'createCompilerHost', 'ngtools2');
exports.formatDiagnostics = getApiMember(ngtools2, 'formatDiagnostics', 'ngtools2');
exports.EmitFlags = getApiMember(ngtools2, 'EmitFlags', 'ngtools2');
