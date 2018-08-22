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
var insert_import_1 = require("./insert_import");
var interfaces_1 = require("./interfaces");
var make_transform_1 = require("./make_transform");
function replaceBootstrap(shouldTransform, getEntryModules, getTypeChecker) {
    var standardTransform = function (sourceFile) {
        var ops = [];
        var entryModules = getEntryModules();
        if (!shouldTransform(sourceFile.fileName) || !entryModules) {
            return ops;
        }
        return entryModules.reduce(function (ops, entryModule) {
            return ops.concat(standardTransformHelper(sourceFile, entryModule));
        }, ops);
    };
    var standardTransformHelper = function (sourceFile, entryModule) {
        var ops = [];
        if (!shouldTransform(sourceFile.fileName) || !entryModule) {
            return ops;
        }
        // Find all identifiers.
        var entryModuleIdentifiers = ast_helpers_1.collectDeepNodes(sourceFile, ts.SyntaxKind.Identifier)
            .filter(function (identifier) { return identifier.text === entryModule.className; });
        if (entryModuleIdentifiers.length === 0) {
            return [];
        }
        var relativeEntryModulePath = path_1.relative(path_1.dirname(sourceFile.fileName), entryModule.path);
        var normalizedEntryModulePath = ("./" + relativeEntryModulePath).replace(/\\/g, '/');
        // Find the bootstrap calls.
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
            var bootstrapModuleIdentifier = propAccessExpr.name;
            var innerCallExpr = propAccessExpr.expression;
            if (!(innerCallExpr.expression.kind === ts.SyntaxKind.Identifier
                && innerCallExpr.expression.text === 'platformBrowserDynamic')) {
                return;
            }
            var platformBrowserDynamicIdentifier = innerCallExpr.expression;
            var idPlatformBrowser = ts.createUniqueName('__NgCli_bootstrap_');
            var idNgFactory = ts.createUniqueName('__NgCli_bootstrap_');
            // Add the transform operations.
            var factoryClassName = entryModule.className + 'NgFactory';
            var factoryModulePath = normalizedEntryModulePath + '.ngfactory';
            ops.push.apply(ops, insert_import_1.insertStarImport(sourceFile, idNgFactory, factoryModulePath).concat([new interfaces_1.ReplaceNodeOperation(sourceFile, entryModuleIdentifier, ts.createPropertyAccess(idNgFactory, ts.createIdentifier(factoryClassName)))], insert_import_1.insertStarImport(sourceFile, idPlatformBrowser, '@angular/platform-browser'), [new interfaces_1.ReplaceNodeOperation(sourceFile, platformBrowserDynamicIdentifier, ts.createPropertyAccess(idPlatformBrowser, 'platformBrowser')),
                new interfaces_1.ReplaceNodeOperation(sourceFile, bootstrapModuleIdentifier, ts.createIdentifier('bootstrapModuleFactory'))]));
        });
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform, getTypeChecker);
}
exports.replaceBootstrap = replaceBootstrap;
