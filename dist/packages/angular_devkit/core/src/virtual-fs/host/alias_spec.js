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
const alias_1 = require("./alias");
const buffer_1 = require("./buffer");
const memory_1 = require("./memory");
describe('AliasHost', () => {
    it('works as in the example', () => {
        const content = buffer_1.stringToFileBuffer('hello world');
        const host = new memory_1.SimpleMemoryHost();
        host.write(__1.normalize('/some/file'), content).subscribe();
        const aHost = new alias_1.AliasHost(host);
        aHost.read(__1.normalize('/some/file'))
            .subscribe(x => expect(x).toBe(content));
        aHost.aliases.set(__1.normalize('/some/file'), __1.normalize('/other/path'));
        // This file will not exist because /other/path does not exist.
        try {
            aHost.read(__1.normalize('/some/file'))
                .subscribe(undefined, err => {
                expect(err.message).toMatch(/does not exist/);
            });
        }
        catch (_a) {
            // Ignore it. RxJS <6 still throw errors when they happen synchronously.
        }
    });
    it('works as in the example (2)', () => {
        const content = buffer_1.stringToFileBuffer('hello world');
        const content2 = buffer_1.stringToFileBuffer('hello world 2');
        const host = new memory_1.SimpleMemoryHost();
        host.write(__1.normalize('/some/folder/file'), content).subscribe();
        const aHost = new alias_1.AliasHost(host);
        aHost.read(__1.normalize('/some/folder/file'))
            .subscribe(x => expect(x).toBe(content));
        aHost.aliases.set(__1.normalize('/some'), __1.normalize('/other'));
        // This file will not exist because /other/path does not exist.
        try {
            aHost.read(__1.normalize('/some/folder/file'))
                .subscribe(undefined, err => expect(err.message).toMatch(/does not exist/));
        }
        catch (_a) { }
        // Create the file with new content and verify that this has the new content.
        aHost.write(__1.normalize('/other/folder/file'), content2).subscribe();
        aHost.read(__1.normalize('/some/folder/file'))
            .subscribe(x => expect(x).toBe(content2));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvdmlydHVhbC1mcy9ob3N0L2FsaWFzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwwQkFBK0I7QUFDL0IsbUNBQW9DO0FBQ3BDLHFDQUE4QztBQUM5QyxxQ0FBNEM7QUFFNUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekIsRUFBRSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtRQUNqQyxNQUFNLE9BQU8sR0FBRywyQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVsRCxNQUFNLElBQUksR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFTLENBQUMsWUFBWSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFekQsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ2hDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMzQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFTLENBQUMsWUFBWSxDQUFDLEVBQUUsYUFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFFckUsK0RBQStEO1FBQy9ELElBQUk7WUFDRixLQUFLLENBQUMsSUFBSSxDQUFDLGFBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDaEMsU0FBUyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztTQUNOO1FBQUMsV0FBTTtZQUNOLHdFQUF3RTtTQUN6RTtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUNyQyxNQUFNLE9BQU8sR0FBRywyQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNsRCxNQUFNLFFBQVEsR0FBRywyQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUVyRCxNQUFNLElBQUksR0FBRyxJQUFJLHlCQUFnQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFTLENBQUMsbUJBQW1CLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVoRSxNQUFNLEtBQUssR0FBRyxJQUFJLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQzthQUNyQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDN0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLGFBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRTNELCtEQUErRDtRQUMvRCxJQUFJO1lBQ0YsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDdkMsU0FBUyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUMvRTtRQUFDLFdBQU0sR0FBRTtRQUVWLDZFQUE2RTtRQUM3RSxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25FLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7YUFDckMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBub3JtYWxpemUgfSBmcm9tICcuLic7XG5pbXBvcnQgeyBBbGlhc0hvc3QgfSBmcm9tICcuL2FsaWFzJztcbmltcG9ydCB7IHN0cmluZ1RvRmlsZUJ1ZmZlciB9IGZyb20gJy4vYnVmZmVyJztcbmltcG9ydCB7IFNpbXBsZU1lbW9yeUhvc3QgfSBmcm9tICcuL21lbW9yeSc7XG5cbmRlc2NyaWJlKCdBbGlhc0hvc3QnLCAoKSA9PiB7XG4gIGl0KCd3b3JrcyBhcyBpbiB0aGUgZXhhbXBsZScsICgpID0+IHtcbiAgICBjb25zdCBjb250ZW50ID0gc3RyaW5nVG9GaWxlQnVmZmVyKCdoZWxsbyB3b3JsZCcpO1xuXG4gICAgY29uc3QgaG9zdCA9IG5ldyBTaW1wbGVNZW1vcnlIb3N0KCk7XG4gICAgaG9zdC53cml0ZShub3JtYWxpemUoJy9zb21lL2ZpbGUnKSwgY29udGVudCkuc3Vic2NyaWJlKCk7XG5cbiAgICBjb25zdCBhSG9zdCA9IG5ldyBBbGlhc0hvc3QoaG9zdCk7XG4gICAgYUhvc3QucmVhZChub3JtYWxpemUoJy9zb21lL2ZpbGUnKSlcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiBleHBlY3QoeCkudG9CZShjb250ZW50KSk7XG4gICAgYUhvc3QuYWxpYXNlcy5zZXQobm9ybWFsaXplKCcvc29tZS9maWxlJyksIG5vcm1hbGl6ZSgnL290aGVyL3BhdGgnKSk7XG5cbiAgICAvLyBUaGlzIGZpbGUgd2lsbCBub3QgZXhpc3QgYmVjYXVzZSAvb3RoZXIvcGF0aCBkb2VzIG5vdCBleGlzdC5cbiAgICB0cnkge1xuICAgICAgYUhvc3QucmVhZChub3JtYWxpemUoJy9zb21lL2ZpbGUnKSlcbiAgICAgICAgLnN1YnNjcmliZSh1bmRlZmluZWQsIGVyciA9PiB7XG4gICAgICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKS50b01hdGNoKC9kb2VzIG5vdCBleGlzdC8pO1xuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIElnbm9yZSBpdC4gUnhKUyA8NiBzdGlsbCB0aHJvdyBlcnJvcnMgd2hlbiB0aGV5IGhhcHBlbiBzeW5jaHJvbm91c2x5LlxuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIGFzIGluIHRoZSBleGFtcGxlICgyKScsICgpID0+IHtcbiAgICBjb25zdCBjb250ZW50ID0gc3RyaW5nVG9GaWxlQnVmZmVyKCdoZWxsbyB3b3JsZCcpO1xuICAgIGNvbnN0IGNvbnRlbnQyID0gc3RyaW5nVG9GaWxlQnVmZmVyKCdoZWxsbyB3b3JsZCAyJyk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IFNpbXBsZU1lbW9yeUhvc3QoKTtcbiAgICBob3N0LndyaXRlKG5vcm1hbGl6ZSgnL3NvbWUvZm9sZGVyL2ZpbGUnKSwgY29udGVudCkuc3Vic2NyaWJlKCk7XG5cbiAgICBjb25zdCBhSG9zdCA9IG5ldyBBbGlhc0hvc3QoaG9zdCk7XG4gICAgYUhvc3QucmVhZChub3JtYWxpemUoJy9zb21lL2ZvbGRlci9maWxlJykpXG4gICAgICAgIC5zdWJzY3JpYmUoeCA9PiBleHBlY3QoeCkudG9CZShjb250ZW50KSk7XG4gICAgYUhvc3QuYWxpYXNlcy5zZXQobm9ybWFsaXplKCcvc29tZScpLCBub3JtYWxpemUoJy9vdGhlcicpKTtcblxuICAgIC8vIFRoaXMgZmlsZSB3aWxsIG5vdCBleGlzdCBiZWNhdXNlIC9vdGhlci9wYXRoIGRvZXMgbm90IGV4aXN0LlxuICAgIHRyeSB7XG4gICAgICBhSG9zdC5yZWFkKG5vcm1hbGl6ZSgnL3NvbWUvZm9sZGVyL2ZpbGUnKSlcbiAgICAgICAgLnN1YnNjcmliZSh1bmRlZmluZWQsIGVyciA9PiBleHBlY3QoZXJyLm1lc3NhZ2UpLnRvTWF0Y2goL2RvZXMgbm90IGV4aXN0LykpO1xuICAgIH0gY2F0Y2gge31cblxuICAgIC8vIENyZWF0ZSB0aGUgZmlsZSB3aXRoIG5ldyBjb250ZW50IGFuZCB2ZXJpZnkgdGhhdCB0aGlzIGhhcyB0aGUgbmV3IGNvbnRlbnQuXG4gICAgYUhvc3Qud3JpdGUobm9ybWFsaXplKCcvb3RoZXIvZm9sZGVyL2ZpbGUnKSwgY29udGVudDIpLnN1YnNjcmliZSgpO1xuICAgIGFIb3N0LnJlYWQobm9ybWFsaXplKCcvc29tZS9mb2xkZXIvZmlsZScpKVxuICAgICAgICAuc3Vic2NyaWJlKHggPT4gZXhwZWN0KHgpLnRvQmUoY29udGVudDIpKTtcbiAgfSk7XG59KTtcbiJdfQ==