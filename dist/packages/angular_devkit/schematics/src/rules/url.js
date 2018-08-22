"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const url_1 = require("url");
function url(urlString) {
    const url = url_1.parse(urlString);
    return (context) => context.engine.createSourceFromUrl(url, context)(context);
}
exports.url = url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9ydWxlcy91cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw2QkFBNEI7QUFJNUIsYUFBb0IsU0FBaUI7SUFDbkMsTUFBTSxHQUFHLEdBQUcsV0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTdCLE9BQU8sQ0FBQyxPQUF5QixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsRyxDQUFDO0FBSkQsa0JBSUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gJ3VybCc7XG5pbXBvcnQgeyBTY2hlbWF0aWNDb250ZXh0LCBTb3VyY2UgfSBmcm9tICcuLi9lbmdpbmUvaW50ZXJmYWNlJztcblxuXG5leHBvcnQgZnVuY3Rpb24gdXJsKHVybFN0cmluZzogc3RyaW5nKTogU291cmNlIHtcbiAgY29uc3QgdXJsID0gcGFyc2UodXJsU3RyaW5nKTtcblxuICByZXR1cm4gKGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IGNvbnRleHQuZW5naW5lLmNyZWF0ZVNvdXJjZUZyb21VcmwodXJsLCBjb250ZXh0KShjb250ZXh0KTtcbn1cbiJdfQ==