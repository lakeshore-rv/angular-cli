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
describe('Browser Builder service worker', () => {
    const manifest = {
        index: '/index.html',
        assetGroups: [
            {
                name: 'app',
                installMode: 'prefetch',
                resources: {
                    files: ['/favicon.ico', '/index.html'],
                    versionedFiles: [
                        '/*.bundle.css',
                        '/*.bundle.js',
                        '/*.chunk.js',
                    ],
                },
            },
            {
                name: 'assets',
                installMode: 'lazy',
                updateMode: 'prefetch',
                resources: {
                    files: ['/assets/**'],
                },
            },
        ],
    };
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('errors if no ngsw-config.json is present', (done) => {
        const overrides = { serviceWorker: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides)
            .subscribe(event => {
            expect(event.success).toBe(false);
        }, () => done(), done.fail);
    });
    it('works with service worker', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/ngsw-config.json': JSON.stringify(manifest),
            'src/assets/folder-asset.txt': 'folder-asset.txt',
        });
        const overrides = { serviceWorker: true };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap(buildEvent => {
            expect(buildEvent.success).toBe(true);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/ngsw.json')));
            const ngswJson = JSON.parse(core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize('dist/ngsw.json'))));
            // Verify index and assets are there.
            expect(ngswJson).toEqual({
                configVersion: 1,
                index: '/index.html',
                navigationUrls: [
                    { positive: true, regex: '^\\\/.*$' },
                    { positive: false, regex: '^\\\/(?:.+\\\/)?[^\/]*\\.[^\/]*$' },
                    { positive: false, regex: '^\\\/(?:.+\\\/)?[^\/]*__[^\/]*$' },
                    { positive: false, regex: '^\\\/(?:.+\\\/)?[^\/]*__[^\/]*\\\/.*$' },
                ],
                assetGroups: [
                    {
                        name: 'app',
                        installMode: 'prefetch',
                        updateMode: 'prefetch',
                        urls: [
                            '/favicon.ico',
                            '/index.html',
                        ],
                        patterns: [],
                    },
                    {
                        name: 'assets',
                        installMode: 'lazy',
                        updateMode: 'prefetch',
                        urls: [
                            '/assets/folder-asset.txt',
                        ],
                        patterns: [],
                    },
                ],
                dataGroups: [],
                hashTable: {
                    '/favicon.ico': '84161b857f5c547e3699ddfbffc6d8d737542e01',
                    '/assets/folder-asset.txt': '617f202968a6a81050aa617c2e28e1dca11ce8d4',
                    '/index.html': '843c96f0aeadc8f093b1b2203c08891ecd8f7425',
                },
            });
        })).toPromise().then(done, done.fail);
    });
    it('works with service worker and baseHref', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/ngsw-config.json': JSON.stringify(manifest),
            'src/assets/folder-asset.txt': 'folder-asset.txt',
        });
        const overrides = { serviceWorker: true, baseHref: '/foo/bar' };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap(buildEvent => {
            expect(buildEvent.success).toBe(true);
            expect(utils_1.host.scopedSync().exists(core_1.normalize('dist/ngsw.json')));
            const ngswJson = JSON.parse(core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize('dist/ngsw.json'))));
            // Verify index and assets include the base href.
            expect(ngswJson).toEqual({
                configVersion: 1,
                index: '/foo/bar/index.html',
                navigationUrls: [
                    { positive: true, regex: '^\\\/.*$' },
                    { positive: false, regex: '^\\\/(?:.+\\\/)?[^\/]*\\.[^\/]*$' },
                    { positive: false, regex: '^\\\/(?:.+\\\/)?[^\/]*__[^\/]*$' },
                    { positive: false, regex: '^\\\/(?:.+\\\/)?[^\/]*__[^\/]*\\\/.*$' },
                ],
                assetGroups: [
                    {
                        name: 'app',
                        installMode: 'prefetch',
                        updateMode: 'prefetch',
                        urls: [
                            '/foo/bar/favicon.ico',
                            '/foo/bar/index.html',
                        ],
                        patterns: [],
                    },
                    {
                        name: 'assets',
                        installMode: 'lazy',
                        updateMode: 'prefetch',
                        urls: [
                            '/foo/bar/assets/folder-asset.txt',
                        ],
                        patterns: [],
                    },
                ],
                dataGroups: [],
                hashTable: {
                    '/foo/bar/favicon.ico': '84161b857f5c547e3699ddfbffc6d8d737542e01',
                    '/foo/bar/assets/folder-asset.txt': '617f202968a6a81050aa617c2e28e1dca11ce8d4',
                    '/foo/bar/index.html': '9ef50361678004b3b197c12cbc74962e5a15b844',
                },
            });
        })).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS13b3JrZXJfc3BlY19sYXJnZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci90ZXN0L2Jyb3dzZXIvc2VydmljZS13b3JrZXJfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUFrRTtBQUNsRSwrQ0FBNEQ7QUFDNUQsOENBQXFDO0FBQ3JDLG9DQUFtRDtBQUduRCxRQUFRLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO0lBQzlDLE1BQU0sUUFBUSxHQUFHO1FBQ2YsS0FBSyxFQUFFLGFBQWE7UUFDcEIsV0FBVyxFQUFFO1lBQ1g7Z0JBQ0UsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsV0FBVyxFQUFFLFVBQVU7Z0JBQ3ZCLFNBQVMsRUFBRTtvQkFDVCxLQUFLLEVBQUUsQ0FBQyxjQUFjLEVBQUUsYUFBYSxDQUFDO29CQUN0QyxjQUFjLEVBQUU7d0JBQ2QsZUFBZTt3QkFDZixjQUFjO3dCQUNkLGFBQWE7cUJBQ2Q7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLElBQUksRUFBRSxRQUFRO2dCQUNkLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsU0FBUyxFQUFFO29CQUNULEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDdEI7YUFDRjtTQUNGO0tBQ0YsQ0FBQztJQUVGLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJ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O29CQUM5RCxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLGlDQUFpQyxFQUFFO29CQUM3RCxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLHVDQUF1QyxFQUFFO2lCQUNwRTtnQkFDRCxXQUFXLEVBQUU7b0JBQ1g7d0JBQ0UsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsV0FBVyxFQUFFLFVBQVU7d0JBQ3ZCLFVBQVUsRUFBRSxVQUFVO3dCQUN0QixJQUFJLEVBQUU7NEJBQ0osc0JBQXNCOzRCQUN0QixxQkFBcUI7eUJBQ3RCO3dCQUNELFFBQVEsRUFBRSxFQUFFO3FCQUNiO29CQUNEO3dCQUNFLElBQUksRUFBRSxRQUFRO3dCQUNkLFdBQVcsRUFBRSxNQUFNO3dCQUNuQixVQUFVLEVBQUUsVUFBVTt3QkFDdEIsSUFBSSxFQUFFOzRCQUNKLGtDQUFrQzt5QkFDbkM7d0JBQ0QsUUFBUSxFQUFFLEVBQUU7cUJBQ2I7aUJBQ0Y7Z0JBQ0QsVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFO29CQUNULHNCQUFzQixFQUFFLDBDQUEwQztvQkFDbEUsa0NBQWtDLEVBQUUsMENBQTBDO29CQUM5RSxxQkFBcUIsRUFBRSwwQ0FBMEM7aUJBQ2xFO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQ0gsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBydW5UYXJnZXRTcGVjIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdC90ZXN0aW5nJztcbmltcG9ydCB7IG5vcm1hbGl6ZSwgdmlydHVhbEZzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgYnJvd3NlclRhcmdldFNwZWMsIGhvc3QgfSBmcm9tICcuLi91dGlscyc7XG5cblxuZGVzY3JpYmUoJ0Jyb3dzZXIgQnVpbGRlciBzZXJ2aWNlIHdvcmtlcicsICgpID0+IHtcbiAgY29uc3QgbWFuaWZlc3QgPSB7XG4gICAgaW5kZXg6ICcvaW5kZXguaHRtbCcsXG4gICAgYXNzZXRHcm91cHM6IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2FwcCcsXG4gICAgICAgIGluc3RhbGxNb2RlOiAncHJlZmV0Y2gnLFxuICAgICAgICByZXNvdXJjZXM6IHtcbiAgICAgICAgICBmaWxlczogWycvZmF2aWNvbi5pY28nLCAnL2luZGV4Lmh0bWwnXSxcbiAgICAgICAgICB2ZXJzaW9uZWRGaWxlczogW1xuICAgICAgICAgICAgJy8qLmJ1bmRsZS5jc3MnLFxuICAgICAgICAgICAgJy8qLmJ1bmRsZS5qcycsXG4gICAgICAgICAgICAnLyouY2h1bmsuanMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYXNzZXRzJyxcbiAgICAgICAgaW5zdGFsbE1vZGU6ICdsYXp5JyxcbiAgICAgICAgdXBkYXRlTW9kZTogJ3ByZWZldGNoJyxcbiAgICAgICAgcmVzb3VyY2VzOiB7XG4gICAgICAgICAgZmlsZXM6IFsnL2Fzc2V0cy8qKiddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuXG4gIGJlZm9yZUVhY2goZG9uZSA9PiBob3N0LmluaXRpYWxpemUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuICBhZnRlckVhY2goZG9uZSA9PiBob3N0LnJlc3RvcmUoKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCkpO1xuXG4gIGl0KCdlcnJvcnMgaWYgbm8gbmdzdy1jb25maWcuanNvbiBpcyBwcmVzZW50JywgKGRvbmUpID0+IHtcbiAgICBjb25zdCBvdmVycmlkZXMgPSB7IHNlcnZpY2VXb3JrZXI6IHRydWUgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcylcbiAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICBleHBlY3QoZXZlbnQuc3VjY2VzcykudG9CZShmYWxzZSk7XG4gICAgICB9LCAoKSA9PiBkb25lKCksIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCd3b3JrcyB3aXRoIHNlcnZpY2Ugd29ya2VyJywgKGRvbmUpID0+IHtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAnc3JjL25nc3ctY29uZmlnLmpzb24nOiBKU09OLnN0cmluZ2lmeShtYW5pZmVzdCksXG4gICAgICAnc3JjL2Fzc2V0cy9mb2xkZXItYXNzZXQudHh0JzogJ2ZvbGRlci1hc3NldC50eHQnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzID0geyBzZXJ2aWNlV29ya2VyOiB0cnVlIH07XG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdGFwKGJ1aWxkRXZlbnQgPT4ge1xuICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKG5vcm1hbGl6ZSgnZGlzdC9uZ3N3Lmpzb24nKSkpO1xuICAgICAgICBjb25zdCBuZ3N3SnNvbiA9IEpTT04ucGFyc2UodmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhcbiAgICAgICAgICBob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZSgnZGlzdC9uZ3N3Lmpzb24nKSkpKTtcbiAgICAgICAgLy8gVmVyaWZ5IGluZGV4IGFuZCBhc3NldHMgYXJlIHRoZXJlLlxuICAgICAgICBleHBlY3Qobmdzd0pzb24pLnRvRXF1YWwoe1xuICAgICAgICAgIGNvbmZpZ1ZlcnNpb246IDEsXG4gICAgICAgICAgaW5kZXg6ICcvaW5kZXguaHRtbCcsXG4gICAgICAgICAgbmF2aWdhdGlvblVybHM6IFtcbiAgICAgICAgICAgIHsgcG9zaXRpdmU6IHRydWUsIHJlZ2V4OiAnXlxcXFxcXC8uKiQnIH0sXG4gICAgICAgICAgICB7IHBvc2l0aXZlOiBmYWxzZSwgcmVnZXg6ICdeXFxcXFxcLyg/Oi4rXFxcXFxcLyk/W15cXC9dKlxcXFwuW15cXC9dKiQnIH0sXG4gICAgICAgICAgICB7IHBvc2l0aXZlOiBmYWxzZSwgcmVnZXg6ICdeXFxcXFxcLyg/Oi4rXFxcXFxcLyk/W15cXC9dKl9fW15cXC9dKiQnIH0sXG4gICAgICAgICAgICB7IHBvc2l0aXZlOiBmYWxzZSwgcmVnZXg6ICdeXFxcXFxcLyg/Oi4rXFxcXFxcLyk/W15cXC9dKl9fW15cXC9dKlxcXFxcXC8uKiQnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBhc3NldEdyb3VwczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnYXBwJyxcbiAgICAgICAgICAgICAgaW5zdGFsbE1vZGU6ICdwcmVmZXRjaCcsXG4gICAgICAgICAgICAgIHVwZGF0ZU1vZGU6ICdwcmVmZXRjaCcsXG4gICAgICAgICAgICAgIHVybHM6IFtcbiAgICAgICAgICAgICAgICAnL2Zhdmljb24uaWNvJyxcbiAgICAgICAgICAgICAgICAnL2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBwYXR0ZXJuczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnYXNzZXRzJyxcbiAgICAgICAgICAgICAgaW5zdGFsbE1vZGU6ICdsYXp5JyxcbiAgICAgICAgICAgICAgdXBkYXRlTW9kZTogJ3ByZWZldGNoJyxcbiAgICAgICAgICAgICAgdXJsczogW1xuICAgICAgICAgICAgICAgICcvYXNzZXRzL2ZvbGRlci1hc3NldC50eHQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBwYXR0ZXJuczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZGF0YUdyb3VwczogW10sXG4gICAgICAgICAgaGFzaFRhYmxlOiB7XG4gICAgICAgICAgICAnL2Zhdmljb24uaWNvJzogJzg0MTYxYjg1N2Y1YzU0N2UzNjk5ZGRmYmZmYzZkOGQ3Mzc1NDJlMDEnLFxuICAgICAgICAgICAgJy9hc3NldHMvZm9sZGVyLWFzc2V0LnR4dCc6ICc2MTdmMjAyOTY4YTZhODEwNTBhYTYxN2MyZTI4ZTFkY2ExMWNlOGQ0JyxcbiAgICAgICAgICAgICcvaW5kZXguaHRtbCc6ICc4NDNjOTZmMGFlYWRjOGYwOTNiMWIyMjAzYzA4ODkxZWNkOGY3NDI1JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdCgnd29ya3Mgd2l0aCBzZXJ2aWNlIHdvcmtlciBhbmQgYmFzZUhyZWYnLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvbmdzdy1jb25maWcuanNvbic6IEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSxcbiAgICAgICdzcmMvYXNzZXRzL2ZvbGRlci1hc3NldC50eHQnOiAnZm9sZGVyLWFzc2V0LnR4dCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7IHNlcnZpY2VXb3JrZXI6IHRydWUsIGJhc2VIcmVmOiAnL2Zvby9iYXInIH07XG4gICAgcnVuVGFyZ2V0U3BlYyhob3N0LCBicm93c2VyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdGFwKGJ1aWxkRXZlbnQgPT4ge1xuICAgICAgICBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoaG9zdC5zY29wZWRTeW5jKCkuZXhpc3RzKG5vcm1hbGl6ZSgnZGlzdC9uZ3N3Lmpzb24nKSkpO1xuICAgICAgICBjb25zdCBuZ3N3SnNvbiA9IEpTT04ucGFyc2UodmlydHVhbEZzLmZpbGVCdWZmZXJUb1N0cmluZyhcbiAgICAgICAgICBob3N0LnNjb3BlZFN5bmMoKS5yZWFkKG5vcm1hbGl6ZSgnZGlzdC9uZ3N3Lmpzb24nKSkpKTtcbiAgICAgICAgLy8gVmVyaWZ5IGluZGV4IGFuZCBhc3NldHMgaW5jbHVkZSB0aGUgYmFzZSBocmVmLlxuICAgICAgICBleHBlY3Qobmdzd0pzb24pLnRvRXF1YWwoe1xuICAgICAgICAgIGNvbmZpZ1ZlcnNpb246IDEsXG4gICAgICAgICAgaW5kZXg6ICcvZm9vL2Jhci9pbmRleC5odG1sJyxcbiAgICAgICAgICBuYXZpZ2F0aW9uVXJsczogW1xuICAgICAgICAgICAgeyBwb3NpdGl2ZTogdHJ1ZSwgcmVnZXg6ICdeXFxcXFxcLy4qJCcgfSxcbiAgICAgICAgICAgIHsgcG9zaXRpdmU6IGZhbHNlLCByZWdleDogJ15cXFxcXFwvKD86LitcXFxcXFwvKT9bXlxcL10qXFxcXC5bXlxcL10qJCcgfSxcbiAgICAgICAgICAgIHsgcG9zaXRpdmU6IGZhbHNlLCByZWdleDogJ15cXFxcXFwvKD86LitcXFxcXFwvKT9bXlxcL10qX19bXlxcL10qJCcgfSxcbiAgICAgICAgICAgIHsgcG9zaXRpdmU6IGZhbHNlLCByZWdleDogJ15cXFxcXFwvKD86LitcXFxcXFwvKT9bXlxcL10qX19bXlxcL10qXFxcXFxcLy4qJCcgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGFzc2V0R3JvdXBzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdhcHAnLFxuICAgICAgICAgICAgICBpbnN0YWxsTW9kZTogJ3ByZWZldGNoJyxcbiAgICAgICAgICAgICAgdXBkYXRlTW9kZTogJ3ByZWZldGNoJyxcbiAgICAgICAgICAgICAgdXJsczogW1xuICAgICAgICAgICAgICAgICcvZm9vL2Jhci9mYXZpY29uLmljbycsXG4gICAgICAgICAgICAgICAgJy9mb28vYmFyL2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBwYXR0ZXJuczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnYXNzZXRzJyxcbiAgICAgICAgICAgICAgaW5zdGFsbE1vZGU6ICdsYXp5JyxcbiAgICAgICAgICAgICAgdXBkYXRlTW9kZTogJ3ByZWZldGNoJyxcbiAgICAgICAgICAgICAgdXJsczogW1xuICAgICAgICAgICAgICAgICcvZm9vL2Jhci9hc3NldHMvZm9sZGVyLWFzc2V0LnR4dCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIHBhdHRlcm5zOiBbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBkYXRhR3JvdXBzOiBbXSxcbiAgICAgICAgICBoYXNoVGFibGU6IHtcbiAgICAgICAgICAgICcvZm9vL2Jhci9mYXZpY29uLmljbyc6ICc4NDE2MWI4NTdmNWM1NDdlMzY5OWRkZmJmZmM2ZDhkNzM3NTQyZTAxJyxcbiAgICAgICAgICAgICcvZm9vL2Jhci9hc3NldHMvZm9sZGVyLWFzc2V0LnR4dCc6ICc2MTdmMjAyOTY4YTZhODEwNTBhYTYxN2MyZTI4ZTFkY2ExMWNlOGQ0JyxcbiAgICAgICAgICAgICcvZm9vL2Jhci9pbmRleC5odG1sJzogJzllZjUwMzYxNjc4MDA0YjNiMTk3YzEyY2JjNzQ5NjJlNWExNWI4NDQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xufSk7XG4iXX0=