"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const operators_1 = require("rxjs/operators");
describe('@schematics/update:migrate', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/update', __dirname + '/../collection.json');
    let host;
    let appTree = new testing_1.UnitTestTree(new schematics_1.HostTree());
    beforeEach(() => {
        host = new core_1.virtualFs.test.TestHost({});
        appTree = new testing_1.UnitTestTree(new schematics_1.HostTree(host));
    });
    it('sorts and understand RC', done => {
        // Since we cannot run tasks in unit tests, we need to validate that the default
        // update schematic updates the package.json appropriately, AND validate that the
        // migrate schematic actually do work appropriately, in a separate test.
        schematicRunner.runSchematicAsync('migrate', {
            package: 'test',
            collection: __dirname + '/test/migration.json',
            from: '1.0.0',
            to: '2.0.0',
        }, appTree).pipe(operators_1.map(tree => {
            const resultJson = JSON.parse(tree.readContent('/migrations'));
            expect(resultJson).toEqual([
                'migration-03',
                'migration-05',
                'migration-04',
                'migration-02',
                'migration-13',
                'migration-19',
                'migration-06',
                'migration-17',
                'migration-16',
                'migration-08',
                'migration-07',
                'migration-12',
                'migration-14',
                'migration-20',
            ]);
        })).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy91cGRhdGUvbWlncmF0ZS9pbmRleF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQWlEO0FBQ2pELDJEQUFzRDtBQUN0RCxnRUFBdUY7QUFDdkYsOENBQXFDO0FBR3JDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7SUFDMUMsTUFBTSxlQUFlLEdBQUcsSUFBSSw2QkFBbUIsQ0FDN0Msb0JBQW9CLEVBQUUsU0FBUyxHQUFHLHFCQUFxQixDQUN4RCxDQUFDO0lBQ0YsSUFBSSxJQUE2QixDQUFDO0lBQ2xDLElBQUksT0FBTyxHQUFpQixJQUFJLHNCQUFZLENBQUMsSUFBSSxxQkFBUSxFQUFFLENBQUMsQ0FBQztJQUU3RCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsSUFBSSxHQUFHLElBQUksZ0JBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sR0FBRyxJQUFJLHNCQUFZLENBQUMsSUFBSSxxQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDbkMsZ0ZBQWdGO1FBQ2hGLGlGQUFpRjtRQUNqRix3RUFBd0U7UUFDeEUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRTtZQUMzQyxPQUFPLEVBQUUsTUFBTTtZQUNmLFVBQVUsRUFBRSxTQUFTLEdBQUcsc0JBQXNCO1lBQzlDLElBQUksRUFBRSxPQUFPO1lBQ2IsRUFBRSxFQUFFLE9BQU87U0FDWixFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDZCxlQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDVCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUUvRCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN6QixjQUFjO2dCQUNkLGNBQWM7Z0JBQ2QsY0FBYztnQkFDZCxjQUFjO2dCQUNkLGNBQWM7Z0JBQ2QsY0FBYztnQkFDZCxjQUFjO2dCQUNkLGNBQWM7Z0JBQ2QsY0FBYztnQkFDZCxjQUFjO2dCQUNkLGNBQWM7Z0JBQ2QsY0FBYztnQkFDZCxjQUFjO2dCQUNkLGNBQWM7YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FDSCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBIb3N0VHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7IFNjaGVtYXRpY1Rlc3RSdW5uZXIsIFVuaXRUZXN0VHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rlc3RpbmcnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5cbmRlc2NyaWJlKCdAc2NoZW1hdGljcy91cGRhdGU6bWlncmF0ZScsICgpID0+IHtcbiAgY29uc3Qgc2NoZW1hdGljUnVubmVyID0gbmV3IFNjaGVtYXRpY1Rlc3RSdW5uZXIoXG4gICAgJ0BzY2hlbWF0aWNzL3VwZGF0ZScsIF9fZGlybmFtZSArICcvLi4vY29sbGVjdGlvbi5qc29uJyxcbiAgKTtcbiAgbGV0IGhvc3Q6IHZpcnR1YWxGcy50ZXN0LlRlc3RIb3N0O1xuICBsZXQgYXBwVHJlZTogVW5pdFRlc3RUcmVlID0gbmV3IFVuaXRUZXN0VHJlZShuZXcgSG9zdFRyZWUoKSk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgaG9zdCA9IG5ldyB2aXJ0dWFsRnMudGVzdC5UZXN0SG9zdCh7fSk7XG4gICAgYXBwVHJlZSA9IG5ldyBVbml0VGVzdFRyZWUobmV3IEhvc3RUcmVlKGhvc3QpKTtcbiAgfSk7XG5cbiAgaXQoJ3NvcnRzIGFuZCB1bmRlcnN0YW5kIFJDJywgZG9uZSA9PiB7XG4gICAgLy8gU2luY2Ugd2UgY2Fubm90IHJ1biB0YXNrcyBpbiB1bml0IHRlc3RzLCB3ZSBuZWVkIHRvIHZhbGlkYXRlIHRoYXQgdGhlIGRlZmF1bHRcbiAgICAvLyB1cGRhdGUgc2NoZW1hdGljIHVwZGF0ZXMgdGhlIHBhY2thZ2UuanNvbiBhcHByb3ByaWF0ZWx5LCBBTkQgdmFsaWRhdGUgdGhhdCB0aGVcbiAgICAvLyBtaWdyYXRlIHNjaGVtYXRpYyBhY3R1YWxseSBkbyB3b3JrIGFwcHJvcHJpYXRlbHksIGluIGEgc2VwYXJhdGUgdGVzdC5cbiAgICBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljQXN5bmMoJ21pZ3JhdGUnLCB7XG4gICAgICBwYWNrYWdlOiAndGVzdCcsXG4gICAgICBjb2xsZWN0aW9uOiBfX2Rpcm5hbWUgKyAnL3Rlc3QvbWlncmF0aW9uLmpzb24nLFxuICAgICAgZnJvbTogJzEuMC4wJyxcbiAgICAgIHRvOiAnMi4wLjAnLFxuICAgIH0sIGFwcFRyZWUpLnBpcGUoXG4gICAgICBtYXAodHJlZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdEpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoJy9taWdyYXRpb25zJykpO1xuXG4gICAgICAgIGV4cGVjdChyZXN1bHRKc29uKS50b0VxdWFsKFtcbiAgICAgICAgICAnbWlncmF0aW9uLTAzJywgLy8gXCIxLjAuNVwiXG4gICAgICAgICAgJ21pZ3JhdGlvbi0wNScsIC8vIFwiMS4xLjAtYmV0YS4wXCJcbiAgICAgICAgICAnbWlncmF0aW9uLTA0JywgLy8gXCIxLjEuMC1iZXRhLjFcIlxuICAgICAgICAgICdtaWdyYXRpb24tMDInLCAvLyBcIjEuMS4wXCJcbiAgICAgICAgICAnbWlncmF0aW9uLTEzJywgLy8gXCIxLjEuMFwiXG4gICAgICAgICAgJ21pZ3JhdGlvbi0xOScsIC8vIFwiMS4xXCJcbiAgICAgICAgICAnbWlncmF0aW9uLTA2JywgLy8gXCIxLjQuMFwiXG4gICAgICAgICAgJ21pZ3JhdGlvbi0xNycsIC8vIFwiMi4wLjAtYWxwaGFcIlxuICAgICAgICAgICdtaWdyYXRpb24tMTYnLCAvLyBcIjIuMC4wLWFscGhhLjVcIlxuICAgICAgICAgICdtaWdyYXRpb24tMDgnLCAvLyBcIjIuMC4wLWJldGEuMFwiXG4gICAgICAgICAgJ21pZ3JhdGlvbi0wNycsIC8vIFwiMi4wLjAtcmMuMFwiXG4gICAgICAgICAgJ21pZ3JhdGlvbi0xMicsIC8vIFwiMi4wLjAtcmMuNFwiXG4gICAgICAgICAgJ21pZ3JhdGlvbi0xNCcsIC8vIFwiMi4wLjBcIlxuICAgICAgICAgICdtaWdyYXRpb24tMjAnLCAvLyBcIjJcIlxuICAgICAgICBdKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcbn0pO1xuIl19