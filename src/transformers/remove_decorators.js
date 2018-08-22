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
var make_transform_1 = require("./make_transform");
function removeDecorators(shouldTransform, getTypeChecker) {
    var standardTransform = function (sourceFile) {
        var ops = [];
        if (!shouldTransform(sourceFile.fileName)) {
            return ops;
        }
        ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.Decorator)
            .filter(function (decorator) { return shouldRemove(decorator, getTypeChecker()); })
            .forEach(function (decorator) {
            // Remove the decorator node.
            ops.push(new interfaces_1.RemoveNodeOperation(sourceFile, decorator));
        });
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform, getTypeChecker);
}
exports.removeDecorators = removeDecorators;
function shouldRemove(decorator, typeChecker) {
    var origin = getDecoratorOrigin(decorator, typeChecker);
    return origin ? origin.module === '@angular/core' : false;
}
function getDecoratorOrigin(decorator, typeChecker) {
    if (!ts.isCallExpression(decorator.expression)) {
        return null;
    }
    var identifier;
    var name = undefined;
    if (ts.isPropertyAccessExpression(decorator.expression.expression)) {
        identifier = decorator.expression.expression.expression;
        name = decorator.expression.expression.name.text;
    }
    else if (ts.isIdentifier(decorator.expression.expression)) {
        identifier = decorator.expression.expression;
    }
    else {
        return null;
    }
    // NOTE: resolver.getReferencedImportDeclaration would work as well but is internal
    var symbol = typeChecker.getSymbolAtLocation(identifier);
    if (symbol && symbol.declarations && symbol.declarations.length > 0) {
        var declaration = symbol.declarations[0];
        var module = void 0;
        if (ts.isImportSpecifier(declaration)) {
            name = (declaration.propertyName || declaration.name).text;
            module = declaration.parent
                && declaration.parent.parent
                && declaration.parent.parent.parent
                && declaration.parent.parent.parent.moduleSpecifier.text
                || '';
        }
        else if (ts.isNamespaceImport(declaration)) {
            // Use the name from the decorator namespace property access
            module = declaration.parent
                && declaration.parent.parent
                && declaration.parent.parent.moduleSpecifier.text;
        }
        else if (ts.isImportClause(declaration)) {
            name = declaration.name && declaration.name.text;
            module = declaration.parent && declaration.parent.moduleSpecifier.text;
        }
        else {
            return null;
        }
        return { name: name || '', module: module || '' };
    }
    return null;
}
