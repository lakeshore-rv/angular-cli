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
var ast_helpers_1 = require("./ast_helpers");
var interfaces_1 = require("./interfaces");
var make_transform_1 = require("./make_transform");
function exportLazyModuleMap(shouldTransform, lazyRoutesCb) {
    var standardTransform = function (sourceFile) {
        var ops = [];
        var lazyRoutes = lazyRoutesCb();
        if (!shouldTransform(sourceFile.fileName)) {
            return ops;
        }
        var dirName = path.normalize(path.dirname(sourceFile.fileName));
        var modules = Object.keys(lazyRoutes)
            .map(function (loadChildrenString) {
            var _a = loadChildrenString.split('#'), moduleName = _a[1];
            var modulePath = lazyRoutes[loadChildrenString];
            return {
                modulePath: modulePath,
                moduleName: moduleName,
                loadChildrenString: loadChildrenString
            };
        });
        modules.forEach(function (module, index) {
            var modulePath = module.modulePath;
            if (!modulePath) {
                return;
            }
            var relativePath = path.relative(dirName, modulePath).replace(/\\/g, '/');
            if (!(relativePath.startsWith('./') || relativePath.startsWith('../'))) {
                // 'a/b/c' is a relative path for Node but an absolute path for TS, so we must convert it.
                relativePath = "./" + relativePath;
            }
            // Create the new namespace import node.
            var namespaceImport = ts.createNamespaceImport(ts.createIdentifier("__lazy_" + index + "__"));
            var importClause = ts.createImportClause(undefined, namespaceImport);
            var newImport = ts.createImportDeclaration(undefined, undefined, importClause, ts.createLiteral(relativePath));
            var firstNode = ast_helpers_1.getFirstNode(sourceFile);
            if (firstNode) {
                ops.push(new interfaces_1.AddNodeOperation(sourceFile, firstNode, newImport));
            }
        });
        var lazyModuleObjectLiteral = ts.createObjectLiteral(modules.map(function (mod, idx) {
            var _a = mod.loadChildrenString.split('#'), modulePath = _a[0], moduleName = _a[1];
            if (modulePath.match(/\.ngfactory/)) {
                modulePath = modulePath.replace('.ngfactory', '');
                moduleName = moduleName.replace('NgFactory', '');
            }
            return ts.createPropertyAssignment(ts.createLiteral(modulePath + "#" + moduleName), ts.createPropertyAccess(ts.createIdentifier("__lazy_" + idx + "__"), mod.moduleName));
        }));
        var lazyModuleVariableStmt = ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], [ts.createVariableDeclaration('LAZY_MODULE_MAP', undefined, lazyModuleObjectLiteral)]);
        var lastNode = ast_helpers_1.getLastNode(sourceFile);
        if (lastNode) {
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, lastNode, undefined, lazyModuleVariableStmt));
        }
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform);
}
exports.exportLazyModuleMap = exportLazyModuleMap;
