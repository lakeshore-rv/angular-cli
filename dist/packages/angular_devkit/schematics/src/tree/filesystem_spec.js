"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:non-null-operator
const core_1 = require("@angular-devkit/core");
const common_spec_1 = require("./common_spec");
const filesystem_1 = require("./filesystem");
describe('FileSystemDirEntry', () => {
    common_spec_1.testTreeVisit({
        createTree: paths => {
            const files = {};
            paths.forEach(path => files[path] = path);
            const host = new core_1.virtualFs.test.TestHost(files);
            const tree = new filesystem_1.FileSystemTree(host);
            return tree;
        },
        sets: [
            {
                name: 'empty',
                files: [],
                visits: [
                    { root: '/', expected: [] },
                ],
            },
            {
                name: 'file at root',
                files: ['/file'],
                visits: [
                    { root: '/' },
                    { root: '/file', exception: ({ path }) => new core_1.PathIsFileException(path) },
                ],
            },
            {
                name: 'file under first level folder',
                // duplicate use case: folder of single file at root
                files: ['/folder/file'],
                visits: [
                    { root: '/' },
                    { root: '/folder', expected: ['/folder/file'] },
                    { root: '/folder/file', exception: ({ path }) => new core_1.PathIsFileException(path) },
                    { root: '/wrong', expected: [] },
                ],
            },
            {
                name: 'file under nested folder',
                // duplicate use case: nested folder of files
                files: ['/folder/nested_folder/file'],
                visits: [
                    { root: '/' },
                    { root: '/folder', expected: ['/folder/nested_folder/file'] },
                    { root: '/folder/nested_folder', expected: ['/folder/nested_folder/file'] },
                    {
                        root: '/folder/nested_folder/file',
                        exception: ({ path }) => new core_1.PathIsFileException(path),
                    },
                ],
            },
            {
                name: 'nested folders',
                // duplicate use case: folder of folders at root
                // duplicate use case: folders of mixed
                files: [
                    '/folder/nested_folder0/file',
                    '/folder/nested_folder1/folder/file',
                    '/folder/nested_folder2/file',
                    '/folder/nested_folder2/folder/file',
                ],
                visits: [
                    { root: '/' },
                    { root: '/folder' },
                    { root: '/folder/nested_folder0', expected: ['/folder/nested_folder0/file'] },
                    { root: '/folder/nested_folder1', expected: ['/folder/nested_folder1/folder/file'] },
                    { root: '/folder/nested_folder1/folder', expected: ['/folder/nested_folder1/folder/file'] },
                    { root: '/folder/nested_folder2', expected: [
                            '/folder/nested_folder2/file',
                            '/folder/nested_folder2/folder/file',
                        ] },
                    { root: '/folder/nested_folder2/folder', expected: ['/folder/nested_folder2/folder/file'] },
                ],
            },
        ],
    });
});
describe('FileSystem', () => {
    it('can create files', () => {
        const host = new core_1.virtualFs.test.TestHost({
            '/hello': 'world',
            '/sub/directory/file2': '',
            '/sub/file1': '',
        });
        const tree = new filesystem_1.FileSystemTree(host);
        expect(tree.files).toEqual(['/hello', '/sub/directory/file2', '/sub/file1'].map(core_1.normalize));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXN5c3RlbV9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy90cmVlL2ZpbGVzeXN0ZW1fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILG1DQUFtQztBQUNuQywrQ0FBaUY7QUFDakYsK0NBQThDO0FBQzlDLDZDQUE4QztBQUc5QyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLDJCQUFhLENBQUM7UUFDWixVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDbEIsTUFBTSxLQUFLLEdBQTRCLEVBQUUsQ0FBQztZQUMxQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBRTFDLE1BQU0sSUFBSSxHQUFHLElBQUksZ0JBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hELE1BQU0sSUFBSSxHQUFHLElBQUksMkJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV0QyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDRCxJQUFJLEVBQUU7WUFDSjtnQkFDRSxJQUFJLEVBQUUsT0FBTztnQkFDYixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVBQUU7b0JBQ04sRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7aUJBQzFCO2FBQ0Y7WUFFRDtnQkFDRSxJQUFJLEVBQUUsY0FBYztnQkFDcEIsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDO2dCQUNoQixNQUFNLEVBQUU7b0JBQ04sRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDO29CQUNYLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLDBCQUFtQixDQUFDLElBQUksQ0FBQyxFQUFDO2lCQUN0RTthQUNGO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLCtCQUErQjtnQkFDckMsb0RBQW9EO2dCQUNwRCxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUM7Z0JBQ3ZCLE1BQU0sRUFBRTtvQkFDTixFQUFDLElBQUksRUFBRSxHQUFHLEVBQUM7b0JBQ1gsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFDO29CQUM3QyxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSwwQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQztvQkFDNUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7aUJBQy9CO2FBQ0Y7WUFDRDtnQkFDRSxJQUFJLEVBQUUsMEJBQTBCO2dCQUNoQyw2Q0FBNkM7Z0JBQzdDLEtBQUssRUFBRSxDQUFDLDRCQUE0QixDQUFDO2dCQUNyQyxNQUFNLEVBQUU7b0JBQ04sRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDO29CQUNYLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFDO29CQUMzRCxFQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFDO29CQUN6RTt3QkFDRSxJQUFJLEVBQUUsNEJBQTRCO3dCQUNsQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLDBCQUFtQixDQUFDLElBQUksQ0FBQztxQkFDckQ7aUJBQ0Y7YUFDRjtZQUVEO2dCQUNFLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLGdEQUFnRDtnQkFDaEQsdUNBQXVDO2dCQUN2QyxLQUFLLEVBQUU7b0JBQ0wsNkJBQTZCO29CQUM3QixvQ0FBb0M7b0JBQ3BDLDZCQUE2QjtvQkFDN0Isb0NBQW9DO2lCQUNyQztnQkFDRCxNQUFNLEVBQUU7b0JBQ04sRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDO29CQUNYLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQztvQkFDakIsRUFBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxFQUFFLENBQUMsNkJBQTZCLENBQUMsRUFBQztvQkFDM0UsRUFBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxFQUFFLENBQUMsb0NBQW9DLENBQUMsRUFBQztvQkFDbEYsRUFBQyxJQUFJLEVBQUUsK0JBQStCLEVBQUUsUUFBUSxFQUFFLENBQUMsb0NBQW9DLENBQUMsRUFBQztvQkFDekYsRUFBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxFQUFFOzRCQUN6Qyw2QkFBNkI7NEJBQzdCLG9DQUFvQzt5QkFDckMsRUFBQztvQkFDRixFQUFDLElBQUksRUFBRSwrQkFBK0IsRUFBRSxRQUFRLEVBQUUsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUFDO2lCQUMxRjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUdILFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxnQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDdkMsUUFBUSxFQUFFLE9BQU87WUFDakIsc0JBQXNCLEVBQUUsRUFBRTtZQUMxQixZQUFZLEVBQUUsRUFBRTtTQUNqQixDQUFDLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLDJCQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpub24tbnVsbC1vcGVyYXRvclxuaW1wb3J0IHsgUGF0aElzRmlsZUV4Y2VwdGlvbiwgbm9ybWFsaXplLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyB0ZXN0VHJlZVZpc2l0IH0gZnJvbSAnLi9jb21tb25fc3BlYyc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtVHJlZSB9IGZyb20gJy4vZmlsZXN5c3RlbSc7XG5cblxuZGVzY3JpYmUoJ0ZpbGVTeXN0ZW1EaXJFbnRyeScsICgpID0+IHtcbiAgdGVzdFRyZWVWaXNpdCh7XG4gICAgY3JlYXRlVHJlZTogcGF0aHMgPT4ge1xuICAgICAgY29uc3QgZmlsZXM6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgICBwYXRocy5mb3JFYWNoKHBhdGggPT4gZmlsZXNbcGF0aF0gPSBwYXRoKTtcblxuICAgICAgY29uc3QgaG9zdCA9IG5ldyB2aXJ0dWFsRnMudGVzdC5UZXN0SG9zdChmaWxlcyk7XG4gICAgICBjb25zdCB0cmVlID0gbmV3IEZpbGVTeXN0ZW1UcmVlKGhvc3QpO1xuXG4gICAgICByZXR1cm4gdHJlZTtcbiAgICB9LFxuICAgIHNldHM6IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2VtcHR5JyxcbiAgICAgICAgZmlsZXM6IFtdLFxuICAgICAgICB2aXNpdHM6IFtcbiAgICAgICAgICB7cm9vdDogJy8nLCBleHBlY3RlZDogW119LFxuICAgICAgICBdLFxuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICBuYW1lOiAnZmlsZSBhdCByb290JyxcbiAgICAgICAgZmlsZXM6IFsnL2ZpbGUnXSxcbiAgICAgICAgdmlzaXRzOiBbXG4gICAgICAgICAge3Jvb3Q6ICcvJ30sXG4gICAgICAgICAge3Jvb3Q6ICcvZmlsZScsIGV4Y2VwdGlvbjogKHtwYXRofSkgPT4gbmV3IFBhdGhJc0ZpbGVFeGNlcHRpb24ocGF0aCl9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2ZpbGUgdW5kZXIgZmlyc3QgbGV2ZWwgZm9sZGVyJyxcbiAgICAgICAgLy8gZHVwbGljYXRlIHVzZSBjYXNlOiBmb2xkZXIgb2Ygc2luZ2xlIGZpbGUgYXQgcm9vdFxuICAgICAgICBmaWxlczogWycvZm9sZGVyL2ZpbGUnXSxcbiAgICAgICAgdmlzaXRzOiBbXG4gICAgICAgICAge3Jvb3Q6ICcvJ30sXG4gICAgICAgICAge3Jvb3Q6ICcvZm9sZGVyJywgZXhwZWN0ZWQ6IFsnL2ZvbGRlci9maWxlJ119LFxuICAgICAgICAgIHtyb290OiAnL2ZvbGRlci9maWxlJywgZXhjZXB0aW9uOiAoe3BhdGh9KSA9PiBuZXcgUGF0aElzRmlsZUV4Y2VwdGlvbihwYXRoKX0sXG4gICAgICAgICAge3Jvb3Q6ICcvd3JvbmcnLCBleHBlY3RlZDogW119LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2ZpbGUgdW5kZXIgbmVzdGVkIGZvbGRlcicsXG4gICAgICAgIC8vIGR1cGxpY2F0ZSB1c2UgY2FzZTogbmVzdGVkIGZvbGRlciBvZiBmaWxlc1xuICAgICAgICBmaWxlczogWycvZm9sZGVyL25lc3RlZF9mb2xkZXIvZmlsZSddLFxuICAgICAgICB2aXNpdHM6IFtcbiAgICAgICAgICB7cm9vdDogJy8nfSxcbiAgICAgICAgICB7cm9vdDogJy9mb2xkZXInLCBleHBlY3RlZDogWycvZm9sZGVyL25lc3RlZF9mb2xkZXIvZmlsZSddfSxcbiAgICAgICAgICB7cm9vdDogJy9mb2xkZXIvbmVzdGVkX2ZvbGRlcicsIGV4cGVjdGVkOiBbJy9mb2xkZXIvbmVzdGVkX2ZvbGRlci9maWxlJ119LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHJvb3Q6ICcvZm9sZGVyL25lc3RlZF9mb2xkZXIvZmlsZScsXG4gICAgICAgICAgICBleGNlcHRpb246ICh7cGF0aH0pID0+IG5ldyBQYXRoSXNGaWxlRXhjZXB0aW9uKHBhdGgpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICduZXN0ZWQgZm9sZGVycycsXG4gICAgICAgIC8vIGR1cGxpY2F0ZSB1c2UgY2FzZTogZm9sZGVyIG9mIGZvbGRlcnMgYXQgcm9vdFxuICAgICAgICAvLyBkdXBsaWNhdGUgdXNlIGNhc2U6IGZvbGRlcnMgb2YgbWl4ZWRcbiAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICAnL2ZvbGRlci9uZXN0ZWRfZm9sZGVyMC9maWxlJyxcbiAgICAgICAgICAnL2ZvbGRlci9uZXN0ZWRfZm9sZGVyMS9mb2xkZXIvZmlsZScsXG4gICAgICAgICAgJy9mb2xkZXIvbmVzdGVkX2ZvbGRlcjIvZmlsZScsXG4gICAgICAgICAgJy9mb2xkZXIvbmVzdGVkX2ZvbGRlcjIvZm9sZGVyL2ZpbGUnLFxuICAgICAgICBdLFxuICAgICAgICB2aXNpdHM6IFtcbiAgICAgICAgICB7cm9vdDogJy8nfSxcbiAgICAgICAgICB7cm9vdDogJy9mb2xkZXInfSxcbiAgICAgICAgICB7cm9vdDogJy9mb2xkZXIvbmVzdGVkX2ZvbGRlcjAnLCBleHBlY3RlZDogWycvZm9sZGVyL25lc3RlZF9mb2xkZXIwL2ZpbGUnXX0sXG4gICAgICAgICAge3Jvb3Q6ICcvZm9sZGVyL25lc3RlZF9mb2xkZXIxJywgZXhwZWN0ZWQ6IFsnL2ZvbGRlci9uZXN0ZWRfZm9sZGVyMS9mb2xkZXIvZmlsZSddfSxcbiAgICAgICAgICB7cm9vdDogJy9mb2xkZXIvbmVzdGVkX2ZvbGRlcjEvZm9sZGVyJywgZXhwZWN0ZWQ6IFsnL2ZvbGRlci9uZXN0ZWRfZm9sZGVyMS9mb2xkZXIvZmlsZSddfSxcbiAgICAgICAgICB7cm9vdDogJy9mb2xkZXIvbmVzdGVkX2ZvbGRlcjInLCBleHBlY3RlZDogW1xuICAgICAgICAgICAgJy9mb2xkZXIvbmVzdGVkX2ZvbGRlcjIvZmlsZScsXG4gICAgICAgICAgICAnL2ZvbGRlci9uZXN0ZWRfZm9sZGVyMi9mb2xkZXIvZmlsZScsXG4gICAgICAgICAgXX0sXG4gICAgICAgICAge3Jvb3Q6ICcvZm9sZGVyL25lc3RlZF9mb2xkZXIyL2ZvbGRlcicsIGV4cGVjdGVkOiBbJy9mb2xkZXIvbmVzdGVkX2ZvbGRlcjIvZm9sZGVyL2ZpbGUnXX0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cblxuZGVzY3JpYmUoJ0ZpbGVTeXN0ZW0nLCAoKSA9PiB7XG4gIGl0KCdjYW4gY3JlYXRlIGZpbGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IGhvc3QgPSBuZXcgdmlydHVhbEZzLnRlc3QuVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgICAnL3N1Yi9kaXJlY3RvcnkvZmlsZTInOiAnJyxcbiAgICAgICcvc3ViL2ZpbGUxJzogJycsXG4gICAgfSk7XG4gICAgY29uc3QgdHJlZSA9IG5ldyBGaWxlU3lzdGVtVHJlZShob3N0KTtcblxuICAgIGV4cGVjdCh0cmVlLmZpbGVzKS50b0VxdWFsKFsnL2hlbGxvJywgJy9zdWIvZGlyZWN0b3J5L2ZpbGUyJywgJy9zdWIvZmlsZTEnXS5tYXAobm9ybWFsaXplKSk7XG4gIH0pO1xufSk7XG4iXX0=