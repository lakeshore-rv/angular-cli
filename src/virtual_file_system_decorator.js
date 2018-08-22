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
exports.NodeWatchFileSystem = require('webpack/lib/node/NodeWatchFileSystem');
var VirtualFileSystemDecorator = /** @class */ (function () {
    function VirtualFileSystemDecorator(_inputFileSystem, _webpackCompilerHost) {
        this._inputFileSystem = _inputFileSystem;
        this._webpackCompilerHost = _webpackCompilerHost;
    }
    VirtualFileSystemDecorator.prototype._readFileSync = function (path) {
        if (this._webpackCompilerHost.fileExists(path)) {
            return this._webpackCompilerHost.readFileBuffer(path) || null;
        }
        return null;
    };
    VirtualFileSystemDecorator.prototype._statSync = function (path) {
        if (this._webpackCompilerHost.fileExists(path)) {
            return this._webpackCompilerHost.stat(path);
        }
        return null;
    };
    VirtualFileSystemDecorator.prototype.getVirtualFilesPaths = function () {
        return this._webpackCompilerHost.getNgFactoryPaths();
    };
    VirtualFileSystemDecorator.prototype.stat = function (path, callback) {
        var result = this._statSync(path);
        if (result) {
            callback(null, result);
        }
        else {
            this._inputFileSystem.stat(path, callback);
        }
    };
    VirtualFileSystemDecorator.prototype.readdir = function (path, callback) {
        this._inputFileSystem.readdir(path, callback);
    };
    VirtualFileSystemDecorator.prototype.readFile = function (path, callback) {
        var result = this._readFileSync(path);
        if (result) {
            callback(null, result);
        }
        else {
            this._inputFileSystem.readFile(path, callback);
        }
    };
    VirtualFileSystemDecorator.prototype.readJson = function (path, callback) {
        this._inputFileSystem.readJson(path, callback);
    };
    VirtualFileSystemDecorator.prototype.readlink = function (path, callback) {
        this._inputFileSystem.readlink(path, callback);
    };
    VirtualFileSystemDecorator.prototype.statSync = function (path) {
        var result = this._statSync(path);
        return result || this._inputFileSystem.statSync(path);
    };
    VirtualFileSystemDecorator.prototype.readdirSync = function (path) {
        return this._inputFileSystem.readdirSync(path);
    };
    VirtualFileSystemDecorator.prototype.readFileSync = function (path) {
        var result = this._readFileSync(path);
        return result || this._inputFileSystem.readFileSync(path);
    };
    VirtualFileSystemDecorator.prototype.readJsonSync = function (path) {
        return this._inputFileSystem.readJsonSync(path);
    };
    VirtualFileSystemDecorator.prototype.readlinkSync = function (path) {
        return this._inputFileSystem.readlinkSync(path);
    };
    VirtualFileSystemDecorator.prototype.purge = function (changes) {
        var _this = this;
        if (typeof changes === 'string') {
            this._webpackCompilerHost.invalidate(changes);
        }
        else if (Array.isArray(changes)) {
            changes.forEach(function (fileName) { return _this._webpackCompilerHost.invalidate(fileName); });
        }
        if (this._inputFileSystem.purge) {
            this._inputFileSystem.purge(changes);
        }
    };
    return VirtualFileSystemDecorator;
}());
exports.VirtualFileSystemDecorator = VirtualFileSystemDecorator;
var VirtualWatchFileSystemDecorator = /** @class */ (function (_super) {
    __extends(VirtualWatchFileSystemDecorator, _super);
    function VirtualWatchFileSystemDecorator(_virtualInputFileSystem, _replacements) {
        var _this = _super.call(this, _virtualInputFileSystem) || this;
        _this._virtualInputFileSystem = _virtualInputFileSystem;
        _this._replacements = _replacements;
        return _this;
    }
    VirtualWatchFileSystemDecorator.prototype.watch = function (files, dirs, missing, startTime, options, callback, // tslint:disable-line:no-any
    callbackUndelayed) {
        var _this = this;
        var reverseReplacements = new Map();
        var reverseTimestamps = function (map) {
            for (var _i = 0, _a = Array.from(map.entries()); _i < _a.length; _i++) {
                var entry = _a[_i];
                var original = reverseReplacements.get(entry[0]);
                if (original) {
                    map.set(original, entry[1]);
                    map["delete"](entry[0]);
                }
            }
            return map;
        };
        var newCallbackUndelayed = function (filename, timestamp) {
            var original = reverseReplacements.get(filename);
            if (original) {
                _this._virtualInputFileSystem.purge(original);
                callbackUndelayed(original, timestamp);
            }
            else {
                callbackUndelayed(filename, timestamp);
            }
        };
        var newCallback = function (err, filesModified, contextModified, missingModified, fileTimestamps, contextTimestamps) {
            // Update fileTimestamps with timestamps from virtual files.
            var virtualFilesStats = _this._virtualInputFileSystem.getVirtualFilesPaths()
                .map(function (fileName) { return ({
                path: fileName,
                mtime: +_this._virtualInputFileSystem.statSync(fileName).mtime
            }); });
            virtualFilesStats.forEach(function (stats) { return fileTimestamps.set(stats.path, +stats.mtime); });
            callback(err, filesModified.map(function (value) { return reverseReplacements.get(value) || value; }), contextModified.map(function (value) { return reverseReplacements.get(value) || value; }), missingModified.map(function (value) { return reverseReplacements.get(value) || value; }), reverseTimestamps(fileTimestamps), reverseTimestamps(contextTimestamps));
        };
        var mapReplacements = function (original) {
            if (!_this._replacements) {
                return original;
            }
            var replacements = _this._replacements;
            return original.map(function (file) {
                if (typeof replacements === 'function') {
                    var replacement = core_1.getSystemPath(replacements(core_1.normalize(file)));
                    if (replacement !== file) {
                        reverseReplacements.set(replacement, file);
                    }
                    return replacement;
                }
                else {
                    var replacement = replacements.get(core_1.normalize(file));
                    if (replacement) {
                        var fullReplacement = core_1.getSystemPath(replacement);
                        reverseReplacements.set(fullReplacement, file);
                        return fullReplacement;
                    }
                    else {
                        return file;
                    }
                }
            });
        };
        var watcher = _super.prototype.watch.call(this, mapReplacements(files), mapReplacements(dirs), mapReplacements(missing), startTime, options, newCallback, newCallbackUndelayed);
        return {
            close: function () { return watcher.close(); },
            pause: function () { return watcher.pause(); },
            getFileTimestamps: function () { return reverseTimestamps(watcher.getFileTimestamps()); },
            getContextTimestamps: function () { return reverseTimestamps(watcher.getContextTimestamps()); }
        };
    };
    return VirtualWatchFileSystemDecorator;
}(exports.NodeWatchFileSystem));
exports.VirtualWatchFileSystemDecorator = VirtualWatchFileSystemDecorator;
