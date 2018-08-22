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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular-devkit/core");
var child_process_1 = require("child_process");
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var benchmark_1 = require("./benchmark");
var compiler_host_1 = require("./compiler_host");
var entry_resolver_1 = require("./entry_resolver");
var gather_diagnostics_1 = require("./gather_diagnostics");
var lazy_routes_1 = require("./lazy_routes");
var ngtools_api_1 = require("./ngtools_api");
var paths_plugin_1 = require("./paths-plugin");
var resource_loader_1 = require("./resource_loader");
var transformers_1 = require("./transformers");
var ast_helpers_1 = require("./transformers/ast_helpers");
var type_checker_1 = require("./type_checker");
var virtual_file_system_decorator_1 = require("./virtual_file_system_decorator");
var webpack_input_host_1 = require("./webpack-input-host");
var treeKill = require('tree-kill');
var PLATFORM;
(function (PLATFORM) {
    PLATFORM[PLATFORM["Browser"] = 0] = "Browser";
    PLATFORM[PLATFORM["Server"] = 1] = "Server";
})(PLATFORM = exports.PLATFORM || (exports.PLATFORM = {}));
var AngularCompilerPlugin = /** @class */ (function () {
    function AngularCompilerPlugin(options) {
        this._singleFileIncludes = [];
        // Contains `moduleImportPath#exportName` => `fullModulePath`.
        this._lazyRoutes = Object.create(null);
        this._transformers = [];
        this._platformTransformers = null;
        this._JitMode = false;
        this._emitSkipped = true;
        this._changedFileExtensions = new Set(['ts', 'html', 'css']);
        // Webpack plugin.
        this._firstRun = true;
        this._warnings = [];
        this._errors = [];
        // TypeChecker process.
        this._forkTypeChecker = true;
        this._forkedTypeCheckerInitialized = false;
        ngtools_api_1.CompilerCliIsSupported();
        this._options = Object.assign({}, options);
        this._setupOptions(this._options);
    }
    Object.defineProperty(AngularCompilerPlugin.prototype, "_ngCompilerSupportsNewApi", {
        get: function () {
            if (this._JitMode) {
                return false;
            }
            else {
                return !!this._program.listLazyRoutes;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerPlugin.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerPlugin.prototype, "done", {
        get: function () { return this._donePromise; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AngularCompilerPlugin.prototype, "entryModules", {
        get: function () {
            if (!this._entryModules) {
                return null;
            }
            return this._entryModules.map(function (entryModule) {
                var splitted = entryModule.split(/(#[a-zA-Z_]([\w]+))$/);
                var path = splitted[0];
                var className = !!splitted[1] ? splitted[1].substring(1) : 'default';
                return { path: path, className: className };
            });
        },
        enumerable: true,
        configurable: true
    });
    AngularCompilerPlugin.isSupported = function () {
        return ngtools_api_1.VERSION && parseInt(ngtools_api_1.VERSION.major) >= 5;
    };
    AngularCompilerPlugin.prototype._setupOptions = function (options) {
        benchmark_1.time('AngularCompilerPlugin._setupOptions');
        // Fill in the missing options.
        if (!options.hasOwnProperty('tsConfigPath')) {
            throw new Error('Must specify "tsConfigPath" in the configuration of @ngtools/webpack.');
        }
        // TS represents paths internally with '/' and expects the tsconfig path to be in this format
        this._tsConfigPath = options.tsConfigPath.replace(/\\/g, '/');
        // Check the base path.
        var maybeBasePath = path.resolve(process.cwd(), this._tsConfigPath);
        var basePath = maybeBasePath;
        if (fs.statSync(maybeBasePath).isFile()) {
            basePath = path.dirname(basePath);
        }
        if (options.basePath !== undefined) {
            basePath = path.resolve(process.cwd(), options.basePath);
        }
        if (options.singleFileIncludes !== undefined) {
            (_a = this._singleFileIncludes).push.apply(_a, options.singleFileIncludes);
        }
        // Parse the tsconfig contents.
        var config = ngtools_api_1.readConfiguration(this._tsConfigPath);
        if (config.errors && config.errors.length) {
            throw new Error(ngtools_api_1.formatDiagnostics(config.errors));
        }
        this._rootNames = (_b = config.rootNames).concat.apply(_b, this._singleFileIncludes);
        this._compilerOptions = __assign({}, config.options, options.compilerOptions);
        this._basePath = config.options.basePath || basePath || '';
        // Overwrite outDir so we can find generated files next to their .ts origin in compilerHost.
        this._compilerOptions.outDir = '';
        this._compilerOptions.suppressOutputPathCheck = true;
        // Default plugin sourceMap to compiler options setting.
        if (!options.hasOwnProperty('sourceMap')) {
            options.sourceMap = this._compilerOptions.sourceMap || false;
        }
        // Force the right sourcemap options.
        if (options.sourceMap) {
            this._compilerOptions.sourceMap = true;
            this._compilerOptions.inlineSources = true;
            this._compilerOptions.inlineSourceMap = false;
            this._compilerOptions.mapRoot = undefined;
            // We will set the source to the full path of the file in the loader, so we don't
            // need sourceRoot here.
            this._compilerOptions.sourceRoot = undefined;
        }
        else {
            this._compilerOptions.sourceMap = false;
            this._compilerOptions.sourceRoot = undefined;
            this._compilerOptions.inlineSources = undefined;
            this._compilerOptions.inlineSourceMap = undefined;
            this._compilerOptions.mapRoot = undefined;
            this._compilerOptions.sourceRoot = undefined;
        }
        // We want to allow emitting with errors so that imports can be added
        // to the webpack dependency tree and rebuilds triggered by file edits.
        this._compilerOptions.noEmitOnError = false;
        // Set JIT (no code generation) or AOT mode.
        if (options.skipCodeGeneration !== undefined) {
            this._JitMode = options.skipCodeGeneration;
        }
        // Process i18n options.
        if (options.i18nInFile !== undefined) {
            this._compilerOptions.i18nInFile = options.i18nInFile;
        }
        if (options.i18nInFormat !== undefined) {
            this._compilerOptions.i18nInFormat = options.i18nInFormat;
        }
        if (options.i18nOutFile !== undefined) {
            this._compilerOptions.i18nOutFile = options.i18nOutFile;
        }
        if (options.i18nOutFormat !== undefined) {
            this._compilerOptions.i18nOutFormat = options.i18nOutFormat;
        }
        if (options.locale !== undefined) {
            this._compilerOptions.i18nInLocale = options.locale;
            this._compilerOptions.i18nOutLocale = options.locale;
            this._normalizedLocale = this._validateLocale(options.locale);
        }
        if (options.missingTranslation !== undefined) {
            this._compilerOptions.i18nInMissingTranslations =
                options.missingTranslation;
        }
        // Process forked type checker options.
        if (options.forkTypeChecker !== undefined) {
            this._forkTypeChecker = options.forkTypeChecker;
        }
        // Add custom platform transformers.
        if (options.platformTransformers !== undefined) {
            this._platformTransformers = options.platformTransformers;
        }
        // Default ContextElementDependency to the one we can import from here.
        // Failing to use the right ContextElementDependency will throw the error below:
        // "No module factory available for dependency type: ContextElementDependency"
        // Hoisting together with peer dependencies can make it so the imported
        // ContextElementDependency does not come from the same Webpack instance that is used
        // in the compilation. In that case, we can pass the right one as an option to the plugin.
        this._contextElementDependencyConstructor = options.contextElementDependencyConstructor
            || require('webpack/lib/dependencies/ContextElementDependency');
        // Use entryModules if available in options, otherwise resolve it from mainPath after program
        // creation.
        if (this._options.entryModules) {
            this._entryModules = this._options.entryModules || [this._options.entryModule];
        }
        else if (this._compilerOptions.entryModule) {
            this._entryModules = [path.resolve(this._basePath, this._compilerOptions.entryModule)]; // temporary cast for type issue
        }
        // Set platform.
        this._platform = options.platform || PLATFORM.Browser;
        // Make transformers.
        this._makeTransformers();
        benchmark_1.timeEnd('AngularCompilerPlugin._setupOptions');
        var _a, _b;
    };
    AngularCompilerPlugin.prototype._getTsProgram = function () {
        return this._JitMode ? this._program : this._program.getTsProgram();
    };
    AngularCompilerPlugin.prototype._getChangedTsFiles = function () {
        var _this = this;
        return this._compilerHost.getChangedFilePaths()
            .filter(function (k) { return (k.endsWith('.ts') || k.endsWith('.tsx')) && !k.endsWith('.d.ts'); })
            .filter(function (k) { return _this._compilerHost.fileExists(k); });
    };
    AngularCompilerPlugin.prototype.updateChangedFileExtensions = function (extension) {
        if (extension) {
            this._changedFileExtensions.add(extension);
        }
    };
    AngularCompilerPlugin.prototype._getChangedCompilationFiles = function () {
        var _this = this;
        return this._compilerHost.getChangedFilePaths()
            .filter(function (k) {
            for (var _i = 0, _a = _this._changedFileExtensions; _i < _a.length; _i++) {
                var ext = _a[_i];
                if (k.endsWith(ext)) {
                    return true;
                }
            }
            return false;
        });
    };
    AngularCompilerPlugin.prototype._createOrUpdateProgram = function () {
        var _this = this;
        return Promise.resolve()
            .then(function () {
            // Get the root files from the ts config.
            // When a new root name (like a lazy route) is added, it won't be available from
            // following imports on the existing files, so we need to get the new list of root files.
            var config = ngtools_api_1.readConfiguration(_this._tsConfigPath);
            _this._rootNames = (_a = config.rootNames).concat.apply(_a, _this._singleFileIncludes);
            // Update the forked type checker with all changed compilation files.
            // This includes templates, that also need to be reloaded on the type checker.
            if (_this._forkTypeChecker && _this._typeCheckerProcess && !_this._firstRun) {
                _this._updateForkedTypeChecker(_this._rootNames, _this._getChangedCompilationFiles());
            }
            // Use an identity function as all our paths are absolute already.
            _this._moduleResolutionCache = ts.createModuleResolutionCache(_this._basePath, function (x) { return x; });
            if (_this._JitMode) {
                // Create the TypeScript program.
                benchmark_1.time('AngularCompilerPlugin._createOrUpdateProgram.ts.createProgram');
                _this._program = ts.createProgram(_this._rootNames, _this._compilerOptions, _this._compilerHost, _this._program);
                benchmark_1.timeEnd('AngularCompilerPlugin._createOrUpdateProgram.ts.createProgram');
                return Promise.resolve();
            }
            else {
                benchmark_1.time('AngularCompilerPlugin._createOrUpdateProgram.ng.createProgram');
                // Create the Angular program.
                _this._program = ngtools_api_1.createProgram({
                    rootNames: _this._rootNames,
                    options: _this._compilerOptions,
                    host: _this._compilerHost,
                    oldProgram: _this._program
                });
                benchmark_1.timeEnd('AngularCompilerPlugin._createOrUpdateProgram.ng.createProgram');
                benchmark_1.time('AngularCompilerPlugin._createOrUpdateProgram.ng.loadNgStructureAsync');
                return _this._program.loadNgStructureAsync()
                    .then(function () {
                    benchmark_1.timeEnd('AngularCompilerPlugin._createOrUpdateProgram.ng.loadNgStructureAsync');
                });
            }
            var _a;
        })
            .then(function () {
            // If there are still no entryModules try to resolve from mainPath.
            if (!_this._entryModules && _this._mainPath) {
                benchmark_1.time('AngularCompilerPlugin._make.resolveEntryModuleFromMain');
                var entryModule = entry_resolver_1.resolveEntryModuleFromMain(_this._mainPath, _this._compilerHost, _this._getTsProgram());
                _this._entryModules = entryModule !== null ? [entryModule] : null;
                benchmark_1.timeEnd('AngularCompilerPlugin._make.resolveEntryModuleFromMain');
            }
        });
    };
    AngularCompilerPlugin.prototype._getLazyRoutesFromNgtools = function () {
        try {
            benchmark_1.time('AngularCompilerPlugin._getLazyRoutesFromNgtools');
            var result = ngtools_api_1.__NGTOOLS_PRIVATE_API_2.listLazyRoutes({
                program: this._getTsProgram(),
                host: this._compilerHost,
                angularCompilerOptions: Object.assign({}, this._compilerOptions, {
                    // genDir seems to still be needed in @angular\compiler-cli\src\compiler_host.js:226.
                    genDir: ''
                }),
                // TODO: fix compiler-cli typings; entryModule should not be string, but also optional.
                // tslint:disable-next-line:non-null-operator
                entryModules: this._entryModules
            });
            benchmark_1.timeEnd('AngularCompilerPlugin._getLazyRoutesFromNgtools');
            return result;
        }
        catch (err) {
            // We silence the error that the @angular/router could not be found. In that case, there is
            // basically no route supported by the app itself.
            if (err.message.startsWith('Could not resolve module @angular/router')) {
                return {};
            }
            else {
                throw err;
            }
        }
    };
    AngularCompilerPlugin.prototype._findLazyRoutesInAst = function (changedFilePaths) {
        benchmark_1.time('AngularCompilerPlugin._findLazyRoutesInAst');
        var result = Object.create(null);
        for (var _i = 0, changedFilePaths_1 = changedFilePaths; _i < changedFilePaths_1.length; _i++) {
            var filePath = changedFilePaths_1[_i];
            var fileLazyRoutes = lazy_routes_1.findLazyRoutes(filePath, this._compilerHost, undefined, this._compilerOptions);
            for (var _a = 0, _b = Object.keys(fileLazyRoutes); _a < _b.length; _a++) {
                var routeKey = _b[_a];
                var route = fileLazyRoutes[routeKey];
                result[routeKey] = route;
            }
        }
        benchmark_1.timeEnd('AngularCompilerPlugin._findLazyRoutesInAst');
        return result;
    };
    AngularCompilerPlugin.prototype._listLazyRoutesFromProgram = function () {
        var ngProgram = this._program;
        if (!ngProgram.listLazyRoutes) {
            throw new Error('_listLazyRoutesFromProgram was called with an old program.');
        }
        var lazyRoutes = ngProgram.listLazyRoutes();
        return lazyRoutes.reduce(function (acc, curr) {
            var ref = curr.route;
            if (ref in acc && acc[ref] !== curr.referencedModule.filePath) {
                throw new Error(+("Duplicated path in loadChildren detected: \"" + ref + "\" is used in 2 loadChildren, ")
                    + ("but they point to different modules \"(" + acc[ref] + " and ")
                    + ("\"" + curr.referencedModule.filePath + "\"). Webpack cannot distinguish on context and ")
                    + 'would fail to load the proper one.');
            }
            acc[ref] = curr.referencedModule.filePath;
            return acc;
        }, {});
    };
    // Process the lazy routes discovered, adding then to _lazyRoutes.
    // TODO: find a way to remove lazy routes that don't exist anymore.
    // This will require a registry of known references to a lazy route, removing it when no
    // module references it anymore.
    AngularCompilerPlugin.prototype._processLazyRoutes = function (discoveredLazyRoutes) {
        var _this = this;
        Object.keys(discoveredLazyRoutes)
            .forEach(function (lazyRouteKey) {
            var _a = lazyRouteKey.split('#'), lazyRouteModule = _a[0], moduleName = _a[1];
            if (!lazyRouteModule) {
                return;
            }
            var lazyRouteTSFile = discoveredLazyRoutes[lazyRouteKey].replace(/\\/g, '/');
            var modulePath, moduleKey;
            if (_this._JitMode) {
                modulePath = lazyRouteTSFile;
                moduleKey = "" + lazyRouteModule + (moduleName ? '#' + moduleName : '');
            }
            else {
                modulePath = lazyRouteTSFile.replace(/(\.d)?\.tsx?$/, '');
                modulePath += '.ngfactory.js';
                var factoryModuleName = moduleName ? "#" + moduleName + "NgFactory" : '';
                moduleKey = lazyRouteModule + ".ngfactory" + factoryModuleName;
            }
            modulePath = compiler_host_1.workaroundResolve(modulePath);
            if (moduleKey in _this._lazyRoutes) {
                if (_this._lazyRoutes[moduleKey] !== modulePath) {
                    // Found a duplicate, this is an error.
                    _this._warnings.push(new Error("Duplicated path in loadChildren detected during a rebuild. "
                        + "We will take the latest version detected and override it to save rebuild time. "
                        + "You should perform a full build to validate that your routes don't overlap."));
                }
            }
            else {
                // Found a new route, add it to the map.
                _this._lazyRoutes[moduleKey] = modulePath;
            }
        });
    };
    AngularCompilerPlugin.prototype._createForkedTypeChecker = function () {
        var _this = this;
        // Bootstrap type checker is using local CLI.
        var g = typeof global !== 'undefined' ? global : {}; // tslint:disable-line:no-any
        var typeCheckerFile = g['_DevKitIsLocal']
            ? './type_checker_bootstrap.js'
            : './type_checker_worker.js';
        var debugArgRegex = /--inspect(?:-brk|-port)?|--debug(?:-brk|-port)/;
        var execArgv = process.execArgv.filter(function (arg) {
            // Remove debug args.
            // Workaround for https://github.com/nodejs/node/issues/9435
            return !debugArgRegex.test(arg);
        });
        // Signal the process to start listening for messages
        // Solves https://github.com/angular/angular-cli/issues/9071
        var forkArgs = [type_checker_1.AUTO_START_ARG];
        var forkOptions = { execArgv: execArgv };
        this._typeCheckerProcess = child_process_1.fork(path.resolve(__dirname, typeCheckerFile), forkArgs, forkOptions);
        // Handle child process exit.
        this._typeCheckerProcess.once('exit', function (_, signal) {
            _this._typeCheckerProcess = null;
            // If process exited not because of SIGTERM (see _killForkedTypeChecker), than something
            // went wrong and it should fallback to type checking on the main thread.
            if (signal !== 'SIGTERM') {
                _this._forkTypeChecker = false;
                var msg = 'AngularCompilerPlugin: Forked Type Checker exited unexpectedly. ' +
                    'Falling back to type checking on main thread.';
                _this._warnings.push(msg);
            }
        });
    };
    AngularCompilerPlugin.prototype._killForkedTypeChecker = function () {
        if (this._typeCheckerProcess && this._typeCheckerProcess.pid) {
            treeKill(this._typeCheckerProcess.pid, 'SIGTERM');
            this._typeCheckerProcess = null;
        }
    };
    AngularCompilerPlugin.prototype._updateForkedTypeChecker = function (rootNames, changedCompilationFiles) {
        if (this._typeCheckerProcess) {
            if (!this._forkedTypeCheckerInitialized) {
                this._typeCheckerProcess.send(new type_checker_1.InitMessage(this._compilerOptions, this._basePath, this._JitMode, this._rootNames));
                this._forkedTypeCheckerInitialized = true;
            }
            this._typeCheckerProcess.send(new type_checker_1.UpdateMessage(rootNames, changedCompilationFiles));
        }
    };
    // Registration hook for webpack plugin.
    AngularCompilerPlugin.prototype.apply = function (compiler) {
        var _this = this;
        // Decorate inputFileSystem to serve contents of CompilerHost.
        // Use decorated inputFileSystem in watchFileSystem.
        compiler.hooks.environment.tap('angular-compiler', function () {
            // The webpack types currently do not include these
            var compilerWithFileSystems = compiler;
            var host = _this._options.host || new webpack_input_host_1.WebpackInputHost(compilerWithFileSystems.inputFileSystem);
            var replacements;
            if (_this._options.hostReplacementPaths) {
                if (typeof _this._options.hostReplacementPaths == 'function') {
                    var replacementResolver_1 = _this._options.hostReplacementPaths;
                    replacements = function (path) { return core_1.normalize(replacementResolver_1(core_1.getSystemPath(path))); };
                    host = new /** @class */ (function (_super) {
                        __extends(class_1, _super);
                        function class_1() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        class_1.prototype._resolve = function (path) {
                            return core_1.normalize(replacementResolver_1(core_1.getSystemPath(path)));
                        };
                        return class_1;
                    }(core_1.virtualFs.ResolverHost))(host);
                }
                else {
                    replacements = new Map();
                    var aliasHost = new core_1.virtualFs.AliasHost(host);
                    for (var from in _this._options.hostReplacementPaths) {
                        var normalizedFrom = core_1.resolve(core_1.normalize(_this._basePath), core_1.normalize(from));
                        var normalizedWith = core_1.resolve(core_1.normalize(_this._basePath), core_1.normalize(_this._options.hostReplacementPaths[from]));
                        aliasHost.aliases.set(normalizedFrom, normalizedWith);
                        replacements.set(normalizedFrom, normalizedWith);
                    }
                    host = aliasHost;
                }
            }
            // Create the webpack compiler host.
            var webpackCompilerHost = new compiler_host_1.WebpackCompilerHost(_this._compilerOptions, _this._basePath, host);
            webpackCompilerHost.enableCaching();
            // Create and set a new WebpackResourceLoader.
            _this._resourceLoader = new resource_loader_1.WebpackResourceLoader();
            webpackCompilerHost.setResourceLoader(_this._resourceLoader);
            // Use the WebpackCompilerHost with a resource loader to create an AngularCompilerHost.
            _this._compilerHost = ngtools_api_1.createCompilerHost({
                options: _this._compilerOptions,
                tsHost: webpackCompilerHost
            });
            // Resolve mainPath if provided.
            if (_this._options.mainPath) {
                _this._mainPath = _this._compilerHost.resolve(_this._options.mainPath);
            }
            var inputDecorator = new virtual_file_system_decorator_1.VirtualFileSystemDecorator(compilerWithFileSystems.inputFileSystem, _this._compilerHost);
            compilerWithFileSystems.inputFileSystem = inputDecorator;
            compilerWithFileSystems.watchFileSystem = new virtual_file_system_decorator_1.VirtualWatchFileSystemDecorator(inputDecorator, replacements);
        });
        // Add lazy modules to the context module for @angular/core
        compiler.hooks.contextModuleFactory.tap('angular-compiler', function (cmf) {
            var angularCorePackagePath = require.resolve('@angular/core/package.json');
            // APFv6 does not have single FESM anymore. Instead of verifying if we're pointing to
            // FESMs, we resolve the `@angular/core` path and verify that the path for the
            // module starts with it.
            // This may be slower but it will be compatible with both APF5, 6 and potential future
            // versions (until the dynamic import appears outside of core I suppose).
            // We resolve any symbolic links in order to get the real path that would be used in webpack.
            var angularCoreDirname = fs.realpathSync(path.dirname(angularCorePackagePath));
            cmf.hooks.afterResolve.tapPromise('angular-compiler', function (result) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // Alter only request from Angular.
                    if (!result || !this.done || !result.resource.startsWith(angularCoreDirname)) {
                        return [2 /*return*/, result];
                    }
                    return [2 /*return*/, this.done.then(function () {
                            // This folder does not exist, but we need to give webpack a resource.
                            // TODO: check if we can't just leave it as is (angularCoreModuleDir).
                            result.resource = path.join(_this._basePath, '$$_lazy_route_resource');
                            // tslint:disable-next-line:no-any
                            result.dependencies.forEach(function (d) { return d.critical = false; });
                            // tslint:disable-next-line:no-any
                            result.resolveDependencies = function (_fs, options, callback) {
                                var dependencies = Object.keys(_this._lazyRoutes)
                                    .map(function (key) {
                                    var modulePath = _this._lazyRoutes[key];
                                    var importPath = key.split('#')[0];
                                    if (modulePath !== null) {
                                        var name_1 = importPath.replace(/(\.ngfactory)?\.(js|ts)$/, '');
                                        return new _this._contextElementDependencyConstructor(modulePath, name_1);
                                    }
                                    else {
                                        return null;
                                    }
                                })
                                    .filter(function (x) { return !!x; });
                                if (_this._options.nameLazyFiles) {
                                    options.chunkName = '[request]';
                                }
                                callback(null, dependencies);
                            };
                            return result;
                        }, function () { return undefined; })];
                });
            }); });
        });
        // Create and destroy forked type checker on watch mode.
        compiler.hooks.watchRun.tap('angular-compiler', function () {
            if (_this._forkTypeChecker && !_this._typeCheckerProcess) {
                _this._createForkedTypeChecker();
            }
        });
        compiler.hooks.watchClose.tap('angular-compiler', function () { return _this._killForkedTypeChecker(); });
        // Remake the plugin on each compilation.
        compiler.hooks.make.tapPromise('angular-compiler', function (compilation) { return _this._make(compilation); });
        compiler.hooks.invalid.tap('angular-compiler', function () { return _this._firstRun = false; });
        compiler.hooks.afterEmit.tap('angular-compiler', function (compilation) {
            // tslint:disable-next-line:no-any
            compilation._ngToolsWebpackPluginInstance = null;
        });
        compiler.hooks.done.tap('angular-compiler', function () {
            _this._donePromise = null;
        });
        compiler.hooks.afterResolvers.tap('angular-compiler', function (compiler) {
            compiler.hooks.normalModuleFactory.tap('angular-compiler', function (nmf) {
                // Virtual file system.
                // TODO: consider if it's better to remove this plugin and instead make it wait on the
                // VirtualFileSystemDecorator.
                // Wait for the plugin to be done when requesting `.ts` files directly (entry points), or
                // when the issuer is a `.ts` or `.ngfactory.js` file.
                nmf.hooks.beforeResolve.tapPromise('angular-compiler', function (request) { return __awaiter(_this, void 0, void 0, function () {
                    var name_2, issuer, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(this.done && request)) return [3 /*break*/, 4];
                                name_2 = request.request;
                                issuer = request.contextInfo.issuer;
                                if (!(name_2.endsWith('.ts') || name_2.endsWith('.tsx')
                                    || (issuer && /\.ts|ngfactory\.js$/.test(issuer)))) return [3 /*break*/, 4];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.done];
                            case 2:
                                _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/, request];
                        }
                    });
                }); });
            });
        });
        compiler.hooks.normalModuleFactory.tap('angular-compiler', function (nmf) {
            nmf.hooks.beforeResolve.tapAsync('angular-compiler', function (request, callback) {
                paths_plugin_1.resolveWithPaths(request, callback, _this._compilerOptions, _this._compilerHost, _this._moduleResolutionCache);
            });
        });
    };
    AngularCompilerPlugin.prototype._make = function (compilation) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                benchmark_1.time('AngularCompilerPlugin._make');
                this._emitSkipped = true;
                // tslint:disable-next-line:no-any
                if (compilation._ngToolsWebpackPluginInstance) {
                    throw new Error('An @ngtools/webpack plugin already exist for this compilation.');
                }
                // Set a private variable for this plugin instance.
                // tslint:disable-next-line:no-any
                compilation._ngToolsWebpackPluginInstance = this;
                // Update the resource loader with the new webpack compilation.
                this._resourceLoader.update(compilation);
                return [2 /*return*/, this._donePromise = Promise.resolve()
                        .then(function () { return _this._update(); })
                        .then(function () {
                        _this.pushCompilationErrors(compilation);
                        benchmark_1.timeEnd('AngularCompilerPlugin._make');
                    }, function (err) {
                        compilation.errors.push(err);
                        _this.pushCompilationErrors(compilation);
                        benchmark_1.timeEnd('AngularCompilerPlugin._make');
                    })];
            });
        });
    };
    AngularCompilerPlugin.prototype.pushCompilationErrors = function (compilation) {
        (_a = compilation.errors).push.apply(_a, this._errors);
        (_b = compilation.warnings).push.apply(_b, this._warnings);
        this._errors = [];
        this._warnings = [];
        var _a, _b;
    };
    AngularCompilerPlugin.prototype._makeTransformers = function () {
        var _this = this;
        var isAppPath = function (fileName) {
            return !fileName.endsWith('.ngfactory.ts') && !fileName.endsWith('.ngstyle.ts');
        };
        var isMainPath = function (fileName) { return fileName === (_this._mainPath ? compiler_host_1.workaroundResolve(_this._mainPath) : _this._mainPath); };
        var getEntryModules = function () { return _this.entryModules
            ? _this.entryModules.map(function (entryModule) { return ({ path: compiler_host_1.workaroundResolve(entryModule.path), className: entryModule.className }); })
            : _this.entryModules; };
        var getLazyRoutes = function () { return _this._lazyRoutes; };
        var getTypeChecker = function () { return _this._getTsProgram().getTypeChecker(); };
        if (this._JitMode) {
            // Replace resources in JIT.
            this._transformers.push(transformers_1.replaceResources(isAppPath));
        }
        else {
            // Remove unneeded angular decorators.
            this._transformers.push(transformers_1.removeDecorators(isAppPath, getTypeChecker));
        }
        if (this._platformTransformers !== null) {
            (_a = this._transformers).push.apply(_a, this._platformTransformers);
        }
        else {
            if (this._platform === PLATFORM.Browser) {
                // If we have a locale, auto import the locale data file.
                // This transform must go before replaceBootstrap because it looks for the entry module
                // import, which will be replaced.
                if (this._normalizedLocale) {
                    this._transformers.push(transformers_1.registerLocaleData(isAppPath, getEntryModules, this._normalizedLocale));
                }
                if (!this._JitMode) {
                    // Replace bootstrap in browser AOT.
                    this._transformers.push(transformers_1.replaceBootstrap(isAppPath, getEntryModules, getTypeChecker));
                }
            }
            else if (this._platform === PLATFORM.Server) {
                this._transformers.push(transformers_1.exportLazyModuleMap(isMainPath, getLazyRoutes));
                if (!this._JitMode) {
                    this._transformers.push(transformers_1.exportNgFactory(isMainPath, getEntryModules), transformers_1.replaceServerBootstrap(isMainPath, getEntryModules, getTypeChecker));
                }
            }
        }
        var _a;
    };
    AngularCompilerPlugin.prototype._update = function () {
        var _this = this;
        benchmark_1.time('AngularCompilerPlugin._update');
        // We only want to update on TS and template changes, but all kinds of files are on this
        // list, like package.json and .ngsummary.json files.
        var changedFiles = this._getChangedCompilationFiles();
        // If nothing we care about changed and it isn't the first run, don't do anything.
        if (changedFiles.length === 0 && !this._firstRun) {
            return Promise.resolve();
        }
        return Promise.resolve()
            // Make a new program and load the Angular structure.
            .then(function () { return _this._createOrUpdateProgram(); })
            .then(function () {
            if (_this.entryModules) {
                // Try to find lazy routes if we have an entry module.
                // We need to run the `listLazyRoutes` the first time because it also navigates libraries
                // and other things that we might miss using the (faster) findLazyRoutesInAst.
                // Lazy routes modules will be read with compilerHost and added to the changed files.
                var changedTsFiles = _this._getChangedTsFiles();
                if (_this._ngCompilerSupportsNewApi) {
                    _this._processLazyRoutes(_this._listLazyRoutesFromProgram());
                }
                else if (_this._firstRun) {
                    _this._processLazyRoutes(_this._getLazyRoutesFromNgtools());
                }
                else if (changedTsFiles.length > 0) {
                    _this._processLazyRoutes(_this._findLazyRoutesInAst(changedTsFiles));
                }
                if (_this._options.additionalLazyModules) {
                    _this._processLazyRoutes(_this._options.additionalLazyModules);
                }
            }
        })
            .then(function () {
            // Emit and report errors.
            // We now have the final list of changed TS files.
            // Go through each changed file and add transforms as needed.
            var sourceFiles = _this._getChangedTsFiles()
                .map(function (fileName) { return _this._getTsProgram().getSourceFile(fileName); })
                // At this point we shouldn't need to filter out undefined files, because any ts file
                // that changed should be emitted.
                // But due to hostReplacementPaths there can be files (the environment files)
                // that changed but aren't part of the compilation, specially on `ng test`.
                // So we ignore missing source files files here.
                // hostReplacementPaths needs to be fixed anyway to take care of the following issue.
                // https://github.com/angular/angular-cli/issues/7305#issuecomment-332150230
                .filter(function (x) { return !!x; });
            // Emit files.
            benchmark_1.time('AngularCompilerPlugin._update._emit');
            var _a = _this._emit(sourceFiles), emitResult = _a.emitResult, diagnostics = _a.diagnostics;
            benchmark_1.timeEnd('AngularCompilerPlugin._update._emit');
            // Report diagnostics.
            var errors = diagnostics
                .filter(function (diag) { return diag.category === ts.DiagnosticCategory.Error; });
            var warnings = diagnostics
                .filter(function (diag) { return diag.category === ts.DiagnosticCategory.Warning; });
            if (errors.length > 0) {
                var message = ngtools_api_1.formatDiagnostics(errors);
                _this._errors.push(new Error(message));
            }
            if (warnings.length > 0) {
                var message = ngtools_api_1.formatDiagnostics(warnings);
                _this._warnings.push(message);
            }
            _this._emitSkipped = !emitResult || emitResult.emitSkipped;
            // Reset changed files on successful compilation.
            if (!_this._emitSkipped && _this._errors.length === 0) {
                _this._compilerHost.resetChangedFileTracker();
            }
            benchmark_1.timeEnd('AngularCompilerPlugin._update');
        });
    };
    AngularCompilerPlugin.prototype.writeI18nOutFile = function () {
        function _recursiveMkDir(p) {
            if (!fs.existsSync(p)) {
                _recursiveMkDir(path.dirname(p));
                fs.mkdirSync(p);
            }
        }
        // Write the extracted messages to disk.
        if (this._compilerOptions.i18nOutFile) {
            var i18nOutFilePath = path.resolve(this._basePath, this._compilerOptions.i18nOutFile);
            var i18nOutFileContent = this._compilerHost.readFile(i18nOutFilePath);
            if (i18nOutFileContent) {
                _recursiveMkDir(path.dirname(i18nOutFilePath));
                fs.writeFileSync(i18nOutFilePath, i18nOutFileContent);
            }
        }
    };
    AngularCompilerPlugin.prototype.getCompiledFile = function (fileName) {
        var _this = this;
        var outputFile = fileName.replace(/.tsx?$/, '.js');
        var outputText;
        var sourceMap;
        var errorDependencies = [];
        if (this._emitSkipped) {
            var text = this._compilerHost.readFile(outputFile);
            if (text) {
                // If the compilation didn't emit files this time, try to return the cached files from the
                // last compilation and let the compilation errors show what's wrong.
                outputText = text;
                sourceMap = this._compilerHost.readFile(outputFile + '.map');
            }
            else {
                // There's nothing we can serve. Return an empty string to prevent lenghty webpack errors,
                // add the rebuild warning if it's not there yet.
                // We also need to all changed files as dependencies of this file, so that all of them
                // will be watched and trigger a rebuild next time.
                outputText = '';
                errorDependencies = this._getChangedCompilationFiles()
                    // These paths are used by the loader so we must denormalize them.
                    .map(function (p) { return _this._compilerHost.denormalizePath(p); });
            }
        }
        else {
            // Check if the TS input file and the JS output file exist.
            if (((fileName.endsWith('.ts') || fileName.endsWith('.tsx'))
                && !this._compilerHost.fileExists(fileName, false))
                || !this._compilerHost.fileExists(outputFile, false)) {
                var msg = fileName + " is missing from the TypeScript compilation. "
                    + "Please make sure it is in your tsconfig via the 'files' or 'include' property.";
                if (/(\\|\/)node_modules(\\|\/)/.test(fileName)) {
                    msg += '\nThe missing file seems to be part of a third party library. '
                        + 'TS files in published libraries are often a sign of a badly packaged library. '
                        + 'Please open an issue in the library repository to alert its author and ask them '
                        + 'to package the library using the Angular Package Format (https://goo.gl/jB3GVv).';
                }
                throw new Error(msg);
            }
            outputText = this._compilerHost.readFile(outputFile) || '';
            sourceMap = this._compilerHost.readFile(outputFile + '.map');
        }
        return { outputText: outputText, sourceMap: sourceMap, errorDependencies: errorDependencies };
    };
    AngularCompilerPlugin.prototype.getDependencies = function (fileName) {
        var _this = this;
        var resolvedFileName = this._compilerHost.resolve(fileName);
        var sourceFile = this._compilerHost.getSourceFile(resolvedFileName, ts.ScriptTarget.Latest);
        if (!sourceFile) {
            return [];
        }
        var options = this._compilerOptions;
        var host = this._compilerHost;
        var cache = this._moduleResolutionCache;
        var esImports = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.ImportDeclaration)
            .map(function (decl) {
            var moduleName = decl.moduleSpecifier.text;
            var resolved = ts.resolveModuleName(moduleName, resolvedFileName, options, host, cache);
            if (resolved.resolvedModule) {
                return resolved.resolvedModule.resolvedFileName;
            }
            else {
                return null;
            }
        })
            .filter(function (x) { return x; });
        var resourceImports = transformers_1.findResources(sourceFile)
            .map(function (resourceReplacement) { return resourceReplacement.resourcePaths; })
            .reduce(function (prev, curr) { return prev.concat(curr); }, [])
            .map(function (resourcePath) { return core_1.resolve(core_1.dirname(resolvedFileName), core_1.normalize(resourcePath)); });
        // These paths are meant to be used by the loader so we must denormalize them.
        var uniqueDependencies = new Set(esImports.concat(resourceImports, this.getResourceDependencies(this._compilerHost.denormalizePath(resolvedFileName))).map(function (p) { return p && _this._compilerHost.denormalizePath(p); }));
        return uniqueDependencies.slice().filter(function (x) { return !!x; });
    };
    AngularCompilerPlugin.prototype.getResourceDependencies = function (fileName) {
        return this._resourceLoader.getResourceDependencies(fileName);
    };
    // This code mostly comes from `performCompilation` in `@angular/compiler-cli`.
    // It skips the program creation because we need to use `loadNgStructureAsync()`,
    // and uses CustomTransformers.
    AngularCompilerPlugin.prototype._emit = function (sourceFiles) {
        var _this = this;
        benchmark_1.time('AngularCompilerPlugin._emit');
        var program = this._program;
        var allDiagnostics = [];
        var emitResult;
        try {
            if (this._JitMode) {
                var tsProgram_1 = program;
                if (this._firstRun) {
                    // Check parameter diagnostics.
                    benchmark_1.time('AngularCompilerPlugin._emit.ts.getOptionsDiagnostics');
                    allDiagnostics.push.apply(allDiagnostics, tsProgram_1.getOptionsDiagnostics());
                    benchmark_1.timeEnd('AngularCompilerPlugin._emit.ts.getOptionsDiagnostics');
                }
                if ((this._firstRun || !this._forkTypeChecker) && this._program) {
                    allDiagnostics.push.apply(allDiagnostics, gather_diagnostics_1.gatherDiagnostics(this._program, this._JitMode, 'AngularCompilerPlugin._emit.ts'));
                }
                if (!gather_diagnostics_1.hasErrors(allDiagnostics)) {
                    sourceFiles.forEach(function (sf) {
                        var timeLabel = "AngularCompilerPlugin._emit.ts+" + sf.fileName + "+.emit";
                        benchmark_1.time(timeLabel);
                        emitResult = tsProgram_1.emit(sf, undefined, undefined, undefined, { before: _this._transformers });
                        allDiagnostics.push.apply(allDiagnostics, emitResult.diagnostics);
                        benchmark_1.timeEnd(timeLabel);
                    });
                }
            }
            else {
                var angularProgram = program;
                // Check Angular structural diagnostics.
                benchmark_1.time('AngularCompilerPlugin._emit.ng.getNgStructuralDiagnostics');
                allDiagnostics.push.apply(allDiagnostics, angularProgram.getNgStructuralDiagnostics());
                benchmark_1.timeEnd('AngularCompilerPlugin._emit.ng.getNgStructuralDiagnostics');
                if (this._firstRun) {
                    // Check TypeScript parameter diagnostics.
                    benchmark_1.time('AngularCompilerPlugin._emit.ng.getTsOptionDiagnostics');
                    allDiagnostics.push.apply(allDiagnostics, angularProgram.getTsOptionDiagnostics());
                    benchmark_1.timeEnd('AngularCompilerPlugin._emit.ng.getTsOptionDiagnostics');
                    // Check Angular parameter diagnostics.
                    benchmark_1.time('AngularCompilerPlugin._emit.ng.getNgOptionDiagnostics');
                    allDiagnostics.push.apply(allDiagnostics, angularProgram.getNgOptionDiagnostics());
                    benchmark_1.timeEnd('AngularCompilerPlugin._emit.ng.getNgOptionDiagnostics');
                }
                if ((this._firstRun || !this._forkTypeChecker) && this._program) {
                    allDiagnostics.push.apply(allDiagnostics, gather_diagnostics_1.gatherDiagnostics(this._program, this._JitMode, 'AngularCompilerPlugin._emit.ng'));
                }
                if (!gather_diagnostics_1.hasErrors(allDiagnostics)) {
                    benchmark_1.time('AngularCompilerPlugin._emit.ng.emit');
                    var extractI18n = !!this._compilerOptions.i18nOutFile;
                    var emitFlags = extractI18n ? ngtools_api_1.EmitFlags.I18nBundle : ngtools_api_1.EmitFlags.Default;
                    emitResult = angularProgram.emit({
                        emitFlags: emitFlags, customTransformers: {
                            beforeTs: this._transformers
                        }
                    });
                    allDiagnostics.push.apply(allDiagnostics, emitResult.diagnostics);
                    if (extractI18n) {
                        this.writeI18nOutFile();
                    }
                    benchmark_1.timeEnd('AngularCompilerPlugin._emit.ng.emit');
                }
            }
        }
        catch (e) {
            benchmark_1.time('AngularCompilerPlugin._emit.catch');
            // This function is available in the import below, but this way we avoid the dependency.
            // import { isSyntaxError } from '@angular/compiler';
            function isSyntaxError(error) {
                return error['ngSyntaxError']; // tslint:disable-line:no-any
            }
            var errMsg = void 0;
            var code = void 0;
            if (isSyntaxError(e)) {
                // don't report the stack for syntax errors as they are well known errors.
                errMsg = e.message;
                code = ngtools_api_1.DEFAULT_ERROR_CODE;
            }
            else {
                errMsg = e.stack;
                // It is not a syntax error we might have a program with unknown state, discard it.
                this._program = null;
                code = ngtools_api_1.UNKNOWN_ERROR_CODE;
            }
            allDiagnostics.push({ category: ts.DiagnosticCategory.Error, messageText: errMsg, code: code, source: ngtools_api_1.SOURCE });
            benchmark_1.timeEnd('AngularCompilerPlugin._emit.catch');
        }
        benchmark_1.timeEnd('AngularCompilerPlugin._emit');
        return { program: program, emitResult: emitResult, diagnostics: allDiagnostics };
    };
    AngularCompilerPlugin.prototype._validateLocale = function (locale) {
        // Get the path of the common module.
        var commonPath = path.dirname(require.resolve('@angular/common/package.json'));
        // Check if the locale file exists
        if (!fs.existsSync(path.resolve(commonPath, 'locales', locale + ".js"))) {
            // Check for an alternative locale (if the locale id was badly formatted).
            var locales = fs.readdirSync(path.resolve(commonPath, 'locales'))
                .filter(function (file) { return file.endsWith('.js'); })
                .map(function (file) { return file.replace('.js', ''); });
            var newLocale = void 0;
            var normalizedLocale = locale.toLowerCase().replace(/_/g, '-');
            for (var _i = 0, locales_1 = locales; _i < locales_1.length; _i++) {
                var l = locales_1[_i];
                if (l.toLowerCase() === normalizedLocale) {
                    newLocale = l;
                    break;
                }
            }
            if (newLocale) {
                locale = newLocale;
            }
            else {
                // Check for a parent locale
                var parentLocale = normalizedLocale.split('-')[0];
                if (locales.indexOf(parentLocale) !== -1) {
                    locale = parentLocale;
                }
                else {
                    this._warnings.push("AngularCompilerPlugin: Unable to load the locale data file " +
                        ("\"@angular/common/locales/" + locale + "\", ") +
                        ("please check that \"" + locale + "\" is a valid locale id.\n            If needed, you can use \"registerLocaleData\" manually."));
                    return null;
                }
            }
        }
        return locale;
    };
    return AngularCompilerPlugin;
}());
exports.AngularCompilerPlugin = AngularCompilerPlugin;
