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
describe('Browser Builder tsconfig paths', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        utils_1.host.replaceInFile('src/app/app.module.ts', './app.component', '@root/app/app.component');
        utils_1.host.replaceInFile('tsconfig.json', /"baseUrl": ".\/",/, `
      "baseUrl": "./",
      "paths": {
        "@root/*": [
          "./src/*"
        ]
      },
    `);
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    });
    it('works', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/meaning-too.ts': 'export var meaning = 42;',
            'src/app/shared/meaning.ts': 'export var meaning = 42;',
            'src/app/shared/index.ts': `export * from './meaning'`,
        });
        utils_1.host.replaceInFile('tsconfig.json', /"baseUrl": ".\/",/, `
      "baseUrl": "./",
      "paths": {
        "@shared": [
          "src/app/shared"
        ],
        "@shared/*": [
          "src/app/shared/*"
        ],
        "*": [
          "*",
          "src/app/shared/*"
        ]
      },
    `);
        utils_1.host.appendToFile('src/app/app.component.ts', `
      import { meaning } from 'src/app/shared/meaning';
      import { meaning as meaning2 } from '@shared';
      import { meaning as meaning3 } from '@shared/meaning';
      import { meaning as meaning4 } from 'meaning';
      import { meaning as meaning5 } from 'src/meaning-too';

      // need to use imports otherwise they are ignored and
      // no error is outputted, even if baseUrl/paths don't work
      console.log(meaning)
      console.log(meaning2)
      console.log(meaning3)
      console.log(meaning4)
      console.log(meaning5)
    `);
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNjb25maWctcGF0aHNfc3BlY19sYXJnZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci90ZXN0L2Jyb3dzZXIvdHNjb25maWctcGF0aHNfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUFrRTtBQUNsRSw4Q0FBcUM7QUFDckMsb0NBQW1EO0FBR25ELFFBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7SUFDOUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ25CLFlBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztRQUMxRixZQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsRUFBRTs7Ozs7OztLQU94RCxDQUFDLENBQUM7UUFFSCx1QkFBYSxDQUFDLFlBQUksRUFBRSx5QkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FDekMsZUFBRyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUMzRCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ25CLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQztZQUN0QixvQkFBb0IsRUFBRSwwQkFBMEI7WUFDaEQsMkJBQTJCLEVBQUUsMEJBQTBCO1lBQ3ZELHlCQUF5QixFQUFFLDJCQUEyQjtTQUN2RCxDQUFDLENBQUM7UUFDSCxZQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxtQkFBbUIsRUFBRTs7Ozs7Ozs7Ozs7Ozs7S0FjeEQsQ0FBQyxDQUFDO1FBQ0gsWUFBSSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsRUFBRTs7Ozs7Ozs7Ozs7Ozs7S0FjN0MsQ0FBQyxDQUFDO1FBRUgsdUJBQWEsQ0FBQyxZQUFJLEVBQUUseUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQ3pDLGVBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDM0QsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBydW5UYXJnZXRTcGVjIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdC90ZXN0aW5nJztcbmltcG9ydCB7IHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGJyb3dzZXJUYXJnZXRTcGVjLCBob3N0IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5cbmRlc2NyaWJlKCdCcm93c2VyIEJ1aWxkZXIgdHNjb25maWcgcGF0aHMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goZG9uZSA9PiBob3N0LmluaXRpYWxpemUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuICBhZnRlckVhY2goZG9uZSA9PiBob3N0LnJlc3RvcmUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuXG4gIGl0KCd3b3JrcycsIChkb25lKSA9PiB7XG4gICAgaG9zdC5yZXBsYWNlSW5GaWxlKCdzcmMvYXBwL2FwcC5tb2R1bGUudHMnLCAnLi9hcHAuY29tcG9uZW50JywgJ0Byb290L2FwcC9hcHAuY29tcG9uZW50Jyk7XG4gICAgaG9zdC5yZXBsYWNlSW5GaWxlKCd0c2NvbmZpZy5qc29uJywgL1wiYmFzZVVybFwiOiBcIi5cXC9cIiwvLCBgXG4gICAgICBcImJhc2VVcmxcIjogXCIuL1wiLFxuICAgICAgXCJwYXRoc1wiOiB7XG4gICAgICAgIFwiQHJvb3QvKlwiOiBbXG4gICAgICAgICAgXCIuL3NyYy8qXCJcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICBgKTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvbWVhbmluZy10b28udHMnOiAnZXhwb3J0IHZhciBtZWFuaW5nID0gNDI7JyxcbiAgICAgICdzcmMvYXBwL3NoYXJlZC9tZWFuaW5nLnRzJzogJ2V4cG9ydCB2YXIgbWVhbmluZyA9IDQyOycsXG4gICAgICAnc3JjL2FwcC9zaGFyZWQvaW5kZXgudHMnOiBgZXhwb3J0ICogZnJvbSAnLi9tZWFuaW5nJ2AsXG4gICAgfSk7XG4gICAgaG9zdC5yZXBsYWNlSW5GaWxlKCd0c2NvbmZpZy5qc29uJywgL1wiYmFzZVVybFwiOiBcIi5cXC9cIiwvLCBgXG4gICAgICBcImJhc2VVcmxcIjogXCIuL1wiLFxuICAgICAgXCJwYXRoc1wiOiB7XG4gICAgICAgIFwiQHNoYXJlZFwiOiBbXG4gICAgICAgICAgXCJzcmMvYXBwL3NoYXJlZFwiXG4gICAgICAgIF0sXG4gICAgICAgIFwiQHNoYXJlZC8qXCI6IFtcbiAgICAgICAgICBcInNyYy9hcHAvc2hhcmVkLypcIlxuICAgICAgICBdLFxuICAgICAgICBcIipcIjogW1xuICAgICAgICAgIFwiKlwiLFxuICAgICAgICAgIFwic3JjL2FwcC9zaGFyZWQvKlwiXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgYCk7XG4gICAgaG9zdC5hcHBlbmRUb0ZpbGUoJ3NyYy9hcHAvYXBwLmNvbXBvbmVudC50cycsIGBcbiAgICAgIGltcG9ydCB7IG1lYW5pbmcgfSBmcm9tICdzcmMvYXBwL3NoYXJlZC9tZWFuaW5nJztcbiAgICAgIGltcG9ydCB7IG1lYW5pbmcgYXMgbWVhbmluZzIgfSBmcm9tICdAc2hhcmVkJztcbiAgICAgIGltcG9ydCB7IG1lYW5pbmcgYXMgbWVhbmluZzMgfSBmcm9tICdAc2hhcmVkL21lYW5pbmcnO1xuICAgICAgaW1wb3J0IHsgbWVhbmluZyBhcyBtZWFuaW5nNCB9IGZyb20gJ21lYW5pbmcnO1xuICAgICAgaW1wb3J0IHsgbWVhbmluZyBhcyBtZWFuaW5nNSB9IGZyb20gJ3NyYy9tZWFuaW5nLXRvbyc7XG5cbiAgICAgIC8vIG5lZWQgdG8gdXNlIGltcG9ydHMgb3RoZXJ3aXNlIHRoZXkgYXJlIGlnbm9yZWQgYW5kXG4gICAgICAvLyBubyBlcnJvciBpcyBvdXRwdXR0ZWQsIGV2ZW4gaWYgYmFzZVVybC9wYXRocyBkb24ndCB3b3JrXG4gICAgICBjb25zb2xlLmxvZyhtZWFuaW5nKVxuICAgICAgY29uc29sZS5sb2cobWVhbmluZzIpXG4gICAgICBjb25zb2xlLmxvZyhtZWFuaW5nMylcbiAgICAgIGNvbnNvbGUubG9nKG1lYW5pbmc0KVxuICAgICAgY29uc29sZS5sb2cobWVhbmluZzUpXG4gICAgYCk7XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjKS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG59KTtcbiJdfQ==