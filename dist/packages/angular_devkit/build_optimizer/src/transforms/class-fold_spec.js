"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable-next-line:no-implicit-dependencies
const core_1 = require("@angular-devkit/core");
const transform_javascript_1 = require("../helpers/transform-javascript");
const class_fold_1 = require("./class-fold");
const transform = (content) => transform_javascript_1.transformJavascript({ content, getTransforms: [class_fold_1.getFoldFileTransformer], typeCheck: true }).content;
describe('class-fold', () => {
    it('folds static properties into class', () => {
        const staticProperty = 'Clazz.prop = 1;';
        const input = core_1.tags.stripIndent `
      var Clazz = (function () { function Clazz() { } return Clazz; }());
      ${staticProperty}
    `;
        const output = core_1.tags.stripIndent `
      var Clazz = (function () { function Clazz() { }
      ${staticProperty} return Clazz; }());
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
    it('folds multiple static properties into class', () => {
        const staticProperty = 'Clazz.prop = 1;';
        const anotherStaticProperty = 'Clazz.anotherProp = 2;';
        const input = core_1.tags.stripIndent `
      var Clazz = (function () { function Clazz() { } return Clazz; }());
      ${staticProperty}
      ${anotherStaticProperty}
    `;
        const output = core_1.tags.stripIndent `
      var Clazz = (function () { function Clazz() { }
      ${staticProperty} ${anotherStaticProperty} return Clazz; }());
    `;
        expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MtZm9sZF9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvY2xhc3MtZm9sZF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsb0RBQW9EO0FBQ3BELCtDQUE0QztBQUM1QywwRUFBc0U7QUFDdEUsNkNBQXNEO0FBR3RELE1BQU0sU0FBUyxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUUsQ0FBQywwQ0FBbUIsQ0FDeEQsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsbUNBQXNCLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFFakYsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDMUIsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUM1QyxNQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQztRQUN6QyxNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOztRQUUxQixjQUFjO0tBQ2pCLENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOztRQUUzQixjQUFjO0tBQ2pCLENBQUM7UUFFRixNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtRQUNyRCxNQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQztRQUN6QyxNQUFNLHFCQUFxQixHQUFHLHdCQUF3QixDQUFDO1FBQ3ZELE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7O1FBRTFCLGNBQWM7UUFDZCxxQkFBcUI7S0FDeEIsQ0FBQztRQUNGLE1BQU0sTUFBTSxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7O1FBRTNCLGNBQWMsSUFBSSxxQkFBcUI7S0FDMUMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1KYXZhc2NyaXB0IH0gZnJvbSAnLi4vaGVscGVycy90cmFuc2Zvcm0tamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBnZXRGb2xkRmlsZVRyYW5zZm9ybWVyIH0gZnJvbSAnLi9jbGFzcy1mb2xkJztcblxuXG5jb25zdCB0cmFuc2Zvcm0gPSAoY29udGVudDogc3RyaW5nKSA9PiB0cmFuc2Zvcm1KYXZhc2NyaXB0KFxuICB7IGNvbnRlbnQsIGdldFRyYW5zZm9ybXM6IFtnZXRGb2xkRmlsZVRyYW5zZm9ybWVyXSwgdHlwZUNoZWNrOiB0cnVlIH0pLmNvbnRlbnQ7XG5cbmRlc2NyaWJlKCdjbGFzcy1mb2xkJywgKCkgPT4ge1xuICBpdCgnZm9sZHMgc3RhdGljIHByb3BlcnRpZXMgaW50byBjbGFzcycsICgpID0+IHtcbiAgICBjb25zdCBzdGF0aWNQcm9wZXJ0eSA9ICdDbGF6ei5wcm9wID0gMTsnO1xuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIENsYXp6KCkgeyB9IHJldHVybiBDbGF6ejsgfSgpKTtcbiAgICAgICR7c3RhdGljUHJvcGVydHl9XG4gICAgYDtcbiAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgdmFyIENsYXp6ID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gQ2xhenooKSB7IH1cbiAgICAgICR7c3RhdGljUHJvcGVydHl9IHJldHVybiBDbGF6ejsgfSgpKTtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xuXG4gIGl0KCdmb2xkcyBtdWx0aXBsZSBzdGF0aWMgcHJvcGVydGllcyBpbnRvIGNsYXNzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YXRpY1Byb3BlcnR5ID0gJ0NsYXp6LnByb3AgPSAxOyc7XG4gICAgY29uc3QgYW5vdGhlclN0YXRpY1Byb3BlcnR5ID0gJ0NsYXp6LmFub3RoZXJQcm9wID0gMjsnO1xuICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgIHZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIENsYXp6KCkgeyB9IHJldHVybiBDbGF6ejsgfSgpKTtcbiAgICAgICR7c3RhdGljUHJvcGVydHl9XG4gICAgICAke2Fub3RoZXJTdGF0aWNQcm9wZXJ0eX1cbiAgICBgO1xuICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBDbGF6eigpIHsgfVxuICAgICAgJHtzdGF0aWNQcm9wZXJ0eX0gJHthbm90aGVyU3RhdGljUHJvcGVydHl9IHJldHVybiBDbGF6ejsgfSgpKTtcbiAgICBgO1xuXG4gICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gIH0pO1xufSk7XG4iXX0=