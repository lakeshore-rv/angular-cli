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
var ast_helpers_1 = require("./ast_helpers");
var interfaces_1 = require("./interfaces");
var make_transform_1 = require("./make_transform");
function exportNgFactory(shouldTransform, getEntryModules) {
    var standardTransform = function (sourceFile) {
        var ops = [];
        var entryModules = getEntryModules();
        if (!shouldTransform(sourceFile.fileName) || !entryModules) {
            return ops;
        }
        return entryModules.reduce(function (ops, entryModule) { return ops.concat(standardTransformHelper(sourceFile, entryModule)); }, ops);
    };
    var standardTransformHelper = function (sourceFile, entryModule) {
        var ops = [];
        // Find all identifiers using the entry module class name.
        var entryModuleIdentifiers = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.Identifier)
            .filter(function (identifier) { return identifier.text === entryModule.className; });
        if (entryModuleIdentifiers.length === 0) {
            return [];
        }
        var relativeEntryModulePath = path_1.relative(path_1.dirname(sourceFile.fileName), entryModule.path);
        var normalizedEntryModulePath = ("./" + relativeEntryModulePath).replace(/\\/g, '/');
        // Get the module path from the import.
        entryModuleIdentifiers.forEach(function (entryModuleIdentifier) {
            if (!entryModuleIdentifier.parent
                || entryModuleIdentifier.parent.kind !== ts.SyntaxKind.ExportSpecifier) {
                return;
            }
            var exportSpec = entryModuleIdentifier.parent;
            var moduleSpecifier = exportSpec.parent
                && exportSpec.parent.parent
                && exportSpec.parent.parent.moduleSpecifier;
            if (!moduleSpecifier || moduleSpecifier.kind !== ts.SyntaxKind.StringLiteral) {
                return;
            }
            // Add the transform operations.
            var factoryClassName = entryModule.className + 'NgFactory';
            var factoryModulePath = normalizedEntryModulePath + '.ngfactory';
            var namedExports = ts.createNamedExports([ts.createExportSpecifier(undefined, ts.createIdentifier(factoryClassName))]);
            var newImport = ts.createExportDeclaration(undefined, undefined, namedExports, ts.createLiteral(factoryModulePath));
            var firstNode = ast_helpers_1.getFirstNode(sourceFile);
            if (firstNode) {
                ops.push(new interfaces_1.AddNodeOperation(sourceFile, firstNode, newImport));
            }
        });
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform);
}
exports.exportNgFactory = exportNgFactory;
