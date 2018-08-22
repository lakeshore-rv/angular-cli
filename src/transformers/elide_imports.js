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
var interfaces_1 = require("./interfaces");
// Remove imports for which all identifiers have been removed.
// Needs type checker, and works even if it's not the first transformer.
// Works by removing imports for symbols whose identifiers have all been removed.
// Doesn't use the `symbol.declarations` because that previous transforms might have removed nodes
// but the type checker doesn't know.
// See https://github.com/Microsoft/TypeScript/issues/17552 for more information.
function elideImports(sourceFile, removedNodes, getTypeChecker) {
    var ops = [];
    if (removedNodes.length === 0) {
        return [];
    }
    var typeChecker = getTypeChecker();
    // Collect all imports and used identifiers
    var specialCaseNames = new Set();
    var usedSymbols = new Set();
    var imports = [];
    ts.forEachChild(sourceFile, function visit(node) {
        // Skip removed nodes
        if (removedNodes.includes(node)) {
            return;
        }
        // Record import and skip
        if (ts.isImportDeclaration(node)) {
            imports.push(node);
            return;
        }
        if (ts.isIdentifier(node)) {
            var symbol = typeChecker.getSymbolAtLocation(node);
            if (symbol) {
                usedSymbols.add(symbol);
            }
        }
        else if (ts.isExportSpecifier(node)) {
            // Export specifiers return the non-local symbol from the above
            // so check the name string instead
            specialCaseNames.add((node.propertyName || node.name).text);
            return;
        }
        else if (ts.isShorthandPropertyAssignment(node)) {
            // Shorthand property assignments return the object property's symbol not the import's
            specialCaseNames.add(node.name.text);
        }
        ts.forEachChild(node, visit);
    });
    if (imports.length === 0) {
        return [];
    }
    var isUnused = function (node) {
        if (specialCaseNames.has(node.text)) {
            return false;
        }
        var symbol = typeChecker.getSymbolAtLocation(node);
        return symbol && !usedSymbols.has(symbol);
    };
    for (var _i = 0, imports_1 = imports; _i < imports_1.length; _i++) {
        var node = imports_1[_i];
        if (!node.importClause) {
            // "import 'abc';"
            continue;
        }
        if (node.importClause.name) {
            // "import XYZ from 'abc';"
            if (isUnused(node.importClause.name)) {
                ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, node));
            }
        }
        else if (node.importClause.namedBindings
            && ts.isNamespaceImport(node.importClause.namedBindings)) {
            // "import * as XYZ from 'abc';"
            if (isUnused(node.importClause.namedBindings.name)) {
                ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, node));
            }
        }
        else if (node.importClause.namedBindings
            && ts.isNamedImports(node.importClause.namedBindings)) {
            // "import { XYZ, ... } from 'abc';"
            var specifierOps = [];
            for (var _a = 0, _b = node.importClause.namedBindings.elements; _a < _b.length; _a++) {
                var specifier = _b[_a];
                if (isUnused(specifier.propertyName || specifier.name)) {
                    specifierOps.push(new interfaces_1.RemoveNodeOperation(sourceFile, specifier));
                }
            }
            if (specifierOps.length === node.importClause.namedBindings.elements.length) {
                ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, node));
            }
            else {
                ops.push.apply(ops, specifierOps);
            }
        }
    }
    return ops;
}
exports.elideImports = elideImports;
