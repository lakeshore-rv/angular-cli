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
var benchmark_1 = require("./benchmark");
var CancellationToken = /** @class */ (function () {
    function CancellationToken() {
        this._isCancelled = false;
    }
    CancellationToken.prototype.requestCancellation = function () {
        this._isCancelled = true;
    };
    CancellationToken.prototype.isCancellationRequested = function () {
        return this._isCancelled;
    };
    CancellationToken.prototype.throwIfCancellationRequested = function () {
        if (this.isCancellationRequested()) {
            throw new ts.OperationCanceledException();
        }
    };
    return CancellationToken;
}());
exports.CancellationToken = CancellationToken;
function hasErrors(diags) {
    return diags.some(function (d) { return d.category === ts.DiagnosticCategory.Error; });
}
exports.hasErrors = hasErrors;
function gatherDiagnostics(program, jitMode, benchmarkLabel, cancellationToken) {
    var allDiagnostics = [];
    var checkOtherDiagnostics = true;
    function checkDiagnostics(fn) {
        if (checkOtherDiagnostics) {
            var diags = fn(undefined, cancellationToken);
            if (diags) {
                allDiagnostics.push.apply(allDiagnostics, diags);
                checkOtherDiagnostics = !hasErrors(diags);
            }
        }
    }
    if (jitMode) {
        var tsProgram = program;
        // Check syntactic diagnostics.
        benchmark_1.time(benchmarkLabel + ".gatherDiagnostics.ts.getSyntacticDiagnostics");
        checkDiagnostics(tsProgram.getSyntacticDiagnostics.bind(tsProgram));
        benchmark_1.timeEnd(benchmarkLabel + ".gatherDiagnostics.ts.getSyntacticDiagnostics");
        // Check semantic diagnostics.
        benchmark_1.time(benchmarkLabel + ".gatherDiagnostics.ts.getSemanticDiagnostics");
        checkDiagnostics(tsProgram.getSemanticDiagnostics.bind(tsProgram));
        benchmark_1.timeEnd(benchmarkLabel + ".gatherDiagnostics.ts.getSemanticDiagnostics");
    }
    else {
        var angularProgram = program;
        // Check TypeScript syntactic diagnostics.
        benchmark_1.time(benchmarkLabel + ".gatherDiagnostics.ng.getTsSyntacticDiagnostics");
        checkDiagnostics(angularProgram.getTsSyntacticDiagnostics.bind(angularProgram));
        benchmark_1.timeEnd(benchmarkLabel + ".gatherDiagnostics.ng.getTsSyntacticDiagnostics");
        // Check TypeScript semantic and Angular structure diagnostics.
        benchmark_1.time(benchmarkLabel + ".gatherDiagnostics.ng.getTsSemanticDiagnostics");
        checkDiagnostics(angularProgram.getTsSemanticDiagnostics.bind(angularProgram));
        benchmark_1.timeEnd(benchmarkLabel + ".gatherDiagnostics.ng.getTsSemanticDiagnostics");
        // Check Angular semantic diagnostics
        benchmark_1.time(benchmarkLabel + ".gatherDiagnostics.ng.getNgSemanticDiagnostics");
        checkDiagnostics(angularProgram.getNgSemanticDiagnostics.bind(angularProgram));
        benchmark_1.timeEnd(benchmarkLabel + ".gatherDiagnostics.ng.getNgSemanticDiagnostics");
    }
    return allDiagnostics;
}
exports.gatherDiagnostics = gatherDiagnostics;
