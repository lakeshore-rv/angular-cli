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
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
describe('Browser Builder allow js', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/my-js-file.js': `console.log(1); export const a = 2;`,
            'src/main.ts': `import { a } from './my-js-file'; console.log(a);`,
        });
        // TODO: this test originally edited tsconfig to have `"allowJs": true` but works without it.
        // Investigate.
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    });
    it('works with aot', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/my-js-file.js': `console.log(1); export const a = 2;`,
            'src/main.ts': `import { a } from './my-js-file'; console.log(a);`,
        });
        const overrides = { aot: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb3ctanNfc3BlY19sYXJnZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci90ZXN0L2Jyb3dzZXIvYWxsb3ctanNfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUFrRTtBQUNsRSw4Q0FBcUM7QUFDckMsb0NBQW1EO0FBR25ELFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ25CLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQztZQUN0QixtQkFBbUIsRUFBRSxxQ0FBcUM7WUFDMUQsYUFBYSxFQUFFLG1EQUFtRDtTQUNuRSxDQUFDLENBQUM7UUFFSCw2RkFBNkY7UUFDN0YsZUFBZTtRQUVmLHVCQUFhLENBQUMsWUFBSSxFQUFFLHlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUN6QyxlQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQzNELENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUM1QixZQUFJLENBQUMsa0JBQWtCLENBQUM7WUFDdEIsbUJBQW1CLEVBQUUscUNBQXFDO1lBQzFELGFBQWEsRUFBRSxtREFBbUQ7U0FDbkUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFaEMsdUJBQWEsQ0FBQyxZQUFJLEVBQUUseUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUNwRCxlQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQzNELENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgcnVuVGFyZ2V0U3BlYyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QvdGVzdGluZyc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBicm93c2VyVGFyZ2V0U3BlYywgaG9zdCB9IGZyb20gJy4uL3V0aWxzJztcblxuXG5kZXNjcmliZSgnQnJvd3NlciBCdWlsZGVyIGFsbG93IGpzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBpdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvbXktanMtZmlsZS5qcyc6IGBjb25zb2xlLmxvZygxKTsgZXhwb3J0IGNvbnN0IGEgPSAyO2AsXG4gICAgICAnc3JjL21haW4udHMnOiBgaW1wb3J0IHsgYSB9IGZyb20gJy4vbXktanMtZmlsZSc7IGNvbnNvbGUubG9nKGEpO2AsXG4gICAgfSk7XG5cbiAgICAvLyBUT0RPOiB0aGlzIHRlc3Qgb3JpZ2luYWxseSBlZGl0ZWQgdHNjb25maWcgdG8gaGF2ZSBgXCJhbGxvd0pzXCI6IHRydWVgIGJ1dCB3b3JrcyB3aXRob3V0IGl0LlxuICAgIC8vIEludmVzdGlnYXRlLlxuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCd3b3JrcyB3aXRoIGFvdCcsIChkb25lKSA9PiB7XG4gICAgaG9zdC53cml0ZU11bHRpcGxlRmlsZXMoe1xuICAgICAgJ3NyYy9teS1qcy1maWxlLmpzJzogYGNvbnNvbGUubG9nKDEpOyBleHBvcnQgY29uc3QgYSA9IDI7YCxcbiAgICAgICdzcmMvbWFpbi50cyc6IGBpbXBvcnQgeyBhIH0gZnJvbSAnLi9teS1qcy1maWxlJzsgY29uc29sZS5sb2coYSk7YCxcbiAgICB9KTtcblxuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgYW90OiB0cnVlIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcbn0pO1xuIl19