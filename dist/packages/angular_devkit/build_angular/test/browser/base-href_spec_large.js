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
describe('Browser Builder base href', () => {
    const outputPath = core_1.normalize('dist');
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/my-js-file.js': `console.log(1); export const a = 2;`,
            'src/main.ts': `import { a } from './my-js-file'; console.log(a);`,
        });
        const overrides = { baseHref: '/myUrl' };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = core_1.join(outputPath, 'index.html');
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(fileName));
            expect(content).toMatch(/<base href="\/myUrl">/);
        })).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1ocmVmX3NwZWNfbGFyZ2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC9icm93c2VyL2Jhc2UtaHJlZl9zcGVjX2xhcmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0RBQWtFO0FBQ2xFLCtDQUFrRTtBQUNsRSw4Q0FBcUM7QUFDckMsb0NBQW1EO0FBR25ELFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7SUFDekMsTUFBTSxVQUFVLEdBQUcsZ0JBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVyQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwRSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDbkIsWUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQ3RCLG1CQUFtQixFQUFFLHFDQUFxQztZQUMxRCxhQUFhLEVBQUUsbURBQW1EO1NBQ25FLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDO1FBRXpDLHVCQUFhLENBQUMsWUFBSSxFQUFFLHlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FDcEQsZUFBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUMxRCxlQUFHLENBQUMsR0FBRyxFQUFFO1lBQ1AsTUFBTSxRQUFRLEdBQUcsV0FBSSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNoRCxNQUFNLE9BQU8sR0FBRyxnQkFBUyxDQUFDLGtCQUFrQixDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMvRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQ0gsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBydW5UYXJnZXRTcGVjIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdC90ZXN0aW5nJztcbmltcG9ydCB7IGpvaW4sIG5vcm1hbGl6ZSwgdmlydHVhbEZzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgYnJvd3NlclRhcmdldFNwZWMsIGhvc3QgfSBmcm9tICcuLi91dGlscyc7XG5cblxuZGVzY3JpYmUoJ0Jyb3dzZXIgQnVpbGRlciBiYXNlIGhyZWYnLCAoKSA9PiB7XG4gIGNvbnN0IG91dHB1dFBhdGggPSBub3JtYWxpemUoJ2Rpc3QnKTtcblxuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBpdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvbXktanMtZmlsZS5qcyc6IGBjb25zb2xlLmxvZygxKTsgZXhwb3J0IGNvbnN0IGEgPSAyO2AsXG4gICAgICAnc3JjL21haW4udHMnOiBgaW1wb3J0IHsgYSB9IGZyb20gJy4vbXktanMtZmlsZSc7IGNvbnNvbGUubG9nKGEpO2AsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7IGJhc2VIcmVmOiAnL215VXJsJyB9O1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gam9pbihvdXRwdXRQYXRoLCAnaW5kZXguaHRtbCcpO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnNjb3BlZFN5bmMoKS5yZWFkKGZpbGVOYW1lKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC88YmFzZSBocmVmPVwiXFwvbXlVcmxcIj4vKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcbn0pO1xuIl19