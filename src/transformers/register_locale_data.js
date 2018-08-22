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
var insert_import_1 = require("./insert_import");
var interfaces_1 = require("./interfaces");
var make_transform_1 = require("./make_transform");
function registerLocaleData(shouldTransform, getEntryModules, locale) {
    var standardTransform = function (sourceFile) {
        var ops = [];
        var entryModules = getEntryModules();
        if (!shouldTransform(sourceFile.fileName) || !entryModules || !locale) {
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
        // Find the bootstrap call
        entryModuleIdentifiers.forEach(function (entryModuleIdentifier) {
            // Figure out if it's a `platformBrowserDynamic().bootstrapModule(AppModule)` call.
            if (!(entryModuleIdentifier.parent
                && entryModuleIdentifier.parent.kind === ts.SyntaxKind.CallExpression)) {
                return;
            }
            var callExpr = entryModuleIdentifier.parent;
            if (callExpr.expression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                return;
            }
            var propAccessExpr = callExpr.expression;
            if (propAccessExpr.name.text !== 'bootstrapModule'
                || propAccessExpr.expression.kind !== ts.SyntaxKind.CallExpression) {
                return;
            }
            var firstNode = ast_helpers_1.getFirstNode(sourceFile);
            if (!firstNode) {
                return;
            }
            // Create the import node for the locale.
            var localeNamespaceId = ts.createUniqueName('__NgCli_locale_');
            ops.push.apply(ops, insert_import_1.insertStarImport(sourceFile, localeNamespaceId, "@angular/common/locales/" + locale, firstNode, true));
            // Create the import node for the registerLocaleData function.
            var regIdentifier = ts.createIdentifier("registerLocaleData");
            var regNamespaceId = ts.createUniqueName('__NgCli_locale_');
            ops.push.apply(ops, insert_import_1.insertStarImport(sourceFile, regNamespaceId, '@angular/common', firstNode, true));
            // Create the register function call
            var registerFunctionCall = ts.createCall(ts.createPropertyAccess(regNamespaceId, regIdentifier), undefined, [ts.createPropertyAccess(localeNamespaceId, 'default')]);
            var registerFunctionStatement = ts.createStatement(registerFunctionCall);
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, firstNode, registerFunctionStatement));
        });
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform);
}
exports.registerLocaleData = registerLocaleData;
