"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-big-function
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const operators_1 = require("rxjs/operators");
const semver = require("semver");
const index_1 = require("./index");
describe('angularMajorCompatGuarantee', () => {
    [
        '5.0.0',
        '5.1.0',
        '5.20.0',
        '6.0.0',
        '6.0.0-rc.0',
        '6.0.0-beta.0',
        '6.1.0-beta.0',
        '6.1.0-rc.0',
        '6.10.11',
    ].forEach(golden => {
        it('works with ' + JSON.stringify(golden), () => {
            expect(semver.satisfies(golden, index_1.angularMajorCompatGuarantee('^5.0.0'))).toBeTruthy();
        });
    });
});
describe('@schematics/update', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/update', __dirname + '/../collection.json');
    let host;
    let appTree = new testing_1.UnitTestTree(new schematics_1.HostTree());
    beforeEach(() => {
        host = new core_1.virtualFs.test.TestHost({
            '/package.json': `{
        "name": "blah",
        "dependencies": {
          "@angular-devkit-tests/update-base": "1.0.0"
        }
      }`,
        });
        appTree = new testing_1.UnitTestTree(new schematics_1.HostTree(host));
    });
    it('updates package.json', done => {
        // Since we cannot run tasks in unit tests, we need to validate that the default
        // update schematic updates the package.json appropriately, AND validate that the
        // migrate schematic actually do work appropriately, in a separate test.
        schematicRunner.runSchematicAsync('update', { all: true }, appTree).pipe(operators_1.map(tree => {
            const packageJson = JSON.parse(tree.readContent('/package.json'));
            expect(packageJson['dependencies']['@angular-devkit-tests/update-base']).toBe('1.1.0');
            // Check install task.
            expect(schematicRunner.tasks).toEqual([
                {
                    name: 'node-package',
                    options: jasmine.objectContaining({
                        command: 'install',
                    }),
                },
            ]);
        })).toPromise().then(done, done.fail);
    }, 45000);
    it('respects existing tilde and caret ranges', done => {
        // Add ranges.
        const content = core_1.virtualFs.fileBufferToString(host.sync.read(core_1.normalize('/package.json')));
        const packageJson = JSON.parse(content);
        packageJson['dependencies']['@angular-devkit-tests/update-base'] = '^1.0.0';
        packageJson['dependencies']['@angular-devkit-tests/update-migrations'] = '~1.0.0';
        host.sync.write(core_1.normalize('/package.json'), core_1.virtualFs.stringToFileBuffer(JSON.stringify(packageJson)));
        schematicRunner.runSchematicAsync('update', { all: true }, appTree).pipe(operators_1.map(tree => {
            const packageJson = JSON.parse(tree.readContent('/package.json'));
            // This one should not change because 1.1.0 was already satisfied by ^1.0.0.
            expect(packageJson['dependencies']['@angular-devkit-tests/update-base']).toBe('^1.0.0');
            expect(packageJson['dependencies']['@angular-devkit-tests/update-migrations'])
                .toBe('~1.6.0');
        })).toPromise().then(done, done.fail);
    }, 45000);
    it('calls migration tasks', done => {
        // Add the basic migration package.
        const content = core_1.virtualFs.fileBufferToString(host.sync.read(core_1.normalize('/package.json')));
        const packageJson = JSON.parse(content);
        packageJson['dependencies']['@angular-devkit-tests/update-migrations'] = '1.0.0';
        host.sync.write(core_1.normalize('/package.json'), core_1.virtualFs.stringToFileBuffer(JSON.stringify(packageJson)));
        schematicRunner.runSchematicAsync('update', { all: true }, appTree).pipe(operators_1.map(tree => {
            const packageJson = JSON.parse(tree.readContent('/package.json'));
            expect(packageJson['dependencies']['@angular-devkit-tests/update-base']).toBe('1.1.0');
            expect(packageJson['dependencies']['@angular-devkit-tests/update-migrations'])
                .toBe('1.6.0');
            // Check install task.
            expect(schematicRunner.tasks).toEqual([
                {
                    name: 'node-package',
                    options: jasmine.objectContaining({
                        command: 'install',
                    }),
                },
                {
                    name: 'run-schematic',
                    options: jasmine.objectContaining({
                        name: 'migrate',
                    }),
                },
            ]);
        })).toPromise().then(done, done.fail);
    }, 45000);
    it('updates Angular as compatible with Angular N-1', done => {
        // Add the basic migration package.
        const content = core_1.virtualFs.fileBufferToString(host.sync.read(core_1.normalize('/package.json')));
        const packageJson = JSON.parse(content);
        const dependencies = packageJson['dependencies'];
        dependencies['@angular-devkit-tests/update-peer-dependencies-angular-5'] = '1.0.0';
        dependencies['@angular/core'] = '5.1.0';
        dependencies['rxjs'] = '5.5.0';
        dependencies['zone.js'] = '0.8.26';
        host.sync.write(core_1.normalize('/package.json'), core_1.virtualFs.stringToFileBuffer(JSON.stringify(packageJson)));
        schematicRunner.runSchematicAsync('update', {
            packages: ['@angular/core@^6.0.0'],
        }, appTree).pipe(operators_1.map(tree => {
            const packageJson = JSON.parse(tree.readContent('/package.json'));
            expect(packageJson['dependencies']['@angular/core'][0]).toBe('6');
            // Check install task.
            expect(schematicRunner.tasks).toEqual([
                {
                    name: 'node-package',
                    options: jasmine.objectContaining({
                        command: 'install',
                    }),
                },
                {
                    name: 'run-schematic',
                    options: jasmine.objectContaining({
                        name: 'migrate',
                    }),
                },
            ]);
        })).toPromise().then(done, done.fail);
    }, 45000);
    it('updates Angular as compatible with Angular N-1 (2)', done => {
        // Add the basic migration package.
        const content = core_1.virtualFs.fileBufferToString(host.sync.read(core_1.normalize('/package.json')));
        const packageJson = JSON.parse(content);
        const dependencies = packageJson['dependencies'];
        dependencies['@angular-devkit-tests/update-peer-dependencies-angular-5-2'] = '1.0.0';
        dependencies['@angular/core'] = '5.1.0';
        dependencies['@angular/animations'] = '5.1.0';
        dependencies['@angular/common'] = '5.1.0';
        dependencies['@angular/compiler'] = '5.1.0';
        dependencies['@angular/compiler-cli'] = '5.1.0';
        dependencies['@angular/platform-browser'] = '5.1.0';
        dependencies['rxjs'] = '5.5.0';
        dependencies['zone.js'] = '0.8.26';
        dependencies['typescript'] = '2.4.2';
        host.sync.write(core_1.normalize('/package.json'), core_1.virtualFs.stringToFileBuffer(JSON.stringify(packageJson)));
        schematicRunner.runSchematicAsync('update', {
            packages: ['@angular/core@^6.0.0'],
        }, appTree).pipe(operators_1.map(tree => {
            const packageJson = JSON.parse(tree.readContent('/package.json'));
            expect(packageJson['dependencies']['@angular/core'][0]).toBe('6');
            expect(packageJson['dependencies']['rxjs'][0]).toBe('6');
            expect(packageJson['dependencies']['typescript'][0]).toBe('2');
            expect(packageJson['dependencies']['typescript'][2]).not.toBe('4');
            // Check install task.
            expect(schematicRunner.tasks).toEqual([
                {
                    name: 'node-package',
                    options: jasmine.objectContaining({
                        command: 'install',
                    }),
                },
                {
                    name: 'run-schematic',
                    options: jasmine.objectContaining({
                        name: 'migrate',
                    }),
                },
            ]);
        })).toPromise().then(done, done.fail);
    }, 45000);
    it('can migrate only', done => {
        // Add the basic migration package.
        const content = core_1.virtualFs.fileBufferToString(host.sync.read(core_1.normalize('/package.json')));
        const packageJson = JSON.parse(content);
        packageJson['dependencies']['@angular-devkit-tests/update-migrations'] = '1.0.0';
        host.sync.write(core_1.normalize('/package.json'), core_1.virtualFs.stringToFileBuffer(JSON.stringify(packageJson)));
        schematicRunner.runSchematicAsync('update', {
            packages: ['@angular-devkit-tests/update-migrations'],
            migrateOnly: true,
        }, appTree).pipe(operators_1.map(tree => {
            const packageJson = JSON.parse(tree.readContent('/package.json'));
            expect(packageJson['dependencies']['@angular-devkit-tests/update-base']).toBe('1.0.0');
            expect(packageJson['dependencies']['@angular-devkit-tests/update-migrations'])
                .toBe('1.0.0');
            // Check install task.
            expect(schematicRunner.tasks).toEqual([
                {
                    name: 'run-schematic',
                    options: jasmine.objectContaining({
                        name: 'migrate',
                    }),
                },
            ]);
        })).toPromise().then(done, done.fail);
    }, 45000);
    it('can migrate from only', done => {
        // Add the basic migration package.
        const content = core_1.virtualFs.fileBufferToString(host.sync.read(core_1.normalize('/package.json')));
        const packageJson = JSON.parse(content);
        packageJson['dependencies']['@angular-devkit-tests/update-migrations'] = '1.6.0';
        host.sync.write(core_1.normalize('/package.json'), core_1.virtualFs.stringToFileBuffer(JSON.stringify(packageJson)));
        schematicRunner.runSchematicAsync('update', {
            packages: ['@angular-devkit-tests/update-migrations'],
            migrateOnly: true,
            from: '0.1.2',
        }, appTree).pipe(operators_1.map(tree => {
            const packageJson = JSON.parse(tree.readContent('/package.json'));
            expect(packageJson['dependencies']['@angular-devkit-tests/update-migrations'])
                .toBe('1.6.0');
            // Check install task.
            expect(schematicRunner.tasks).toEqual([
                {
                    name: 'run-schematic',
                    options: jasmine.objectContaining({
                        name: 'migrate',
                        options: jasmine.objectContaining({
                            from: '0.1.2',
                            to: '1.6.0',
                        }),
                    }),
                },
            ]);
        })).toPromise().then(done, done.fail);
    }, 45000);
    it('can install and migrate with --from (short version number)', done => {
        // Add the basic migration package.
        const content = core_1.virtualFs.fileBufferToString(host.sync.read(core_1.normalize('/package.json')));
        const packageJson = JSON.parse(content);
        packageJson['dependencies']['@angular-devkit-tests/update-migrations'] = '1.6.0';
        host.sync.write(core_1.normalize('/package.json'), core_1.virtualFs.stringToFileBuffer(JSON.stringify(packageJson)));
        schematicRunner.runSchematicAsync('update', {
            packages: ['@angular-devkit-tests/update-migrations'],
            migrateOnly: true,
            from: '0',
        }, appTree).pipe(operators_1.map(tree => {
            const packageJson = JSON.parse(tree.readContent('/package.json'));
            expect(packageJson['dependencies']['@angular-devkit-tests/update-migrations'])
                .toBe('1.6.0');
            // Check install task.
            expect(schematicRunner.tasks).toEqual([
                {
                    name: 'run-schematic',
                    options: jasmine.objectContaining({
                        name: 'migrate',
                        options: jasmine.objectContaining({
                            from: '0.0.0',
                            to: '1.6.0',
                        }),
                    }),
                },
            ]);
        })).toPromise().then(done, done.fail);
    }, 45000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy91cGRhdGUvdXBkYXRlL2luZGV4X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQzs7QUFFakMsK0NBQTREO0FBQzVELDJEQUFzRDtBQUN0RCxnRUFBdUY7QUFDdkYsOENBQXFDO0FBQ3JDLGlDQUFpQztBQUNqQyxtQ0FBc0Q7QUFHdEQsUUFBUSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtJQUMzQztRQUNFLE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUTtRQUNSLE9BQU87UUFDUCxZQUFZO1FBQ1osY0FBYztRQUNkLGNBQWM7UUFDZCxZQUFZO1FBQ1osU0FBUztLQUNWLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2pCLEVBQUUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUU7WUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLG1DQUEyQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN2RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLE1BQU0sZUFBZSxHQUFHLElBQUksNkJBQW1CLENBQzdDLG9CQUFvQixFQUFFLFNBQVMsR0FBRyxxQkFBcUIsQ0FDeEQsQ0FBQztJQUNGLElBQUksSUFBNkIsQ0FBQztJQUNsQyxJQUFJLE9BQU8sR0FBaUIsSUFBSSxzQkFBWSxDQUFDLElBQUkscUJBQVEsRUFBRSxDQUFDLENBQUM7SUFFN0QsVUFBVSxDQUFDLEdBQUcs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SSxDQUFDLEVBQUU7WUFDVCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7aUJBQzNFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqQixzQkFBc0I7WUFDdEIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BDO29CQUNFLElBQUksRUFBRSxlQUFlO29CQUNyQixPQUFPLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDO3dCQUNoQyxJQUFJLEVBQUUsU0FBUzt3QkFDZixPQUFPLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDOzRCQUNoQyxJQUFJLEVBQUUsT0FBTzs0QkFDYixFQUFFLEVBQUUsT0FBTzt5QkFDWixDQUFDO3FCQUNILENBQUM7aUJBQ0g7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FDSCxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNaLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGU6bm8tYmlnLWZ1bmN0aW9uXG5cbmltcG9ydCB7IG5vcm1hbGl6ZSwgdmlydHVhbEZzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgSG9zdFRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBTY2hlbWF0aWNUZXN0UnVubmVyLCBVbml0VGVzdFRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90ZXN0aW5nJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHsgYW5ndWxhck1ham9yQ29tcGF0R3VhcmFudGVlIH0gZnJvbSAnLi9pbmRleCc7XG5cblxuZGVzY3JpYmUoJ2FuZ3VsYXJNYWpvckNvbXBhdEd1YXJhbnRlZScsICgpID0+IHtcbiAgW1xuICAgICc1LjAuMCcsXG4gICAgJzUuMS4wJyxcbiAgICAnNS4yMC4wJyxcbiAgICAnNi4wLjAnLFxuICAgICc2LjAuMC1yYy4wJyxcbiAgICAnNi4wLjAtYmV0YS4wJyxcbiAgICAnNi4xLjAtYmV0YS4wJyxcbiAgICAnNi4xLjAtcmMuMCcsXG4gICAgJzYuMTAuMTEnLFxuICBdLmZvckVhY2goZ29sZGVuID0+IHtcbiAgICBpdCgnd29ya3Mgd2l0aCAnICsgSlNPTi5zdHJpbmdpZnkoZ29sZGVuKSwgKCkgPT4ge1xuICAgICAgZXhwZWN0KHNlbXZlci5zYXRpc2ZpZXMoZ29sZGVuLCBhbmd1bGFyTWFqb3JDb21wYXRHdWFyYW50ZWUoJ141LjAuMCcpKSkudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnQHNjaGVtYXRpY3MvdXBkYXRlJywgKCkgPT4ge1xuICBjb25zdCBzY2hlbWF0aWNSdW5uZXIgPSBuZXcgU2NoZW1hdGljVGVzdFJ1bm5lcihcbiAgICAnQHNjaGVtYXRpY3MvdXBkYXRlJywgX19kaXJuYW1lICsgJy8uLi9jb2xsZWN0aW9uLmpzb24nLFxuICApO1xuICBsZXQgaG9zdDogdmlydHVhbEZzLnRlc3QuVGVzdEhvc3Q7XG4gIGxldCBhcHBUcmVlOiBVbml0VGVzdFRyZWUgPSBuZXcgVW5pdFRlc3RUcmVlKG5ldyBIb3N0VHJlZSgpKTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBob3N0ID0gbmV3IHZpcnR1YWxGcy50ZXN0LlRlc3RIb3N0KHtcbiAgICAgICcvcGFja2FnZS5qc29uJzogYHtcbiAgICAgICAgXCJuYW1lXCI6IFwiYmxhaFwiLFxuICAgICAgICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgICAgICAgXCJAYW5ndWxhci1kZXZraXQtdGVzdHMvdXBkYXRlLWJhc2VcIjogXCIxLjAuMFwiXG4gICAgICAgIH1cbiAgICAgIH1gLFxuICAgIH0pO1xuICAgIGFwcFRyZWUgPSBuZXcgVW5pdFRlc3RUcmVlKG5ldyBIb3N0VHJlZShob3N0KSk7XG4gIH0pO1xuXG4gIGl0KCd1cGRhdGVzIHBhY2thZ2UuanNvbicsIGRvbmUgPT4ge1xuICAgIC8vIFNpbmNlIHdlIGNhbm5vdCBydW4gdGFza3MgaW4gdW5pdCB0ZXN0cywgd2UgbmVlZCB0byB2YWxpZGF0ZSB0aGF0IHRoZSBkZWZhdWx0XG4gICAgLy8gdXBkYXRlIHNjaGVtYXRpYyB1cGRhdGVzIHRoZSBwYWNrYWdlLmpzb24gYXBwcm9wcmlhdGVseSwgQU5EIHZhbGlkYXRlIHRoYXQgdGhlXG4gICAgLy8gbWlncmF0ZSBzY2hlbWF0aWMgYWN0dWFsbHkgZG8gd29yayBhcHByb3ByaWF0ZWx5LCBpbiBhIHNlcGFyYXRlIHRlc3QuXG4gICAgc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpY0FzeW5jKCd1cGRhdGUnLCB7IGFsbDogdHJ1ZSB9LCBhcHBUcmVlKS5waXBlKFxuICAgICAgbWFwKHRyZWUgPT4ge1xuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UodHJlZS5yZWFkQ29udGVudCgnL3BhY2thZ2UuanNvbicpKTtcbiAgICAgICAgZXhwZWN0KHBhY2thZ2VKc29uWydkZXBlbmRlbmNpZXMnXVsnQGFuZ3VsYXItZGV2a2l0LXRlc3RzL3VwZGF0ZS1iYXNlJ10pLnRvQmUoJzEuMS4wJyk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaW5zdGFsbCB0YXNrLlxuICAgICAgICBleHBlY3Qoc2NoZW1hdGljUnVubmVyLnRhc2tzKS50b0VxdWFsKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnbm9kZS1wYWNrYWdlJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IGphc21pbmUub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgIGNvbW1hbmQ6ICdpbnN0YWxsJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0sIDQ1MDAwKTtcblxuICBpdCgncmVzcGVjdHMgZXhpc3RpbmcgdGlsZGUgYW5kIGNhcmV0IHJhbmdlcycsIGRvbmUgPT4ge1xuICAgIC8vIEFkZCByYW5nZXMuXG4gICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zeW5jLnJlYWQobm9ybWFsaXplKCcvcGFja2FnZS5qc29uJykpKTtcbiAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UoY29udGVudCk7XG4gICAgcGFja2FnZUpzb25bJ2RlcGVuZGVuY2llcyddWydAYW5ndWxhci1kZXZraXQtdGVzdHMvdXBkYXRlLWJhc2UnXSA9ICdeMS4wLjAnO1xuICAgIHBhY2thZ2VKc29uWydkZXBlbmRlbmNpZXMnXVsnQGFuZ3VsYXItZGV2a2l0LXRlc3RzL3VwZGF0ZS1taWdyYXRpb25zJ10gPSAnfjEuMC4wJztcbiAgICBob3N0LnN5bmMud3JpdGUoXG4gICAgICBub3JtYWxpemUoJy9wYWNrYWdlLmpzb24nKSxcbiAgICAgIHZpcnR1YWxGcy5zdHJpbmdUb0ZpbGVCdWZmZXIoSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24pKSxcbiAgICApO1xuXG4gICAgc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpY0FzeW5jKCd1cGRhdGUnLCB7IGFsbDogdHJ1ZSB9LCBhcHBUcmVlKS5waXBlKFxuICAgICAgbWFwKHRyZWUgPT4ge1xuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UodHJlZS5yZWFkQ29udGVudCgnL3BhY2thZ2UuanNvbicpKTtcbiAgICAgICAgLy8gVGhpcyBvbmUgc2hvdWxkIG5vdCBjaGFuZ2UgYmVjYXVzZSAxLjEuMCB3YXMgYWxyZWFkeSBzYXRpc2ZpZWQgYnkgXjEuMC4wLlxuICAgICAgICBleHBlY3QocGFja2FnZUpzb25bJ2RlcGVuZGVuY2llcyddWydAYW5ndWxhci1kZXZraXQtdGVzdHMvdXBkYXRlLWJhc2UnXSkudG9CZSgnXjEuMC4wJyk7XG4gICAgICAgIGV4cGVjdChwYWNrYWdlSnNvblsnZGVwZW5kZW5jaWVzJ11bJ0Bhbmd1bGFyLWRldmtpdC10ZXN0cy91cGRhdGUtbWlncmF0aW9ucyddKVxuICAgICAgICAgIC50b0JlKCd+MS42LjAnKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCA0NTAwMCk7XG5cbiAgaXQoJ2NhbGxzIG1pZ3JhdGlvbiB0YXNrcycsIGRvbmUgPT4ge1xuICAgIC8vIEFkZCB0aGUgYmFzaWMgbWlncmF0aW9uIHBhY2thZ2UuXG4gICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zeW5jLnJlYWQobm9ybWFsaXplKCcvcGFja2FnZS5qc29uJykpKTtcbiAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UoY29udGVudCk7XG4gICAgcGFja2FnZUpzb25bJ2RlcGVuZGVuY2llcyddWydAYW5ndWxhci1kZXZraXQtdGVzdHMvdXBkYXRlLW1pZ3JhdGlvbnMnXSA9ICcxLjAuMCc7XG4gICAgaG9zdC5zeW5jLndyaXRlKFxuICAgICAgbm9ybWFsaXplKCcvcGFja2FnZS5qc29uJyksXG4gICAgICB2aXJ0dWFsRnMuc3RyaW5nVG9GaWxlQnVmZmVyKEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uKSksXG4gICAgKTtcblxuICAgIHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWNBc3luYygndXBkYXRlJywgeyBhbGw6IHRydWUgfSwgYXBwVHJlZSkucGlwZShcbiAgICAgIG1hcCh0cmVlID0+IHtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoJy9wYWNrYWdlLmpzb24nKSk7XG4gICAgICAgIGV4cGVjdChwYWNrYWdlSnNvblsnZGVwZW5kZW5jaWVzJ11bJ0Bhbmd1bGFyLWRldmtpdC10ZXN0cy91cGRhdGUtYmFzZSddKS50b0JlKCcxLjEuMCcpO1xuICAgICAgICBleHBlY3QocGFja2FnZUpzb25bJ2RlcGVuZGVuY2llcyddWydAYW5ndWxhci1kZXZraXQtdGVzdHMvdXBkYXRlLW1pZ3JhdGlvbnMnXSlcbiAgICAgICAgICAudG9CZSgnMS42LjAnKTtcblxuICAgICAgICAvLyBDaGVjayBpbnN0YWxsIHRhc2suXG4gICAgICAgIGV4cGVjdChzY2hlbWF0aWNSdW5uZXIudGFza3MpLnRvRXF1YWwoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdub2RlLXBhY2thZ2UnLFxuICAgICAgICAgICAgb3B0aW9uczogamFzbWluZS5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgY29tbWFuZDogJ2luc3RhbGwnLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncnVuLXNjaGVtYXRpYycsXG4gICAgICAgICAgICBvcHRpb25zOiBqYXNtaW5lLm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICBuYW1lOiAnbWlncmF0ZScsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCA0NTAwMCk7XG5cbiAgaXQoJ3VwZGF0ZXMgQW5ndWxhciBhcyBjb21wYXRpYmxlIHdpdGggQW5ndWxhciBOLTEnLCBkb25lID0+IHtcbiAgICAvLyBBZGQgdGhlIGJhc2ljIG1pZ3JhdGlvbiBwYWNrYWdlLlxuICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc3luYy5yZWFkKG5vcm1hbGl6ZSgnL3BhY2thZ2UuanNvbicpKSk7XG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IHBhY2thZ2VKc29uWydkZXBlbmRlbmNpZXMnXTtcbiAgICBkZXBlbmRlbmNpZXNbJ0Bhbmd1bGFyLWRldmtpdC10ZXN0cy91cGRhdGUtcGVlci1kZXBlbmRlbmNpZXMtYW5ndWxhci01J10gPSAnMS4wLjAnO1xuICAgIGRlcGVuZGVuY2llc1snQGFuZ3VsYXIvY29yZSddID0gJzUuMS4wJztcbiAgICBkZXBlbmRlbmNpZXNbJ3J4anMnXSA9ICc1LjUuMCc7XG4gICAgZGVwZW5kZW5jaWVzWyd6b25lLmpzJ10gPSAnMC44LjI2JztcbiAgICBob3N0LnN5bmMud3JpdGUoXG4gICAgICBub3JtYWxpemUoJy9wYWNrYWdlLmpzb24nKSxcbiAgICAgIHZpcnR1YWxGcy5zdHJpbmdUb0ZpbGVCdWZmZXIoSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24pKSxcbiAgICApO1xuXG4gICAgc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpY0FzeW5jKCd1cGRhdGUnLCB7XG4gICAgICBwYWNrYWdlczogWydAYW5ndWxhci9jb3JlQF42LjAuMCddLFxuICAgIH0sIGFwcFRyZWUpLnBpcGUoXG4gICAgICBtYXAodHJlZSA9PiB7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KCcvcGFja2FnZS5qc29uJykpO1xuICAgICAgICBleHBlY3QocGFja2FnZUpzb25bJ2RlcGVuZGVuY2llcyddWydAYW5ndWxhci9jb3JlJ11bMF0pLnRvQmUoJzYnKTtcblxuICAgICAgICAvLyBDaGVjayBpbnN0YWxsIHRhc2suXG4gICAgICAgIGV4cGVjdChzY2hlbWF0aWNSdW5uZXIudGFza3MpLnRvRXF1YWwoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdub2RlLXBhY2thZ2UnLFxuICAgICAgICAgICAgb3B0aW9uczogamFzbWluZS5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgY29tbWFuZDogJ2luc3RhbGwnLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncnVuLXNjaGVtYXRpYycsXG4gICAgICAgICAgICBvcHRpb25zOiBqYXNtaW5lLm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICBuYW1lOiAnbWlncmF0ZScsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCA0NTAwMCk7XG5cbiAgaXQoJ3VwZGF0ZXMgQW5ndWxhciBhcyBjb21wYXRpYmxlIHdpdGggQW5ndWxhciBOLTEgKDIpJywgZG9uZSA9PiB7XG4gICAgLy8gQWRkIHRoZSBiYXNpYyBtaWdyYXRpb24gcGFja2FnZS5cbiAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnN5bmMucmVhZChub3JtYWxpemUoJy9wYWNrYWdlLmpzb24nKSkpO1xuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBwYWNrYWdlSnNvblsnZGVwZW5kZW5jaWVzJ107XG4gICAgZGVwZW5kZW5jaWVzWydAYW5ndWxhci1kZXZraXQtdGVzdHMvdXBkYXRlLXBlZXItZGVwZW5kZW5jaWVzLWFuZ3VsYXItNS0yJ10gPSAnMS4wLjAnO1xuICAgIGRlcGVuZGVuY2llc1snQGFuZ3VsYXIvY29yZSddID0gJzUuMS4wJztcbiAgICBkZXBlbmRlbmNpZXNbJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnXSA9ICc1LjEuMCc7XG4gICAgZGVwZW5kZW5jaWVzWydAYW5ndWxhci9jb21tb24nXSA9ICc1LjEuMCc7XG4gICAgZGVwZW5kZW5jaWVzWydAYW5ndWxhci9jb21waWxlciddID0gJzUuMS4wJztcbiAgICBkZXBlbmRlbmNpZXNbJ0Bhbmd1bGFyL2NvbXBpbGVyLWNsaSddID0gJzUuMS4wJztcbiAgICBkZXBlbmRlbmNpZXNbJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInXSA9ICc1LjEuMCc7XG4gICAgZGVwZW5kZW5jaWVzWydyeGpzJ10gPSAnNS41LjAnO1xuICAgIGRlcGVuZGVuY2llc1snem9uZS5qcyddID0gJzAuOC4yNic7XG4gICAgZGVwZW5kZW5jaWVzWyd0eXBlc2NyaXB0J10gPSAnMi40LjInO1xuICAgIGhvc3Quc3luYy53cml0ZShcbiAgICAgIG5vcm1hbGl6ZSgnL3BhY2thZ2UuanNvbicpLFxuICAgICAgdmlydHVhbEZzLnN0cmluZ1RvRmlsZUJ1ZmZlcihKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbikpLFxuICAgICk7XG5cbiAgICBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljQXN5bmMoJ3VwZGF0ZScsIHtcbiAgICAgIHBhY2thZ2VzOiBbJ0Bhbmd1bGFyL2NvcmVAXjYuMC4wJ10sXG4gICAgfSwgYXBwVHJlZSkucGlwZShcbiAgICAgIG1hcCh0cmVlID0+IHtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoJy9wYWNrYWdlLmpzb24nKSk7XG4gICAgICAgIGV4cGVjdChwYWNrYWdlSnNvblsnZGVwZW5kZW5jaWVzJ11bJ0Bhbmd1bGFyL2NvcmUnXVswXSkudG9CZSgnNicpO1xuICAgICAgICBleHBlY3QocGFja2FnZUpzb25bJ2RlcGVuZGVuY2llcyddWydyeGpzJ11bMF0pLnRvQmUoJzYnKTtcbiAgICAgICAgZXhwZWN0KHBhY2thZ2VKc29uWydkZXBlbmRlbmNpZXMnXVsndHlwZXNjcmlwdCddWzBdKS50b0JlKCcyJyk7XG4gICAgICAgIGV4cGVjdChwYWNrYWdlSnNvblsnZGVwZW5kZW5jaWVzJ11bJ3R5cGVzY3JpcHQnXVsyXSkubm90LnRvQmUoJzQnKTtcblxuICAgICAgICAvLyBDaGVjayBpbnN0YWxsIHRhc2suXG4gICAgICAgIGV4cGVjdChzY2hlbWF0aWNSdW5uZXIudGFza3MpLnRvRXF1YWwoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdub2RlLXBhY2thZ2UnLFxuICAgICAgICAgICAgb3B0aW9uczogamFzbWluZS5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgY29tbWFuZDogJ2luc3RhbGwnLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncnVuLXNjaGVtYXRpYycsXG4gICAgICAgICAgICBvcHRpb25zOiBqYXNtaW5lLm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICBuYW1lOiAnbWlncmF0ZScsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCA0NTAwMCk7XG5cbiAgaXQoJ2NhbiBtaWdyYXRlIG9ubHknLCBkb25lID0+IHtcbiAgICAvLyBBZGQgdGhlIGJhc2ljIG1pZ3JhdGlvbiBwYWNrYWdlLlxuICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc3luYy5yZWFkKG5vcm1hbGl6ZSgnL3BhY2thZ2UuanNvbicpKSk7XG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuICAgIHBhY2thZ2VKc29uWydkZXBlbmRlbmNpZXMnXVsnQGFuZ3VsYXItZGV2a2l0LXRlc3RzL3VwZGF0ZS1taWdyYXRpb25zJ10gPSAnMS4wLjAnO1xuICAgIGhvc3Quc3luYy53cml0ZShcbiAgICAgIG5vcm1hbGl6ZSgnL3BhY2thZ2UuanNvbicpLFxuICAgICAgdmlydHVhbEZzLnN0cmluZ1RvRmlsZUJ1ZmZlcihKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbikpLFxuICAgICk7XG5cbiAgICBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljQXN5bmMoJ3VwZGF0ZScsIHtcbiAgICAgIHBhY2thZ2VzOiBbJ0Bhbmd1bGFyLWRldmtpdC10ZXN0cy91cGRhdGUtbWlncmF0aW9ucyddLFxuICAgICAgbWlncmF0ZU9ubHk6IHRydWUsXG4gICAgfSwgYXBwVHJlZSkucGlwZShcbiAgICAgIG1hcCh0cmVlID0+IHtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoJy9wYWNrYWdlLmpzb24nKSk7XG4gICAgICAgIGV4cGVjdChwYWNrYWdlSnNvblsnZGVwZW5kZW5jaWVzJ11bJ0Bhbmd1bGFyLWRldmtpdC10ZXN0cy91cGRhdGUtYmFzZSddKS50b0JlKCcxLjAuMCcpO1xuICAgICAgICBleHBlY3QocGFja2FnZUpzb25bJ2RlcGVuZGVuY2llcyddWydAYW5ndWxhci1kZXZraXQtdGVzdHMvdXBkYXRlLW1pZ3JhdGlvbnMnXSlcbiAgICAgICAgICAudG9CZSgnMS4wLjAnKTtcblxuICAgICAgICAvLyBDaGVjayBpbnN0YWxsIHRhc2suXG4gICAgICAgIGV4cGVjdChzY2hlbWF0aWNSdW5uZXIudGFza3MpLnRvRXF1YWwoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdydW4tc2NoZW1hdGljJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IGphc21pbmUub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgIG5hbWU6ICdtaWdyYXRlJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0sIDQ1MDAwKTtcblxuICBpdCgnY2FuIG1pZ3JhdGUgZnJvbSBvbmx5JywgZG9uZSA9PiB7XG4gICAgLy8gQWRkIHRoZSBiYXNpYyBtaWdyYXRpb24gcGFja2FnZS5cbiAgICBjb25zdCBjb250ZW50ID0gdmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhob3N0LnN5bmMucmVhZChub3JtYWxpemUoJy9wYWNrYWdlLmpzb24nKSkpO1xuICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICBwYWNrYWdlSnNvblsnZGVwZW5kZW5jaWVzJ11bJ0Bhbmd1bGFyLWRldmtpdC10ZXN0cy91cGRhdGUtbWlncmF0aW9ucyddID0gJzEuNi4wJztcbiAgICBob3N0LnN5bmMud3JpdGUoXG4gICAgICBub3JtYWxpemUoJy9wYWNrYWdlLmpzb24nKSxcbiAgICAgIHZpcnR1YWxGcy5zdHJpbmdUb0ZpbGVCdWZmZXIoSlNPTi5zdHJpbmdpZnkocGFja2FnZUpzb24pKSxcbiAgICApO1xuXG4gICAgc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpY0FzeW5jKCd1cGRhdGUnLCB7XG4gICAgICBwYWNrYWdlczogWydAYW5ndWxhci1kZXZraXQtdGVzdHMvdXBkYXRlLW1pZ3JhdGlvbnMnXSxcbiAgICAgIG1pZ3JhdGVPbmx5OiB0cnVlLFxuICAgICAgZnJvbTogJzAuMS4yJyxcbiAgICB9LCBhcHBUcmVlKS5waXBlKFxuICAgICAgbWFwKHRyZWUgPT4ge1xuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UodHJlZS5yZWFkQ29udGVudCgnL3BhY2thZ2UuanNvbicpKTtcbiAgICAgICAgZXhwZWN0KHBhY2thZ2VKc29uWydkZXBlbmRlbmNpZXMnXVsnQGFuZ3VsYXItZGV2a2l0LXRlc3RzL3VwZGF0ZS1taWdyYXRpb25zJ10pXG4gICAgICAgICAgLnRvQmUoJzEuNi4wJyk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaW5zdGFsbCB0YXNrLlxuICAgICAgICBleHBlY3Qoc2NoZW1hdGljUnVubmVyLnRhc2tzKS50b0VxdWFsKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncnVuLXNjaGVtYXRpYycsXG4gICAgICAgICAgICBvcHRpb25zOiBqYXNtaW5lLm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICBuYW1lOiAnbWlncmF0ZScsXG4gICAgICAgICAgICAgIG9wdGlvbnM6IGphc21pbmUub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgICAgZnJvbTogJzAuMS4yJyxcbiAgICAgICAgICAgICAgICB0bzogJzEuNi4wJyxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCA0NTAwMCk7XG5cbiAgaXQoJ2NhbiBpbnN0YWxsIGFuZCBtaWdyYXRlIHdpdGggLS1mcm9tIChzaG9ydCB2ZXJzaW9uIG51bWJlciknLCBkb25lID0+IHtcbiAgICAvLyBBZGQgdGhlIGJhc2ljIG1pZ3JhdGlvbiBwYWNrYWdlLlxuICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc3luYy5yZWFkKG5vcm1hbGl6ZSgnL3BhY2thZ2UuanNvbicpKSk7XG4gICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuICAgIHBhY2thZ2VKc29uWydkZXBlbmRlbmNpZXMnXVsnQGFuZ3VsYXItZGV2a2l0LXRlc3RzL3VwZGF0ZS1taWdyYXRpb25zJ10gPSAnMS42LjAnO1xuICAgIGhvc3Quc3luYy53cml0ZShcbiAgICAgIG5vcm1hbGl6ZSgnL3BhY2thZ2UuanNvbicpLFxuICAgICAgdmlydHVhbEZzLnN0cmluZ1RvRmlsZUJ1ZmZlcihKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbikpLFxuICAgICk7XG5cbiAgICBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljQXN5bmMoJ3VwZGF0ZScsIHtcbiAgICAgIHBhY2thZ2VzOiBbJ0Bhbmd1bGFyLWRldmtpdC10ZXN0cy91cGRhdGUtbWlncmF0aW9ucyddLFxuICAgICAgbWlncmF0ZU9ubHk6IHRydWUsXG4gICAgICBmcm9tOiAnMCcsXG4gICAgfSwgYXBwVHJlZSkucGlwZShcbiAgICAgIG1hcCh0cmVlID0+IHtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoJy9wYWNrYWdlLmpzb24nKSk7XG4gICAgICAgIGV4cGVjdChwYWNrYWdlSnNvblsnZGVwZW5kZW5jaWVzJ11bJ0Bhbmd1bGFyLWRldmtpdC10ZXN0cy91cGRhdGUtbWlncmF0aW9ucyddKVxuICAgICAgICAgIC50b0JlKCcxLjYuMCcpO1xuXG4gICAgICAgIC8vIENoZWNrIGluc3RhbGwgdGFzay5cbiAgICAgICAgZXhwZWN0KHNjaGVtYXRpY1J1bm5lci50YXNrcykudG9FcXVhbChbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3J1bi1zY2hlbWF0aWMnLFxuICAgICAgICAgICAgb3B0aW9uczogamFzbWluZS5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgbmFtZTogJ21pZ3JhdGUnLFxuICAgICAgICAgICAgICBvcHRpb25zOiBqYXNtaW5lLm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICAgIGZyb206ICcwLjAuMCcsXG4gICAgICAgICAgICAgICAgdG86ICcxLjYuMCcsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSk7XG4gICAgICB9KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSwgNDUwMDApO1xufSk7XG4iXX0=