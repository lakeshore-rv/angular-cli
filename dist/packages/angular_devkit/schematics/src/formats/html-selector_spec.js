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
const html_selector_1 = require("./html-selector");
describe('Schematics HTML selector format', () => {
    it('accepts correct selectors', done => {
        const data = { selector: 'my-selector' };
        const dataSchema = {
            properties: { selector: { type: 'string', format: 'html-selector' } },
        };
        format_validator_1.formatValidator(data, dataSchema, [html_selector_1.htmlSelectorFormat])
            .pipe(operators_1.map(result => expect(result.success).toBe(true)))
            .toPromise().then(done, done.fail);
    });
    it('rejects selectors starting with invalid characters', done => {
        const data = { selector: 'my-selector$' };
        const dataSchema = {
            properties: { selector: { type: 'string', format: 'html-selector' } },
        };
        format_validator_1.formatValidator(data, dataSchema, [html_selector_1.htmlSelectorFormat])
            .pipe(operators_1.map(result => expect(result.success).toBe(false)))
            .toPromise().then(done, done.fail);
    });
    it('rejects selectors starting with number', done => {
        const data = { selector: '1selector' };
        const dataSchema = {
            properties: { selector: { type: 'string', format: 'html-selector' } },
        };
        format_validator_1.formatValidator(data, dataSchema, [html_selector_1.htmlSelectorFormat])
            .pipe(operators_1.map(result => expect(result.success).toBe(false)))
            .toPromise().then(done, done.fail);
    });
    it('rejects selectors with non-letter after dash', done => {
        const data = { selector: 'my-1selector' };
        const dataSchema = {
            properties: { selector: { type: 'string', format: 'html-selector' } },
        };
        format_validator_1.formatValidator(data, dataSchema, [html_selector_1.htmlSelectorFormat])
            .pipe(operators_1.map(result => expect(result.success).toBe(false)))
            .toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC1zZWxlY3Rvcl9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9mb3JtYXRzL2h0bWwtc2VsZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUFxQztBQUNyQyx5REFBcUQ7QUFDckQsbURBQXFEO0FBR3JELFFBQVEsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7SUFDL0MsRUFBRSxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxFQUFFO1NBQ3RFLENBQUM7UUFFRixrQ0FBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxrQ0FBa0IsQ0FBQyxDQUFDO2FBQ3BELElBQUksQ0FBQyxlQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3RELFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQzlELE1BQU0sSUFBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxDQUFDO1FBQzFDLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxFQUFFO1NBQ3RFLENBQUM7UUFFRixrQ0FBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxrQ0FBa0IsQ0FBQyxDQUFDO2FBQ3BELElBQUksQ0FBQyxlQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3ZELFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ2xELE1BQU0sSUFBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxFQUFFO1NBQ3RFLENBQUM7UUFFRixrQ0FBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxrQ0FBa0IsQ0FBQyxDQUFDO2FBQ3BELElBQUksQ0FBQyxlQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3ZELFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ3hELE1BQU0sSUFBSSxHQUFHLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxDQUFDO1FBQzFDLE1BQU0sVUFBVSxHQUFHO1lBQ2pCLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxFQUFFO1NBQ3RFLENBQUM7UUFFRixrQ0FBZSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxrQ0FBa0IsQ0FBQyxDQUFDO2FBQ3BELElBQUksQ0FBQyxlQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3ZELFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGZvcm1hdFZhbGlkYXRvciB9IGZyb20gJy4vZm9ybWF0LXZhbGlkYXRvcic7XG5pbXBvcnQgeyBodG1sU2VsZWN0b3JGb3JtYXQgfSBmcm9tICcuL2h0bWwtc2VsZWN0b3InO1xuXG5cbmRlc2NyaWJlKCdTY2hlbWF0aWNzIEhUTUwgc2VsZWN0b3IgZm9ybWF0JywgKCkgPT4ge1xuICBpdCgnYWNjZXB0cyBjb3JyZWN0IHNlbGVjdG9ycycsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB7IHNlbGVjdG9yOiAnbXktc2VsZWN0b3InIH07XG4gICAgY29uc3QgZGF0YVNjaGVtYSA9IHtcbiAgICAgIHByb3BlcnRpZXM6IHsgc2VsZWN0b3I6IHsgdHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2h0bWwtc2VsZWN0b3InIH0gfSxcbiAgICB9O1xuXG4gICAgZm9ybWF0VmFsaWRhdG9yKGRhdGEsIGRhdGFTY2hlbWEsIFtodG1sU2VsZWN0b3JGb3JtYXRdKVxuICAgICAgLnBpcGUobWFwKHJlc3VsdCA9PiBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpKVxuICAgICAgLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoJ3JlamVjdHMgc2VsZWN0b3JzIHN0YXJ0aW5nIHdpdGggaW52YWxpZCBjaGFyYWN0ZXJzJywgZG9uZSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHsgc2VsZWN0b3I6ICdteS1zZWxlY3RvciQnIH07XG4gICAgY29uc3QgZGF0YVNjaGVtYSA9IHtcbiAgICAgIHByb3BlcnRpZXM6IHsgc2VsZWN0b3I6IHsgdHlwZTogJ3N0cmluZycsIGZvcm1hdDogJ2h0bWwtc2VsZWN0b3InIH0gfSxcbiAgICB9O1xuXG4gICAgZm9ybWF0VmFsaWRhdG9yKGRhdGEsIGRhdGFTY2hlbWEsIFtodG1sU2VsZWN0b3JGb3JtYXRdKVxuICAgICAgLnBpcGUobWFwKHJlc3VsdCA9PiBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmUoZmFsc2UpKSlcbiAgICAgIC50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCdyZWplY3RzIHNlbGVjdG9ycyBzdGFydGluZyB3aXRoIG51bWJlcicsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGRhdGEgPSB7IHNlbGVjdG9yOiAnMXNlbGVjdG9yJyB9O1xuICAgIGNvbnN0IGRhdGFTY2hlbWEgPSB7XG4gICAgICBwcm9wZXJ0aWVzOiB7IHNlbGVjdG9yOiB7IHR5cGU6ICdzdHJpbmcnLCBmb3JtYXQ6ICdodG1sLXNlbGVjdG9yJyB9IH0sXG4gICAgfTtcblxuICAgIGZvcm1hdFZhbGlkYXRvcihkYXRhLCBkYXRhU2NoZW1hLCBbaHRtbFNlbGVjdG9yRm9ybWF0XSlcbiAgICAgIC5waXBlKG1hcChyZXN1bHQgPT4gZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKGZhbHNlKSkpXG4gICAgICAudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdCgncmVqZWN0cyBzZWxlY3RvcnMgd2l0aCBub24tbGV0dGVyIGFmdGVyIGRhc2gnLCBkb25lID0+IHtcbiAgICBjb25zdCBkYXRhID0geyBzZWxlY3RvcjogJ215LTFzZWxlY3RvcicgfTtcbiAgICBjb25zdCBkYXRhU2NoZW1hID0ge1xuICAgICAgcHJvcGVydGllczogeyBzZWxlY3RvcjogeyB0eXBlOiAnc3RyaW5nJywgZm9ybWF0OiAnaHRtbC1zZWxlY3RvcicgfSB9LFxuICAgIH07XG5cbiAgICBmb3JtYXRWYWxpZGF0b3IoZGF0YSwgZGF0YVNjaGVtYSwgW2h0bWxTZWxlY3RvckZvcm1hdF0pXG4gICAgICAucGlwZShtYXAocmVzdWx0ID0+IGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZShmYWxzZSkpKVxuICAgICAgLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG59KTtcbiJdfQ==