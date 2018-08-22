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
const node_1 = require("@angular-devkit/core/node");
const tools_1 = require("@angular-devkit/schematics/tools");
const path = require("path");
describe('NodeWorkflow', () => {
    // TODO: this test seems to either not work on windows or on linux.
    xit('works', done => {
        const workflow = new tools_1.NodeWorkflow(new node_1.NodeJsSyncHost(), { dryRun: true });
        const collection = path.join(__dirname, '../../../../schematics/angular/package.json');
        workflow.execute({
            collection,
            schematic: 'ng-new',
            options: { name: 'workflow-test', version: '6.0.0-rc.4' },
        }).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS13b3JrZmxvd19zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3Rvb2xzL3dvcmtmbG93L25vZGUtd29ya2Zsb3dfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDBDQUEwQztBQUMxQyxvREFBMkQ7QUFDM0QsNERBQWdFO0FBQ2hFLDZCQUE2QjtBQUc3QixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixtRUFBbUU7SUFDbkUsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRTtRQUNsQixNQUFNLFFBQVEsR0FBRyxJQUFJLG9CQUFZLENBQUMsSUFBSSxxQkFBYyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFDO1FBRXZGLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDZixVQUFVO1lBQ1YsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFO1NBQzFELENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBOb2RlSnNTeW5jSG9zdCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL25vZGUnO1xuaW1wb3J0IHsgTm9kZVdvcmtmbG93IH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdG9vbHMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxuXG5kZXNjcmliZSgnTm9kZVdvcmtmbG93JywgKCkgPT4ge1xuICAvLyBUT0RPOiB0aGlzIHRlc3Qgc2VlbXMgdG8gZWl0aGVyIG5vdCB3b3JrIG9uIHdpbmRvd3Mgb3Igb24gbGludXguXG4gIHhpdCgnd29ya3MnLCBkb25lID0+IHtcbiAgICBjb25zdCB3b3JrZmxvdyA9IG5ldyBOb2RlV29ya2Zsb3cobmV3IE5vZGVKc1N5bmNIb3N0KCksIHsgZHJ5UnVuOiB0cnVlIH0pO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vLi4vc2NoZW1hdGljcy9hbmd1bGFyL3BhY2thZ2UuanNvbicpO1xuXG4gICAgd29ya2Zsb3cuZXhlY3V0ZSh7XG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgc2NoZW1hdGljOiAnbmctbmV3JyxcbiAgICAgIG9wdGlvbnM6IHsgbmFtZTogJ3dvcmtmbG93LXRlc3QnLCB2ZXJzaW9uOiAnNi4wLjAtcmMuNCcgfSxcbiAgICB9KS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xufSk7XG4iXX0=