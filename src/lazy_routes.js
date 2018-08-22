"use strict";
exports.__esModule = true;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var path_1 = require("path");
var ts = require("typescript");
var refactor_1 = require("./refactor");
function _getContentOfKeyLiteral(_source, node) {
    if (node.kind == ts.SyntaxKind.Identifier) {
        return node.text;
    }
    else if (node.kind == ts.SyntaxKind.StringLiteral) {
        return node.text;
    }
    else {
        return null;
    }
}
function findLazyRoutes(filePath, host, program, compilerOptions) {
    if (!compilerOptions) {
        if (!program) {
            throw new Error('Must pass either program or compilerOptions to findLazyRoutes.');
        }
        compilerOptions = program.getCompilerOptions();
    }
    var fileName = refactor_1.resolve(filePath, host, compilerOptions).replace(/\\/g, '/');
    var sourceFile;
    if (program) {
        sourceFile = program.getSourceFile(fileName);
    }
    if (!sourceFile) {
        var content = host.readFile(fileName);
        if (content) {
            sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, true);
        }
    }
    if (!sourceFile) {
        throw new Error("Source file not found: '" + fileName + "'.");
    }
    var sf = sourceFile;
    return refactor_1.findAstNodes(null, sourceFile, ts.SyntaxKind.ObjectLiteralExpression, true)
        // Get all their property assignments.
        .map(function (node) {
        return refactor_1.findAstNodes(node, sf, ts.SyntaxKind.PropertyAssignment, false);
    })
        // Take all `loadChildren` elements.
        .reduce(function (acc, props) {
        return acc.concat(props.filter(function (literal) {
            return _getContentOfKeyLiteral(sf, literal.name) == 'loadChildren';
        }));
    }, [])
        // Get only string values.
        .filter(function (node) { return node.initializer.kind == ts.SyntaxKind.StringLiteral; })
        // Get the string value.
        .map(function (node) { return node.initializer.text; })
        // Map those to either [path, absoluteModulePath], or [path, null] if the module pointing to
        // does not exist.
        .map(function (routePath) {
        var moduleName = routePath.split('#')[0];
        var compOptions = (program && program.getCompilerOptions()) || compilerOptions || {};
        var resolvedModuleName = moduleName[0] == '.'
            ? {
                resolvedModule: { resolvedFileName: path_1.join(path_1.dirname(filePath), moduleName) + '.ts' }
            }
            : ts.resolveModuleName(moduleName, filePath, compOptions, host);
        if (resolvedModuleName.resolvedModule
            && resolvedModuleName.resolvedModule.resolvedFileName
            && host.fileExists(resolvedModuleName.resolvedModule.resolvedFileName)) {
            return [routePath, resolvedModuleName.resolvedModule.resolvedFileName];
        }
        else {
            return [routePath, null];
        }
    })
        // Reduce to the LazyRouteMap map.
        .reduce(function (acc, _a) {
        var routePath = _a[0], resolvedModuleName = _a[1];
        if (resolvedModuleName) {
            acc[routePath] = resolvedModuleName;
        }
        return acc;
    }, {});
}
exports.findLazyRoutes = findLazyRoutes;
