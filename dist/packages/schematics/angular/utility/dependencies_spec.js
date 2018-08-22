"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const dependencies_1 = require("./dependencies");
describe('dependencies', () => {
    describe('addDependency', () => {
        let tree;
        const pkgJsonPath = '/package.json';
        let dependency;
        beforeEach(() => {
            tree = new testing_1.UnitTestTree(new schematics_1.EmptyTree());
            tree.create(pkgJsonPath, '{}');
            dependency = {
                type: dependencies_1.NodeDependencyType.Default,
                name: 'my-pkg',
                version: '1.2.3',
            };
        });
        [
            { type: dependencies_1.NodeDependencyType.Default, key: 'dependencies' },
            { type: dependencies_1.NodeDependencyType.Dev, key: 'devDependencies' },
            { type: dependencies_1.NodeDependencyType.Optional, key: 'optionalDependencies' },
            { type: dependencies_1.NodeDependencyType.Peer, key: 'peerDependencies' },
        ].forEach(type => {
            describe(`Type: ${type.toString()}`, () => {
                beforeEach(() => {
                    dependency.type = type.type;
                });
                it('should add a dependency', () => {
                    dependencies_1.addPackageJsonDependency(tree, dependency);
                    const pkgJson = JSON.parse(tree.readContent(pkgJsonPath));
                    expect(pkgJson[type.key][dependency.name]).toEqual(dependency.version);
                });
                it('should handle an existing dependency (update version)', () => {
                    dependencies_1.addPackageJsonDependency(tree, Object.assign({}, dependency, { version: '0.0.0' }));
                    dependencies_1.addPackageJsonDependency(tree, Object.assign({}, dependency, { overwrite: true }));
                    const pkgJson = JSON.parse(tree.readContent(pkgJsonPath));
                    expect(pkgJson[type.key][dependency.name]).toEqual(dependency.version);
                });
            });
        });
        it('should throw when missing package.json', () => {
            expect((() => dependencies_1.addPackageJsonDependency(new schematics_1.EmptyTree(), dependency))).toThrow();
        });
    });
    describe('getDependency', () => {
        let tree;
        beforeEach(() => {
            const pkgJsonPath = '/package.json';
            const pkgJsonContent = JSON.stringify({
                dependencies: {
                    'my-pkg': '1.2.3',
                },
            }, null, 2);
            tree = new testing_1.UnitTestTree(new schematics_1.EmptyTree());
            tree.create(pkgJsonPath, pkgJsonContent);
        });
        it('should get a dependency', () => {
            const dep = dependencies_1.getPackageJsonDependency(tree, 'my-pkg');
            expect(dep.type).toEqual(dependencies_1.NodeDependencyType.Default);
            expect(dep.name).toEqual('my-pkg');
            expect(dep.version).toEqual('1.2.3');
        });
        it('should return null if dependency does not exist', () => {
            const dep = dependencies_1.getPackageJsonDependency(tree, 'missing-pkg');
            expect(dep).toBeNull();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jaWVzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2RlcGVuZGVuY2llc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMkRBQXVEO0FBQ3ZELGdFQUFrRTtBQUNsRSxpREFLd0I7QUFHeEIsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7UUFDN0IsSUFBSSxJQUFrQixDQUFDO1FBQ3ZCLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQztRQUNwQyxJQUFJLFVBQTBCLENBQUM7UUFDL0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksR0FBRyxJQUFJLHNCQUFZLENBQUMsSUFBSSxzQkFBUyxFQUFFLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUUvQixVQUFVLEdBQUc7Z0JBQ1gsSUFBSSxFQUFFLGlDQUFrQixDQUFDLE9BQU87Z0JBQ2hDLElBQUksRUFBRSxRQUFRO2dCQUNkLE9BQU8sRUFBRSxPQUFPO2FBQ2pCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVIO1lBQ0UsRUFBRSxJQUFJLEVBQUUsaUNBQWtCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxjQUFjLEVBQUU7WUFDekQsRUFBRSxJQUFJLEVBQUUsaUNBQWtCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTtZQUN4RCxFQUFFLElBQUksRUFBRSxpQ0FBa0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFO1lBQ2xFLEVBQUUsSUFBSSxFQUFFLGlDQUFrQixDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsa0JB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QUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELE1BQU0sR0FBRyxHQUFHLHVDQUF3QixDQUFDLElBQUksRUFBRSxhQUFhLENBQW1CLENBQUM7WUFDNUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEVtcHR5VHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7IFVuaXRUZXN0VHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3Rlc3RpbmcnO1xuaW1wb3J0IHtcbiAgTm9kZURlcGVuZGVuY3ksXG4gIE5vZGVEZXBlbmRlbmN5VHlwZSxcbiAgYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5LFxuICBnZXRQYWNrYWdlSnNvbkRlcGVuZGVuY3ksXG59IGZyb20gJy4vZGVwZW5kZW5jaWVzJztcblxuXG5kZXNjcmliZSgnZGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnYWRkRGVwZW5kZW5jeScsICgpID0+IHtcbiAgICBsZXQgdHJlZTogVW5pdFRlc3RUcmVlO1xuICAgIGNvbnN0IHBrZ0pzb25QYXRoID0gJy9wYWNrYWdlLmpzb24nO1xuICAgIGxldCBkZXBlbmRlbmN5OiBOb2RlRGVwZW5kZW5jeTtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHRyZWUgPSBuZXcgVW5pdFRlc3RUcmVlKG5ldyBFbXB0eVRyZWUoKSk7XG4gICAgICB0cmVlLmNyZWF0ZShwa2dKc29uUGF0aCwgJ3t9Jyk7XG5cbiAgICAgIGRlcGVuZGVuY3kgPSB7XG4gICAgICAgIHR5cGU6IE5vZGVEZXBlbmRlbmN5VHlwZS5EZWZhdWx0LFxuICAgICAgICBuYW1lOiAnbXktcGtnJyxcbiAgICAgICAgdmVyc2lvbjogJzEuMi4zJyxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBbXG4gICAgICB7IHR5cGU6IE5vZGVEZXBlbmRlbmN5VHlwZS5EZWZhdWx0LCBrZXk6ICdkZXBlbmRlbmNpZXMnIH0sXG4gICAgICB7IHR5cGU6IE5vZGVEZXBlbmRlbmN5VHlwZS5EZXYsIGtleTogJ2RldkRlcGVuZGVuY2llcycgfSxcbiAgICAgIHsgdHlwZTogTm9kZURlcGVuZGVuY3lUeXBlLk9wdGlvbmFsLCBrZXk6ICdvcHRpb25hbERlcGVuZGVuY2llcycgfSxcbiAgICAgIHsgdHlwZTogTm9kZURlcGVuZGVuY3lUeXBlLlBlZXIsIGtleTogJ3BlZXJEZXBlbmRlbmNpZXMnIH0sXG4gICAgXS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgZGVzY3JpYmUoYFR5cGU6ICR7dHlwZS50b1N0cmluZygpfWAsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgZGVwZW5kZW5jeS50eXBlID0gdHlwZS50eXBlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGFkZCBhIGRlcGVuZGVuY3knLCAoKSA9PiB7XG4gICAgICAgICAgYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5KHRyZWUsIGRlcGVuZGVuY3kpO1xuICAgICAgICAgIGNvbnN0IHBrZ0pzb24gPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQocGtnSnNvblBhdGgpKTtcbiAgICAgICAgICBleHBlY3QocGtnSnNvblt0eXBlLmtleV1bZGVwZW5kZW5jeS5uYW1lXSkudG9FcXVhbChkZXBlbmRlbmN5LnZlcnNpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbiBleGlzdGluZyBkZXBlbmRlbmN5ICh1cGRhdGUgdmVyc2lvbiknLCAoKSA9PiB7XG4gICAgICAgICAgYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5KHRyZWUsIHsuLi5kZXBlbmRlbmN5LCB2ZXJzaW9uOiAnMC4wLjAnfSk7XG4gICAgICAgICAgYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5KHRyZWUsIHsuLi5kZXBlbmRlbmN5LCBvdmVyd3JpdGU6IHRydWV9KTtcbiAgICAgICAgICBjb25zdCBwa2dKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KHBrZ0pzb25QYXRoKSk7XG4gICAgICAgICAgZXhwZWN0KHBrZ0pzb25bdHlwZS5rZXldW2RlcGVuZGVuY3kubmFtZV0pLnRvRXF1YWwoZGVwZW5kZW5jeS52ZXJzaW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdGhyb3cgd2hlbiBtaXNzaW5nIHBhY2thZ2UuanNvbicsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKCkgPT4gYWRkUGFja2FnZUpzb25EZXBlbmRlbmN5KG5ldyBFbXB0eVRyZWUoKSwgZGVwZW5kZW5jeSkpKS50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldERlcGVuZGVuY3knLCAoKSA9PiB7XG4gICAgbGV0IHRyZWU6IFVuaXRUZXN0VHJlZTtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGNvbnN0IHBrZ0pzb25QYXRoID0gJy9wYWNrYWdlLmpzb24nO1xuICAgICAgY29uc3QgcGtnSnNvbkNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGRlcGVuZGVuY2llczoge1xuICAgICAgICAgICdteS1wa2cnOiAnMS4yLjMnLFxuICAgICAgICB9LFxuICAgICAgfSwgbnVsbCwgMik7XG4gICAgICB0cmVlID0gbmV3IFVuaXRUZXN0VHJlZShuZXcgRW1wdHlUcmVlKCkpO1xuICAgICAgdHJlZS5jcmVhdGUocGtnSnNvblBhdGgsIHBrZ0pzb25Db250ZW50KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZ2V0IGEgZGVwZW5kZW5jeScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRlcCA9IGdldFBhY2thZ2VKc29uRGVwZW5kZW5jeSh0cmVlLCAnbXktcGtnJykgYXMgTm9kZURlcGVuZGVuY3k7XG4gICAgICBleHBlY3QoZGVwLnR5cGUpLnRvRXF1YWwoTm9kZURlcGVuZGVuY3lUeXBlLkRlZmF1bHQpO1xuICAgICAgZXhwZWN0KGRlcC5uYW1lKS50b0VxdWFsKCdteS1wa2cnKTtcbiAgICAgIGV4cGVjdChkZXAudmVyc2lvbikudG9FcXVhbCgnMS4yLjMnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgaWYgZGVwZW5kZW5jeSBkb2VzIG5vdCBleGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRlcCA9IGdldFBhY2thZ2VKc29uRGVwZW5kZW5jeSh0cmVlLCAnbWlzc2luZy1wa2cnKSBhcyBOb2RlRGVwZW5kZW5jeTtcbiAgICAgIGV4cGVjdChkZXApLnRvQmVOdWxsKCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=