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
// Karma watch mode is currently bugged:
// - errors print a huge stack trace
// - karma does not have a way to close the server gracefully.
// TODO: fix these before 6.0 final.
xdescribe('Karma Builder watch mode', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        const overrides = { watch: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.karmaTargetSpec, overrides).pipe(operators_1.debounceTime(500), operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.take(1)).toPromise().then(done, done.fail);
    }, 30000);
    it('recovers from compilation failures in watch mode', (done) => {
        const overrides = { watch: true };
        let buildNumber = 0;
        testing_1.runTargetSpec(utils_1.host, utils_1.karmaTargetSpec, overrides).pipe(operators_1.debounceTime(500), operators_1.tap((buildEvent) => {
            buildNumber += 1;
            switch (buildNumber) {
                case 1:
                    // Karma run should succeed.
                    // Add a compilation error.
                    expect(buildEvent.success).toBe(true);
                    utils_1.host.writeMultipleFiles({
                        'src/app/app.component.spec.ts': '<p> definitely not typescript </p>',
                    });
                    break;
                case 2:
                    // Karma run should fail due to compilation error. Fix it.
                    expect(buildEvent.success).toBe(false);
                    utils_1.host.writeMultipleFiles({ 'src/foo.spec.ts': '' });
                    break;
                case 3:
                    // Karma run should succeed again.
                    expect(buildEvent.success).toBe(true);
                    break;
                default:
                    break;
            }
        }), operators_1.take(3)).toPromise().then(done, done.fail);
    }, 30000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVidWlsZHNfc3BlY19sYXJnZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci90ZXN0L2thcm1hL3JlYnVpbGRzX3NwZWNfbGFyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrREFBa0U7QUFDbEUsOENBQXlEO0FBQ3pELG9DQUFpRDtBQUdqRCx3Q0FBd0M7QUFDeEMsb0NBQW9DO0FBQ3BDLDhEQUE4RDtBQUM5RCxvQ0FBb0M7QUFDcEMsU0FBUyxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RSxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVwRSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDbkIsTUFBTSxTQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDbEMsdUJBQWEsQ0FBQyxZQUFJLEVBQUUsdUJBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQ2xELHdCQUFZLENBQUMsR0FBRyxDQUFDLEVBQ2pCLGVBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFDMUQsZ0JBQUksQ0FBQyxDQUFDLENBQUMsQ0FDUixDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVWLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzlELE1BQU0sU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2xDLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztRQUVwQix1QkFBYSxDQUFDLFlBQUksRUFBRSx1QkFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FDbEQsd0JBQVksQ0FBQyxHQUFHLENBQUMsRUFDakIsZUFBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDakIsV0FBVyxJQUFJLENBQUMsQ0FBQztZQUNqQixRQUFRLFdBQVcsRUFBRTtnQkFDbkIsS0FBSyxDQUFDO29CQUNKLDRCQUE0QjtvQkFDNUIsMkJBQTJCO29CQUMzQixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdEMsWUFBSSxDQUFDLGtCQUFrQixDQUFDO3dCQUN0QiwrQkFBK0IsRUFBRSxvQ0FBb0M7cUJBQ3RFLENBQUMsQ0FBQztvQkFDSCxNQUFNO2dCQUVSLEtBQUssQ0FBQztvQkFDSiwwREFBMEQ7b0JBQzFELE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN2QyxZQUFJLENBQUMsa0JBQWtCLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNuRCxNQUFNO2dCQUVSLEtBQUssQ0FBQztvQkFDSixrQ0FBa0M7b0JBQ2xDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN0QyxNQUFNO2dCQUVSO29CQUNFLE1BQU07YUFDVDtRQUNILENBQUMsQ0FBQyxFQUNGLGdCQUFJLENBQUMsQ0FBQyxDQUFDLENBQ1IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDWixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgcnVuVGFyZ2V0U3BlYyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QvdGVzdGluZyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIHRha2UsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGhvc3QsIGthcm1hVGFyZ2V0U3BlYyB9IGZyb20gJy4uL3V0aWxzJztcblxuXG4vLyBLYXJtYSB3YXRjaCBtb2RlIGlzIGN1cnJlbnRseSBidWdnZWQ6XG4vLyAtIGVycm9ycyBwcmludCBhIGh1Z2Ugc3RhY2sgdHJhY2Vcbi8vIC0ga2FybWEgZG9lcyBub3QgaGF2ZSBhIHdheSB0byBjbG9zZSB0aGUgc2VydmVyIGdyYWNlZnVsbHkuXG4vLyBUT0RPOiBmaXggdGhlc2UgYmVmb3JlIDYuMCBmaW5hbC5cbnhkZXNjcmliZSgnS2FybWEgQnVpbGRlciB3YXRjaCBtb2RlJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBpdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgd2F0Y2g6IHRydWUgfTtcbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGthcm1hVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDUwMCksXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFrZSgxKSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSwgMzAwMDApO1xuXG4gIGl0KCdyZWNvdmVycyBmcm9tIGNvbXBpbGF0aW9uIGZhaWx1cmVzIGluIHdhdGNoIG1vZGUnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgd2F0Y2g6IHRydWUgfTtcbiAgICBsZXQgYnVpbGROdW1iZXIgPSAwO1xuXG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBrYXJtYVRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSg1MDApLFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiB7XG4gICAgICAgIGJ1aWxkTnVtYmVyICs9IDE7XG4gICAgICAgIHN3aXRjaCAoYnVpbGROdW1iZXIpIHtcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAvLyBLYXJtYSBydW4gc2hvdWxkIHN1Y2NlZWQuXG4gICAgICAgICAgICAvLyBBZGQgYSBjb21waWxhdGlvbiBlcnJvci5cbiAgICAgICAgICAgIGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAgICAgICAgICdzcmMvYXBwL2FwcC5jb21wb25lbnQuc3BlYy50cyc6ICc8cD4gZGVmaW5pdGVseSBub3QgdHlwZXNjcmlwdCA8L3A+JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAvLyBLYXJtYSBydW4gc2hvdWxkIGZhaWwgZHVlIHRvIGNvbXBpbGF0aW9uIGVycm9yLiBGaXggaXQuXG4gICAgICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKGZhbHNlKTtcbiAgICAgICAgICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHsgJ3NyYy9mb28uc3BlYy50cyc6ICcnIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAvLyBLYXJtYSBydW4gc2hvdWxkIHN1Y2NlZWQgYWdhaW4uXG4gICAgICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGFrZSgzKSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSwgMzAwMDApO1xufSk7XG4iXX0=