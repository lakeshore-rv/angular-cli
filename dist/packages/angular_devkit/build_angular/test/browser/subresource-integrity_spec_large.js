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
describe('Browser Builder subresource integrity', () => {
    const outputPath = core_1.normalize('dist');
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/my-js-file.js': `console.log(1); export const a = 2;`,
            'src/main.ts': `import { a } from './my-js-file'; console.log(a);`,
        });
        const overrides = { subresourceIntegrity: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = core_1.join(outputPath, 'index.html');
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(fileName));
            expect(content).toMatch(/integrity="\w+-[A-Za-z0-9\/\+=]+"/);
        })).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VicmVzb3VyY2UtaW50ZWdyaXR5X3NwZWNfbGFyZ2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC9icm93c2VyL3N1YnJlc291cmNlLWludGVncml0eV9zcGVjX2xhcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0RBQWtFO0FBQ2xFLCtDQUFrRTtBQUNsRSw4Q0FBcUM7QUFDckMsb0NBQW1EO0FBR25ELFFBQVEsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7SUFDckQsTUFBTSxVQUFVLEdBQUcsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVyQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwRSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDbkIsWUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQ3RCLG1CQUFtQixFQUFFLHFDQUFxQztZQUMxRCxhQUFhLEVBQUUsbURBQW1EO1NBQ25FLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFakQsdUJBQWEsQ0FBQyxZQUFJLEVBQUUseUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUNwRCxlQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQzFELGVBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDUCxNQUFNLFFBQVEsR0FBRyxXQUFJLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2hELE1BQU0sT0FBTyxHQUFHLGdCQUFTLENBQUMsa0JBQWtCLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9FLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FDSCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IHJ1blRhcmdldFNwZWMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHsgam9pbiwgbm9ybWFsaXplLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBicm93c2VyVGFyZ2V0U3BlYywgaG9zdCB9IGZyb20gJy4uL3V0aWxzJztcblxuXG5kZXNjcmliZSgnQnJvd3NlciBCdWlsZGVyIHN1YnJlc291cmNlIGludGVncml0eScsICgpID0+IHtcbiAgY29uc3Qgb3V0cHV0UGF0aCA9IG5vcm1hbGl6ZSgnZGlzdCcpO1xuXG4gIGJlZm9yZUVhY2goZG9uZSA9PiBob3N0LmluaXRpYWxpemUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuICBhZnRlckVhY2goZG9uZSA9PiBob3N0LnJlc3RvcmUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuXG4gIGl0KCd3b3JrcycsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgJ3NyYy9teS1qcy1maWxlLmpzJzogYGNvbnNvbGUubG9nKDEpOyBleHBvcnQgY29uc3QgYSA9IDI7YCxcbiAgICAgICdzcmMvbWFpbi50cyc6IGBpbXBvcnQgeyBhIH0gZnJvbSAnLi9teS1qcy1maWxlJzsgY29uc29sZS5sb2coYSk7YCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgc3VicmVzb3VyY2VJbnRlZ3JpdHk6IHRydWUgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGpvaW4ob3V0cHV0UGF0aCwgJ2luZGV4Lmh0bWwnKTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChmaWxlTmFtZSkpO1xuICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvaW50ZWdyaXR5PVwiXFx3Ky1bQS1aYS16MC05XFwvXFwrPV0rXCIvKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcbn0pO1xuIl19