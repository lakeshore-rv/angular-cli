"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular-devkit/core");
var ts = require("typescript");
var benchmark_1 = require("./benchmark");
var compiler_host_1 = require("./compiler_host");
var gather_diagnostics_1 = require("./gather_diagnostics");
var ngtools_api_1 = require("./ngtools_api");
// This file should run in a child process with the AUTO_START_ARG argument
var MESSAGE_KIND;
(function (MESSAGE_KIND) {
    MESSAGE_KIND[MESSAGE_KIND["Init"] = 0] = "Init";
    MESSAGE_KIND[MESSAGE_KIND["Update"] = 1] = "Update";
})(MESSAGE_KIND = exports.MESSAGE_KIND || (exports.MESSAGE_KIND = {}));
var TypeCheckerMessage = /** @class */ (function () {
    function TypeCheckerMessage(kind) {
        this.kind = kind;
    }
    return TypeCheckerMessage;
}());
exports.TypeCheckerMessage = TypeCheckerMessage;
var InitMessage = /** @class */ (function (_super) {
    __extends(InitMessage, _super);
    function InitMessage(compilerOptions, basePath, jitMode, rootNames) {
        var _this = _super.call(this, MESSAGE_KIND.Init) || this;
        _this.compilerOptions = compilerOptions;
        _this.basePath = basePath;
        _this.jitMode = jitMode;
        _this.rootNames = rootNames;
        return _this;
    }
    return InitMessage;
}(TypeCheckerMessage));
exports.InitMessage = InitMessage;
var UpdateMessage = /** @class */ (function (_super) {
    __extends(UpdateMessage, _super);
    function UpdateMessage(rootNames, changedCompilationFiles) {
        var _this = _super.call(this, MESSAGE_KIND.Update) || this;
        _this.rootNames = rootNames;
        _this.changedCompilationFiles = changedCompilationFiles;
        return _this;
    }
    return UpdateMessage;
}(TypeCheckerMessage));
exports.UpdateMessage = UpdateMessage;
exports.AUTO_START_ARG = '9d93e901-158a-4cf9-ba1b-2f0582ffcfeb';
var TypeChecker = /** @class */ (function () {
    function TypeChecker(_compilerOptions, _basePath, _JitMode, _rootNames) {
        this._compilerOptions = _compilerOptions;
        this._JitMode = _JitMode;
        this._rootNames = _rootNames;
        benchmark_1.time('TypeChecker.constructor');
        var compilerHost = new compiler_host_1.WebpackCompilerHost(_compilerOptions, _basePath);
        compilerHost.enableCaching();
        // We don't set a async resource loader on the compiler host because we only support
        // html templates, which are the only ones that can throw errors, and those can be loaded
        // synchronously.
        // If we need to also report errors on styles then we'll need to ask the main thread
        // for these resources.
        this._compilerHost = ngtools_api_1.createCompilerHost({
            options: this._compilerOptions,
            tsHost: compilerHost
        });
        benchmark_1.timeEnd('TypeChecker.constructor');
    }
    TypeChecker.prototype._update = function (rootNames, changedCompilationFiles) {
        var _this = this;
        benchmark_1.time('TypeChecker._update');
        this._rootNames = rootNames;
        changedCompilationFiles.forEach(function (fileName) {
            _this._compilerHost.invalidate(fileName);
        });
        benchmark_1.timeEnd('TypeChecker._update');
    };
    TypeChecker.prototype._createOrUpdateProgram = function () {
        if (this._JitMode) {
            // Create the TypeScript program.
            benchmark_1.time('TypeChecker._createOrUpdateProgram.ts.createProgram');
            this._program = ts.createProgram(this._rootNames, this._compilerOptions, this._compilerHost, this._program);
            benchmark_1.timeEnd('TypeChecker._createOrUpdateProgram.ts.createProgram');
        }
        else {
            benchmark_1.time('TypeChecker._createOrUpdateProgram.ng.createProgram');
            // Create the Angular program.
            this._program = ngtools_api_1.createProgram({
                rootNames: this._rootNames,
                options: this._compilerOptions,
                host: this._compilerHost,
                oldProgram: this._program
            });
            benchmark_1.timeEnd('TypeChecker._createOrUpdateProgram.ng.createProgram');
        }
    };
    TypeChecker.prototype._diagnose = function (cancellationToken) {
        var allDiagnostics = gather_diagnostics_1.gatherDiagnostics(this._program, this._JitMode, 'TypeChecker', cancellationToken);
        // Report diagnostics.
        if (!cancellationToken.isCancellationRequested()) {
            var errors = allDiagnostics.filter(function (d) { return d.category === ts.DiagnosticCategory.Error; });
            var warnings = allDiagnostics.filter(function (d) { return d.category === ts.DiagnosticCategory.Warning; });
            if (errors.length > 0) {
                var message = ngtools_api_1.formatDiagnostics(errors);
                console.error(core_1.terminal.bold(core_1.terminal.red('ERROR in ' + message)));
            }
            else {
                // Reset the changed file tracker only if there are no errors.
                this._compilerHost.resetChangedFileTracker();
            }
            if (warnings.length > 0) {
                var message = ngtools_api_1.formatDiagnostics(warnings);
                console.log(core_1.terminal.bold(core_1.terminal.yellow('WARNING in ' + message)));
            }
        }
    };
    TypeChecker.prototype.update = function (rootNames, changedCompilationFiles, cancellationToken) {
        this._update(rootNames, changedCompilationFiles);
        this._createOrUpdateProgram();
        this._diagnose(cancellationToken);
    };
    return TypeChecker;
}());
exports.TypeChecker = TypeChecker;
