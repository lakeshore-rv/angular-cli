"use strict";
exports.__esModule = true;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var core_1 = require("@angular-devkit/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
// Host is used instead of ReadonlyHost due to most decorators only supporting Hosts
var WebpackInputHost = /** @class */ (function () {
    function WebpackInputHost(inputFileSystem) {
        this.inputFileSystem = inputFileSystem;
    }
    Object.defineProperty(WebpackInputHost.prototype, "capabilities", {
        get: function () {
            return { synchronous: true };
        },
        enumerable: true,
        configurable: true
    });
    WebpackInputHost.prototype.write = function (_path, _content) {
        return rxjs_1.throwError(new Error('Not supported.'));
    };
    WebpackInputHost.prototype["delete"] = function (_path) {
        return rxjs_1.throwError(new Error('Not supported.'));
    };
    WebpackInputHost.prototype.rename = function (_from, _to) {
        return rxjs_1.throwError(new Error('Not supported.'));
    };
    WebpackInputHost.prototype.read = function (path) {
        var _this = this;
        return new rxjs_1.Observable(function (obs) {
            // TODO: remove this try+catch when issue https://github.com/ReactiveX/rxjs/issues/3740 is
            // fixed.
            try {
                var data = _this.inputFileSystem.readFileSync(core_1.getSystemPath(path));
                obs.next(new Uint8Array(data).buffer);
                obs.complete();
            }
            catch (e) {
                obs.error(e);
            }
        });
    };
    WebpackInputHost.prototype.list = function (path) {
        var _this = this;
        return new rxjs_1.Observable(function (obs) {
            // TODO: remove this try+catch when issue https://github.com/ReactiveX/rxjs/issues/3740 is
            // fixed.
            try {
                var names = _this.inputFileSystem.readdirSync(core_1.getSystemPath(path));
                obs.next(names.map(function (name) { return core_1.fragment(name); }));
                obs.complete();
            }
            catch (err) {
                obs.error(err);
            }
        });
    };
    WebpackInputHost.prototype.exists = function (path) {
        return this.stat(path).pipe(operators_1.map(function (stats) { return stats != null; }));
    };
    WebpackInputHost.prototype.isDirectory = function (path) {
        return this.stat(path).pipe(operators_1.map(function (stats) { return stats != null && stats.isDirectory(); }));
    };
    WebpackInputHost.prototype.isFile = function (path) {
        return this.stat(path).pipe(operators_1.map(function (stats) { return stats != null && stats.isFile(); }));
    };
    WebpackInputHost.prototype.stat = function (path) {
        var _this = this;
        return new rxjs_1.Observable(function (obs) {
            try {
                var stats = _this.inputFileSystem.statSync(core_1.getSystemPath(path));
                obs.next(stats);
                obs.complete();
            }
            catch (e) {
                if (e.code === 'ENOENT') {
                    obs.next(null);
                    obs.complete();
                }
                else {
                    obs.error(e);
                }
            }
        });
    };
    WebpackInputHost.prototype.watch = function (_path, _options) {
        return null;
    };
    return WebpackInputHost;
}());
exports.WebpackInputHost = WebpackInputHost;
