"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-any
// tslint:disable-next-line:no-implicit-dependencies
const node_1 = require("@angular-devkit/core/node");
const path = require("path");
const devKitRoot = global._DevKitRoot;
describe('resolve', () => {
    it('works', () => {
        expect(node_1.resolve('tslint', { basedir: __dirname }))
            .toBe(path.join(devKitRoot, 'node_modules/tslint/lib/index.js'));
        expect(() => node_1.resolve('npm', { basedir: '/' })).toThrow();
        expect(() => node_1.resolve('npm', { basedir: '/', checkGlobal: true })).not.toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZV9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL25vZGUvcmVzb2x2ZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsd0JBQXdCO0FBQ3hCLG9EQUFvRDtBQUNwRCxvREFBb0Q7QUFDcEQsNkJBQTZCO0FBRTdCLE1BQU0sVUFBVSxHQUFJLE1BQWMsQ0FBQyxXQUFXLENBQUM7QUFFL0MsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFFdkIsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDZixNQUFNLENBQUMsY0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO2FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDLENBQUM7UUFFbkUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRXpELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsRixDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGU6bm8tYW55XG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUvbm9kZSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBkZXZLaXRSb290ID0gKGdsb2JhbCBhcyBhbnkpLl9EZXZLaXRSb290O1xuXG5kZXNjcmliZSgncmVzb2x2ZScsICgpID0+IHtcblxuICBpdCgnd29ya3MnLCAoKSA9PiB7XG4gICAgZXhwZWN0KHJlc29sdmUoJ3RzbGludCcsIHsgYmFzZWRpcjogX19kaXJuYW1lIH0pKVxuICAgICAgLnRvQmUocGF0aC5qb2luKGRldktpdFJvb3QsICdub2RlX21vZHVsZXMvdHNsaW50L2xpYi9pbmRleC5qcycpKTtcblxuICAgIGV4cGVjdCgoKSA9PiByZXNvbHZlKCducG0nLCB7IGJhc2VkaXI6ICcvJyB9KSkudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHJlc29sdmUoJ25wbScsIHsgYmFzZWRpcjogJy8nLCBjaGVja0dsb2JhbDogdHJ1ZSB9KSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbn0pO1xuIl19