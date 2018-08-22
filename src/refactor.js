"use strict";
exports.__esModule = true;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var path = require("path");
var ts = require("typescript");
/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node The root node to check, or null if the whole tree should be searched.
 * @param sourceFile The source file where the node is.
 * @param kind The kind of nodes to find.
 * @param recursive Whether to go in matched nodes to keep matching.
 * @param max The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
// TODO: replace this with collectDeepNodes and add limits to collectDeepNodes
function findAstNodes(node, sourceFile, kind, recursive, max) {
    if (recursive === void 0) { recursive = false; }
    if (max === void 0) { max = Infinity; }
    // TODO: refactor operations that only need `refactor.findAstNodes()` to use this instead.
    if (max == 0) {
        return [];
    }
    if (!node) {
        node = sourceFile;
    }
    var arr = [];
    if (node.kind === kind) {
        // If we're not recursively looking for children, stop here.
        if (!recursive) {
            return [node];
        }
        arr.push(node);
        max--;
    }
    if (max > 0) {
        for (var _i = 0, _a = node.getChildren(sourceFile); _i < _a.length; _i++) {
            var child = _a[_i];
            findAstNodes(child, sourceFile, kind, recursive, max)
                .forEach(function (node) {
                if (max > 0) {
                    arr.push(node);
                }
                max--;
            });
            if (max <= 0) {
                break;
            }
        }
    }
    return arr;
}
exports.findAstNodes = findAstNodes;
function resolve(filePath, _host, compilerOptions) {
    if (path.isAbsolute(filePath)) {
        return filePath;
    }
    var basePath = compilerOptions.baseUrl || compilerOptions.rootDir;
    if (!basePath) {
        throw new Error("Trying to resolve '" + filePath + "' without a basePath.");
    }
    return path.join(basePath, filePath);
}
exports.resolve = resolve;
var TypeScriptFileRefactor = /** @class */ (function () {
    function TypeScriptFileRefactor(fileName, _host, _program, source) {
        var sourceFile = null;
        if (_program) {
            fileName = resolve(fileName, _host, _program.getCompilerOptions()).replace(/\\/g, '/');
            this._fileName = fileName;
            if (source) {
                sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
            }
            else {
                sourceFile = _program.getSourceFile(fileName) || null;
            }
        }
        if (!sourceFile) {
            var maybeContent = source || _host.readFile(fileName);
            if (maybeContent) {
                sourceFile = ts.createSourceFile(fileName, maybeContent, ts.ScriptTarget.Latest, true);
            }
        }
        if (!sourceFile) {
            throw new Error('Must have a source file to refactor.');
        }
        this._sourceFile = sourceFile;
    }
    Object.defineProperty(TypeScriptFileRefactor.prototype, "fileName", {
        get: function () { return this._fileName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeScriptFileRefactor.prototype, "sourceFile", {
        get: function () { return this._sourceFile; },
        enumerable: true,
        configurable: true
    });
    /**
     * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
     * @param node The root node to check, or null if the whole tree should be searched.
     * @param kind The kind of nodes to find.
     * @param recursive Whether to go in matched nodes to keep matching.
     * @param max The maximum number of items to return.
     * @return all nodes of kind, or [] if none is found
     */
    TypeScriptFileRefactor.prototype.findAstNodes = function (node, kind, recursive, max) {
        if (recursive === void 0) { recursive = false; }
        if (max === void 0) { max = Infinity; }
        return findAstNodes(node, this._sourceFile, kind, recursive, max);
    };
    return TypeScriptFileRefactor;
}());
exports.TypeScriptFileRefactor = TypeScriptFileRefactor;
