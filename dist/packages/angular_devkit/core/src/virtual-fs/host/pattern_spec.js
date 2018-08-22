"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const __1 = require("..");
const buffer_1 = require("./buffer");
const memory_1 = require("./memory");
const pattern_1 = require("./pattern");
describe('PatternMatchingHost', () => {
    it('works for NativeScript', () => {
        const content = buffer_1.stringToFileBuffer('hello world');
        const content2 = buffer_1.stringToFileBuffer('hello world 2');
        const host = new memory_1.SimpleMemoryHost();
        host.write(__1.normalize('/some/file.tns.ts'), content).subscribe();
        const pHost = new pattern_1.PatternMatchingHost(host);
        pHost.read(__1.normalize('/some/file.tns.ts'))
            .subscribe(x => expect(x).toBe(content));
        pHost.addPattern('**/*.tns.ts', path => {
            return __1.normalize(path.replace(/\.tns\.ts$/, '.ts'));
        });
        // This file will not exist because /some/file.ts does not exist.
        try {
            pHost.read(__1.normalize('/some/file.tns.ts'))
                .subscribe(undefined, err => {
                expect(err.message).toMatch(/does not exist/);
            });
        }
        catch (_a) {
            // Ignore it. RxJS <6 still throw errors when they happen synchronously.
        }
        // Create the file, it should exist now.
        pHost.write(__1.normalize('/some/file.ts'), content2).subscribe();
        pHost.read(__1.normalize('/some/file.tns.ts'))
            .subscribe(x => expect(x).toBe(content2));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0dGVybl9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy92aXJ0dWFsLWZzL2hvc3QvcGF0dGVybl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMEJBQStCO0FBQy9CLHFDQUE4QztBQUM5QyxxQ0FBNEM7QUFDNUMsdUNBQWdEO0FBRWhELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsRUFBRSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtRQUNoQyxNQUFNLE9BQU8sR0FBRywyQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRywyQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUVyRCxNQUFNLElBQUksR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFTLENBQUMsbUJBQW1CLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVoRSxNQUFNLEtBQUssR0FBRyxJQUFJLDZCQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7YUFDdkMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBRTNDLEtBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sYUFBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxpRUFBaUU7UUFDakUsSUFBSTtZQUNGLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7aUJBQ3ZDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUFDLFdBQU07WUFDTix3RUFBd0U7U0FDekU7UUFFRCx3Q0FBd0M7UUFDeEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFTLENBQUMsZUFBZSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDOUQsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQzthQUN2QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJy4uJztcbmltcG9ydCB7IHN0cmluZ1RvRmlsZUJ1ZmZlciB9IGZyb20gJy4vYnVmZmVyJztcbmltcG9ydCB7IFNpbXBsZU1lbW9yeUhvc3QgfSBmcm9tICcuL21lbW9yeSc7XG5pbXBvcnQgeyBQYXR0ZXJuTWF0Y2hpbmdIb3N0IH0gZnJvbSAnLi9wYXR0ZXJuJztcblxuZGVzY3JpYmUoJ1BhdHRlcm5NYXRjaGluZ0hvc3QnLCAoKSA9PiB7XG4gIGl0KCd3b3JrcyBmb3IgTmF0aXZlU2NyaXB0JywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBzdHJpbmdUb0ZpbGVCdWZmZXIoJ2hlbGxvIHdvcmxkJyk7XG4gICAgY29uc3QgY29udGVudDIgPSBzdHJpbmdUb0ZpbGVCdWZmZXIoJ2hlbGxvIHdvcmxkIDInKTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgU2ltcGxlTWVtb3J5SG9zdCgpO1xuICAgIGhvc3Qud3JpdGUobm9ybWFsaXplKCcvc29tZS9maWxlLnRucy50cycpLCBjb250ZW50KS5zdWJzY3JpYmUoKTtcblxuICAgIGNvbnN0IHBIb3N0ID0gbmV3IFBhdHRlcm5NYXRjaGluZ0hvc3QoaG9zdCk7XG4gICAgcEhvc3QucmVhZChub3JtYWxpemUoJy9zb21lL2ZpbGUudG5zLnRzJykpXG4gICAgICAuc3Vic2NyaWJlKHggPT4gZXhwZWN0KHgpLnRvQmUoY29udGVudCkpO1xuXG4gICAgcEhvc3QuYWRkUGF0dGVybignKiovKi50bnMudHMnLCBwYXRoID0+IHtcbiAgICAgIHJldHVybiBub3JtYWxpemUocGF0aC5yZXBsYWNlKC9cXC50bnNcXC50cyQvLCAnLnRzJykpO1xuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBmaWxlIHdpbGwgbm90IGV4aXN0IGJlY2F1c2UgL3NvbWUvZmlsZS50cyBkb2VzIG5vdCBleGlzdC5cbiAgICB0cnkge1xuICAgICAgcEhvc3QucmVhZChub3JtYWxpemUoJy9zb21lL2ZpbGUudG5zLnRzJykpXG4gICAgICAgIC5zdWJzY3JpYmUodW5kZWZpbmVkLCBlcnIgPT4ge1xuICAgICAgICAgIGV4cGVjdChlcnIubWVzc2FnZSkudG9NYXRjaCgvZG9lcyBub3QgZXhpc3QvKTtcbiAgICAgICAgfSk7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBJZ25vcmUgaXQuIFJ4SlMgPDYgc3RpbGwgdGhyb3cgZXJyb3JzIHdoZW4gdGhleSBoYXBwZW4gc3luY2hyb25vdXNseS5cbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgdGhlIGZpbGUsIGl0IHNob3VsZCBleGlzdCBub3cuXG4gICAgcEhvc3Qud3JpdGUobm9ybWFsaXplKCcvc29tZS9maWxlLnRzJyksIGNvbnRlbnQyKS5zdWJzY3JpYmUoKTtcbiAgICBwSG9zdC5yZWFkKG5vcm1hbGl6ZSgnL3NvbWUvZmlsZS50bnMudHMnKSlcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiBleHBlY3QoeCkudG9CZShjb250ZW50MikpO1xuICB9KTtcbn0pO1xuIl19