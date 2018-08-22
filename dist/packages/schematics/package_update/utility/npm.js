"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const https = require("https");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const semver = require("semver");
const semverIntersect = require('semver-intersect');
const kPackageJsonDependencyFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
];
const npmPackageJsonCache = new Map();
function _getVersionFromNpmPackage(json, version, loose) {
    const distTags = json['dist-tags'];
    if (distTags && distTags[version]) {
        return (loose ? '~' : '') + distTags[version];
    }
    else {
        if (!semver.validRange(version)) {
            throw new schematics_1.SchematicsException(`Invalid range or version: "${version}".`);
        }
        if (semver.valid(version) && loose) {
            version = '~' + version;
        }
        const packageVersions = Object.keys(json['versions']);
        const maybeMatch = semver.maxSatisfying(packageVersions, version);
        if (!maybeMatch) {
            throw new schematics_1.SchematicsException(`Version "${version}" has no satisfying version for package ${json['name']}`);
        }
        const maybeOperator = version.match(/^[~^]/);
        if (version == '*') {
            return maybeMatch;
        }
        else if (maybeOperator) {
            return maybeOperator[0] + maybeMatch;
        }
        else {
            return (loose ? '~' : '') + maybeMatch;
        }
    }
}
/**
 * Get the NPM repository's package.json for a package. This is p
 * @param {string} packageName The package name to fetch.
 * @param {LoggerApi} logger A logger instance to log debug information.
 * @returns {Observable<JsonObject>} An observable that will put the pacakge.json content.
 * @private
 */
function _getNpmPackageJson(packageName, logger) {
    const url = `https://registry.npmjs.org/${packageName.replace(/\//g, '%2F')}`;
    logger.debug(`Getting package.json from ${JSON.stringify(packageName)}...`);
    let maybeRequest = npmPackageJsonCache.get(url);
    if (!maybeRequest) {
        const subject = new rxjs_1.ReplaySubject(1);
        const request = https.request(url, response => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                try {
                    const json = core_1.parseJson(data, core_1.JsonParseMode.Strict);
                    subject.next(json);
                    subject.complete();
                }
                catch (err) {
                    subject.error(err);
                }
            });
            response.on('error', err => subject.error(err));
        });
        request.end();
        maybeRequest = subject.asObservable();
        npmPackageJsonCache.set(url, maybeRequest);
    }
    return maybeRequest;
}
/**
 * Recursively get versions of packages to update to, along with peer dependencies. Only recurse
 * peer dependencies and only update versions of packages that are in the original package.json.
 * @param {JsonObject} packageJson The original package.json to update.
 * @param {{[p: string]: string}} packages
 * @param {{[p: string]: string}} allVersions
 * @param {LoggerApi} logger
 * @param {boolean} loose
 * @returns {Observable<void>}
 * @private
 */
