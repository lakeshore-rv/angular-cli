"use strict";
exports.__esModule = true;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// TODO: fix typings.
// tslint:disable-next-line:no-global-tslint-disable
// tslint:disable:no-any
var path = require("path");
var vm = require("vm");
var webpack_sources_1 = require("webpack-sources");
var NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
var NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
var LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var WebpackResourceLoader = /** @class */ (function () {
    function WebpackResourceLoader() {
        this._fileDependencies = new Map();
        this._cachedSources = new Map();
        this._cachedEvaluatedSources = new Map();
    }
    WebpackResourceLoader.prototype.update = function (parentCompilation) {
        this._parentCompilation = parentCompilation;
        this._context = parentCompilation.context;
    };
    WebpackResourceLoader.prototype.getResourceDependencies = function (filePath) {
        return this._fileDependencies.get(filePath) || [];
    };
    WebpackResourceLoader.prototype._compile = function (filePath) {
        var _this = this;
        if (!this._parentCompilation) {
            throw new Error('WebpackResourceLoader cannot be used without parentCompilation');
        }
        // Simple sanity check.
        if (filePath.match(/\.[jt]s$/)) {
            return Promise.reject('Cannot use a JavaScript or TypeScript file for styleUrl.');
        }
        var outputOptions = { filename: filePath };
        var relativePath = path.relative(this._context || '', filePath);
        var childCompiler = this._parentCompilation.createChildCompiler(relativePath, outputOptions);
        childCompiler.context = this._context;
        new NodeTemplatePlugin(outputOptions).apply(childCompiler);
        new NodeTargetPlugin().apply(childCompiler);
        new SingleEntryPlugin(this._context, filePath).apply(childCompiler);
        new LoaderTargetPlugin('node').apply(childCompiler);
        childCompiler.hooks.thisCompilation.tap('ngtools-webpack', function (compilation) {
            compilation.hooks.additionalAssets.tapAsync('ngtools-webpack', function (callback) {
                if (_this._cachedEvaluatedSources.has(compilation.fullHash)) {
                    var cachedEvaluatedSource = _this._cachedEvaluatedSources.get(compilation.fullHash);
                    compilation.assets[filePath] = cachedEvaluatedSource;
                    callback();
                    return;
                }
                var asset = compilation.assets[filePath];
                if (asset) {
                    _this._evaluate({ outputName: filePath, source: asset.source() })
                        .then(function (output) {
                        var evaluatedSource = new webpack_sources_1.RawSource(output);
                        _this._cachedEvaluatedSources.set(compilation.fullHash, evaluatedSource);
                        compilation.assets[filePath] = evaluatedSource;
                        callback();
                    })["catch"](function (err) { return callback(err); });
                }
                else {
                    callback();
                }
            });
        });
        // Compile and return a promise
        return new Promise(function (resolve, reject) {
            childCompiler.compile(function (err, childCompilation) {
                // Resolve / reject the promise
                if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
                    var errorDetails = childCompilation.errors.map(function (error) {
                        return error.message + (error.error ? ':\n' + error.error : '');
                    }).join('\n');
                    reject(new Error('Child compilation failed:\n' + errorDetails));
                }
                else if (err) {
                    reject(err);
                }
                else {
                    Object.keys(childCompilation.assets).forEach(function (assetName) {
                        // Add all new assets to the parent compilation, with the exception of
                        // the file we're loading and its sourcemap.
                        if (assetName !== filePath
                            && assetName !== filePath + ".map"
                            && _this._parentCompilation.assets[assetName] == undefined) {
                            _this._parentCompilation.assets[assetName] = childCompilation.assets[assetName];
                        }
                    });
                    // Save the dependencies for this resource.
                    _this._fileDependencies.set(filePath, childCompilation.fileDependencies);
                    var compilationHash = childCompilation.fullHash;
                    var maybeSource = _this._cachedSources.get(compilationHash);
                    if (maybeSource) {
                        resolve({ outputName: filePath, source: maybeSource });
                    }
                    else {
                        var source = childCompilation.assets[filePath].source();
                        _this._cachedSources.set(compilationHash, source);
                        resolve({ outputName: filePath, source: source });
                    }
                }
            });
        });
    };
    WebpackResourceLoader.prototype._evaluate = function (_a) {
        var outputName = _a.outputName, source = _a.source;
        try {
            // Evaluate code
            var evaluatedSource = vm.runInNewContext(source, undefined, { filename: outputName });
            if (typeof evaluatedSource == 'string') {
                return Promise.resolve(evaluatedSource);
            }
            return Promise.reject('The loader "' + outputName + '" didn\'t return a string.');
        }
        catch (e) {
            return Promise.reject(e);
        }
    };
    WebpackResourceLoader.prototype.get = function (filePath) {
        return this._compile(filePath)
            .then(function (result) { return result.source; });
    };
    return WebpackResourceLoader;
}());
exports.WebpackResourceLoader = WebpackResourceLoader;
