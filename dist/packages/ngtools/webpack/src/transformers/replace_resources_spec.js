"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core"); // tslint:disable-line:no-implicit-dependencies
const ast_helpers_1 = require("./ast_helpers");
const replace_resources_1 = require("./replace_resources");
describe('@ngtools/webpack transformers', () => {
    describe('replace_resources', () => {
        it('should replace resources', () => {
            const input = core_1.tags.stripIndent `
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css', './app.component.2.css']
        })
        export class AppComponent {
          title = 'app';
        }
      `;
            const output = core_1.tags.stripIndent `
        import * as tslib_1 from "tslib";
        import { Component } from '@angular/core';
        let AppComponent = class AppComponent {
            constructor() {
                this.title = 'app';
            }
        };
        AppComponent = tslib_1.__decorate([
            Component({
                selector: 'app-root',
                template: require("./app.component.html"),
                styles: [require("./app.component.css"), require("./app.component.2.css")]
            })
        ], AppComponent);
        export { AppComponent };
      `;
            const transformer = replace_resources_1.replaceResources(() => true);
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should replace resources with backticks', () => {
            const input = `
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-root',
          templateUrl: \`./app.component.html\`,
          styleUrls: [\`./app.component.css\`, \`./app.component.2.css\`]
        })
        export class AppComponent {
          title = 'app';
        }
      `;
            const output = `
        import * as tslib_1 from "tslib";
        import { Component } from '@angular/core';
        let AppComponent = class AppComponent {
            constructor() {
                this.title = 'app';
            }
        };
        AppComponent = tslib_1.__decorate([
            Component({
                selector: 'app-root',
                template: require("./app.component.html"),
                styles: [require("./app.component.css"), require("./app.component.2.css")]
            })
        ], AppComponent);
        export { AppComponent };
      `;
            const transformer = replace_resources_1.replaceResources(() => true);
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should not replace resources if shouldTransform returns false', () => {
            const input = core_1.tags.stripIndent `
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css', './app.component.2.css']
        })
        export class AppComponent {
          title = 'app';
        }
      `;
            const output = `
        import * as tslib_1 from "tslib";
        import { Component } from '@angular/core';
        let AppComponent = class AppComponent {
            constructor() {
                this.title = 'app';
            }
        };
        AppComponent = tslib_1.__decorate([
            Component({
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.css', './app.component.2.css']
            })
        ], AppComponent);
        export { AppComponent };
      `;
            const transformer = replace_resources_1.replaceResources(() => false);
            const result = ast_helpers_1.transformTypescript(input, [transformer]);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZV9yZXNvdXJjZXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvbmd0b29scy93ZWJwYWNrL3NyYy90cmFuc2Zvcm1lcnMvcmVwbGFjZV9yZXNvdXJjZXNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUE0QyxDQUFFLCtDQUErQztBQUM3RiwrQ0FBb0Q7QUFDcEQsMkRBQXVEO0FBRXZELFFBQVEsQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7SUFDN0MsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUNqQyxFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUE7Ozs7Ozs7Ozs7O09BVzdCLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0I5QixDQUFDO1lBRUYsTUFBTSxXQUFXLEdBQUcsb0NBQWdCLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsTUFBTSxNQUFNLEdBQUcsaUNBQW1CLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUV6RCxNQUFNLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxNQUFNLEtBQUssR0FBRzs7Ozs7Ozs7Ozs7T0FXYixDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQmQsQ0FBQztZQUVGLE1BQU0sV0FBVyxHQUFHLG9DQUFnQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELE1BQU0sTUFBTSxHQUFHLGlDQUFtQixDQUFDLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFFekQsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7WUFDdkUsTUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7Ozs7Ozs7T0FXN0IsQ0FBQztZQUNGLE1BQU0sTUFBTSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7O09BZ0JkLENBQUM7WUFFRixNQUFNLFdBQVcsR0FBRyxvQ0FBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsRCxNQUFNLE1BQU0sR0FBRyxpQ0FBbUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBRXpELE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgdGFncyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJzsgIC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyB0cmFuc2Zvcm1UeXBlc2NyaXB0IH0gZnJvbSAnLi9hc3RfaGVscGVycyc7XG5pbXBvcnQgeyByZXBsYWNlUmVzb3VyY2VzIH0gZnJvbSAnLi9yZXBsYWNlX3Jlc291cmNlcyc7XG5cbmRlc2NyaWJlKCdAbmd0b29scy93ZWJwYWNrIHRyYW5zZm9ybWVycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3JlcGxhY2VfcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVwbGFjZSByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4gICAgICAgIEBDb21wb25lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgICAgIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuY3NzJywgJy4vYXBwLmNvbXBvbmVudC4yLmNzcyddXG4gICAgICAgIH0pXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICAgICAgICAgIHRpdGxlID0gJ2FwcCc7XG4gICAgICAgIH1cbiAgICAgIGA7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgKiBhcyB0c2xpYl8xIGZyb20gXCJ0c2xpYlwiO1xuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgbGV0IEFwcENvbXBvbmVudCA9IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gJ2FwcCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIEFwcENvbXBvbmVudCA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgICAgICBDb21wb25lbnQoe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKFwiLi9hcHAuY29tcG9uZW50Lmh0bWxcIiksXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbcmVxdWlyZShcIi4vYXBwLmNvbXBvbmVudC5jc3NcIiksIHJlcXVpcmUoXCIuL2FwcC5jb21wb25lbnQuMi5jc3NcIildXG4gICAgICAgICAgICB9KVxuICAgICAgICBdLCBBcHBDb21wb25lbnQpO1xuICAgICAgICBleHBvcnQgeyBBcHBDb21wb25lbnQgfTtcbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gcmVwbGFjZVJlc291cmNlcygoKSA9PiB0cnVlKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQoaW5wdXQsIFt0cmFuc2Zvcm1lcl0pO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIHJlc291cmNlcyB3aXRoIGJhY2t0aWNrcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gYFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuICAgICAgICBAQ29tcG9uZW50KHtcbiAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogXFxgLi9hcHAuY29tcG9uZW50Lmh0bWxcXGAsXG4gICAgICAgICAgc3R5bGVVcmxzOiBbXFxgLi9hcHAuY29tcG9uZW50LmNzc1xcYCwgXFxgLi9hcHAuY29tcG9uZW50LjIuY3NzXFxgXVxuICAgICAgICB9KVxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICB0aXRsZSA9ICdhcHAnO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gYFxuICAgICAgICBpbXBvcnQgKiBhcyB0c2xpYl8xIGZyb20gXCJ0c2xpYlwiO1xuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgbGV0IEFwcENvbXBvbmVudCA9IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpdGxlID0gJ2FwcCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIEFwcENvbXBvbmVudCA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgICAgICBDb21wb25lbnQoe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKFwiLi9hcHAuY29tcG9uZW50Lmh0bWxcIiksXG4gICAgICAgICAgICAgICAgc3R5bGVzOiBbcmVxdWlyZShcIi4vYXBwLmNvbXBvbmVudC5jc3NcIiksIHJlcXVpcmUoXCIuL2FwcC5jb21wb25lbnQuMi5jc3NcIildXG4gICAgICAgICAgICB9KVxuICAgICAgICBdLCBBcHBDb21wb25lbnQpO1xuICAgICAgICBleHBvcnQgeyBBcHBDb21wb25lbnQgfTtcbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gcmVwbGFjZVJlc291cmNlcygoKSA9PiB0cnVlKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQoaW5wdXQsIFt0cmFuc2Zvcm1lcl0pO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVwbGFjZSByZXNvdXJjZXMgaWYgc2hvdWxkVHJhbnNmb3JtIHJldHVybnMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4gICAgICAgIEBDb21wb25lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgICAgIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuY3NzJywgJy4vYXBwLmNvbXBvbmVudC4yLmNzcyddXG4gICAgICAgIH0pXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICAgICAgICAgIHRpdGxlID0gJ2FwcCc7XG4gICAgICAgIH1cbiAgICAgIGA7XG4gICAgICBjb25zdCBvdXRwdXQgPSBgXG4gICAgICAgIGltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG4gICAgICAgIGltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBsZXQgQXBwQ29tcG9uZW50ID0gY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUgPSAnYXBwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgQXBwQ29tcG9uZW50ID0gdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgICAgIENvbXBvbmVudCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL2FwcC5jb21wb25lbnQuaHRtbCcsXG4gICAgICAgICAgICAgICAgc3R5bGVVcmxzOiBbJy4vYXBwLmNvbXBvbmVudC5jc3MnLCAnLi9hcHAuY29tcG9uZW50LjIuY3NzJ11cbiAgICAgICAgICAgIH0pXG4gICAgICAgIF0sIEFwcENvbXBvbmVudCk7XG4gICAgICAgIGV4cG9ydCB7IEFwcENvbXBvbmVudCB9O1xuICAgICAgYDtcblxuICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSByZXBsYWNlUmVzb3VyY2VzKCgpID0+IGZhbHNlKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQoaW5wdXQsIFt0cmFuc2Zvcm1lcl0pO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19