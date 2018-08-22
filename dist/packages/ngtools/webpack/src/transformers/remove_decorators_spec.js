"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-big-function
const core_1 = require("@angular-devkit/core"); // tslint:disable-line:no-implicit-dependencies
const ast_helpers_1 = require("./ast_helpers");
const remove_decorators_1 = require("./remove_decorators");
describe('@ngtools/webpack transformers', () => {
    describe('decorator_remover', () => {
        it('should remove Angular decorators', () => {
            const input = core_1.tags.stripIndent `
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css']
        })
        export class AppComponent {
          title = 'app';
        }
      `;
            const output = core_1.tags.stripIndent `
        export class AppComponent {
          constructor() {
            this.title = 'app';
          }
        }
      `;
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = remove_decorators_1.removeDecorators(() => true, () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should not remove non-Angular decorators', () => {
            const input = core_1.tags.stripIndent `
        import { Component } from 'another-lib';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css']
        })
        export class AppComponent {
          title = 'app';
        }
      `;
            const output = `
        import * as tslib_1 from "tslib";
        import { Component } from 'another-lib';
        let AppComponent = class AppComponent {
            constructor() {
                this.title = 'app';
            }
        };
        AppComponent = tslib_1.__decorate([
            Component({
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.css']
            })
        ], AppComponent);
        export { AppComponent };
      `;
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = remove_decorators_1.removeDecorators(() => true, () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should keep other decorators on class member', () => {
            const input = core_1.tags.stripIndent `
        import { Component, HostListener } from '@angular/core';
        import { AnotherDecorator } from 'another-lib';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css']
        })
        export class AppComponent {
          title = 'app';

          @HostListener('document:keydown.escape')
          @AnotherDecorator()
          onEscape() {
            console.log('run');
          }
        }
      `;
            const output = core_1.tags.stripIndent `
        import * as tslib_1 from "tslib";
        import { AnotherDecorator } from 'another-lib';

        export class AppComponent {
          constructor() {
              this.title = 'app';
          }

          onEscape() {
            console.log('run');
          }
        }
        tslib_1.__decorate([
          AnotherDecorator()
        ], AppComponent.prototype, "onEscape", null);
      `;
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = remove_decorators_1.removeDecorators(() => true, () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should keep other decorators on class declaration', () => {
            const input = core_1.tags.stripIndent `
        import { Component } from '@angular/core';
        import { AnotherDecorator } from 'another-lib';

        @AnotherDecorator()
        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css']
        })
        export class AppComponent {
          title = 'app';
        }
      `;
            const output = core_1.tags.stripIndent `
        import * as tslib_1 from "tslib";
        import { AnotherDecorator } from 'another-lib';

        let AppComponent = class AppComponent {
          constructor() {
              this.title = 'app';
          }
        };
        AppComponent = tslib_1.__decorate([
          AnotherDecorator()
        ], AppComponent);
        export { AppComponent };
      `;
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = remove_decorators_1.removeDecorators(() => true, () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should remove imports for identifiers within the decorator', () => {
            const input = core_1.tags.stripIndent `
        import { Component } from '@angular/core';
        import { ChangeDetectionStrategy } from '@angular/core';

        @Component({
          selector: 'app-root',
          changeDetection: ChangeDetectionStrategy.OnPush,
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css']
        })
        export class AppComponent {
          title = 'app';
        }
      `;
            const output = core_1.tags.stripIndent `
        export class AppComponent {
          constructor() {
            this.title = 'app';
          }
        }
      `;
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = remove_decorators_1.removeDecorators(() => true, () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('should not remove imports from types that are still used', () => {
            const input = core_1.tags.stripIndent `
        import { Component, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
        import { abc } from 'xyz';

        @Component({
          selector: 'app-root',
          changeDetection: ChangeDetectionStrategy.OnPush,
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css']
        })
        export class AppComponent {
          notify: EventEmitter<string> = new EventEmitter<string>();
          title = 'app';
          example = { abc };
        }

        export { ChangeDetectionStrategy };
      `;
            const output = core_1.tags.stripIndent `
        import { ChangeDetectionStrategy, EventEmitter } from '@angular/core';
        import { abc } from 'xyz';

        export class AppComponent {
          constructor() {
            this.notify = new EventEmitter();
            this.title = 'app';
            this.example = { abc };
          }
        }

        export { ChangeDetectionStrategy };
      `;
            const { program, compilerHost } = ast_helpers_1.createTypescriptContext(input);
            const transformer = remove_decorators_1.removeDecorators(() => true, () => program.getTypeChecker());
            const result = ast_helpers_1.transformTypescript(undefined, [transformer], program, compilerHost);
            expect(core_1.tags.oneLine `${result}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlX2RlY29yYXRvcnNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvbmd0b29scy93ZWJwYWNrL3NyYy90cmFuc2Zvcm1lcnMvcmVtb3ZlX2RlY29yYXRvcnNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFpQztBQUNqQywrQ0FBNEMsQ0FBRSwrQ0FBK0M7QUFDN0YsK0NBQTZFO0FBQzdFLDJEQUF1RDtBQUV2RCxRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO0lBQzdDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtZQUMxQyxNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBOzs7Ozs7Ozs7OztPQVc3QixDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7Ozs7O09BTTlCLENBQUM7WUFFRixNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxHQUFHLHFDQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sV0FBVyxHQUFHLG9DQUFnQixDQUNsQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQ1YsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUMvQixDQUFDO1lBQ0YsTUFBTSxNQUFNLEdBQUcsaUNBQW1CLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBRXBGLE1BQU0sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQSxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbkUsQ0FB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R0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaWctZnVuY3Rpb25cbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7ICAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgY3JlYXRlVHlwZXNjcmlwdENvbnRleHQsIHRyYW5zZm9ybVR5cGVzY3JpcHQgfSBmcm9tICcuL2FzdF9oZWxwZXJzJztcbmltcG9ydCB7IHJlbW92ZURlY29yYXRvcnMgfSBmcm9tICcuL3JlbW92ZV9kZWNvcmF0b3JzJztcblxuZGVzY3JpYmUoJ0BuZ3Rvb2xzL3dlYnBhY2sgdHJhbnNmb3JtZXJzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZGVjb3JhdG9yX3JlbW92ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgQW5ndWxhciBkZWNvcmF0b3JzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuICAgICAgICBAQ29tcG9uZW50KHtcbiAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgICAgICAgICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LmNzcyddXG4gICAgICAgIH0pXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICAgICAgICAgIHRpdGxlID0gJ2FwcCc7XG4gICAgICAgIH1cbiAgICAgIGA7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSAnYXBwJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IHsgcHJvZ3JhbSwgY29tcGlsZXJIb3N0IH0gPSBjcmVhdGVUeXBlc2NyaXB0Q29udGV4dChpbnB1dCk7XG4gICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IHJlbW92ZURlY29yYXRvcnMoXG4gICAgICAgICgpID0+IHRydWUsXG4gICAgICAgICgpID0+IHByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKSxcbiAgICAgICk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KHVuZGVmaW5lZCwgW3RyYW5zZm9ybWVyXSwgcHJvZ3JhbSwgY29tcGlsZXJIb3N0KTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbW92ZSBub24tQW5ndWxhciBkZWNvcmF0b3JzJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdhbm90aGVyLWxpYic7XG5cbiAgICAgICAgQENvbXBvbmVudCh7XG4gICAgICAgICAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL2FwcC5jb21wb25lbnQuaHRtbCcsXG4gICAgICAgICAgc3R5bGVVcmxzOiBbJy4vYXBwLmNvbXBvbmVudC5jc3MnXVxuICAgICAgICB9KVxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICB0aXRsZSA9ICdhcHAnO1xuICAgICAgICB9XG4gICAgICBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gYFxuICAgICAgICBpbXBvcnQgKiBhcyB0c2xpYl8xIGZyb20gXCJ0c2xpYlwiO1xuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdhbm90aGVyLWxpYic7XG4gICAgICAgIGxldCBBcHBDb21wb25lbnQgPSBjbGFzcyBBcHBDb21wb25lbnQge1xuICAgICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9ICdhcHAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBBcHBDb21wb25lbnQgPSB0c2xpYl8xLl9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgQ29tcG9uZW50KHtcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgICAgICAgICAgICAgICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LmNzcyddXG4gICAgICAgICAgICB9KVxuICAgICAgICBdLCBBcHBDb21wb25lbnQpO1xuICAgICAgICBleHBvcnQgeyBBcHBDb21wb25lbnQgfTtcbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IHsgcHJvZ3JhbSwgY29tcGlsZXJIb3N0IH0gPSBjcmVhdGVUeXBlc2NyaXB0Q29udGV4dChpbnB1dCk7XG4gICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IHJlbW92ZURlY29yYXRvcnMoXG4gICAgICAgICgpID0+IHRydWUsXG4gICAgICAgICgpID0+IHByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKSxcbiAgICAgICk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KHVuZGVmaW5lZCwgW3RyYW5zZm9ybWVyXSwgcHJvZ3JhbSwgY29tcGlsZXJIb3N0KTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQga2VlcCBvdGhlciBkZWNvcmF0b3JzIG9uIGNsYXNzIG1lbWJlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgQW5vdGhlckRlY29yYXRvciB9IGZyb20gJ2Fub3RoZXItbGliJztcblxuICAgICAgICBAQ29tcG9uZW50KHtcbiAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgICAgICAgICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LmNzcyddXG4gICAgICAgIH0pXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICAgICAgICAgIHRpdGxlID0gJ2FwcCc7XG5cbiAgICAgICAgICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDprZXlkb3duLmVzY2FwZScpXG4gICAgICAgICAgQEFub3RoZXJEZWNvcmF0b3IoKVxuICAgICAgICAgIG9uRXNjYXBlKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3J1bicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG4gICAgICAgIGltcG9ydCB7IEFub3RoZXJEZWNvcmF0b3IgfSBmcm9tICdhbm90aGVyLWxpYic7XG5cbiAgICAgICAgZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAgIHRoaXMudGl0bGUgPSAnYXBwJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvbkVzY2FwZSgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdydW4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdHNsaWJfMS5fX2RlY29yYXRlKFtcbiAgICAgICAgICBBbm90aGVyRGVjb3JhdG9yKClcbiAgICAgICAgXSwgQXBwQ29tcG9uZW50LnByb3RvdHlwZSwgXCJvbkVzY2FwZVwiLCBudWxsKTtcbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IHsgcHJvZ3JhbSwgY29tcGlsZXJIb3N0IH0gPSBjcmVhdGVUeXBlc2NyaXB0Q29udGV4dChpbnB1dCk7XG4gICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IHJlbW92ZURlY29yYXRvcnMoXG4gICAgICAgICgpID0+IHRydWUsXG4gICAgICAgICgpID0+IHByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKSxcbiAgICAgICk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KHVuZGVmaW5lZCwgW3RyYW5zZm9ybWVyXSwgcHJvZ3JhbSwgY29tcGlsZXJIb3N0KTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQga2VlcCBvdGhlciBkZWNvcmF0b3JzIG9uIGNsYXNzIGRlY2xhcmF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgQW5vdGhlckRlY29yYXRvciB9IGZyb20gJ2Fub3RoZXItbGliJztcblxuICAgICAgICBAQW5vdGhlckRlY29yYXRvcigpXG4gICAgICAgIEBDb21wb25lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgICAgIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuY3NzJ11cbiAgICAgICAgfSlcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgICAgICAgdGl0bGUgPSAnYXBwJztcbiAgICAgICAgfVxuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCAqIGFzIHRzbGliXzEgZnJvbSBcInRzbGliXCI7XG4gICAgICAgIGltcG9ydCB7IEFub3RoZXJEZWNvcmF0b3IgfSBmcm9tICdhbm90aGVyLWxpYic7XG5cbiAgICAgICAgbGV0IEFwcENvbXBvbmVudCA9IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAgIHRoaXMudGl0bGUgPSAnYXBwJztcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIEFwcENvbXBvbmVudCA9IHRzbGliXzEuX19kZWNvcmF0ZShbXG4gICAgICAgICAgQW5vdGhlckRlY29yYXRvcigpXG4gICAgICAgIF0sIEFwcENvbXBvbmVudCk7XG4gICAgICAgIGV4cG9ydCB7IEFwcENvbXBvbmVudCB9O1xuICAgICAgYDtcblxuICAgICAgY29uc3QgeyBwcm9ncmFtLCBjb21waWxlckhvc3QgfSA9IGNyZWF0ZVR5cGVzY3JpcHRDb250ZXh0KGlucHV0KTtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gcmVtb3ZlRGVjb3JhdG9ycyhcbiAgICAgICAgKCkgPT4gdHJ1ZSxcbiAgICAgICAgKCkgPT4gcHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQodW5kZWZpbmVkLCBbdHJhbnNmb3JtZXJdLCBwcm9ncmFtLCBjb21waWxlckhvc3QpO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgaW1wb3J0cyBmb3IgaWRlbnRpZmllcnMgd2l0aGluIHRoZSBkZWNvcmF0b3InLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4gICAgICAgIEBDb21wb25lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgICAgIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuY3NzJ11cbiAgICAgICAgfSlcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgICAgICAgdGl0bGUgPSAnYXBwJztcbiAgICAgICAgfVxuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgdGhpcy50aXRsZSA9ICdhcHAnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgYDtcblxuICAgICAgY29uc3QgeyBwcm9ncmFtLCBjb21waWxlckhvc3QgfSA9IGNyZWF0ZVR5cGVzY3JpcHRDb250ZXh0KGlucHV0KTtcbiAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gcmVtb3ZlRGVjb3JhdG9ycyhcbiAgICAgICAgKCkgPT4gdHJ1ZSxcbiAgICAgICAgKCkgPT4gcHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpLFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybVR5cGVzY3JpcHQodW5kZWZpbmVkLCBbdHJhbnNmb3JtZXJdLCBwcm9ncmFtLCBjb21waWxlckhvc3QpO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7cmVzdWx0fWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVtb3ZlIGltcG9ydHMgZnJvbSB0eXBlcyB0aGF0IGFyZSBzdGlsbCB1c2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgYWJjIH0gZnJvbSAneHl6JztcblxuICAgICAgICBAQ29tcG9uZW50KHtcbiAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgICAgICAgICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LmNzcyddXG4gICAgICAgIH0pXG4gICAgICAgIGV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xuICAgICAgICAgIG5vdGlmeTogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgICAgICAgICB0aXRsZSA9ICdhcHAnO1xuICAgICAgICAgIGV4YW1wbGUgPSB7IGFiYyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfTtcbiAgICAgIGA7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IGFiYyB9IGZyb20gJ3h5eic7XG5cbiAgICAgICAgZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gICAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSAnYXBwJztcbiAgICAgICAgICAgIHRoaXMuZXhhbXBsZSA9IHsgYWJjIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXhwb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgfTtcbiAgICAgIGA7XG5cbiAgICAgIGNvbnN0IHsgcHJvZ3JhbSwgY29tcGlsZXJIb3N0IH0gPSBjcmVhdGVUeXBlc2NyaXB0Q29udGV4dChpbnB1dCk7XG4gICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IHJlbW92ZURlY29yYXRvcnMoXG4gICAgICAgICgpID0+IHRydWUsXG4gICAgICAgICgpID0+IHByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKSxcbiAgICAgICk7XG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1UeXBlc2NyaXB0KHVuZGVmaW5lZCwgW3RyYW5zZm9ybWVyXSwgcHJvZ3JhbSwgY29tcGlsZXJIb3N0KTtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3Jlc3VsdH1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==