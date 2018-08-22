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
var compiler_host_1 = require("../compiler_host");
// Find all nodes from the AST in the subtree of node of SyntaxKind kind.
function collectDeepNodes(node, kind) {
    var nodes = [];
    var helper = function (child) {
        if (child.kind === kind) {
            nodes.push(child);
        }
        ts.forEachChild(child, helper);
    };
    ts.forEachChild(node, helper);
    return nodes;
}
exports.collectDeepNodes = collectDeepNodes;
function getFirstNode(sourceFile) {
    if (sourceFile.statements.length > 0) {
        return sourceFile.statements[0];
    }
    return sourceFile.getChildAt(0);
}
exports.getFirstNode = getFirstNode;
function getLastNode(sourceFile) {
    if (sourceFile.statements.length > 0) {
        return sourceFile.statements[sourceFile.statements.length - 1] || null;
    }
    return null;
}
exports.getLastNode = getLastNode;
// Test transform helpers.
var basePath = '/project/src/';
var fileName = basePath + 'test-file.ts';
function createTypescriptContext(content) {
    // Set compiler options.
    var compilerOptions = {
        noEmitOnError: false,
        allowJs: true,
        newLine: ts.NewLineKind.LineFeed,
        target: ts.ScriptTarget.ESNext,
        skipLibCheck: true,
        sourceMap: false,
        importHelpers: true
    };
    // Create compiler host.
    var compilerHost = new compiler_host_1.WebpackCompilerHost(compilerOptions, basePath);
    // Add a dummy file to host content.
    compilerHost.writeFile(fileName, content, false);
    // Create the TypeScript program.
    var program = ts.createProgram([fileName], compilerOptions, compilerHost);
    return { compilerHost: compilerHost, program: program };
}
exports.createTypescriptContext = createTypescriptContext;
function transformTypescript(content, transformers, program, compilerHost) {
    // Use given context or create a new one.
    if (content !== undefined) {
        var typescriptContext = createTypescriptContext(content);
        program = typescriptContext.program;
        compilerHost = typescriptContext.compilerHost;
    }
    else if (!program || !compilerHost) {
        throw new Error('transformTypescript needs either `content` or a `program` and `compilerHost');
    }
    // Emit.
    var _a = program.emit(undefined, undefined, undefined, undefined, { before: transformers }), emitSkipped = _a.emitSkipped, diagnostics = _a.diagnostics;
    // Log diagnostics if emit wasn't successfull.
    if (emitSkipped) {
        console.log(diagnostics);
        return null;
    }
    // Return the transpiled js.
    return compilerHost.readFile(fileName.replace(/\.ts$/, '.js'));
}
exports.transformTypescript = transformTypescript;
