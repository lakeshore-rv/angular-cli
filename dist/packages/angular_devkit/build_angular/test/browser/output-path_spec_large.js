"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular-devkit/architect/testing");
const core_1 = require("@angular-devkit/core");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
describe('Browser Builder output path', () => {
    const outputPath = core_1.normalize('dist');
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('deletes output path', (done) => {
        // Write a file to the output path to later verify it was deleted.
        utils_1.host.scopedSync().write(core_1.join(outputPath, 'file.txt'), core_1.virtualFs.stringToFileBuffer('file'));
        // Delete an app file to force a failed compilation.
        // Failed compilations still delete files, but don't output any.
        utils_1.host.delete(core_1.join(utils_1.host.root(), 'src', 'app', 'app.component.ts')).subscribe({
            error: done.fail,
        });
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => {
            expect(buildEvent.success).toBe(false);
            expect(utils_1.host.scopedSync().exists(outputPath)).toBe(false);
        })).toPromise().then(done, done.fail);
    });
    it('does not allow output path to be project root', (done) => {
        const overrides = { outputPath: './' };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides)
            .subscribe(undefined, () => done(), done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LXBhdGhfc3BlY19sYXJnZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci90ZXN0L2Jyb3dzZXIvb3V0cHV0LXBhdGhfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUFrRTtBQUNsRSwrQ0FBa0U7QUFDbEUsOENBQXFDO0FBQ3JDLG9DQUFtRDtBQUduRCxRQUFRLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO0lBQzNDLE1BQU0sVUFBVSxHQUFHLGdCQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFckMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEUsRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDakMsa0VBQWtFO1FBQ2xFLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxnQkFBUyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUYsb0RBQW9EO1FBQ3BELGdFQUFnRTtRQUNoRSxZQUFJLENBQUMsTUFBTSxDQUFDLFdBQUksQ0FBQyxZQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3pFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNqQixDQUFDLENBQUM7UUFFSCx1QkFBYSxDQUFDLFlBQUksRUFBRSx5QkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FDekMsZUFBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDakIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQ0gsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzNELE1BQU0sU0FBUyxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO1FBRXZDLHVCQUFhLENBQUMsWUFBSSxFQUFFLHlCQUFpQixFQUFFLFNBQVMsQ0FBQzthQUM5QyxTQUFTLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBydW5UYXJnZXRTcGVjIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdC90ZXN0aW5nJztcbmltcG9ydCB7IGpvaW4sIG5vcm1hbGl6ZSwgdmlydHVhbEZzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgYnJvd3NlclRhcmdldFNwZWMsIGhvc3QgfSBmcm9tICcuLi91dGlscyc7XG5cblxuZGVzY3JpYmUoJ0Jyb3dzZXIgQnVpbGRlciBvdXRwdXQgcGF0aCcsICgpID0+IHtcbiAgY29uc3Qgb3V0cHV0UGF0aCA9IG5vcm1hbGl6ZSgnZGlzdCcpO1xuXG4gIGJlZm9yZUVhY2goZG9uZSA9PiBob3N0LmluaXRpYWxpemUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuICBhZnRlckVhY2goZG9uZSA9PiBob3N0LnJlc3RvcmUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuXG4gIGl0KCdkZWxldGVzIG91dHB1dCBwYXRoJywgKGRvbmUpID0+IHtcbiAgICAvLyBXcml0ZSBhIGZpbGUgdG8gdGhlIG91dHB1dCBwYXRoIHRvIGxhdGVyIHZlcmlmeSBpdCB3YXMgZGVsZXRlZC5cbiAgICBob3N0LnNjb3BlZFN5bmMoKS53cml0ZShqb2luKG91dHB1dFBhdGgsICdmaWxlLnR4dCcpLCB2aXJ0dWFsRnMuc3RyaW5nVG9GaWxlQnVmZmVyKCdmaWxlJykpO1xuICAgIC8vIERlbGV0ZSBhbiBhcHAgZmlsZSB0byBmb3JjZSBhIGZhaWxlZCBjb21waWxhdGlvbi5cbiAgICAvLyBGYWlsZWQgY29tcGlsYXRpb25zIHN0aWxsIGRlbGV0ZSBmaWxlcywgYnV0IGRvbid0IG91dHB1dCBhbnkuXG4gICAgaG9zdC5kZWxldGUoam9pbihob3N0LnJvb3QoKSwgJ3NyYycsICdhcHAnLCAnYXBwLmNvbXBvbmVudC50cycpKS5zdWJzY3JpYmUoe1xuICAgICAgZXJyb3I6IGRvbmUuZmFpbCxcbiAgICB9KTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IHtcbiAgICAgICAgZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZShmYWxzZSk7XG4gICAgICAgIGV4cGVjdChob3N0LnNjb3BlZFN5bmMoKS5leGlzdHMob3V0cHV0UGF0aCkpLnRvQmUoZmFsc2UpO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCdkb2VzIG5vdCBhbGxvdyBvdXRwdXQgcGF0aCB0byBiZSBwcm9qZWN0IHJvb3QnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgb3V0cHV0UGF0aDogJy4vJyB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKVxuICAgICAgLnN1YnNjcmliZSh1bmRlZmluZWQsICgpID0+IGRvbmUoKSwgZG9uZS5mYWlsKTtcbiAgfSk7XG59KTtcbiJdfQ==