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
const express = require("express"); // tslint:disable-line:no-implicit-dependencies
const http = require("http");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
describe('Dev Server Builder proxy', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        // Create an express app that serves as a proxy.
        const app = express();
        const server = http.createServer(app);
        server.listen(0);
        app.set('port', server.address().port);
        app.get('/api/test', function (_req, res) {
            res.send('TEST_API_RETURN');
        });
        const backendHost = 'localhost';
        const backendPort = server.address().port;
        const proxyServerUrl = `http://${backendHost}:${backendPort}`;
        utils_1.host.writeMultipleFiles({
            'proxy.config.json': `{ "/api/*": { "target": "${proxyServerUrl}" } }`,
        });
        const overrides = { proxyConfig: 'proxy.config.json' };
        testing_1.runTargetSpec(utils_1.host, utils_1.devServerTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.concatMap(() => rxjs_1.from(testing_1.request('http://localhost:4200/api/test'))), operators_1.tap(response => {
            expect(response).toContain('TEST_API_RETURN');
            server.close();
        }), operators_1.take(1)).toPromise().then(done, done.fail);
    }, 30000);
    it('errors out with a missing proxy file', (done) => {
        const overrides = { proxyConfig: '../proxy.config.json' };
        testing_1.runTargetSpec(utils_1.host, utils_1.devServerTargetSpec, overrides)
            .subscribe(undefined, () => done(), done.fail);
    }, 30000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlfc3BlY19sYXJnZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfYW5ndWxhci90ZXN0L2Rldi1zZXJ2ZXIvcHJveHlfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUEyRTtBQUMzRSxtQ0FBbUMsQ0FBQywrQ0FBK0M7QUFDbkYsNkJBQTZCO0FBQzdCLCtCQUE0QjtBQUM1Qiw4Q0FBc0Q7QUFFdEQsb0NBQXFEO0FBR3JELFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ25CLGdEQUFnRDtRQUNoRCxNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFVBQVUsSUFBSSxFQUFFLEdBQUc7WUFDdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQ2hDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDMUMsTUFBTSxjQUFjLEdBQUcsVUFBVSxXQUFXLElBQUksV0FBVyxFQUFFLENBQUM7UUFFOUQsWUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQ3RCLG1CQUFtQixFQUFFLDRCQUE0QixjQUFjLE9BQU87U0FDdkUsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQXFDLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLENBQUM7UUFFekYsdUJBQWEsQ0FBQyxZQUFJLEVBQUUsMkJBQW1CLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUN0RCxlQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQzFELHFCQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBSSxDQUFDLGlCQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLEVBQ2hFLGVBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNiLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDLEVBQ0YsZ0JBQUksQ0FBQyxDQUFDLENBQUMsQ0FDUixDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVWLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ2xELE1BQU0sU0FBUyxHQUFxQyxFQUFFLFdBQVcsRUFBRSxzQkFBc0IsRUFBRSxDQUFDO1FBRTVGLHVCQUFhLENBQUMsWUFBSSxFQUFFLDJCQUFtQixFQUFFLFNBQVMsQ0FBQzthQUNoRCxTQUFTLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDWixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgcmVxdWVzdCwgcnVuVGFyZ2V0U3BlYyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QvdGVzdGluZyc7XG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNvbmNhdE1hcCwgdGFrZSwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGV2U2VydmVyQnVpbGRlck9wdGlvbnMgfSBmcm9tICcuLi8uLi9zcmMnO1xuaW1wb3J0IHsgZGV2U2VydmVyVGFyZ2V0U3BlYywgaG9zdCB9IGZyb20gJy4uL3V0aWxzJztcblxuXG5kZXNjcmliZSgnRGV2IFNlcnZlciBCdWlsZGVyIHByb3h5JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBpdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgIC8vIENyZWF0ZSBhbiBleHByZXNzIGFwcCB0aGF0IHNlcnZlcyBhcyBhIHByb3h5LlxuICAgIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcbiAgICBjb25zdCBzZXJ2ZXIgPSBodHRwLmNyZWF0ZVNlcnZlcihhcHApO1xuICAgIHNlcnZlci5saXN0ZW4oMCk7XG5cbiAgICBhcHAuc2V0KCdwb3J0Jywgc2VydmVyLmFkZHJlc3MoKS5wb3J0KTtcbiAgICBhcHAuZ2V0KCcvYXBpL3Rlc3QnLCBmdW5jdGlvbiAoX3JlcSwgcmVzKSB7XG4gICAgICByZXMuc2VuZCgnVEVTVF9BUElfUkVUVVJOJyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBiYWNrZW5kSG9zdCA9ICdsb2NhbGhvc3QnO1xuICAgIGNvbnN0IGJhY2tlbmRQb3J0ID0gc2VydmVyLmFkZHJlc3MoKS5wb3J0O1xuICAgIGNvbnN0IHByb3h5U2VydmVyVXJsID0gYGh0dHA6Ly8ke2JhY2tlbmRIb3N0fToke2JhY2tlbmRQb3J0fWA7XG5cbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7XG4gICAgICAncHJveHkuY29uZmlnLmpzb24nOiBgeyBcIi9hcGkvKlwiOiB7IFwidGFyZ2V0XCI6IFwiJHtwcm94eVNlcnZlclVybH1cIiB9IH1gLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgb3ZlcnJpZGVzOiBQYXJ0aWFsPERldlNlcnZlckJ1aWxkZXJPcHRpb25zPiA9IHsgcHJveHlDb25maWc6ICdwcm94eS5jb25maWcuanNvbicgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgZGV2U2VydmVyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdGFwKChidWlsZEV2ZW50KSA9PiBleHBlY3QoYnVpbGRFdmVudC5zdWNjZXNzKS50b0JlKHRydWUpKSxcbiAgICAgIGNvbmNhdE1hcCgoKSA9PiBmcm9tKHJlcXVlc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6NDIwMC9hcGkvdGVzdCcpKSksXG4gICAgICB0YXAocmVzcG9uc2UgPT4ge1xuICAgICAgICBleHBlY3QocmVzcG9uc2UpLnRvQ29udGFpbignVEVTVF9BUElfUkVUVVJOJyk7XG4gICAgICAgIHNlcnZlci5jbG9zZSgpO1xuICAgICAgfSksXG4gICAgICB0YWtlKDEpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9LCAzMDAwMCk7XG5cbiAgaXQoJ2Vycm9ycyBvdXQgd2l0aCBhIG1pc3NpbmcgcHJveHkgZmlsZScsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzOiBQYXJ0aWFsPERldlNlcnZlckJ1aWxkZXJPcHRpb25zPiA9IHsgcHJveHlDb25maWc6ICcuLi9wcm94eS5jb25maWcuanNvbicgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgZGV2U2VydmVyVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKVxuICAgICAgLnN1YnNjcmliZSh1bmRlZmluZWQsICgpID0+IGRvbmUoKSwgZG9uZS5mYWlsKTtcbiAgfSwgMzAwMDApO1xufSk7XG4iXX0=