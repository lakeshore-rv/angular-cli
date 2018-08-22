"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const schematics_1 = require("@angular-devkit/schematics");
const semver = require("semver");
const npm_1 = require("../utility/npm");
const angularPackagesName = [
    '@angular/animations',
    '@angular/bazel',
    '@angular/benchpress',
    '@angular/common',
    '@angular/compiler',
    '@angular/compiler-cli',
    '@angular/core',
    '@angular/forms',
    '@angular/http',
    '@angular/language-service',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/platform-server',
    '@angular/platform-webworker',
    '@angular/platform-webworker-dynamic',
    '@angular/router',
    '@angular/service-worker',
    '@angular/upgrade',
];
function default_1(options) {
    const version = options.version || 'latest';
    if (semver.valid(version)) {
        if (!semver.gt(version, '4.0.0')) {
            throw new schematics_1.SchematicsException('You cannot use a version of Angular older than 4.');
        }
    }
    return npm_1.updatePackageJson(angularPackagesName, options.version, options.loose);
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NjaGVtYXRpY3MvcGFja2FnZV91cGRhdGUvX2FuZ3VsYXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwyREFBdUU7QUFDdkUsaUNBQWlDO0FBRWpDLHdDQUFtRDtBQUduRCxNQUFNLG1CQUFtQixHQUFHO0lBQzFCLHFCQUFxQjtJQUNyQixnQkFBZ0I7SUFDaEIscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsZUFBZTtJQUNmLDJCQUEyQjtJQUMzQiwyQkFBMkI7SUFDM0IsbUNBQW1DO0lBQ25DLDBCQUEwQjtJQUMxQiw2QkFBNkI7SUFDN0IscUNBQXFDO0lBQ3JDLGlCQUFpQjtJQUNqQix5QkFBeUI7SUFDekIsa0JBQWtCO0NBQ25CLENBQUM7QUFFRixtQkFBd0IsT0FBK0I7SUFDckQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUM7SUFDNUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRTtZQUNoQyxNQUFNLElBQUksZ0NBQW1CLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUNwRjtLQUNGO0lBRUQsT0FBTyx1QkFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBVEQsNEJBU0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBSdWxlLCBTY2hlbWF0aWNzRXhjZXB0aW9uIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgeyBTY2hlbWF0aWNzVXBkYXRlU2NoZW1hIH0gZnJvbSAnLi4vc2NoZW1hJztcbmltcG9ydCB7IHVwZGF0ZVBhY2thZ2VKc29uIH0gZnJvbSAnLi4vdXRpbGl0eS9ucG0nO1xuXG5cbmNvbnN0IGFuZ3VsYXJQYWNrYWdlc05hbWUgPSBbXG4gICdAYW5ndWxhci9hbmltYXRpb25zJyxcbiAgJ0Bhbmd1bGFyL2JhemVsJyxcbiAgJ0Bhbmd1bGFyL2JlbmNocHJlc3MnLFxuICAnQGFuZ3VsYXIvY29tbW9uJyxcbiAgJ0Bhbmd1bGFyL2NvbXBpbGVyJyxcbiAgJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaScsXG4gICdAYW5ndWxhci9jb3JlJyxcbiAgJ0Bhbmd1bGFyL2Zvcm1zJyxcbiAgJ0Bhbmd1bGFyL2h0dHAnLFxuICAnQGFuZ3VsYXIvbGFuZ3VhZ2Utc2VydmljZScsXG4gICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJyxcbiAgJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYycsXG4gICdAYW5ndWxhci9wbGF0Zm9ybS1zZXJ2ZXInLFxuICAnQGFuZ3VsYXIvcGxhdGZvcm0td2Vid29ya2VyJyxcbiAgJ0Bhbmd1bGFyL3BsYXRmb3JtLXdlYndvcmtlci1keW5hbWljJyxcbiAgJ0Bhbmd1bGFyL3JvdXRlcicsXG4gICdAYW5ndWxhci9zZXJ2aWNlLXdvcmtlcicsXG4gICdAYW5ndWxhci91cGdyYWRlJyxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9wdGlvbnM6IFNjaGVtYXRpY3NVcGRhdGVTY2hlbWEpOiBSdWxlIHtcbiAgY29uc3QgdmVyc2lvbiA9IG9wdGlvbnMudmVyc2lvbiB8fCAnbGF0ZXN0JztcbiAgaWYgKHNlbXZlci52YWxpZCh2ZXJzaW9uKSkge1xuICAgIGlmICghc2VtdmVyLmd0KHZlcnNpb24sICc0LjAuMCcpKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignWW91IGNhbm5vdCB1c2UgYSB2ZXJzaW9uIG9mIEFuZ3VsYXIgb2xkZXIgdGhhbiA0LicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1cGRhdGVQYWNrYWdlSnNvbihhbmd1bGFyUGFja2FnZXNOYW1lLCBvcHRpb25zLnZlcnNpb24sIG9wdGlvbnMubG9vc2UpO1xufVxuIl19