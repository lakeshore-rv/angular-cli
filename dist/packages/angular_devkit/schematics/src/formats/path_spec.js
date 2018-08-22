"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const format_validator_1 = require("./format-validator");
const path_1 = require("./path");
describe('Schematics Path format', () => {
    it('accepts correct Paths', done => {
        const data = { path: 'a/b/c' };
        const dataSchema = {
            properties: { path: { type: 'string', format: 'path' } },
        };
        format_validator_1.formatValidator(data, dataSchema, [path_1.pathFormat])
            .pipe(operators_1.map(result => expect(result.success).toBe(true)))
            .toPromise().then(done, done.fail);
    });
    it('rejects Paths that are not normalized', done => {
        const data = { path: 'a/b/c/../' };
        const dataSchema = {
            properties: { path: { type: 'string', format: 'path' } },
        };
        format_validator_1.formatValidator(data, dataSchema, [path_1.pathFormat])
            .pipe(operators_1.map(result => expect(result.success).toBe(false)))
            .toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aF9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9mb3JtYXRzL3BhdGhfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFxQztBQUNyQyx5REFBcUQ7QUFDckQsaUNBQW9DO0FBR3BDLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ2pDLE1BQU0sSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQy9CLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFO1NBQ3pELENBQUM7UUFFRixrQ0FBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLENBQUM7YUFDNUMsSUFBSSxDQUFDLGVBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDdEQsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDakQsTUFBTSxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDbkMsTUFBTSxVQUFVLEdBQUc7WUFDakIsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7U0FDekQsQ0FBQztRQUVGLGtDQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLGlCQUFVLENBQUMsQ0FBQzthQUM1QyxJQUFJLENBQUMsZUFBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUN2RCxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBmb3JtYXRWYWxpZGF0b3IgfSBmcm9tICcuL2Zvcm1hdC12YWxpZGF0b3InO1xuaW1wb3J0IHsgcGF0aEZvcm1hdCB9IGZyb20gJy4vcGF0aCc7XG5cblxuZGVzY3JpYmUoJ1NjaGVtYXRpY3MgUGF0aCBmb3JtYXQnLCAoKSA9PiB7XG4gIGl0KCdhY2NlcHRzIGNvcnJlY3QgUGF0aHMnLCBkb25lID0+IHtcbiAgICBjb25zdCBkYXRhID0geyBwYXRoOiAnYS9iL2MnIH07XG4gICAgY29uc3QgZGF0YVNjaGVtYSA9IHtcbiAgICAgIHByb3BlcnRpZXM6IHsgcGF0aDogeyB0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAncGF0aCcgfSB9LFxuICAgIH07XG5cbiAgICBmb3JtYXRWYWxpZGF0b3IoZGF0YSwgZGF0YVNjaGVtYSwgW3BhdGhGb3JtYXRdKVxuICAgICAgLnBpcGUobWFwKHJlc3VsdCA9PiBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpKVxuICAgICAgLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoJ3JlamVjdHMgUGF0aHMgdGhhdCBhcmUgbm90IG5vcm1hbGl6ZWQnLCBkb25lID0+IHtcbiAgICBjb25zdCBkYXRhID0geyBwYXRoOiAnYS9iL2MvLi4vJyB9O1xuICAgIGNvbnN0IGRhdGFTY2hlbWEgPSB7XG4gICAgICBwcm9wZXJ0aWVzOiB7IHBhdGg6IHsgdHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ3BhdGgnIH0gfSxcbiAgICB9O1xuXG4gICAgZm9ybWF0VmFsaWRhdG9yKGRhdGEsIGRhdGFTY2hlbWEsIFtwYXRoRm9ybWF0XSlcbiAgICAgIC5waXBlKG1hcChyZXN1bHQgPT4gZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKGZhbHNlKSkpXG4gICAgICAudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcbn0pO1xuIl19