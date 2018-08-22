"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const base_href_webpack_plugin_1 = require("./base-href-webpack-plugin");
function mockCompiler(indexHtml, callback) {
    return {
        plugin: function (_event, compilerCallback) {
            const compilation = {
                plugin: function (_hook, compilationCallback) {
                    const htmlPluginData = {
                        html: indexHtml
                    };
                    compilationCallback(htmlPluginData, callback);
                }
            };
            compilerCallback(compilation);
        }
    };
}
describe('base href webpack plugin', () => {
    const html = core_1.tags.oneLine `
    <html>
      <head></head>
      <body></body>
    </html>
  `;
    it('should do nothing when baseHref is null', () => {
        const plugin = new base_href_webpack_plugin_1.BaseHrefWebpackPlugin({ baseHref: null });
        const compiler = mockCompiler(html, (_x, htmlPluginData) => {
            expect(htmlPluginData.html).toEqual('<body><head></head></body>');
        });
        plugin.apply(compiler);
    });
    it('should insert base tag when not exist', function () {
        const plugin = new base_href_webpack_plugin_1.BaseHrefWebpackPlugin({ baseHref: '/' });
        const compiler = mockCompiler(html, (_x, htmlPluginData) => {
            expect(htmlPluginData.html).toEqual(core_1.tags.oneLine `
          <html>
            <head><base href="/"></head>
            <body></body>
          </html>
        `);
        });
        plugin.apply(compiler);
    });
    it('should replace href attribute when base tag already exists', function () {
        const plugin = new base_href_webpack_plugin_1.BaseHrefWebpackPlugin({ baseHref: '/myUrl/' });
        const compiler = mockCompiler(core_1.tags.oneLine `
          <head><base href="/" target="_blank"></head>
          <body></body>
        `, (_x, htmlPluginData) => {
            expect(htmlPluginData.html).toEqual(core_1.tags.oneLine `
          <head><base href="/myUrl/" target="_blank"></head>
          <body></body>
        `);
        });
        plugin.apply(compiler);
    });
    it('should replace href attribute when baseHref is empty', function () {
        const plugin = new base_href_webpack_plugin_1.BaseHrefWebpackPlugin({ baseHref: '' });
        const compiler = mockCompiler(core_1.tags.oneLine `
          <head><base href="/" target="_blank"></head>
          <body></body>
        `, (_x, htmlPluginData) => {
            expect(htmlPluginData.html).toEqual(core_1.tags.oneLine `
          <head><base href="" target="_blank"></head>
          <body></body>
        `);
        });
        plugin.apply(compiler);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1ocmVmLXdlYnBhY2stcGx1Z2luX3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvc3JjL2FuZ3VsYXItY2xpLWZpbGVzL2xpYi9iYXNlLWhyZWYtd2VicGFjay9iYXNlLWhyZWYtd2VicGFjay1wbHVnaW5fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUJBQWlCO0FBQ2pCLCtEQUErRDs7QUFFL0QsK0NBQTRDO0FBQzVDLHlFQUFpRTtBQUdqRSxzQkFBc0IsU0FBaUIsRUFBRSxRQUFrQjtJQUN6RCxPQUFPO1FBQ0wsTUFBTSxFQUFFLFVBQVUsTUFBVyxFQUFFLGdCQUEwQjtZQUN2RCxNQUFNLFdBQVcsR0FBRztnQkFDbEIsTUFBTSxFQUFFLFVBQVUsS0FBVSxFQUFFLG1CQUE2QjtvQkFDekQsTUFBTSxjQUFjLEdBQUc7d0JBQ3JCLElBQUksRUFBRSxTQUFTO3FCQUNoQixDQUFDO29CQUNGLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDaEQsQ0FBQzthQUNGLENBQUM7WUFDRixnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoQyxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUM7QUFFRCxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLE1BQU0sSUFBSSxHQUFHLFdBQUksQ0FBQyxPQUFPLENBQUE7Ozs7O0dBS3hCLENBQUM7SUFFRixFQUFFLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELE1BQU0sTUFBTSxHQUFHLElBQUksZ0RBQXFCLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFTLENBQUMsQ0FBQztRQUVwRSxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBTyxFQUFFLGNBQW1CLEVBQUUsRUFBRTtZQUNuRSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtRQUMxQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdEQUFxQixDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDNUQsTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQU8sRUFBRSxjQUFtQixFQUFFLEVBQUU7WUFDakUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQTs7Ozs7U0FLL0MsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFTCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFO1FBQy9ELE1BQU0sTUFBTSxHQUFHLElBQUksZ0RBQXFCLENBQUMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUVsRSxNQUFNLFFBQVEsR0FBRyxZQUFZLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQTs7O1NBR3JDLEVBQUUsQ0FBQyxFQUFPLEVBQUUsY0FBbUIsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUE7OztTQUc3QyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUU7UUFDekQsTUFBTSxNQUFNLEdBQUcsSUFBSSxnREFBcUIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTNELE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBOzs7U0FHckMsRUFBRSxDQUFDLEVBQU8sRUFBRSxjQUFtQixFQUFFLEVBQUU7WUFDdEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQTs7O1NBRzdDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGVcbi8vIFRPRE86IGNsZWFudXAgdGhpcyBmaWxlLCBpdCdzIGNvcGllZCBhcyBpcyBmcm9tIEFuZ3VsYXIgQ0xJLlxuXG5pbXBvcnQgeyB0YWdzIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtCYXNlSHJlZldlYnBhY2tQbHVnaW59IGZyb20gJy4vYmFzZS1ocmVmLXdlYnBhY2stcGx1Z2luJztcblxuXG5mdW5jdGlvbiBtb2NrQ29tcGlsZXIoaW5kZXhIdG1sOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICByZXR1cm4ge1xuICAgIHBsdWdpbjogZnVuY3Rpb24gKF9ldmVudDogYW55LCBjb21waWxlckNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgY29uc3QgY29tcGlsYXRpb24gPSB7XG4gICAgICAgIHBsdWdpbjogZnVuY3Rpb24gKF9ob29rOiBhbnksIGNvbXBpbGF0aW9uQ2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgY29uc3QgaHRtbFBsdWdpbkRhdGEgPSB7XG4gICAgICAgICAgICBodG1sOiBpbmRleEh0bWxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbXBpbGF0aW9uQ2FsbGJhY2soaHRtbFBsdWdpbkRhdGEsIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbXBpbGVyQ2FsbGJhY2soY29tcGlsYXRpb24pO1xuICAgIH1cbiAgfTtcbn1cblxuZGVzY3JpYmUoJ2Jhc2UgaHJlZiB3ZWJwYWNrIHBsdWdpbicsICgpID0+IHtcbiAgY29uc3QgaHRtbCA9IHRhZ3Mub25lTGluZWBcbiAgICA8aHRtbD5cbiAgICAgIDxoZWFkPjwvaGVhZD5cbiAgICAgIDxib2R5PjwvYm9keT5cbiAgICA8L2h0bWw+XG4gIGA7XG5cbiAgaXQoJ3Nob3VsZCBkbyBub3RoaW5nIHdoZW4gYmFzZUhyZWYgaXMgbnVsbCcsICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW4gPSBuZXcgQmFzZUhyZWZXZWJwYWNrUGx1Z2luKHsgYmFzZUhyZWY6IG51bGwgfSBhcyBhbnkpO1xuXG4gICAgY29uc3QgY29tcGlsZXIgPSBtb2NrQ29tcGlsZXIoaHRtbCwgKF94OiBhbnksIGh0bWxQbHVnaW5EYXRhOiBhbnkpID0+IHtcbiAgICAgIGV4cGVjdChodG1sUGx1Z2luRGF0YS5odG1sKS50b0VxdWFsKCc8Ym9keT48aGVhZD48L2hlYWQ+PC9ib2R5PicpO1xuICAgIH0pO1xuICAgIHBsdWdpbi5hcHBseShjb21waWxlcik7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgaW5zZXJ0IGJhc2UgdGFnIHdoZW4gbm90IGV4aXN0JywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHBsdWdpbiA9IG5ldyBCYXNlSHJlZldlYnBhY2tQbHVnaW4oeyBiYXNlSHJlZjogJy8nIH0pO1xuICAgIGNvbnN0IGNvbXBpbGVyID0gbW9ja0NvbXBpbGVyKGh0bWwsIChfeDogYW55LCBodG1sUGx1Z2luRGF0YTogYW55KSA9PiB7XG4gICAgICAgIGV4cGVjdChodG1sUGx1Z2luRGF0YS5odG1sKS50b0VxdWFsKHRhZ3Mub25lTGluZWBcbiAgICAgICAgICA8aHRtbD5cbiAgICAgICAgICAgIDxoZWFkPjxiYXNlIGhyZWY9XCIvXCI+PC9oZWFkPlxuICAgICAgICAgICAgPGJvZHk+PC9ib2R5PlxuICAgICAgICAgIDwvaHRtbD5cbiAgICAgICAgYCk7XG4gICAgICB9KTtcblxuICAgIHBsdWdpbi5hcHBseShjb21waWxlcik7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmVwbGFjZSBocmVmIGF0dHJpYnV0ZSB3aGVuIGJhc2UgdGFnIGFscmVhZHkgZXhpc3RzJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHBsdWdpbiA9IG5ldyBCYXNlSHJlZldlYnBhY2tQbHVnaW4oeyBiYXNlSHJlZjogJy9teVVybC8nIH0pO1xuXG4gICAgY29uc3QgY29tcGlsZXIgPSBtb2NrQ29tcGlsZXIodGFncy5vbmVMaW5lYFxuICAgICAgICAgIDxoZWFkPjxiYXNlIGhyZWY9XCIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+PC9oZWFkPlxuICAgICAgICAgIDxib2R5PjwvYm9keT5cbiAgICAgICAgYCwgKF94OiBhbnksIGh0bWxQbHVnaW5EYXRhOiBhbnkpID0+IHtcbiAgICAgIGV4cGVjdChodG1sUGx1Z2luRGF0YS5odG1sKS50b0VxdWFsKHRhZ3Mub25lTGluZWBcbiAgICAgICAgICA8aGVhZD48YmFzZSBocmVmPVwiL215VXJsL1wiIHRhcmdldD1cIl9ibGFua1wiPjwvaGVhZD5cbiAgICAgICAgICA8Ym9keT48L2JvZHk+XG4gICAgICAgIGApO1xuICAgIH0pO1xuICAgIHBsdWdpbi5hcHBseShjb21waWxlcik7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmVwbGFjZSBocmVmIGF0dHJpYnV0ZSB3aGVuIGJhc2VIcmVmIGlzIGVtcHR5JywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHBsdWdpbiA9IG5ldyBCYXNlSHJlZldlYnBhY2tQbHVnaW4oeyBiYXNlSHJlZjogJycgfSk7XG5cbiAgICBjb25zdCBjb21waWxlciA9IG1vY2tDb21waWxlcih0YWdzLm9uZUxpbmVgXG4gICAgICAgICAgPGhlYWQ+PGJhc2UgaHJlZj1cIi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj48L2hlYWQ+XG4gICAgICAgICAgPGJvZHk+PC9ib2R5PlxuICAgICAgICBgLCAoX3g6IGFueSwgaHRtbFBsdWdpbkRhdGE6IGFueSkgPT4ge1xuICAgICAgZXhwZWN0KGh0bWxQbHVnaW5EYXRhLmh0bWwpLnRvRXF1YWwodGFncy5vbmVMaW5lYFxuICAgICAgICAgIDxoZWFkPjxiYXNlIGhyZWY9XCJcIiB0YXJnZXQ9XCJfYmxhbmtcIj48L2hlYWQ+XG4gICAgICAgICAgPGJvZHk+PC9ib2R5PlxuICAgICAgICBgKTtcbiAgICB9KTtcbiAgICBwbHVnaW4uYXBwbHkoY29tcGlsZXIpO1xuICB9KTtcbn0pO1xuIl19