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
// tslint:disable:non-null-operator
// tslint:disable:no-implicit-dependencies
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const fs = require("fs");
const temp = require('temp');
// TODO: replace this with an "it()" macro that's reusable globally.
let linuxOnlyIt = it;
if (process.platform.startsWith('win') || process.platform.startsWith('darwin')) {
    linuxOnlyIt = xit;
}
describe('NodeJsAsyncHost', () => {
    let root;
    let host;
    beforeEach(() => {
        root = temp.mkdirSync('core-node-spec-');
        host = new core_1.virtualFs.ScopedHost(new node_1.NodeJsAsyncHost(), core_1.normalize(root));
    });
    afterEach(done => host.delete(core_1.normalize('/')).toPromise().then(done, done.fail));
    linuxOnlyIt('can watch', done => {
        let obs;
        let subscription;
        const content = core_1.virtualFs.stringToFileBuffer('hello world');
        const content2 = core_1.virtualFs.stringToFileBuffer('hello world 2');
        const allEvents = [];
        Promise.resolve()
            .then(() => fs.mkdirSync(root + '/sub1'))
            .then(() => fs.writeFileSync(root + '/sub1/file1', 'hello world'))
            .then(() => {
            obs = host.watch(core_1.normalize('/sub1'), { recursive: true });
            expect(obs).not.toBeNull();
            subscription = obs.subscribe(event => { allEvents.push(event); });
        })
            .then(() => new Promise(resolve => setTimeout(resolve, 100)))
            // Discard the events registered so far.
            .then(() => allEvents.splice(0))
            .then(() => host.write(core_1.normalize('/sub1/sub2/file3'), content).toPromise())
            .then(() => host.write(core_1.normalize('/sub1/file2'), content2).toPromise())
            .then(() => host.delete(core_1.normalize('/sub1/file1')).toPromise())
            .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
            .then(() => {
            expect(allEvents.length).toBe(3);
            subscription.unsubscribe();
        })
            .then(done, done.fail);
    }, 30000);
});
describe('NodeJsSyncHost', () => {
    let root;
    let host;
    beforeEach(() => {
        root = temp.mkdirSync('core-node-spec-');
        host = new core_1.virtualFs.SyncDelegateHost(new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), core_1.normalize(root)));
    });
    afterEach(() => {
        host.delete(core_1.normalize('/'));
    });
    linuxOnlyIt('can watch', done => {
        let obs;
        let subscription;
        const content = core_1.virtualFs.stringToFileBuffer('hello world');
        const content2 = core_1.virtualFs.stringToFileBuffer('hello world 2');
        const allEvents = [];
        Promise.resolve()
            .then(() => fs.mkdirSync(root + '/sub1'))
            .then(() => fs.writeFileSync(root + '/sub1/file1', 'hello world'))
            .then(() => {
            obs = host.watch(core_1.normalize('/sub1'), { recursive: true });
            expect(obs).not.toBeNull();
            subscription = obs.subscribe(event => { allEvents.push(event); });
        })
            .then(() => new Promise(resolve => setTimeout(resolve, 100)))
            // Discard the events registered so far.
            .then(() => allEvents.splice(0))
            .then(() => {
            host.write(core_1.normalize('/sub1/sub2/file3'), content);
            host.write(core_1.normalize('/sub1/file2'), content2);
            host.delete(core_1.normalize('/sub1/file1'));
        })
            .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
            .then(() => {
            expect(allEvents.length).toBe(3);
            subscription.unsubscribe();
        })
            .then(done, done.fail);
    }, 30000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdF9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL25vZGUvaG9zdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsd0JBQXdCO0FBQ3hCLG1DQUFtQztBQUNuQywwQ0FBMEM7QUFDMUMsK0NBQTREO0FBQzVELG9EQUE0RTtBQUM1RSx5QkFBeUI7QUFHekIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRzdCLG9FQUFvRTtBQUNwRSxJQUFJLFdBQVcsR0FBYyxFQUFFLENBQUM7QUFDaEMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUMvRSxXQUFXLEdBQUcsR0FBRyxDQUFDO0NBQ25CO0FBR0QsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLElBQVksQ0FBQztJQUNqQixJQUFJLElBQThCLENBQUM7SUFFbkMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDekMsSUFBSSxHQUFHLElBQUksZ0JBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxzQkFBZSxFQUFFLEVBQUUsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUMsQ0FBQyxDQUFDO0lBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFD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QUNwRSxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0Qsd0NBQXdDO2FBQ3ZDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9CLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzdELElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRVosQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnlcbi8vIHRzbGludDpkaXNhYmxlOm5vbi1udWxsLW9wZXJhdG9yXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IG5vcm1hbGl6ZSwgdmlydHVhbEZzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgTm9kZUpzQXN5bmNIb3N0LCBOb2RlSnNTeW5jSG9zdCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL25vZGUnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmNvbnN0IHRlbXAgPSByZXF1aXJlKCd0ZW1wJyk7XG5cblxuLy8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggYW4gXCJpdCgpXCIgbWFjcm8gdGhhdCdzIHJldXNhYmxlIGdsb2JhbGx5LlxubGV0IGxpbnV4T25seUl0OiB0eXBlb2YgaXQgPSBpdDtcbmlmIChwcm9jZXNzLnBsYXRmb3JtLnN0YXJ0c1dpdGgoJ3dpbicpIHx8IHByb2Nlc3MucGxhdGZvcm0uc3RhcnRzV2l0aCgnZGFyd2luJykpIHtcbiAgbGludXhPbmx5SXQgPSB4aXQ7XG59XG5cblxuZGVzY3JpYmUoJ05vZGVKc0FzeW5jSG9zdCcsICgpID0+IHtcbiAgbGV0IHJvb3Q6IHN0cmluZztcbiAgbGV0IGhvc3Q6IHZpcnR1YWxGcy5Ib3N0PGZzLlN0YXRzPjtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICByb290ID0gdGVtcC5ta2RpclN5bmMoJ2NvcmUtbm9kZS1zcGVjLScpO1xuICAgIGhvc3QgPSBuZXcgdmlydHVhbEZzLlNjb3BlZEhvc3QobmV3IE5vZGVKc0FzeW5jSG9zdCgpLCBub3JtYWxpemUocm9vdCkpO1xuICB9KTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5kZWxldGUobm9ybWFsaXplKCcvJykpLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKSk7XG5cbiAgbGludXhPbmx5SXQoJ2NhbiB3YXRjaCcsIGRvbmUgPT4ge1xuICAgIGxldCBvYnM6IE9ic2VydmFibGU8dmlydHVhbEZzLkhvc3RXYXRjaEV2ZW50PjtcbiAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5zdHJpbmdUb0ZpbGVCdWZmZXIoJ2hlbGxvIHdvcmxkJyk7XG4gICAgY29uc3QgY29udGVudDIgPSB2aXJ0dWFsRnMuc3RyaW5nVG9GaWxlQnVmZmVyKCdoZWxsbyB3b3JsZCAyJyk7XG4gICAgY29uc3QgYWxsRXZlbnRzOiB2aXJ0dWFsRnMuSG9zdFdhdGNoRXZlbnRbXSA9IFtdO1xuXG4gICAgUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIC50aGVuKCgpID0+IGZzLm1rZGlyU3luYyhyb290ICsgJy9zdWIxJykpXG4gICAgICAudGhlbigoKSA9PiBmcy53cml0ZUZpbGVTeW5jKHJvb3QgKyAnL3N1YjEvZmlsZTEnLCAnaGVsbG8gd29ybGQnKSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgb2JzID0gaG9zdC53YXRjaChub3JtYWxpemUoJy9zdWIxJyksIHsgcmVjdXJzaXZlOiB0cnVlIH0pICE7XG4gICAgICAgIGV4cGVjdChvYnMpLm5vdC50b0JlTnVsbCgpO1xuICAgICAgICBzdWJzY3JpcHRpb24gPSBvYnMuc3Vic2NyaWJlKGV2ZW50ID0+IHsgYWxsRXZlbnRzLnB1c2goZXZlbnQpOyB9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSkpXG4gICAgICAvLyBEaXNjYXJkIHRoZSBldmVudHMgcmVnaXN0ZXJlZCBzbyBmYXIuXG4gICAgICAudGhlbigoKSA9PiBhbGxFdmVudHMuc3BsaWNlKDApKVxuICAgICAgLnRoZW4oKCkgPT4gaG9zdC53cml0ZShub3JtYWxpemUoJy9zdWIxL3N1YjIvZmlsZTMnKSwgY29udGVudCkudG9Qcm9taXNlKCkpXG4gICAgICAudGhlbigoKSA9PiBob3N0LndyaXRlKG5vcm1hbGl6ZSgnL3N1YjEvZmlsZTInKSwgY29udGVudDIpLnRvUHJvbWlzZSgpKVxuICAgICAgLnRoZW4oKCkgPT4gaG9zdC5kZWxldGUobm9ybWFsaXplKCcvc3ViMS9maWxlMScpKS50b1Byb21pc2UoKSlcbiAgICAgIC50aGVuKCgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSkpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChhbGxFdmVudHMubGVuZ3RoKS50b0JlKDMpO1xuICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCAzMDAwMCk7XG59KTtcblxuXG5kZXNjcmliZSgnTm9kZUpzU3luY0hvc3QnLCAoKSA9PiB7XG4gIGxldCByb290OiBzdHJpbmc7XG4gIGxldCBob3N0OiB2aXJ0dWFsRnMuU3luY0RlbGVnYXRlSG9zdDxmcy5TdGF0cz47XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgcm9vdCA9IHRlbXAubWtkaXJTeW5jKCdjb3JlLW5vZGUtc3BlYy0nKTtcbiAgICBob3N0ID0gbmV3IHZpcnR1YWxGcy5TeW5jRGVsZWdhdGVIb3N0KFxuICAgICAgbmV3IHZpcnR1YWxGcy5TY29wZWRIb3N0KG5ldyBOb2RlSnNTeW5jSG9zdCgpLCBub3JtYWxpemUocm9vdCkpKTtcbiAgfSk7XG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgaG9zdC5kZWxldGUobm9ybWFsaXplKCcvJykpO1xuICB9KTtcblxuICBsaW51eE9ubHlJdCgnY2FuIHdhdGNoJywgZG9uZSA9PiB7XG4gICAgbGV0IG9iczogT2JzZXJ2YWJsZTx2aXJ0dWFsRnMuSG9zdFdhdGNoRXZlbnQ+O1xuICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLnN0cmluZ1RvRmlsZUJ1ZmZlcignaGVsbG8gd29ybGQnKTtcbiAgICBjb25zdCBjb250ZW50MiA9IHZpcnR1YWxGcy5zdHJpbmdUb0ZpbGVCdWZmZXIoJ2hlbGxvIHdvcmxkIDInKTtcbiAgICBjb25zdCBhbGxFdmVudHM6IHZpcnR1YWxGcy5Ib3N0V2F0Y2hFdmVudFtdID0gW107XG5cbiAgICBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgLnRoZW4oKCkgPT4gZnMubWtkaXJTeW5jKHJvb3QgKyAnL3N1YjEnKSlcbiAgICAgIC50aGVuKCgpID0+IGZzLndyaXRlRmlsZVN5bmMocm9vdCArICcvc3ViMS9maWxlMScsICdoZWxsbyB3b3JsZCcpKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBvYnMgPSBob3N0LndhdGNoKG5vcm1hbGl6ZSgnL3N1YjEnKSwgeyByZWN1cnNpdmU6IHRydWUgfSkhO1xuICAgICAgICBleHBlY3Qob2JzKS5ub3QudG9CZU51bGwoKTtcbiAgICAgICAgc3Vic2NyaXB0aW9uID0gb2JzLnN1YnNjcmliZShldmVudCA9PiB7IGFsbEV2ZW50cy5wdXNoKGV2ZW50KTsgfSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMCkpKVxuICAgICAgLy8gRGlzY2FyZCB0aGUgZXZlbnRzIHJlZ2lzdGVyZWQgc28gZmFyLlxuICAgICAgLnRoZW4oKCkgPT4gYWxsRXZlbnRzLnNwbGljZSgwKSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgaG9zdC53cml0ZShub3JtYWxpemUoJy9zdWIxL3N1YjIvZmlsZTMnKSwgY29udGVudCk7XG4gICAgICAgIGhvc3Qud3JpdGUobm9ybWFsaXplKCcvc3ViMS9maWxlMicpLCBjb250ZW50Mik7XG4gICAgICAgIGhvc3QuZGVsZXRlKG5vcm1hbGl6ZSgnL3N1YjEvZmlsZTEnKSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGFsbEV2ZW50cy5sZW5ndGgpLnRvQmUoMyk7XG4gICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0sIDMwMDAwKTtcblxufSk7XG4iXX0=