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
var elide_imports_1 = require("./elide_imports");
var interfaces_1 = require("./interfaces");
// Typescript below 2.7.0 needs a workaround.
var tsVersionParts = ts.version.split('.').map(function (p) { return Number(p); });
var visitEachChild = tsVersionParts[0] <= 2 && tsVersionParts[1] < 7
    ? visitEachChildWorkaround
    : ts.visitEachChild;
function makeTransform(standardTransform, getTypeChecker) {
    return function (context) {
        var transformer = function (sf) {
            var ops = standardTransform(sf);
            var removeOps = ops
                .filter(function (op) { return op.kind === interfaces_1.OPERATION_KIND.Remove; });
            var addOps = ops.filter(function (op) { return op.kind === interfaces_1.OPERATION_KIND.Add; });
            var replaceOps = ops
                .filter(function (op) { return op.kind === interfaces_1.OPERATION_KIND.Replace; });
            // If nodes are removed, elide the imports as well.
            // Mainly a workaround for https://github.com/Microsoft/TypeScript/issues/17552.
            // WARNING: this assumes that replaceOps DO NOT reuse any of the nodes they are replacing.
            // This is currently true for transforms that use replaceOps (replace_bootstrap and
            // replace_resources), but may not be true for new transforms.
            if (getTypeChecker && removeOps.length + replaceOps.length > 0) {
                var removedNodes = removeOps.concat(replaceOps).map(function (op) { return op.target; });
                removeOps.push.apply(removeOps, elide_imports_1.elideImports(sf, removedNodes, getTypeChecker));
            }
            var visitor = function (node) {
                var modified = false;
                var modifiedNodes = [node];
                // Check if node should be dropped.
                if (removeOps.find(function (op) { return op.target === node; })) {
                    modifiedNodes = [];
                    modified = true;
                }
                // Check if node should be replaced (only replaces with first op found).
                var replace = replaceOps.find(function (op) { return op.target === node; });
                if (replace) {
                    modifiedNodes = [replace.replacement];
                    modified = true;
                }
                // Check if node should be added to.
                var add = addOps.filter(function (op) { return op.target === node; });
                if (add.length > 0) {
                    modifiedNodes = add.filter(function (op) { return op.before; }).map((function (op) { return op.before; })).concat(modifiedNodes, add.filter(function (op) { return op.after; }).map((function (op) { return op.after; })));
                    modified = true;
                }
                // If we changed anything, return modified nodes without visiting further.
                if (modified) {
                    return modifiedNodes;
                }
                else {
                    // Otherwise return node as is and visit children.
                    return visitEachChild(node, visitor, context);
                }
            };
            // Don't visit the sourcefile at all if we don't have ops for it.
            if (ops.length === 0) {
                return sf;
            }
            var result = ts.visitNode(sf, visitor);
            // If we removed any decorators, we need to clean up the decorator arrays.
            if (removeOps.some(function (op) { return op.target.kind === ts.SyntaxKind.Decorator; })) {
                cleanupDecorators(result);
            }
            return result;
        };
        return transformer;
    };
}
exports.makeTransform = makeTransform;
/**
 * This is a version of `ts.visitEachChild` that works that calls our version
 * of `updateSourceFileNode`, so that typescript doesn't lose type information
 * for property decorators.
 * See https://github.com/Microsoft/TypeScript/issues/17384 (fixed by
 * https://github.com/Microsoft/TypeScript/pull/20314 and released in TS 2.7.0) and
 * https://github.com/Microsoft/TypeScript/issues/17551 (fixed by
 * https://github.com/Microsoft/TypeScript/pull/18051 and released on TS 2.5.0).
 */
function visitEachChildWorkaround(node, visitor, context) {
    if (node.kind === ts.SyntaxKind.SourceFile) {
        var sf = node;
        var statements = ts.visitLexicalEnvironment(sf.statements, visitor, context);
        if (statements === sf.statements) {
            return sf;
        }
        // Note: Need to clone the original file (and not use `ts.updateSourceFileNode`)
        // as otherwise TS fails when resolving types for decorators.
        var sfClone = ts.getMutableClone(sf);
        sfClone.statements = statements;
        return sfClone;
    }
    return ts.visitEachChild(node, visitor, context);
}
// 1) If TS sees an empty decorator array, it will still emit a `__decorate` call.
//    This seems to be a TS bug.
// 2) Also ensure nodes with modified decorators have parents
//    built in TS transformers assume certain nodes have parents (fixed in TS 2.7+)
function cleanupDecorators(node) {
    if (node.decorators) {
        if (node.decorators.length == 0) {
            node.decorators = undefined;
        }
        else if (node.parent == undefined) {
            var originalNode = ts.getParseTreeNode(node);
            node.parent = originalNode.parent;
        }
    }
    ts.forEachChild(node, function (node) { return cleanupDecorators(node); });
}
