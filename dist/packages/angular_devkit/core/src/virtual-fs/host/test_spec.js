"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const test_1 = require("./test");
// Yes, we realize the irony of testing a test host.
describe('TestHost', () => {
    it('can list files', () => {
        const files = {
            '/x/y/z': '',
            '/a': '',
            '/h': '',
            '/x/y/b': '',
        };
        const host = new test_1.TestHost(files);
        expect(host.files.sort()).toEqual(Object.keys(files).sort());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy92aXJ0dWFsLWZzL2hvc3QvdGVzdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUNBQWtDO0FBR2xDLG9EQUFvRDtBQUNwRCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUV4QixFQUFFLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLE1BQU0sS0FBSyxHQUFHO1lBQ1osUUFBUSxFQUFFLEVBQUU7WUFDWixJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxFQUFFO1lBQ1IsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDO1FBRUYsTUFBTSxJQUFJLEdBQUcsSUFBSSxlQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzNFLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBUZXN0SG9zdCB9IGZyb20gJy4vdGVzdCc7XG5cblxuLy8gWWVzLCB3ZSByZWFsaXplIHRoZSBpcm9ueSBvZiB0ZXN0aW5nIGEgdGVzdCBob3N0LlxuZGVzY3JpYmUoJ1Rlc3RIb3N0JywgKCkgPT4ge1xuXG4gIGl0KCdjYW4gbGlzdCBmaWxlcycsICgpID0+IHtcbiAgICBjb25zdCBmaWxlcyA9IHtcbiAgICAgICcveC95L3onOiAnJyxcbiAgICAgICcvYSc6ICcnLFxuICAgICAgJy9oJzogJycsXG4gICAgICAnL3gveS9iJzogJycsXG4gICAgfTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgVGVzdEhvc3QoZmlsZXMpO1xuICAgIGV4cGVjdChob3N0LmZpbGVzLnNvcnQoKSBhcyBzdHJpbmdbXSkudG9FcXVhbChPYmplY3Qua2V5cyhmaWxlcykuc29ydCgpKTtcbiAgfSk7XG5cbn0pO1xuIl19