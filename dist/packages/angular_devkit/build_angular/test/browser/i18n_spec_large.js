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
describe('Browser Builder i18n', () => {
    const outputPath = core_1.normalize('dist');
    const emptyTranslationFile = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
        <file source-language="en" datatype="plaintext" original="ng2.template">
          <body>
          </body>
        </file>
      </xliff>`;
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('uses translations', (done) => {
        utils_1.host.writeMultipleFiles({
            'src/locale/messages.fr.xlf': `
      <?xml version="1.0" encoding="UTF-8" ?>
      <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
      <file source-language="en" datatype="plaintext" original="ng2.template">
      <body>
      <trans-unit id="8def8481e91291a52f9baa31cbdb313e6a6ca02b" datatype="html">
      <source>Hello i18n!</source>
      <target>Bonjour i18n!</target>
      <note priority="1" from="description">An introduction header for this sample</note>
      </trans-unit>
      </body>
      </file>
      </xliff>
      `,
        });
        utils_1.host.appendToFile('src/app/app.component.html', '<h1 i18n="An introduction header for this sample">Hello i18n!</h1>');
        const overrides = {
            aot: true,
            i18nFile: 'src/locale/messages.fr.xlf',
            i18nFormat: 'true',
            i18nLocale: 'fr',
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = core_1.join(outputPath, 'main.js');
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(/Bonjour i18n!/);
        })).toPromise().then(done, done.fail);
    });
    it('ignores missing translations', (done) => {
        const overrides = {
            aot: true,
            i18nFile: 'src/locale/messages.fr.xlf',
            i18nFormat: 'true',
            i18nLocale: 'fr',
            i18nMissingTranslation: 'ignore',
        };
        utils_1.host.writeMultipleFiles({ 'src/locale/messages.fr.xlf': emptyTranslationFile });
        utils_1.host.appendToFile('src/app/app.component.html', '<p i18n>Other content</p>');
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = core_1.join(outputPath, 'main.js');
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(/Other content/);
        })).toPromise().then(done, done.fail);
    });
    it('reports errors for missing translations', (done) => {
        const overrides = {
            aot: true,
            i18nFile: 'src/locale/messages.fr.xlf',
            i18nFormat: 'true',
            i18nLocale: 'fr',
            i18nMissingTranslation: 'error',
        };
        utils_1.host.writeMultipleFiles({ 'src/locale/messages.fr.xlf': emptyTranslationFile });
        utils_1.host.appendToFile('src/app/app.component.html', '<p i18n>Other content</p>');
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(false))).toPromise().then(done, done.fail);
    });
    it('register locales', (done) => {
        const overrides = { aot: true, i18nLocale: 'fr_FR' };
        testing_1.runTargetSpec(utils_1.host, utils_1.browserTargetSpec, overrides).pipe(operators_1.tap((buildEvent) => expect(buildEvent.success).toBe(true)), operators_1.tap(() => {
            const fileName = core_1.join(outputPath, 'main.js');
            const content = core_1.virtualFs.fileBufferToString(utils_1.host.scopedSync().read(core_1.normalize(fileName)));
            expect(content).toMatch(/registerLocaleData/);
            expect(content).toMatch(/angular_common_locales_fr/);
        })).toPromise().then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9zcGVjX2xhcmdlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9hbmd1bGFyL3Rlc3QvYnJvd3Nlci9pMThuX3NwZWNfbGFyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrREFBa0U7QUFDbEUsK0NBQWtFO0FBQ2xFLDhDQUFxQztBQUNyQyxvQ0FBbUQ7QUFHbkQsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxNQUFNLFVBQVUsR0FBRyxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sb0JBQW9CLEdBQUc7Ozs7Ozs7ZUFPaEIsQ0FBQztJQUVkLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBFLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQy9CLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQztZQUN0Qiw0QkFBNEIsRUFBRTs7Ozs7Ozs7Ozs7OztPQWE3QjtTQUNGLENBQUMsQ0FBQztRQUVILFlBQUksQ0FBQyxZQUFZLENBQUMsNEJBQTRCLEVBQzVDLG9FQUFvRSxDQUFDLENBQUM7UUFFeEUsTUFBTSxTQUFTLEdBQUc7WUFDaEIsR0FBRyxFQUFFLElBQUk7WUFDVCxRQUFRLEVBQUUsNEJBQTRCO1lBQ3RDLFVBQVUs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XG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7IHJ1blRhcmdldFNwZWMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0L3Rlc3RpbmcnO1xuaW1wb3J0IHsgam9pbiwgbm9ybWFsaXplLCB2aXJ0dWFsRnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBicm93c2VyVGFyZ2V0U3BlYywgaG9zdCB9IGZyb20gJy4uL3V0aWxzJztcblxuXG5kZXNjcmliZSgnQnJvd3NlciBCdWlsZGVyIGkxOG4nLCAoKSA9PiB7XG4gIGNvbnN0IG91dHB1dFBhdGggPSBub3JtYWxpemUoJ2Rpc3QnKTtcbiAgY29uc3QgZW1wdHlUcmFuc2xhdGlvbkZpbGUgPSBgXG4gICAgICA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiID8+XG4gICAgICA8eGxpZmYgdmVyc2lvbj1cIjEuMlwiIHhtbG5zPVwidXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjEuMlwiPlxuICAgICAgICA8ZmlsZSBzb3VyY2UtbGFuZ3VhZ2U9XCJlblwiIGRhdGF0eXBlPVwicGxhaW50ZXh0XCIgb3JpZ2luYWw9XCJuZzIudGVtcGxhdGVcIj5cbiAgICAgICAgICA8Ym9keT5cbiAgICAgICAgICA8L2JvZHk+XG4gICAgICAgIDwvZmlsZT5cbiAgICAgIDwveGxpZmY+YDtcblxuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBpdCgndXNlcyB0cmFuc2xhdGlvbnMnLCAoZG9uZSkgPT4ge1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvbG9jYWxlL21lc3NhZ2VzLmZyLnhsZic6IGBcbiAgICAgIDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgPz5cbiAgICAgIDx4bGlmZiB2ZXJzaW9uPVwiMS4yXCIgeG1sbnM9XCJ1cm46b2FzaXM6bmFtZXM6dGM6eGxpZmY6ZG9jdW1lbnQ6MS4yXCI+XG4gICAgICA8ZmlsZSBzb3VyY2UtbGFuZ3VhZ2U9XCJlblwiIGRhdGF0eXBlPVwicGxhaW50ZXh0XCIgb3JpZ2luYWw9XCJuZzIudGVtcGxhdGVcIj5cbiAgICAgIDxib2R5PlxuICAgICAgPHRyYW5zLXVuaXQgaWQ9XCI4ZGVmODQ4MWU5MTI5MWE1MmY5YmFhMzFjYmRiMzEzZTZhNmNhMDJiXCIgZGF0YXR5cGU9XCJodG1sXCI+XG4gICAgICA8c291cmNlPkhlbGxvIGkxOG4hPC9zb3VyY2U+XG4gICAgICA8dGFyZ2V0PkJvbmpvdXIgaTE4biE8L3RhcmdldD5cbiAgICAgIDxub3RlIHByaW9yaXR5PVwiMVwiIGZyb209XCJkZXNjcmlwdGlvblwiPkFuIGludHJvZHVjdGlvbiBoZWFkZXIgZm9yIHRoaXMgc2FtcGxlPC9ub3RlPlxuICAgICAgPC90cmFucy11bml0PlxuICAgICAgPC9ib2R5PlxuICAgICAgPC9maWxlPlxuICAgICAgPC94bGlmZj5cbiAgICAgIGAsXG4gICAgfSk7XG5cbiAgICBob3N0LmFwcGVuZFRvRmlsZSgnc3JjL2FwcC9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgJzxoMSBpMThuPVwiQW4gaW50cm9kdWN0aW9uIGhlYWRlciBmb3IgdGhpcyBzYW1wbGVcIj5IZWxsbyBpMThuITwvaDE+Jyk7XG5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7XG4gICAgICBhb3Q6IHRydWUsXG4gICAgICBpMThuRmlsZTogJ3NyYy9sb2NhbGUvbWVzc2FnZXMuZnIueGxmJyxcbiAgICAgIGkxOG5Gb3JtYXQ6ICd0cnVlJyxcbiAgICAgIGkxOG5Mb2NhbGU6ICdmcicsXG4gICAgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGpvaW4ob3V0cHV0UGF0aCwgJ21haW4uanMnKTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoZmlsZU5hbWUpKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9Cb25qb3VyIGkxOG4hLyk7XG4gICAgICB9KSxcbiAgICApLnRvUHJvbWlzZSgpLnRoZW4oZG9uZSwgZG9uZS5mYWlsKTtcbiAgfSk7XG5cbiAgaXQoJ2lnbm9yZXMgbWlzc2luZyB0cmFuc2xhdGlvbnMnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgIGFvdDogdHJ1ZSxcbiAgICAgIGkxOG5GaWxlOiAnc3JjL2xvY2FsZS9tZXNzYWdlcy5mci54bGYnLFxuICAgICAgaTE4bkZvcm1hdDogJ3RydWUnLFxuICAgICAgaTE4bkxvY2FsZTogJ2ZyJyxcbiAgICAgIGkxOG5NaXNzaW5nVHJhbnNsYXRpb246ICdpZ25vcmUnLFxuICAgIH07XG5cbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyh7ICdzcmMvbG9jYWxlL21lc3NhZ2VzLmZyLnhsZic6IGVtcHR5VHJhbnNsYXRpb25GaWxlIH0pO1xuICAgIGhvc3QuYXBwZW5kVG9GaWxlKCdzcmMvYXBwL2FwcC5jb21wb25lbnQuaHRtbCcsICc8cCBpMThuPk90aGVyIGNvbnRlbnQ8L3A+Jyk7XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGJyb3dzZXJUYXJnZXRTcGVjLCBvdmVycmlkZXMpLnBpcGUoXG4gICAgICB0YXAoKGJ1aWxkRXZlbnQpID0+IGV4cGVjdChidWlsZEV2ZW50LnN1Y2Nlc3MpLnRvQmUodHJ1ZSkpLFxuICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBqb2luKG91dHB1dFBhdGgsICdtYWluLmpzJyk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB2aXJ0dWFsRnMuZmlsZUJ1ZmZlclRvU3RyaW5nKGhvc3Quc2NvcGVkU3luYygpLnJlYWQobm9ybWFsaXplKGZpbGVOYW1lKSkpO1xuICAgICAgICBleHBlY3QoY29udGVudCkudG9NYXRjaCgvT3RoZXIgY29udGVudC8pO1xuICAgICAgfSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0pO1xuXG4gIGl0KCdyZXBvcnRzIGVycm9ycyBmb3IgbWlzc2luZyB0cmFuc2xhdGlvbnMnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG92ZXJyaWRlcyA9IHtcbiAgICAgIGFvdDogdHJ1ZSxcbiAgICAgIGkxOG5GaWxlOiAnc3JjL2xvY2FsZS9tZXNzYWdlcy5mci54bGYnLFxuICAgICAgaTE4bkZvcm1hdDogJ3RydWUnLFxuICAgICAgaTE4bkxvY2FsZTogJ2ZyJyxcbiAgICAgIGkxOG5NaXNzaW5nVHJhbnNsYXRpb246ICdlcnJvcicsXG4gICAgfTtcblxuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHsgJ3NyYy9sb2NhbGUvbWVzc2FnZXMuZnIueGxmJzogZW1wdHlUcmFuc2xhdGlvbkZpbGUgfSk7XG4gICAgaG9zdC5hcHBlbmRUb0ZpbGUoJ3NyYy9hcHAvYXBwLmNvbXBvbmVudC5odG1sJywgJzxwIGkxOG4+T3RoZXIgY29udGVudDwvcD4nKTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZShmYWxzZSkpLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcblxuICBpdCgncmVnaXN0ZXIgbG9jYWxlcycsIChkb25lKSA9PiB7XG4gICAgY29uc3Qgb3ZlcnJpZGVzID0geyBhb3Q6IHRydWUsIGkxOG5Mb2NhbGU6ICdmcl9GUicgfTtcblxuICAgIHJ1blRhcmdldFNwZWMoaG9zdCwgYnJvd3NlclRhcmdldFNwZWMsIG92ZXJyaWRlcykucGlwZShcbiAgICAgIHRhcCgoYnVpbGRFdmVudCkgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgICB0YXAoKCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGpvaW4ob3V0cHV0UGF0aCwgJ21haW4uanMnKTtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHZpcnR1YWxGcy5maWxlQnVmZmVyVG9TdHJpbmcoaG9zdC5zY29wZWRTeW5jKCkucmVhZChub3JtYWxpemUoZmlsZU5hbWUpKSk7XG4gICAgICAgIGV4cGVjdChjb250ZW50KS50b01hdGNoKC9yZWdpc3RlckxvY2FsZURhdGEvKTtcbiAgICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL2FuZ3VsYXJfY29tbW9uX2xvY2FsZXNfZnIvKTtcbiAgICAgIH0pLFxuICAgICkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpO1xuICB9KTtcbn0pO1xuIl19