function _getRecursiveVersions(packageJson, packages, allVersions, logger, loose) {
    return rxjs_1.from(kPackageJsonDependencyFields).pipe(operators_1.mergeMap(field => {
        const deps = packageJson[field];
        if (deps) {
            return rxjs_1.from(Object.keys(deps)
                .map(depName => depName in deps ? [depName, deps[depName]] : null)
                .filter(x => !!x));
        }
        else {
            return rxjs_1.EMPTY;
        }
    }), operators_1.mergeMap(([depName, depVersion]) => {
        if (!packages[depName] || packages[depName] === depVersion) {
            return rxjs_1.EMPTY;
        }
        if (allVersions[depName] && semver.intersects(allVersions[depName], depVersion)) {
            allVersions[depName] = semverIntersect.intersect(allVersions[depName], depVersion);
            return rxjs_1.EMPTY;
        }
        return _getNpmPackageJson(depName, logger).pipe(operators_1.map(json => ({ version: packages[depName], depName, depVersion, npmPackageJson: json })));
    }), operators_1.mergeMap(({ version, depName, depVersion, npmPackageJson }) => {
        const updateVersion = _getVersionFromNpmPackage(npmPackageJson, version, loose);
        const npmPackageVersions = Object.keys(npmPackageJson['versions']);
        const match = semver.maxSatisfying(npmPackageVersions, updateVersion);
        if (!match) {
            return rxjs_1.EMPTY;
        }
        if (semver.lt(semverIntersect.parseRange(updateVersion).version, semverIntersect.parseRange(depVersion).version)) {
            throw new schematics_1.SchematicsException(`Cannot downgrade package ${JSON.stringify(depName)} from version "${depVersion}" to "${updateVersion}".`);
        }
        const innerNpmPackageJson = npmPackageJson['versions'][match];
        const dependencies = {};
        const deps = innerNpmPackageJson['peerDependencies'];
        if (deps) {
            for (const depName of Object.keys(deps)) {
                dependencies[depName] = deps[depName];
            }
        }
        logger.debug(`Recording update for ${JSON.stringify(depName)} to version ${updateVersion}.`);
        if (allVersions[depName]) {
            if (!semver.intersects(allVersions[depName], updateVersion)) {
                throw new schematics_1.SchematicsException('Cannot update safely because packages have conflicting dependencies. Package '
                    + `${depName} would need to match both versions "${updateVersion}" and `
                    + `"${allVersions[depName]}, which are not compatible.`);
            }
            allVersions[depName] = semverIntersect.intersect(allVersions[depName], updateVersion);
        }
        else {
            allVersions[depName] = updateVersion;
        }
        return _getRecursiveVersions(packageJson, dependencies, allVersions, logger, loose);
    }));
}
/**
 * Use a Rule which can return an observable, but do not actually modify the Tree.
 * This rules perform an HTTPS request to get the npm registry package.json, then resolve the
 * version from the options, and replace the version in the options by an actual version.
 * @param supportedPackages A list of packages to update (at the same version).
 * @param maybeVersion A version to update those packages to.
 * @param loose Whether to use loose version operators (instead of specific versions).
 * @private
 */
