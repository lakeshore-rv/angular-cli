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
function replaceResources(shouldTransform) {
    var standardTransform = function (sourceFile) {
        var ops = [];
        if (!shouldTransform(sourceFile.fileName)) {
            return ops;
        }
        var replacements = findResources(sourceFile);
        if (replacements.length > 0) {
            // Add the replacement operations.
            ops.push.apply(ops, (replacements.map(function (rep) { return rep.replaceNodeOperation; })));
            // If we added a require call, we need to also add typings for it.
            // The typings need to be compatible with node typings, but also work by themselves.
            // interface NodeRequire {(id: string): any;}
            var nodeRequireInterface = ts.createInterfaceDeclaration([], [], 'NodeRequire', [], [], [
                ts.createCallSignature([], [
                    ts.createParameter([], [], undefined, 'id', undefined, ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)),
                ], ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)),
            ]);
            // declare var require: NodeRequire;
            var varRequire = ts.createVariableStatement([ts.createToken(ts.SyntaxKind.DeclareKeyword)], [ts.createVariableDeclaration('require', ts.createTypeReferenceNode('NodeRequire', []))]);
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, ast_helpers_1.getFirstNode(sourceFile), nodeRequireInterface));
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, ast_helpers_1.getFirstNode(sourceFile), varRequire));
        }
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform);
}
exports.replaceResources = replaceResources;
function findResources(sourceFile) {
    var replacements = [];
    // Find all object literals.
    ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.ObjectLiteralExpression)
        // Get all their property assignments.
        .map(function (node) { return ast_helpers_1.collectDeepNodes(node, ts.SyntaxKind.PropertyAssignment); })
        // Flatten into a single array (from an array of array<property assignments>).
        .reduce(function (prev, curr) { return curr ? prev.concat(curr) : prev; }, [])
        // We only want property assignments for the templateUrl/styleUrls keys.
        .filter(function (node) {
        var key = _getContentOfKeyLiteral(node.name);
        if (!key) {
            // key is an expression, can't do anything.
            return false;
        }
        return key == 'templateUrl' || key == 'styleUrls';
    })
        // Replace templateUrl/styleUrls key with template/styles, and and paths with require('path').
        .forEach(function (node) {
        var key = _getContentOfKeyLiteral(node.name);
        if (key == 'templateUrl') {
            var resourcePath = _getResourceRequest(node.initializer, sourceFile);
            var requireCall = _createRequireCall(resourcePath);
            var propAssign = ts.createPropertyAssignment('template', requireCall);
            replacements.push({
                resourcePaths: [resourcePath],
                replaceNodeOperation: new interfaces_1.ReplaceNodeOperation(sourceFile, node, propAssign)
            });
        }
        else if (key == 'styleUrls') {
            var arr = ast_helpers_1.collectDeepNodes(node, ts.SyntaxKind.ArrayLiteralExpression);
            if (!arr || arr.length == 0 || arr[0].elements.length == 0) {
                return;
            }
            var stylePaths = arr[0].elements.map(function (element) {
                return _getResourceRequest(element, sourceFile);
            });
            var requireArray = ts.createArrayLiteral(stylePaths.map(function (path) { return _createRequireCall(path); }));
            var propAssign = ts.createPropertyAssignment('styles', requireArray);
            replacements.push({
                resourcePaths: stylePaths,
                replaceNodeOperation: new interfaces_1.ReplaceNodeOperation(sourceFile, node, propAssign)
            });
        }
    });
    return replacements;
}
exports.findResources = findResources;
function _getContentOfKeyLiteral(node) {
    if (!node) {
        return null;
    }
    else if (node.kind == ts.SyntaxKind.Identifier) {
        return node.text;
    }
    else if (node.kind == ts.SyntaxKind.StringLiteral) {
        return node.text;
    }
    else {
        return null;
    }
}
function _getResourceRequest(element, sourceFile) {
    if (element.kind === ts.SyntaxKind.StringLiteral ||
        element.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
        var url = element.text;
        // If the URL does not start with ./ or ../, prepends ./ to it.
        return "" + (/^\.?\.\//.test(url) ? '' : './') + url;
    }
    else {
        // if not string, just use expression directly
        return element.getFullText(sourceFile);
    }
}
function _createRequireCall(path) {
    return ts.createCall(ts.createIdentifier('require'), [], [ts.createLiteral(path)]);
}
