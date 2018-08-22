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
describe('Browser Builder poll', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        const overrides = { watch: true, poll: 1000 };
        let msAvg = 1000;
        let lastTime;
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(
        // Debounce 1s, otherwise changes are too close together and polling doesn't work.
        operators_1.debounceTime(1000), operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const currTime = Date.now();
            if (lastTime) {
                const ms = Math.floor((currTime - lastTime));
                msAvg = (msAvg + ms) / 2;
            }
            lastTime = currTime;
            utils_1.host.appendToFile('src/main.ts', 'console.log(1);');
        }), operators_1.take(5)).subscribe(undefined, done.fail, () => {
            // Check if the average is between 1750 and 2750, allowing for a 1000ms variance.
            expect(msAvg).toBeGreaterThan(1750);
            expect(msAvg).toBeLessThan(2750);
            done();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbF9zcGVjX2xhcmdlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9hbmd1bGFyL3Rlc3QvYnJvd3Nlci9wb2xsX3NwZWNfbGFyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrREFBa0U7QUFDbEUsOENBQXlEO0FBQ3pELG9DQUFtRDtBQUduRCxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNuQixNQUFNLFNBQVMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLFFBQWdCLENBQUM7UUFDckIsdUJBQWEsQ0FBQyxZQUFJLEVBQUUseUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSTtRQUNwRCxrRkFBa0Y7UUFDbEYsd0JBQVksQ0FBQyxJQUFJLENBQUMsRUFDbEIsZUFBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUMxRCxlQUFHLENBQUMsR0FBRyxFQUFFO1lBQ1AsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzVCLElBQUksUUFBUSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMxQjtZQUNELFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDcEIsWUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsRUFDRixnQkFBSSxDQUFDLENBQUMsQ0FBQyxDQUNSLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUNyQyxpRkFBaUY7WUFDakYsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBydW5UYXJnZXRTcGVjIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdC90ZXN0aW5nJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgdGFrZSwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgYnJvd3NlclRhcmdldFNwZWMsIGhvc3QgfSBmcm9tICcuLi91dGlscyc7XG5cblxuZGVzY3JpYmUoJ0Jyb3dzZXIgQnVpbGRlciBwb2xsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBpdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHsgd2F0Y2g6IHRydWUsIHBvbGw6IDEwMDAgfTtcbiAgICBsZXQgbXNBdmcgPSAxMDAwO1xuICAgIGxldCBsYXN0VGltZTogbnVtYmVyO1xuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIC8vIERlYm91bmNlIDFzLCBvdGhlcndpc2UgY2hhbmdlcyBhcmUgdG9vIGNsb3NlIHRvZ2V0aGVyIGFuZCBwb2xsaW5nIGRvZXNuJ3Qgd29yay5cbiAgICAgIGRlYm91bmNlVGltZSgxMDAwKSxcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIGlmIChsYXN0VGltZSkge1xuICAgICAgICAgIGNvbnN0IG1zID0gTWF0aC5mbG9vcigoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICAgIG1zQXZnID0gKG1zQXZnICsgbXMpIC8gMjtcbiAgICAgICAgfVxuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lO1xuICAgICAgICBob3N0LmFwcGVuZFRvRmlsZSgnc3JjL21haW4udHMnLCAnY29uc29sZS5sb2coMSk7Jyk7XG4gICAgICB9KSxcbiAgICAgIHRha2UoNSksXG4gICAgKS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwsICgpID0+IHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBhdmVyYWdlIGlzIGJldHdlZW4gMTc1MCBhbmQgMjc1MCwgYWxsb3dpbmcgZm9yIGEgMTAwMG1zIHZhcmlhbmNlLlxuICAgICAgZXhwZWN0KG1zQXZnKS50b0JlR3JlYXRlclRoYW4oMTc1MCk7XG4gICAgICBleHBlY3QobXNBdmcpLnRvQmVMZXNzVGhhbigyNzUwKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==