function updatePackageJson(supportedPackages, maybeVersion = 'latest', loose = false) {
    const version = maybeVersion ? maybeVersion : 'latest';
    // This will be updated as we read the NPM repository.
    const allVersions = {};
    return schematics_1.chain([
        (tree, context) => {
            const packageJsonContent = tree.read('/package.json');
            if (!packageJsonContent) {
                throw new schematics_1.SchematicsException('Could not find package.json.');
            }
            const packageJson = core_1.parseJson(packageJsonContent.toString(), core_1.JsonParseMode.Strict);
            if (packageJson === null || typeof packageJson !== 'object' || Array.isArray(packageJson)) {
                throw new schematics_1.SchematicsException('Could not parse package.json.');
            }
            const packages = {};
            for (const name of supportedPackages) {
                packages[name] = version;
            }
            return rxjs_1.concat(_getRecursiveVersions(packageJson, packages, allVersions, context.logger, loose).pipe(operators_1.ignoreElements()), rxjs_1.of(tree));
        },
        (tree) => {
            const packageJsonContent = tree.read('/package.json');
            if (!packageJsonContent) {
                throw new schematics_1.SchematicsException('Could not find package.json.');
            }
            const packageJson = core_1.parseJson(packageJsonContent.toString(), core_1.JsonParseMode.Strict);
            if (packageJson === null || typeof packageJson !== 'object' || Array.isArray(packageJson)) {
                throw new schematics_1.SchematicsException('Could not parse package.json.');
            }
            for (const field of kPackageJsonDependencyFields) {
                const deps = packageJson[field];
                if (!deps || typeof deps !== 'object' || Array.isArray(deps)) {
                    continue;
                }
                for (const depName of Object.keys(deps)) {
                    if (allVersions[depName]) {
                        deps[depName] = allVersions[depName];
                    }
                }
            }
            tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2) + '\n');
            return tree;
        },
        (_tree, context) => {
            context.addTask(new tasks_1.NodePackageInstallTask());
        },
    ]);
}
exports.updatePackageJson = updatePackageJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnBtLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9zY2hlbWF0aWNzL3BhY2thZ2VfdXBkYXRlL3V0aWxpdHkvbnBtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQXFGO0FBQ3JGLDJEQU1vQztBQUNwQyw0REFBMEU7QUFDMUUsK0JBQStCO0FBQy9CLCtCQU9jO0FBQ2QsOENBQStEO0FBQy9ELGlDQUFpQztBQUVqQyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUVwRCxNQUFNLDRCQUE0QixHQUFHO0lBQ25DLGNBQWM7SUFDZCxpQkFBaUI7SUFDakIsa0JBQWtCO0lBQ2xCLHNCQUFzQjtDQUN2QixDQUFDO0FBR0YsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBa0MsQ0FBQztBQUV0RSxtQ0FBbUMsSUFBZ0IsRUFBRSxPQUFlLEVBQUUsS0FBYztJQUNsRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFlLENBQUM7SUFDakQsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBVyxDQUFDO0tBQ3pEO1NBQU07UUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMvQixNQUFNLElBQUksZ0NBQW1CLENBQUMsOEJBQThCLE9BQU8sSUFBSSxDQUFDLENBQUM7U0FDMUU7UUFDRCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxFQUFFO1lBQ2xDLE9BQU8sR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDO1NBQ3pCO1FBRUQsTUFB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Q0FBQyxFQUFFO2dCQUN6RixNQUFNLElBQUksZ0NBQW1CLENBQUMsK0JBQStCLENBQUMsQ0FBQzthQUNoRTtZQUVELEtBQUssTUFBTSxLQUFLLElBQUksNEJBQTRCLEVBQUU7Z0JBQ2hELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDNUQsU0FBUztpQkFDVjtnQkFFRCxLQUFLLE1BQU0sT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3ZDLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN0QztpQkFDRjthQUNGO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBRTdFLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELENBQUMsS0FBVyxFQUFFLE9BQXlCLEVBQUUsRUFBRTtZQUN6QyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQXNCLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELENBQUM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDO0FBOURELDhDQThEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEpzb25PYmplY3QsIEpzb25QYXJzZU1vZGUsIGxvZ2dpbmcsIHBhcnNlSnNvbiB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIGNoYWluLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBOb2RlUGFja2FnZUluc3RhbGxUYXNrIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnO1xuaW1wb3J0IHtcbiAgRU1QVFksXG4gIE9ic2VydmFibGUsXG4gIFJlcGxheVN1YmplY3QsXG4gIGNvbmNhdCxcbiAgZnJvbSBhcyBvYnNlcnZhYmxlRnJvbSxcbiAgb2YgYXMgb2JzZXJ2YWJsZU9mLFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGlnbm9yZUVsZW1lbnRzLCBtYXAsIG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5cbmNvbnN0IHNlbXZlckludGVyc2VjdCA9IHJlcXVpcmUoJ3NlbXZlci1pbnRlcnNlY3QnKTtcblxuY29uc3Qga1BhY2thZ2VKc29uRGVwZW5kZW5jeUZpZWxkcyA9IFtcbiAgJ2RlcGVuZGVuY2llcycsXG4gICdkZXZEZXBlbmRlbmNpZXMnLFxuICAncGVlckRlcGVuZGVuY2llcycsXG4gICdvcHRpb25hbERlcGVuZGVuY2llcycsXG5dO1xuXG5cbmNvbnN0IG5wbVBhY2thZ2VKc29uQ2FjaGUgPSBuZXcgTWFwPHN0cmluZywgT2JzZXJ2YWJsZTxKc29uT2JqZWN0Pj4oKTtcblxuZnVuY3Rpb24gX2dldFZlcnNpb25Gcm9tTnBtUGFja2FnZShqc29uOiBKc29uT2JqZWN0LCB2ZXJzaW9uOiBzdHJpbmcsIGxvb3NlOiBib29sZWFuKTogc3RyaW5nIHtcbiAgY29uc3QgZGlzdFRhZ3MgPSBqc29uWydkaXN0LXRhZ3MnXSBhcyBKc29uT2JqZWN0O1xuICBpZiAoZGlzdFRhZ3MgJiYgZGlzdFRhZ3NbdmVyc2lvbl0pIHtcbiAgICByZXR1cm4gKGxvb3NlID8gJ34nIDogJycpICsgZGlzdFRhZ3NbdmVyc2lvbl0gYXMgc3RyaW5nO1xuICB9IGVsc2Uge1xuICAgIGlmICghc2VtdmVyLnZhbGlkUmFuZ2UodmVyc2lvbikpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBJbnZhbGlkIHJhbmdlIG9yIHZlcnNpb246IFwiJHt2ZXJzaW9ufVwiLmApO1xuICAgIH1cbiAgICBpZiAoc2VtdmVyLnZhbGlkKHZlcnNpb24pICYmIGxvb3NlKSB7XG4gICAgICB2ZXJzaW9uID0gJ34nICsgdmVyc2lvbjtcbiAgICB9XG5cbiAgICBjb25zdCBwYWNrYWdlVmVyc2lvbnMgPSBPYmplY3Qua2V5cyhqc29uWyd2ZXJzaW9ucyddIGFzIEpzb25PYmplY3QpO1xuICAgIGNvbnN0IG1heWJlTWF0Y2ggPSBzZW12ZXIubWF4U2F0aXNmeWluZyhwYWNrYWdlVmVyc2lvbnMsIHZlcnNpb24pO1xuXG4gICAgaWYgKCFtYXliZU1hdGNoKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihcbiAgICAgICAgYFZlcnNpb24gXCIke3ZlcnNpb259XCIgaGFzIG5vIHNhdGlzZnlpbmcgdmVyc2lvbiBmb3IgcGFja2FnZSAke2pzb25bJ25hbWUnXX1gLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXliZU9wZXJhdG9yID0gdmVyc2lvbi5tYXRjaCgvXlt+Xl0vKTtcbiAgICBpZiAodmVyc2lvbiA9PSAnKicpIHtcbiAgICAgIHJldHVybiBtYXliZU1hdGNoO1xuICAgIH0gZWxzZSBpZiAobWF5YmVPcGVyYXRvcikge1xuICAgICAgcmV0dXJuIG1heWJlT3BlcmF0b3JbMF0gKyBtYXliZU1hdGNoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKGxvb3NlID8gJ34nIDogJycpICsgbWF5YmVNYXRjaDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIE5QTSByZXBvc2l0b3J5J3MgcGFja2FnZS5qc29uIGZvciBhIHBhY2thZ2UuIFRoaXMgaXMgcFxuICogQHBhcmFtIHtzdHJpbmd9IHBhY2thZ2VOYW1lIFRoZSBwYWNrYWdlIG5hbWUgdG8gZmV0Y2guXG4gKiBAcGFyYW0ge0xvZ2dlckFwaX0gbG9nZ2VyIEEgbG9nZ2VyIGluc3RhbmNlIHRvIGxvZyBkZWJ1ZyBpbmZvcm1hdGlvbi5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPEpzb25PYmplY3Q+fSBBbiBvYnNlcnZhYmxlIHRoYXQgd2lsbCBwdXQgdGhlIHBhY2FrZ2UuanNvbiBjb250ZW50LlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2dldE5wbVBhY2thZ2VKc29uKFxuICBwYWNrYWdlTmFtZTogc3RyaW5nLFxuICBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyQXBpLFxuKTogT2JzZXJ2YWJsZTxKc29uT2JqZWN0PiB7XG4gIGNvbnN0IHVybCA9IGBodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy8ke3BhY2thZ2VOYW1lLnJlcGxhY2UoL1xcLy9nLCAnJTJGJyl9YDtcbiAgbG9nZ2VyLmRlYnVnKGBHZXR0aW5nIHBhY2thZ2UuanNvbiBmcm9tICR7SlNPTi5zdHJpbmdpZnkocGFja2FnZU5hbWUpfS4uLmApO1xuXG4gIGxldCBtYXliZVJlcXVlc3QgPSBucG1QYWNrYWdlSnNvbkNhY2hlLmdldCh1cmwpO1xuICBpZiAoIW1heWJlUmVxdWVzdCkge1xuICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxKc29uT2JqZWN0PigxKTtcblxuICAgIGNvbnN0IHJlcXVlc3QgPSBodHRwcy5yZXF1ZXN0KHVybCwgcmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IGRhdGEgPSAnJztcbiAgICAgIHJlc3BvbnNlLm9uKCdkYXRhJywgY2h1bmsgPT4gZGF0YSArPSBjaHVuayk7XG4gICAgICByZXNwb25zZS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGpzb24gPSBwYXJzZUpzb24oZGF0YSwgSnNvblBhcnNlTW9kZS5TdHJpY3QpO1xuICAgICAgICAgIHN1YmplY3QubmV4dChqc29uIGFzIEpzb25PYmplY3QpO1xuICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlc3BvbnNlLm9uKCdlcnJvcicsIGVyciA9PiBzdWJqZWN0LmVycm9yKGVycikpO1xuICAgIH0pO1xuICAgIHJlcXVlc3QuZW5kKCk7XG5cbiAgICBtYXliZVJlcXVlc3QgPSBzdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIG5wbVBhY2thZ2VKc29uQ2FjaGUuc2V0KHVybCwgbWF5YmVSZXF1ZXN0KTtcbiAgfVxuXG4gIHJldHVybiBtYXliZVJlcXVlc3Q7XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgZ2V0IHZlcnNpb25zIG9mIHBhY2thZ2VzIHRvIHVwZGF0ZSB0bywgYWxvbmcgd2l0aCBwZWVyIGRlcGVuZGVuY2llcy4gT25seSByZWN1cnNlXG4gKiBwZWVyIGRlcGVuZGVuY2llcyBhbmQgb25seSB1cGRhdGUgdmVyc2lvbnMgb2YgcGFja2FnZXMgdGhhdCBhcmUgaW4gdGhlIG9yaWdpbmFsIHBhY2thZ2UuanNvbi5cbiAqIEBwYXJhbSB7SnNvbk9iamVjdH0gcGFja2FnZUpzb24gVGhlIG9yaWdpbmFsIHBhY2thZ2UuanNvbiB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge3tbcDogc3RyaW5nXTogc3RyaW5nfX0gcGFja2FnZXNcbiAqIEBwYXJhbSB7e1twOiBzdHJpbmddOiBzdHJpbmd9fSBhbGxWZXJzaW9uc1xuICogQHBhcmFtIHtMb2dnZXJBcGl9IGxvZ2dlclxuICogQHBhcmFtIHtib29sZWFufSBsb29zZVxuICogQHJldHVybnMge09ic2VydmFibGU8dm9pZD59XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfZ2V0UmVjdXJzaXZlVmVyc2lvbnMoXG4gIHBhY2thZ2VKc29uOiBKc29uT2JqZWN0LFxuICBwYWNrYWdlczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0sXG4gIGFsbFZlcnNpb25zOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSxcbiAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSxcbiAgbG9vc2U6IGJvb2xlYW4sXG4pOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgcmV0dXJuIG9ic2VydmFibGVGcm9tKGtQYWNrYWdlSnNvbkRlcGVuZGVuY3lGaWVsZHMpLnBpcGUoXG4gICAgbWVyZ2VNYXAoZmllbGQgPT4ge1xuICAgICAgY29uc3QgZGVwcyA9IHBhY2thZ2VKc29uW2ZpZWxkXSBhcyBKc29uT2JqZWN0O1xuICAgICAgaWYgKGRlcHMpIHtcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVGcm9tKFxuICAgICAgICAgIE9iamVjdC5rZXlzKGRlcHMpXG4gICAgICAgICAgICAubWFwKGRlcE5hbWUgPT4gZGVwTmFtZSBpbiBkZXBzID8gW2RlcE5hbWUsIGRlcHNbZGVwTmFtZV1dIDogbnVsbClcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiAhIXgpLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIEVNUFRZO1xuICAgICAgfVxuICAgIH0pLFxuICAgIG1lcmdlTWFwKChbZGVwTmFtZSwgZGVwVmVyc2lvbl06IFtzdHJpbmcsIHN0cmluZ10pID0+IHtcbiAgICAgIGlmICghcGFja2FnZXNbZGVwTmFtZV0gfHwgcGFja2FnZXNbZGVwTmFtZV0gPT09IGRlcFZlcnNpb24pIHtcbiAgICAgICAgcmV0dXJuIEVNUFRZO1xuICAgICAgfVxuICAgICAgaWYgKGFsbFZlcnNpb25zW2RlcE5hbWVdICYmIHNlbXZlci5pbnRlcnNlY3RzKGFsbFZlcnNpb25zW2RlcE5hbWVdLCBkZXBWZXJzaW9uKSkge1xuICAgICAgICBhbGxWZXJzaW9uc1tkZXBOYW1lXSA9IHNlbXZlckludGVyc2VjdC5pbnRlcnNlY3QoYWxsVmVyc2lvbnNbZGVwTmFtZV0sIGRlcFZlcnNpb24pO1xuXG4gICAgICAgIHJldHVybiBFTVBUWTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9nZXROcG1QYWNrYWdlSnNvbihkZXBOYW1lLCBsb2dnZXIpLnBpcGUoXG4gICAgICAgIG1hcChqc29uID0+ICh7IHZlcnNpb246IHBhY2thZ2VzW2RlcE5hbWVdLCBkZXBOYW1lLCBkZXBWZXJzaW9uLCBucG1QYWNrYWdlSnNvbjoganNvbiB9KSksXG4gICAgICApO1xuICAgIH0pLFxuICAgIG1lcmdlTWFwKCh7dmVyc2lvbiwgZGVwTmFtZSwgZGVwVmVyc2lvbiwgbnBtUGFja2FnZUpzb259KSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVWZXJzaW9uID0gX2dldFZlcnNpb25Gcm9tTnBtUGFja2FnZShucG1QYWNrYWdlSnNvbiwgdmVyc2lvbiwgbG9vc2UpO1xuICAgICAgY29uc3QgbnBtUGFja2FnZVZlcnNpb25zID0gT2JqZWN0LmtleXMobnBtUGFja2FnZUpzb25bJ3ZlcnNpb25zJ10gYXMgSnNvbk9iamVjdCk7XG4gICAgICBjb25zdCBtYXRjaCA9IHNlbXZlci5tYXhTYXRpc2Z5aW5nKG5wbVBhY2thZ2VWZXJzaW9ucywgdXBkYXRlVmVyc2lvbik7XG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIHJldHVybiBFTVBUWTtcbiAgICAgIH1cbiAgICAgIGlmIChzZW12ZXIubHQoXG4gICAgICAgIHNlbXZlckludGVyc2VjdC5wYXJzZVJhbmdlKHVwZGF0ZVZlcnNpb24pLnZlcnNpb24sXG4gICAgICAgIHNlbXZlckludGVyc2VjdC5wYXJzZVJhbmdlKGRlcFZlcnNpb24pLnZlcnNpb24pXG4gICAgICApIHtcbiAgICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENhbm5vdCBkb3duZ3JhZGUgcGFja2FnZSAke1xuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRlcE5hbWUpfSBmcm9tIHZlcnNpb24gXCIke2RlcFZlcnNpb259XCIgdG8gXCIke3VwZGF0ZVZlcnNpb259XCIuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5uZXJOcG1QYWNrYWdlSnNvbiA9IChucG1QYWNrYWdlSnNvblsndmVyc2lvbnMnXSBhcyBKc29uT2JqZWN0KVttYXRjaF0gYXMgSnNvbk9iamVjdDtcbiAgICAgIGNvbnN0IGRlcGVuZGVuY2llczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICAgICAgY29uc3QgZGVwcyA9IGlubmVyTnBtUGFja2FnZUpzb25bJ3BlZXJEZXBlbmRlbmNpZXMnXSBhcyBKc29uT2JqZWN0O1xuICAgICAgaWYgKGRlcHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBkZXBOYW1lIG9mIE9iamVjdC5rZXlzKGRlcHMpKSB7XG4gICAgICAgICAgZGVwZW5kZW5jaWVzW2RlcE5hbWVdID0gZGVwc1tkZXBOYW1lXSBhcyBzdHJpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbG9nZ2VyLmRlYnVnKGBSZWNvcmRpbmcgdXBkYXRlIGZvciAke0pTT04uc3RyaW5naWZ5KGRlcE5hbWUpfSB0byB2ZXJzaW9uICR7dXBkYXRlVmVyc2lvbn0uYCk7XG5cbiAgICAgIGlmIChhbGxWZXJzaW9uc1tkZXBOYW1lXSkge1xuICAgICAgICBpZiAoIXNlbXZlci5pbnRlcnNlY3RzKGFsbFZlcnNpb25zW2RlcE5hbWVdLCB1cGRhdGVWZXJzaW9uKSkge1xuICAgICAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKFxuICAgICAgICAgICAgJ0Nhbm5vdCB1cGRhdGUgc2FmZWx5IGJlY2F1c2UgcGFja2FnZXMgaGF2ZSBjb25mbGljdGluZyBkZXBlbmRlbmNpZXMuIFBhY2thZ2UgJ1xuICAgICAgICAgICAgKyBgJHtkZXBOYW1lfSB3b3VsZCBuZWVkIHRvIG1hdGNoIGJvdGggdmVyc2lvbnMgXCIke3VwZGF0ZVZlcnNpb259XCIgYW5kIGBcbiAgICAgICAgICAgICsgYFwiJHthbGxWZXJzaW9uc1tkZXBOYW1lXX0sIHdoaWNoIGFyZSBub3QgY29tcGF0aWJsZS5gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBhbGxWZXJzaW9uc1tkZXBOYW1lXSA9IHNlbXZlckludGVyc2VjdC5pbnRlcnNlY3QoYWxsVmVyc2lvbnNbZGVwTmFtZV0sIHVwZGF0ZVZlcnNpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxsVmVyc2lvbnNbZGVwTmFtZV0gPSB1cGRhdGVWZXJzaW9uO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2dldFJlY3Vyc2l2ZVZlcnNpb25zKFxuICAgICAgICBwYWNrYWdlSnNvbixcbiAgICAgICAgZGVwZW5kZW5jaWVzLFxuICAgICAgICBhbGxWZXJzaW9ucyxcbiAgICAgICAgbG9nZ2VyLFxuICAgICAgICBsb29zZSxcbiAgICAgICk7XG4gICAgfSksXG4gICk7XG59XG5cbi8qKlxuICogVXNlIGEgUnVsZSB3aGljaCBjYW4gcmV0dXJuIGFuIG9ic2VydmFibGUsIGJ1dCBkbyBub3QgYWN0dWFsbHkgbW9kaWZ5IHRoZSBUcmVlLlxuICogVGhpcyBydWxlcyBwZXJmb3JtIGFuIEhUVFBTIHJlcXVlc3QgdG8gZ2V0IHRoZSBucG0gcmVnaXN0cnkgcGFja2FnZS5qc29uLCB0aGVuIHJlc29sdmUgdGhlXG4gKiB2ZXJzaW9uIGZyb20gdGhlIG9wdGlvbnMsIGFuZCByZXBsYWNlIHRoZSB2ZXJzaW9uIGluIHRoZSBvcHRpb25zIGJ5IGFuIGFjdHVhbCB2ZXJzaW9uLlxuICogQHBhcmFtIHN1cHBvcnRlZFBhY2thZ2VzIEEgbGlzdCBvZiBwYWNrYWdlcyB0byB1cGRhdGUgKGF0IHRoZSBzYW1lIHZlcnNpb24pLlxuICogQHBhcmFtIG1heWJlVmVyc2lvbiBBIHZlcnNpb24gdG8gdXBkYXRlIHRob3NlIHBhY2thZ2VzIHRvLlxuICogQHBhcmFtIGxvb3NlIFdoZXRoZXIgdG8gdXNlIGxvb3NlIHZlcnNpb24gb3BlcmF0b3JzIChpbnN0ZWFkIG9mIHNwZWNpZmljIHZlcnNpb25zKS5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQYWNrYWdlSnNvbihcbiAgc3VwcG9ydGVkUGFja2FnZXM6IHN0cmluZ1tdLFxuICBtYXliZVZlcnNpb24gPSAnbGF0ZXN0JyxcbiAgbG9vc2UgPSBmYWxzZSxcbik6IFJ1bGUge1xuICBjb25zdCB2ZXJzaW9uID0gbWF5YmVWZXJzaW9uID8gbWF5YmVWZXJzaW9uIDogJ2xhdGVzdCc7XG4gIC8vIFRoaXMgd2lsbCBiZSB1cGRhdGVkIGFzIHdlIHJlYWQgdGhlIE5QTSByZXBvc2l0b3J5LlxuICBjb25zdCBhbGxWZXJzaW9uczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuXG4gIHJldHVybiBjaGFpbihbXG4gICAgKHRyZWU6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpOiBPYnNlcnZhYmxlPFRyZWU+ID0+IHtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uQ29udGVudCA9IHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpO1xuICAgICAgaWYgKCFwYWNrYWdlSnNvbkNvbnRlbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ0NvdWxkIG5vdCBmaW5kIHBhY2thZ2UuanNvbi4nKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gcGFyc2VKc29uKHBhY2thZ2VKc29uQ29udGVudC50b1N0cmluZygpLCBKc29uUGFyc2VNb2RlLlN0cmljdCk7XG4gICAgICBpZiAocGFja2FnZUpzb24gPT09IG51bGwgfHwgdHlwZW9mIHBhY2thZ2VKc29uICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KHBhY2thZ2VKc29uKSkge1xuICAgICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignQ291bGQgbm90IHBhcnNlIHBhY2thZ2UuanNvbi4nKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhY2thZ2VzOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHN1cHBvcnRlZFBhY2thZ2VzKSB7XG4gICAgICAgIHBhY2thZ2VzW25hbWVdID0gdmVyc2lvbjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbmNhdChcbiAgICAgICAgX2dldFJlY3Vyc2l2ZVZlcnNpb25zKHBhY2thZ2VKc29uLCBwYWNrYWdlcywgYWxsVmVyc2lvbnMsIGNvbnRleHQubG9nZ2VyLCBsb29zZSkucGlwZShcbiAgICAgICAgICBpZ25vcmVFbGVtZW50cygpLFxuICAgICAgICApLFxuICAgICAgICBvYnNlcnZhYmxlT2YodHJlZSksXG4gICAgICApO1xuICAgIH0sXG4gICAgKHRyZWU6IFRyZWUpID0+IHtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uQ29udGVudCA9IHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpO1xuICAgICAgaWYgKCFwYWNrYWdlSnNvbkNvbnRlbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ0NvdWxkIG5vdCBmaW5kIHBhY2thZ2UuanNvbi4nKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gcGFyc2VKc29uKHBhY2thZ2VKc29uQ29udGVudC50b1N0cmluZygpLCBKc29uUGFyc2VNb2RlLlN0cmljdCk7XG4gICAgICBpZiAocGFja2FnZUpzb24gPT09IG51bGwgfHwgdHlwZW9mIHBhY2thZ2VKc29uICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KHBhY2thZ2VKc29uKSkge1xuICAgICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignQ291bGQgbm90IHBhcnNlIHBhY2thZ2UuanNvbi4nKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBrUGFja2FnZUpzb25EZXBlbmRlbmN5RmllbGRzKSB7XG4gICAgICAgIGNvbnN0IGRlcHMgPSBwYWNrYWdlSnNvbltmaWVsZF07XG4gICAgICAgIGlmICghZGVwcyB8fCB0eXBlb2YgZGVwcyAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShkZXBzKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBkZXBOYW1lIG9mIE9iamVjdC5rZXlzKGRlcHMpKSB7XG4gICAgICAgICAgaWYgKGFsbFZlcnNpb25zW2RlcE5hbWVdKSB7XG4gICAgICAgICAgICBkZXBzW2RlcE5hbWVdID0gYWxsVmVyc2lvbnNbZGVwTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRyZWUub3ZlcndyaXRlKCcvcGFja2FnZS5qc29uJywgSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24sIG51bGwsIDIpICsgJ1xcbicpO1xuXG4gICAgICByZXR1cm4gdHJlZTtcbiAgICB9LFxuICAgIChfdHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKCkpO1xuICAgIH0sXG4gIF0pO1xufVxuIl19