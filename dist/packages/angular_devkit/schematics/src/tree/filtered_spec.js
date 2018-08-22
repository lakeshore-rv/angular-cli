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
const filtered_1 = require("./filtered");
const virtual_1 = require("./virtual");
describe('FilteredTree', () => {
    it('works', () => {
        const tree = new virtual_1.VirtualTree;
        tree.create('/file1', '');
        tree.create('/file2', '');
        tree.create('/file3', '');
        const filtered = new filtered_1.FilteredTree(tree, p => p != '/file2');
        expect(filtered.files.sort()).toEqual(['/file1', '/file3'].map(core_1.normalize));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyZWRfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvdHJlZS9maWx0ZXJlZF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQWlEO0FBQ2pELHlDQUEwQztBQUMxQyx1Q0FBd0M7QUFHeEMsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDZixNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFXLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSx1QkFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQVMsQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IEZpbHRlcmVkVHJlZSB9IGZyb20gJy4vZmlsdGVyZWQnO1xuaW1wb3J0IHsgVmlydHVhbFRyZWUgfSBmcm9tICcuL3ZpcnR1YWwnO1xuXG5cbmRlc2NyaWJlKCdGaWx0ZXJlZFRyZWUnLCAoKSA9PiB7XG4gIGl0KCd3b3JrcycsICgpID0+IHtcbiAgICBjb25zdCB0cmVlID0gbmV3IFZpcnR1YWxUcmVlO1xuICAgIHRyZWUuY3JlYXRlKCcvZmlsZTEnLCAnJyk7XG4gICAgdHJlZS5jcmVhdGUoJy9maWxlMicsICcnKTtcbiAgICB0cmVlLmNyZWF0ZSgnL2ZpbGUzJywgJycpO1xuXG4gICAgY29uc3QgZmlsdGVyZWQgPSBuZXcgRmlsdGVyZWRUcmVlKHRyZWUsIHAgPT4gcCAhPSAnL2ZpbGUyJyk7XG4gICAgZXhwZWN0KGZpbHRlcmVkLmZpbGVzLnNvcnQoKSkudG9FcXVhbChbJy9maWxlMScsICcvZmlsZTMnXS5tYXAobm9ybWFsaXplKSk7XG4gIH0pO1xufSk7XG4iXX0=