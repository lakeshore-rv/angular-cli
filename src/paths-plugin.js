"use strict";
exports.__esModule = true;
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var path = require("path");
var ts = require("typescript");
function resolveWithPaths(request, callback, compilerOptions, host, cache) {
    if (!request || !request.request || !compilerOptions.paths) {
        callback(null, request);
        return;
    }
    // Only work on Javascript/TypeScript issuers.
    if (!request.contextInfo.issuer || !request.contextInfo.issuer.match(/\.[jt]s$/)) {
        callback(null, request);
        return;
    }
    var originalRequest = request.request.trim();
    // Relative requests are not mapped
    if (originalRequest.startsWith('.') || originalRequest.startsWith('/')) {
        callback(null, request);
        return;
    }
    // Amd requests are not mapped
    if (originalRequest.startsWith('!!webpack amd')) {
        callback(null, request);
        return;
    }
    // check if any path mapping rules are relevant
    var pathMapOptions = [];
    for (var pattern in compilerOptions.paths) {
        // get potentials and remove duplicates; JS Set maintains insertion order
        var potentials = Array.from(new Set(compilerOptions.paths[pattern]));
        if (potentials.length === 0) {
            // no potential replacements so skip
            continue;
        }
        // can only contain zero or one
        var starIndex = pattern.indexOf('*');
        if (starIndex === -1) {
            if (pattern === originalRequest) {
                pathMapOptions.push({
                    starIndex: starIndex,
                    partial: '',
                    potentials: potentials
                });
            }
        }
        else if (starIndex === 0 && pattern.length === 1) {
            pathMapOptions.push({
                starIndex: starIndex,
                partial: originalRequest,
                potentials: potentials
            });
        }
        else if (starIndex === pattern.length - 1) {
            if (originalRequest.startsWith(pattern.slice(0, -1))) {
                pathMapOptions.push({
                    starIndex: starIndex,
                    partial: originalRequest.slice(pattern.length - 1),
                    potentials: potentials
                });
            }
        }
        else {
            var _a = pattern.split('*'), prefix = _a[0], suffix = _a[1];
            if (originalRequest.startsWith(prefix) && originalRequest.endsWith(suffix)) {
                pathMapOptions.push({
                    starIndex: starIndex,
                    partial: originalRequest.slice(prefix.length).slice(0, -suffix.length),
                    potentials: potentials
                });
            }
        }
    }
    if (pathMapOptions.length === 0) {
        callback(null, request);
        return;
    }
    // exact matches take priority then largest prefix match
    pathMapOptions.sort(function (a, b) {
        if (a.starIndex === -1) {
            return -1;
        }
        else if (b.starIndex === -1) {
            return 1;
        }
        else {
            return b.starIndex - a.starIndex;
        }
    });
    if (pathMapOptions[0].potentials.length === 1) {
        var onlyPotential = pathMapOptions[0].potentials[0];
        var replacement = void 0;
        var starIndex = onlyPotential.indexOf('*');
        if (starIndex === -1) {
            replacement = onlyPotential;
        }
        else if (starIndex === onlyPotential.length - 1) {
            replacement = onlyPotential.slice(0, -1) + pathMapOptions[0].partial;
        }
        else {
            var _b = onlyPotential.split('*'), prefix = _b[0], suffix = _b[1];
            replacement = prefix + pathMapOptions[0].partial + suffix;
        }
        request.request = path.resolve(compilerOptions.baseUrl || '', replacement);
        callback(null, request);
        return;
    }
    // TODO: The following is used when there is more than one potential and will not be
    //       needed once this is turned into a full webpack resolver plugin
    var moduleResolver = ts.resolveModuleName(originalRequest, request.contextInfo.issuer, compilerOptions, host, cache);
    var moduleFilePath = moduleResolver.resolvedModule
        && moduleResolver.resolvedModule.resolvedFileName;
    // If there is no result, let webpack try to resolve
    if (!moduleFilePath) {
        callback(null, request);
        return;
    }
    // If TypeScript gives us a `.d.ts`, it is probably a node module
    if (moduleFilePath.endsWith('.d.ts')) {
        // If in a package, let webpack resolve the package
        var packageRootPath = path.join(path.dirname(moduleFilePath), 'package.json');
        if (!host.fileExists(packageRootPath)) {
            // Otherwise, if there is a file with a .js extension use that
            var jsFilePath = moduleFilePath.slice(0, -5) + '.js';
            if (host.fileExists(jsFilePath)) {
                request.request = jsFilePath;
            }
        }
        callback(null, request);
        return;
    }
    request.request = moduleFilePath;
    callback(null, request);
}
exports.resolveWithPaths = resolveWithPaths;
