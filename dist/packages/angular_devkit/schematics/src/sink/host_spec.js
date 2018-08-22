"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-implicit-dependencies
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const host_1 = require("../../../core/src/virtual-fs/host");
const host_tree_1 = require("../tree/host-tree");
const static_1 = require("../tree/static");
describe('FileSystemSink', () => {
    it('works', done => {
        const host = new core_1.virtualFs.test.TestHost({
            '/hello': 'world',
            '/sub/directory/file2': '',
            '/sub/file1': '',
        });
        const tree = new host_tree_1.HostCreateTree(host);
        tree.create('/test', 'testing 1 2');
        const recorder = tree.beginUpdate('/test');
        recorder.insertLeft(8, 'testing ');
        tree.commitUpdate(recorder);
        const files = ['/hello', '/sub/directory/file2', '/sub/file1', '/test'];
        const treeFiles = [];
        tree.visit(path => treeFiles.push(path));
        treeFiles.sort();
        expect(treeFiles).toEqual(files);
        const outputHost = new core_1.virtualFs.test.TestHost();
        const sink = new schematics_1.HostSink(outputHost);
        sink.commit(static_1.optimize(tree))
            .toPromise()
            .then(() => {
            const tmpFiles = outputHost.files.sort();
            expect(tmpFiles).toEqual(files);
            expect(outputHost.sync.read(core_1.normalize('/test')).toString())
                .toBe('testing testing 1 2');
        })
            .then(done, done.fail);
    });
    describe('complex tests', () => {
        beforeEach(done => {
            // Commit a version of the tree.
            const host = new core_1.virtualFs.test.TestHost({
                '/file0': '/file0',
                '/sub/directory/file2': '/sub/directory/file2',
                '/sub/file1': '/sub/file1',
            });
            const tree = new host_tree_1.HostCreateTree(host);
            const outputHost = new core_1.virtualFs.test.TestHost();
            const sink = new schematics_1.HostSink(outputHost);
            sink.commit(static_1.optimize(tree))
                .toPromise()
                .then(done, done.fail);
        });
        it('can rename files', done => {
            const host = new core_1.virtualFs.test.TestHost({
                '/file0': '/file0',
            });
            const tree = new host_tree_1.HostTree(host);
            tree.rename('/file0', '/file1');
            const sink = new schematics_1.HostSink(host);
            sink.commit(static_1.optimize(tree))
                .toPromise()
                .then(() => {
                expect(host.sync.exists(core_1.normalize('/file0'))).toBe(false);
                expect(host.sync.exists(core_1.normalize('/file1'))).toBe(true);
            })
                .then(done, done.fail);
        });
        it('can rename nested files', done => {
            const host = new core_1.virtualFs.test.TestHost({
                '/sub/directory/file2': '',
            });
            const tree = new host_tree_1.HostTree(host);
            tree.rename('/sub/directory/file2', '/another-directory/file2');
            const sink = new schematics_1.HostSink(host);
            sink.commit(static_1.optimize(tree))
                .toPromise()
                .then(() => {
                expect(host.sync.exists(core_1.normalize('/sub/directory/file2'))).toBe(false);
                expect(host.sync.exists(core_1.normalize('/another-directory/file2'))).toBe(true);
            })
                .then(done, done.fail);
        });
        it('can delete and create the same file', done => {
            const host = new core_1.virtualFs.test.TestHost({
                '/file0': 'world',
            });
            const tree = new host_tree_1.HostTree(host);
            tree.delete('/file0');
            tree.create('/file0', 'hello');
            const sink = new schematics_1.HostSink(host);
            sink.commit(static_1.optimize(tree))
                .toPromise()
                .then(() => {
                expect(host.sync.read(core_1.normalize('/file0')).toString()).toBe('hello');
            })
                .then(done, done.fail);
        });
        it('can rename then create the same file', done => {
            const host = new core_1.virtualFs.test.TestHost({
                '/file0': 'world',
            });
            const tree = new host_tree_1.HostTree(host);
            tree.rename('/file0', '/file1');
            expect(tree.exists('/file0')).toBeFalsy();
            expect(tree.exists('/file1')).toBeTruthy();
            tree.create('/file0', 'hello');
            expect(tree.exists('/file0')).toBeTruthy();
            const sink = new schematics_1.HostSink(host);
            sink.commit(static_1.optimize(tree))
                .toPromise()
                .then(() => {
                expect(host.sync.read(core_1.normalize('/file0')).toString()).toBe('hello');
                expect(host_1.fileBufferToString(host.sync.read(core_1.normalize('/file1')))).toBe('world');
            })
                .then(done, done.fail);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdF9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9zaW5rL2hvc3Rfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDBDQUEwQztBQUMxQywrQ0FBNEQ7QUFDNUQsMkRBQXNEO0FBQ3RELDREQUF1RTtBQUN2RSxpREFBNkQ7QUFDN0QsMkNBQTBDO0FBRzFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRTtRQUNqQixNQUFNLElBQUksR0FBRyxJQUFJLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN2QyxRQUFRLEVBQUUsT0FBTztZQUNqQixzQkFBc0IsRUFBRSxFQUFFO1lBQzFCLFlBQVksRUFBRSxFQUFFO1NBQ2pCLENBQUMsQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLElBQUksMEJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFNUIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWpDLE1BQU0sVUFBVSxHQUFHLElBQUksZ0JBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakQsTUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0QixTQUFTLEVBQUU7YUFDWCxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1QsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN6QyxNQUFNLENBQUMsUUFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUN4RCxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQixnQ0FBZ0M7WUFDaEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxnQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3ZDLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixzQkFBc0IsRUFBRSxzQkFBc0I7Z0JBQzlDLFlBQVksRUFBRSxZQUFZO2FBQzNCLENBQUMsQ0FBQztZQUNILE1BQU0sSUFBSSxHQUFHLElBQUksMEJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV0QyxNQUFNLFVBQVUsR0FBRyxJQUFJLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pELE1BQU0sSUFBSSxHQUFHLElBQUkscUJBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3RCLFNBQVMsRUFBRTtpQkFDWCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksR0FBRyxJQUFJLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDdkMsUUFBUSxFQUFFLFFBQVE7YUFDbkIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxJQUFJLEdBQUcsSUFBSSxvQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRWhDLE1BQU0sSUFBSSxHQUFHLElBQUkscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3RCLFNBQVMsRUFBRTtpQkFDWCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0QsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBR0gsRUFBRSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxHQUFHLElBQUksZ0JBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN2QyxzQkFBc0IsRUFBRSxFQUFFO2FBQzNCLENBQUMsQ0FBQztZQUNILE1BQU0sSUFBSSxHQUFHLElBQUksb0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLDBCQUEwQixDQUFDLENBQUM7WUFFaEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDdEIsU0FBUyxFQUFFO2lCQUNYLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0UsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQy9DLE1BQU0sSUFBSSxHQUFHLElBQUksZ0JBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUN2QyxRQUFRLEVBQUUsT0FBTzthQUNsQixDQUFDLENBQUM7WUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLG9CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUUvQixNQUFNLElBQUksR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN0QixTQUFTLEVBQUU7aUJBQ1gsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZFLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNoRCxNQUFNLElBQUksR0FBRyxJQUFJLGdCQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDdkMsUUFBUSxFQUFFLE9BQU87YUFDbEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxJQUFJLEdBQUcsSUFBSSxvQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWhDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUUzQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRTNDLE1BQU0sSUFBSSxHQUFHLElBQUkscUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3RCLFNBQVMsRUFBRTtpQkFDWCxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sQ0FBQyx5QkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBub3JtYWxpemUsIHZpcnR1YWxGcyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IEhvc3RTaW5rIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgZmlsZUJ1ZmZlclRvU3RyaW5nIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9zcmMvdmlydHVhbC1mcy9ob3N0JztcbmltcG9ydCB7IEhvc3RDcmVhdGVUcmVlLCBIb3N0VHJlZSB9IGZyb20gJy4uL3RyZWUvaG9zdC10cmVlJztcbmltcG9ydCB7IG9wdGltaXplIH0gZnJvbSAnLi4vdHJlZS9zdGF0aWMnO1xuXG5cbmRlc2NyaWJlKCdGaWxlU3lzdGVtU2luaycsICgpID0+IHtcbiAgaXQoJ3dvcmtzJywgZG9uZSA9PiB7XG4gICAgY29uc3QgaG9zdCA9IG5ldyB2aXJ0dWFsRnMudGVzdC5UZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICAgICcvc3ViL2RpcmVjdG9yeS9maWxlMic6ICcnLFxuICAgICAgJy9zdWIvZmlsZTEnOiAnJyxcbiAgICB9KTtcbiAgICBjb25zdCB0cmVlID0gbmV3IEhvc3RDcmVhdGVUcmVlKGhvc3QpO1xuXG4gICAgdHJlZS5jcmVhdGUoJy90ZXN0JywgJ3Rlc3RpbmcgMSAyJyk7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0cmVlLmJlZ2luVXBkYXRlKCcvdGVzdCcpO1xuICAgIHJlY29yZGVyLmluc2VydExlZnQoOCwgJ3Rlc3RpbmcgJyk7XG4gICAgdHJlZS5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuXG4gICAgY29uc3QgZmlsZXMgPSBbJy9oZWxsbycsICcvc3ViL2RpcmVjdG9yeS9maWxlMicsICcvc3ViL2ZpbGUxJywgJy90ZXN0J107XG4gICAgY29uc3QgdHJlZUZpbGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgIHRyZWUudmlzaXQocGF0aCA9PiB0cmVlRmlsZXMucHVzaChwYXRoKSk7XG4gICAgdHJlZUZpbGVzLnNvcnQoKTtcbiAgICBleHBlY3QodHJlZUZpbGVzKS50b0VxdWFsKGZpbGVzKTtcblxuICAgIGNvbnN0IG91dHB1dEhvc3QgPSBuZXcgdmlydHVhbEZzLnRlc3QuVGVzdEhvc3QoKTtcbiAgICBjb25zdCBzaW5rID0gbmV3IEhvc3RTaW5rKG91dHB1dEhvc3QpO1xuICAgIHNpbmsuY29tbWl0KG9wdGltaXplKHRyZWUpKVxuICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRtcEZpbGVzID0gb3V0cHV0SG9zdC5maWxlcy5zb3J0KCk7XG4gICAgICAgICAgZXhwZWN0KHRtcEZpbGVzIGFzIHN0cmluZ1tdKS50b0VxdWFsKGZpbGVzKTtcbiAgICAgICAgICBleHBlY3Qob3V0cHV0SG9zdC5zeW5jLnJlYWQobm9ybWFsaXplKCcvdGVzdCcpKS50b1N0cmluZygpKVxuICAgICAgICAgICAgLnRvQmUoJ3Rlc3RpbmcgdGVzdGluZyAxIDInKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NvbXBsZXggdGVzdHMnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaChkb25lID0+IHtcbiAgICAgIC8vIENvbW1pdCBhIHZlcnNpb24gb2YgdGhlIHRyZWUuXG4gICAgICBjb25zdCBob3N0ID0gbmV3IHZpcnR1YWxGcy50ZXN0LlRlc3RIb3N0KHtcbiAgICAgICAgJy9maWxlMCc6ICcvZmlsZTAnLFxuICAgICAgICAnL3N1Yi9kaXJlY3RvcnkvZmlsZTInOiAnL3N1Yi9kaXJlY3RvcnkvZmlsZTInLFxuICAgICAgICAnL3N1Yi9maWxlMSc6ICcvc3ViL2ZpbGUxJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdHJlZSA9IG5ldyBIb3N0Q3JlYXRlVHJlZShob3N0KTtcblxuICAgICAgY29uc3Qgb3V0cHV0SG9zdCA9IG5ldyB2aXJ0dWFsRnMudGVzdC5UZXN0SG9zdCgpO1xuICAgICAgY29uc3Qgc2luayA9IG5ldyBIb3N0U2luayhvdXRwdXRIb3N0KTtcbiAgICAgIHNpbmsuY29tbWl0KG9wdGltaXplKHRyZWUpKVxuICAgICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAgIC50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FuIHJlbmFtZSBmaWxlcycsIGRvbmUgPT4ge1xuICAgICAgY29uc3QgaG9zdCA9IG5ldyB2aXJ0dWFsRnMudGVzdC5UZXN0SG9zdCh7XG4gICAgICAgICcvZmlsZTAnOiAnL2ZpbGUwJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdHJlZSA9IG5ldyBIb3N0VHJlZShob3N0KTtcbiAgICAgIHRyZWUucmVuYW1lKCcvZmlsZTAnLCAnL2ZpbGUxJyk7XG5cbiAgICAgIGNvbnN0IHNpbmsgPSBuZXcgSG9zdFNpbmsoaG9zdCk7XG4gICAgICBzaW5rLmNvbW1pdChvcHRpbWl6ZSh0cmVlKSlcbiAgICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoaG9zdC5zeW5jLmV4aXN0cyhub3JtYWxpemUoJy9maWxlMCcpKSkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoaG9zdC5zeW5jLmV4aXN0cyhub3JtYWxpemUoJy9maWxlMScpKSkudG9CZSh0cnVlKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdjYW4gcmVuYW1lIG5lc3RlZCBmaWxlcycsIGRvbmUgPT4ge1xuICAgICAgY29uc3QgaG9zdCA9IG5ldyB2aXJ0dWFsRnMudGVzdC5UZXN0SG9zdCh7XG4gICAgICAgICcvc3ViL2RpcmVjdG9yeS9maWxlMic6ICcnLFxuICAgICAgfSk7XG4gICAgICBjb25zdCB0cmVlID0gbmV3IEhvc3RUcmVlKGhvc3QpO1xuICAgICAgdHJlZS5yZW5hbWUoJy9zdWIvZGlyZWN0b3J5L2ZpbGUyJywgJy9hbm90aGVyLWRpcmVjdG9yeS9maWxlMicpO1xuXG4gICAgICBjb25zdCBzaW5rID0gbmV3IEhvc3RTaW5rKGhvc3QpO1xuICAgICAgc2luay5jb21taXQob3B0aW1pemUodHJlZSkpXG4gICAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGhvc3Quc3luYy5leGlzdHMobm9ybWFsaXplKCcvc3ViL2RpcmVjdG9yeS9maWxlMicpKSkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICBleHBlY3QoaG9zdC5zeW5jLmV4aXN0cyhub3JtYWxpemUoJy9hbm90aGVyLWRpcmVjdG9yeS9maWxlMicpKSkudG9CZSh0cnVlKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gICAgfSk7XG5cbiAgICBpdCgnY2FuIGRlbGV0ZSBhbmQgY3JlYXRlIHRoZSBzYW1lIGZpbGUnLCBkb25lID0+IHtcbiAgICAgIGNvbnN0IGhvc3QgPSBuZXcgdmlydHVhbEZzLnRlc3QuVGVzdEhvc3Qoe1xuICAgICAgICAnL2ZpbGUwJzogJ3dvcmxkJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdHJlZSA9IG5ldyBIb3N0VHJlZShob3N0KTtcbiAgICAgIHRyZWUuZGVsZXRlKCcvZmlsZTAnKTtcbiAgICAgIHRyZWUuY3JlYXRlKCcvZmlsZTAnLCAnaGVsbG8nKTtcblxuICAgICAgY29uc3Qgc2luayA9IG5ldyBIb3N0U2luayhob3N0KTtcbiAgICAgIHNpbmsuY29tbWl0KG9wdGltaXplKHRyZWUpKVxuICAgICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdChob3N0LnN5bmMucmVhZChub3JtYWxpemUoJy9maWxlMCcpKS50b1N0cmluZygpKS50b0JlKCdoZWxsbycpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgICB9KTtcblxuICAgIGl0KCdjYW4gcmVuYW1lIHRoZW4gY3JlYXRlIHRoZSBzYW1lIGZpbGUnLCBkb25lID0+IHtcbiAgICAgIGNvbnN0IGhvc3QgPSBuZXcgdmlydHVhbEZzLnRlc3QuVGVzdEhvc3Qoe1xuICAgICAgICAnL2ZpbGUwJzogJ3dvcmxkJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdHJlZSA9IG5ldyBIb3N0VHJlZShob3N0KTtcblxuICAgICAgdHJlZS5yZW5hbWUoJy9maWxlMCcsICcvZmlsZTEnKTtcbiAgICAgIGV4cGVjdCh0cmVlLmV4aXN0cygnL2ZpbGUwJykpLnRvQmVGYWxzeSgpO1xuICAgICAgZXhwZWN0KHRyZWUuZXhpc3RzKCcvZmlsZTEnKSkudG9CZVRydXRoeSgpO1xuXG4gICAgICB0cmVlLmNyZWF0ZSgnL2ZpbGUwJywgJ2hlbGxvJyk7XG4gICAgICBleHBlY3QodHJlZS5leGlzdHMoJy9maWxlMCcpKS50b0JlVHJ1dGh5KCk7XG5cbiAgICAgIGNvbnN0IHNpbmsgPSBuZXcgSG9zdFNpbmsoaG9zdCk7XG4gICAgICBzaW5rLmNvbW1pdChvcHRpbWl6ZSh0cmVlKSlcbiAgICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBleHBlY3QoaG9zdC5zeW5jLnJlYWQobm9ybWFsaXplKCcvZmlsZTAnKSkudG9TdHJpbmcoKSkudG9CZSgnaGVsbG8nKTtcbiAgICAgICAgICAgIGV4cGVjdChmaWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zeW5jLnJlYWQobm9ybWFsaXplKCcvZmlsZTEnKSkpKS50b0JlKCd3b3JsZCcpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==