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
var node_1 = require("@angular-devkit/core/node");
var path_1 = require("path");
var ts = require("typescript");
var dev = Math.floor(Math.random() * 10000);
var VirtualStats = /** @class */ (function () {
    function VirtualStats(_path) {
        this._path = _path;
        this._ctime = new Date();
        this._mtime = new Date();
        this._atime = new Date();
        this._btime = new Date();
        this._dev = dev;
        this._ino = Math.floor(Math.random() * 100000);
        this._mode = parseInt('777', 8); // RWX for everyone.
        this._uid = Number(process.env['UID']) || 0;
        this._gid = Number(process.env['GID']) || 0;
    }
    VirtualStats.prototype.isFile = function () { return false; };
    VirtualStats.prototype.isDirectory = function () { return false; };
    VirtualStats.prototype.isBlockDevice = function () { return false; };
    VirtualStats.prototype.isCharacterDevice = function () { return false; };
    VirtualStats.prototype.isSymbolicLink = function () { return false; };
    VirtualStats.prototype.isFIFO = function () { return false; };
    VirtualStats.prototype.isSocket = function () { return false; };
    Object.defineProperty(VirtualStats.prototype, "dev", {
        get: function () { return this._dev; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "ino", {
        get: function () { return this._ino; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "mode", {
        get: function () { return this._mode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "nlink", {
        get: function () { return 1; } // Default to 1 hard link.
        ,
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "uid", {
        get: function () { return this._uid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "gid", {
        get: function () { return this._gid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "rdev", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "size", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "blksize", {
        get: function () { return 512; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "blocks", {
        get: function () { return Math.ceil(this.size / this.blksize); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "atime", {
        get: function () { return this._atime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "atimeMs", {
        get: function () { return this._atime.getTime(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "mtime", {
        get: function () { return this._mtime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "mtimeMs", {
        get: function () { return this._mtime.getTime(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "ctime", {
        get: function () { return this._ctime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "ctimeMs", {
        get: function () { return this._ctime.getTime(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "birthtime", {
        get: function () { return this._btime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "birthtimeMs", {
        get: function () { return this._btime.getTime(); },
        enumerable: true,
        configurable: true
    });
    return VirtualStats;
}());
exports.VirtualStats = VirtualStats;
var VirtualDirStats = /** @class */ (function (_super) {
    __extends(VirtualDirStats, _super);
    function VirtualDirStats(_fileName) {
        return _super.call(this, _fileName) || this;
    }
    VirtualDirStats.prototype.isDirectory = function () { return true; };
    Object.defineProperty(VirtualDirStats.prototype, "size", {
        get: function () { return 1024; },
        enumerable: true,
        configurable: true
    });
    return VirtualDirStats;
}(VirtualStats));
exports.VirtualDirStats = VirtualDirStats;
var VirtualFileStats = /** @class */ (function (_super) {
    __extends(VirtualFileStats, _super);
    function VirtualFileStats(_fileName) {
        return _super.call(this, _fileName) || this;
    }
    VirtualFileStats.createFromString = function (_fileName, _content) {
        var stats = new VirtualFileStats(_fileName);
        stats.content = _content;
        return stats;
    };
    VirtualFileStats.createFromBuffer = function (_fileName, _buffer) {
        var stats = new VirtualFileStats(_fileName);
        stats.bufferContent = _buffer;
        return stats;
    };
    Object.defineProperty(VirtualFileStats.prototype, "content", {
        get: function () {
            if (!this._content && this.bufferContent) {
                this._content = core_1.virtualFs.fileBufferToString(this.bufferContent);
            }
            return this._content || '';
        },
        set: function (v) {
            this._content = v;
            this._bufferContent = null;
            this.resetMetadata();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualFileStats.prototype, "bufferContent", {
        get: function () {
            if (!this._bufferContent && this._content) {
                this._bufferContent = core_1.virtualFs.stringToFileBuffer(this._content);
            }
            return this._bufferContent || core_1.virtualFs.stringToFileBuffer('');
        },
        set: function (buf) {
            this._bufferContent = buf;
            this._content = null;
            this.resetMetadata();
        },
        enumerable: true,
        configurable: true
    });
    VirtualFileStats.prototype.setSourceFile = function (sourceFile) {
        this._sourceFile = sourceFile;
    };
    VirtualFileStats.prototype.getSourceFile = function (languageVersion, setParentNodes) {
        if (!this._sourceFile) {
            this._sourceFile = ts.createSourceFile(workaroundResolve(this._path), this.content, languageVersion, setParentNodes);
        }
        return this._sourceFile;
    };
    VirtualFileStats.prototype.resetMetadata = function () {
        this._mtime = new Date();
        this._sourceFile = null;
    };
    VirtualFileStats.prototype.isFile = function () { return true; };
    Object.defineProperty(VirtualFileStats.prototype, "size", {
        get: function () { return this.content.length; },
        enumerable: true,
        configurable: true
    });
    return VirtualFileStats;
}(VirtualStats));
exports.VirtualFileStats = VirtualFileStats;
var WebpackCompilerHost = /** @class */ (function () {
    function WebpackCompilerHost(_options, basePath, _host) {
        if (_host === void 0) { _host = new node_1.NodeJsSyncHost(); }
        this._options = _options;
        this._host = _host;
        this._files = Object.create(null);
        this._directories = Object.create(null);
        this._changedFiles = Object.create(null);
        this._changedDirs = Object.create(null);
        this._cache = false;
        this._syncHost = new core_1.virtualFs.SyncDelegateHost(_host);
        this._setParentNodes = true;
        this._basePath = this._normalizePath(basePath);
    }
    WebpackCompilerHost.prototype._normalizePath = function (path) {
        return core_1.normalize(path);
    };
    WebpackCompilerHost.prototype.denormalizePath = function (path) {
        return core_1.getSystemPath(core_1.normalize(path));
    };
    WebpackCompilerHost.prototype.resolve = function (path) {
        var p = this._normalizePath(path);
        if (p[0] == '.') {
            return this._normalizePath(path_1.join(this.getCurrentDirectory(), p));
        }
        else if (p[0] == '/' || p.match(/^\w:\//)) {
            return p;
        }
        else {
            return this._normalizePath(path_1.join(this._basePath, p));
        }
    };
    WebpackCompilerHost.prototype._cacheFile = function (fileName, stats) {
        this._files[fileName] = stats;
        var p = path_1.dirname(fileName);
        while (p && !this._directories[p]) {
            this._directories[p] = new VirtualDirStats(p);
            this._changedDirs[p] = true;
            p = path_1.dirname(p);
        }
        this._changedFiles[fileName] = true;
    };
    Object.defineProperty(WebpackCompilerHost.prototype, "dirty", {
        get: function () {
            return Object.keys(this._changedFiles).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    WebpackCompilerHost.prototype.enableCaching = function () {
        this._cache = true;
    };
    WebpackCompilerHost.prototype.resetChangedFileTracker = function () {
        this._changedFiles = Object.create(null);
        this._changedDirs = Object.create(null);
    };
    WebpackCompilerHost.prototype.getChangedFilePaths = function () {
        return Object.keys(this._changedFiles);
    };
    WebpackCompilerHost.prototype.getNgFactoryPaths = function () {
        var _this = this;
        return Object.keys(this._files)
            .filter(function (fileName) { return fileName.endsWith('.ngfactory.js') || fileName.endsWith('.ngstyle.js'); })
            // These paths are used by the virtual file system decorator so we must denormalize them.
            .map(function (path) { return _this.denormalizePath(path); });
    };
    WebpackCompilerHost.prototype.invalidate = function (fileName) {
        var fullPath = this.resolve(fileName);
        if (fullPath in this._files) {
            this._files[fullPath] = null;
        }
        else {
            for (var file in this._files) {
                if (file.startsWith(fullPath + '/')) {
                    this._files[file] = null;
                }
            }
        }
        if (this.fileExists(fullPath)) {
            this._changedFiles[fullPath] = true;
        }
    };
    WebpackCompilerHost.prototype.fileExists = function (fileName, delegate) {
        if (delegate === void 0) { delegate = true; }
        var p = this.resolve(fileName);
        return this._files[p] != null
            || (delegate && this._syncHost.exists(core_1.normalize(p)));
    };
    WebpackCompilerHost.prototype.readFile = function (fileName) {
        var stats = this.findVirtualFile(fileName);
        return stats && stats.content;
    };
    WebpackCompilerHost.prototype.readFileBuffer = function (fileName) {
        var stats = this.findVirtualFile(fileName);
        if (stats) {
            var buffer = Buffer.from(stats.bufferContent);
            return buffer;
        }
    };
    WebpackCompilerHost.prototype.findVirtualFile = function (fileName) {
        var p = this.resolve(fileName);
        var stats = this._files[p];
        if (stats) {
            return stats;
        }
        try {
            var fileBuffer = this._syncHost.read(p);
            if (fileBuffer) {
                var stats_1 = VirtualFileStats.createFromBuffer(p, fileBuffer);
                if (this._cache) {
                    this._cacheFile(p, stats_1);
                }
                return stats_1;
            }
        }
        catch (_a) {
            return undefined;
        }
    };
    WebpackCompilerHost.prototype.stat = function (path) {
        var p = this.resolve(path);
        var stats = this._files[p] || this._directories[p];
        if (!stats) {
            return this._syncHost.stat(p);
        }
        return stats;
    };
    WebpackCompilerHost.prototype.directoryExists = function (directoryName, delegate) {
        if (delegate === void 0) { delegate = true; }
        var p = this.resolve(directoryName);
        return (this._directories[p] != null)
            || (delegate && this._syncHost.exists(p) && this._syncHost.isDirectory(p));
    };
    WebpackCompilerHost.prototype.getFiles = function (path) {
        var _this = this;
        var p = this.resolve(path);
        var subfiles = Object.keys(this._files)
            .filter(function (fileName) { return path_1.dirname(fileName) == p; })
            .map(function (p) { return path_1.basename(p); });
        var delegated;
        try {
            delegated = this._syncHost.list(p).filter(function (x) {
                try {
                    return _this._syncHost.isFile(core_1.join(p, x));
                }
                catch (_a) {
                    return false;
                }
            });
        }
        catch (_a) {
            delegated = [];
        }
        return delegated.concat(subfiles);
    };
    WebpackCompilerHost.prototype.getDirectories = function (path) {
        var _this = this;
        var p = this.resolve(path);
        var subdirs = Object.keys(this._directories)
            .filter(function (fileName) { return path_1.dirname(fileName) == p; })
            .map(function (path) { return path_1.basename(path); });
        var delegated;
        try {
            delegated = this._syncHost.list(p).filter(function (x) {
                try {
                    return _this._syncHost.isDirectory(core_1.join(p, x));
                }
                catch (_a) {
                    return false;
                }
            });
        }
        catch (_a) {
            delegated = [];
        }
        return delegated.concat(subdirs);
    };
    WebpackCompilerHost.prototype.getSourceFile = function (fileName, languageVersion, _onError) {
        fileName = this.resolve(fileName);
        var stats = this._files[fileName];
        if (!stats) {
            var content = this.readFile(fileName);
            if (!this._cache && content) {
                return ts.createSourceFile(workaroundResolve(fileName), content, languageVersion, this._setParentNodes);
            }
            else {
                stats = this._files[fileName];
                if (!stats) {
                    // If cache is turned on and the file exists, the readFile call will have populated stats.
                    // Empty stats at this point mean the file doesn't exist at and so we should return
                    // undefined.
                    return undefined;
                }
            }
        }
        return stats && stats.getSourceFile(languageVersion, this._setParentNodes);
    };
    Object.defineProperty(WebpackCompilerHost.prototype, "getCancellationToken", {
        get: function () {
            // return this._delegate.getCancellationToken;
            // TODO: consider implementing a cancellation token.
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    WebpackCompilerHost.prototype.getDefaultLibFileName = function (options) {
        return ts.createCompilerHost(options, false).getDefaultLibFileName(options);
    };
    Object.defineProperty(WebpackCompilerHost.prototype, "writeFile", {
        // This is due to typescript CompilerHost interface being weird on writeFile. This shuts down
        // typings in WebStorm.
        get: function () {
            var _this = this;
            return function (fileName, data, _writeByteOrderMark, _onError, _sourceFiles) {
                var p = _this.resolve(fileName);
                var stats = VirtualFileStats.createFromString(p, data);
                _this._cacheFile(p, stats);
            };
        },
        enumerable: true,
        configurable: true
    });
    WebpackCompilerHost.prototype.getCurrentDirectory = function () {
        return this._basePath !== null ? this._basePath : '/';
    };
    WebpackCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        return this.resolve(fileName);
    };
    WebpackCompilerHost.prototype.useCaseSensitiveFileNames = function () {
        return !process.platform.startsWith('win32');
    };
    WebpackCompilerHost.prototype.getNewLine = function () {
        return '\n';
    };
    WebpackCompilerHost.prototype.setResourceLoader = function (resourceLoader) {
        this._resourceLoader = resourceLoader;
    };
    WebpackCompilerHost.prototype.readResource = function (fileName) {
        if (this._resourceLoader) {
            // These paths are meant to be used by the loader so we must denormalize them.
            var denormalizedFileName = this.denormalizePath(core_1.normalize(fileName));
            return this._resourceLoader.get(denormalizedFileName);
        }
        else {
            return this.readFile(fileName);
        }
    };
    return WebpackCompilerHost;
}());
exports.WebpackCompilerHost = WebpackCompilerHost;
// `TsCompilerAotCompilerTypeCheckHostAdapter` in @angular/compiler-cli seems to resolve module
// names directly via `resolveModuleName`, which prevents full Path usage.
// To work around this we must provide the same path format as TS internally uses in
// the SourceFile paths.
function workaroundResolve(path) {
    return core_1.getSystemPath(core_1.normalize(path)).replace(/\\/g, '/');
}
exports.workaroundResolve = workaroundResolve;
