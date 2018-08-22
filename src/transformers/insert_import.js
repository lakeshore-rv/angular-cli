"use strict";
exports.__esModule = true;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ts = require("typescript");
var ast_helpers_1 = require("./ast_helpers");
var interfaces_1 = require("./interfaces");
function insertStarImport(sourceFile, identifier, modulePath, target, before) {
    if (before === void 0) { before = false; }
    var ops = [];
    var allImports = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.ImportDeclaration);
    // We don't need to verify if the symbol is already imported, star imports should be unique.
    // Create the new import node.
    var namespaceImport = ts.createNamespaceImport(identifier);
    var importClause = ts.createImportClause(undefined, namespaceImport);
    var newImport = ts.createImportDeclaration(undefined, undefined, importClause, ts.createLiteral(modulePath));
    if (target) {
        ops.push(new interfaces_1.AddNodeOperation(sourceFile, target, before ? newImport : undefined, before ? undefined : newImport));
    }
    else if (allImports.length > 0) {
        // Find the last import and insert after.
        ops.push(new interfaces_1.AddNodeOperation(sourceFile, allImports[allImports.length - 1], undefined, newImport));
    }
    else {
        var firstNode = ast_helpers_1.getFirstNode(sourceFile);
        if (firstNode) {
            // Insert before the first node.
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, firstNode, newImport));
        }
    }
    return ops;
}
exports.insertStarImport = insertStarImport;
function insertImport(sourceFile, symbolName, modulePath) {
    var ops = [];
    // Find all imports.
    var allImports = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.ImportDeclaration);
    var maybeImports = allImports
        .filter(function (node) {
        // Filter all imports that do not match the modulePath.
        return node.moduleSpecifier.kind == ts.SyntaxKind.StringLiteral
            && node.moduleSpecifier.text == modulePath;
    })
        .filter(function (node) {
        // Filter out import statements that are either `import 'XYZ'` or `import * as X from 'XYZ'`.
        var clause = node.importClause;
        if (!clause || clause.name || !clause.namedBindings) {
            return false;
        }
        return clause.namedBindings.kind == ts.SyntaxKind.NamedImports;
    })
        .map(function (node) {
        // Return the `{ ... }` list of the named import.
        return node.importClause.namedBindings;
    });
    if (maybeImports.length) {
        // There's an `import {A, B, C} from 'modulePath'`.
        // Find if it's in either imports. If so, just return; nothing to do.
        var hasImportAlready = maybeImports.some(function (node) {
            return node.elements.some(function (element) {
                return element.name.text == symbolName;
            });
        });
        if (hasImportAlready) {
            return ops;
        }
        // Just pick the first one and insert at the end of its identifier list.
        ops.push(new interfaces_1.AddNodeOperation(sourceFile, maybeImports[0].elements[maybeImports[0].elements.length - 1], undefined, ts.createImportSpecifier(undefined, ts.createIdentifier(symbolName))));
    }
    else {
        // Create the new import node.
        var namedImports = ts.createNamedImports([ts.createImportSpecifier(undefined, ts.createIdentifier(symbolName))]);
        var importClause = ts.createImportClause(undefined, namedImports);
        var newImport = ts.createImportDeclaration(undefined, undefined, importClause, ts.createLiteral(modulePath));
        if (allImports.length > 0) {
            // Find the last import and insert after.
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, allImports[allImports.length - 1], undefined, newImport));
        }
        else {
            var firstNode = ast_helpers_1.getFirstNode(sourceFile);
            if (firstNode) {
                // Insert before the first node.
                ops.push(new interfaces_1.AddNodeOperation(sourceFile, firstNode, newImport));
            }
        }
    }
    return ops;
}
exports.insertImport = insertImport;
