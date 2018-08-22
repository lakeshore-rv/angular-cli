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
// tslint:disable-next-line:no-implicit-dependencies
const core_1 = require("@angular-devkit/core");
const transform_javascript_1 = require("../helpers/transform-javascript");
const scrub_file_1 = require("./scrub-file");
const transform = (content) => transform_javascript_1.transformJavascript({ content, getTransforms: [scrub_file_1.getScrubFileTransformer], typeCheck: true }).content;
describe('scrub-file', () => {
    const clazz = 'var Clazz = (function () { function Clazz() { } return Clazz; }());';
    describe('decorators', () => {
        it('removes top-level Angular decorators', () => {
            const output = core_1.tags.stripIndent `
        import { Injectable } from '@angular/core';
        ${clazz}
      `;
            const input = core_1.tags.stripIndent `
        ${output}
        Clazz.decorators = [ { type: Injectable } ];
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('removes nested Angular decorators', () => {
            const output = core_1.tags.stripIndent `
        import { Injectable } from '@angular/core';
        var Clazz = (function () {
          function Clazz() { }
          return Clazz;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Injectable } from '@angular/core';
        var Clazz = (function () {
          function Clazz() {}
          Clazz.decorators = [ { type: Injectable } ];
          return Clazz;
        }());
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\'t remove non Angular decorators', () => {
            const input = core_1.tags.stripIndent `
        import { Injectable } from 'another-lib';
        ${clazz}
        Clazz.decorators = [{ type: Injectable }];
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${input}`);
        });
        it('leaves non-Angular decorators in mixed arrays', () => {
            const input = core_1.tags.stripIndent `
        import { Injectable } from '@angular/core';
        import { NotInjectable } from 'another-lib';
        ${clazz}
        Clazz.decorators = [{ type: Injectable }, { type: NotInjectable }];
      `;
            const output = core_1.tags.stripIndent `
        import { Injectable } from '@angular/core';
        import { NotInjectable } from 'another-lib';
        ${clazz}
        Clazz.decorators = [{ type: NotInjectable }];
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
    describe('__decorate', () => {
        it('removes Angular decorators calls in __decorate', () => {
            const output = core_1.tags.stripIndent `
        import { Component, Injectable } from '@angular/core';
        var Clazz = (function () {
          function Clazz() { }
          return Clazz;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Component, Injectable } from '@angular/core';
        var Clazz = (function () {
          function Clazz() { }
          Clazz = __decorate([
            Injectable(),
            Component({
              selector: 'app-root',
              templateUrl: './app.component.html',
              styleUrls: ['./app.component.css']
            })
          ], Clazz);
          return Clazz;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('removes constructor parameter metadata in __decorate', () => {
            const output = core_1.tags.stripIndent `
        import { Component, ElementRef } from '@angular/core';
        import { LibService } from 'another-lib';
        var Clazz = (function () {
          function Clazz() { }
          return Clazz;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Component, ElementRef } from '@angular/core';
        import { LibService } from 'another-lib';
        var Clazz = (function () {
          function Clazz() { }
          Clazz = __decorate([
            Component({
              selector: 'app-root',
              templateUrl: './app.component.html',
              styleUrls: ['./app.component.css']
            }),
            __metadata("design:paramtypes", [ElementRef, LibService])
          ], Clazz);
          return Clazz;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('removes constructor parameter metadata when static properties are present', () => {
            const output = core_1.tags.stripIndent `
        import { Injectable } from '@angular/core';
        import { Logger } from 'another-lib';
        var GaService = (function () {
          function GaService(logger) {
            this.logger = logger;
          }
          GaService_1 = GaService;
          GaService.prototype.initializeGa = function () {
            console.log(GaService_1.initializeDelay);
          };
          GaService.initializeDelay = 1000;
          return GaService;
          var GaService_1;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Injectable } from '@angular/core';
        import { Logger } from 'another-lib';
        var GaService = (function () {
          function GaService(logger) {
            this.logger = logger;
          }
          GaService_1 = GaService;
          GaService.prototype.initializeGa = function () {
            console.log(GaService_1.initializeDelay);
          };
          GaService.initializeDelay = 1000;
          GaService = GaService_1 = __decorate([
            Injectable(),
            __metadata("design:paramtypes", [Logger])
          ], GaService);
          return GaService;
          var GaService_1;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\t remove constructor parameter metadata for whitelisted classes', () => {
            const input = core_1.tags.stripIndent `
        import { ElementRef } from '@angular/core';
        import { LibService } from 'another-lib';
        var BrowserPlatformLocation = (function () {
          function BrowserPlatformLocation() { }
          BrowserPlatformLocation = __decorate([
            __metadata("design:paramtypes", [ElementRef, LibService])
          ], BrowserPlatformLocation);
          return BrowserPlatformLocation;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${input}`);
        });
        it('removes only Angular decorators calls in __decorate', () => {
            const output = core_1.tags.stripIndent `
        import { Component } from '@angular/core';
        import { NotComponent } from 'another-lib';
        var Clazz = (function () {
          function Clazz() { }
          Clazz = __decorate([
            NotComponent()
          ], Clazz);
          return Clazz;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Component } from '@angular/core';
        import { NotComponent } from 'another-lib';
        var Clazz = (function () {
          function Clazz() { }
          Clazz = __decorate([
            NotComponent(),
            Component({
              selector: 'app-root',
              templateUrl: './app.component.html',
              styleUrls: ['./app.component.css']
            })
          ], Clazz);
          return Clazz;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('recognizes tslib as well', () => {
            const input = core_1.tags.stripIndent `
        import * as tslib from "tslib";
        import * as tslib_2 from "tslib";
        import { Component } from '@angular/core';
        import { NotComponent } from 'another-lib';
        var Clazz = (function () {
          function Clazz() { }
          Clazz = tslib.__decorate([
            NotComponent(),
            Component({
              selector: 'app-root',
              templateUrl: './app.component.html',
              styleUrls: ['./app.component.css']
            })
          ], Clazz);
          return Clazz;
        }());

        var Clazz2 = (function () {
          function Clazz2() { }
          Clazz2 = tslib_2.__decorate([
            NotComponent(),
            Component({
              selector: 'app-root',
              templateUrl: './app.component.html',
              styleUrls: ['./app.component.css']
            })
          ], Clazz2);
          return Clazz2;
        }());
      `;
            const output = core_1.tags.stripIndent `
        import * as tslib from "tslib";
        import * as tslib_2 from "tslib";
        import { Component } from '@angular/core';
        import { NotComponent } from 'another-lib';
        var Clazz = (function () {
          function Clazz() { }
          Clazz = tslib.__decorate([
            NotComponent()
          ], Clazz);
          return Clazz;
        }());

        var Clazz2 = (function () {
          function Clazz2() { }
          Clazz2 = tslib_2.__decorate([
            NotComponent()
          ], Clazz2);
          return Clazz2;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
    describe('__metadata', () => {
        it('removes Angular decorators metadata', () => {
            const output = core_1.tags.stripIndent `
        import { Input, Output, EventEmitter, HostListener } from '@angular/core';
        var Clazz = (function () {
          function Clazz() {
            this.change = new EventEmitter();
          }
          return Clazz;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Input, Output, EventEmitter, HostListener } from '@angular/core';
        import { NotInput } from 'another-lib';
        var Clazz = (function () {
          function Clazz() {
            this.change = new EventEmitter();
          }
          __decorate([
            Input(),
            __metadata("design:type", Object)
          ], Clazz.prototype, "selected", void 0);
          __decorate([
              Output(),
              __metadata("design:type", Object)
          ], Clazz.prototype, "change", void 0);
          __decorate([
            HostListener('document:keydown.escape'),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", []),
            __metadata("design:returntype", void 0)
          ], Clazz.prototype, "onKeyDown", null);
          return Clazz;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('removes only Angular decorator metadata', () => {
            const output = core_1.tags.stripIndent `
        import { Input } from '@angular/core';
        import { NotInput } from 'another-lib';
        var Clazz = (function () {
          function Clazz() { }
          __decorate([
            NotInput(),
            __metadata("design:type", Object)
          ], Clazz.prototype, "other", void 0);
          return Clazz;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Input } from '@angular/core';
        import { NotInput } from 'another-lib';
        var Clazz = (function () {
          function Clazz() { }
          __decorate([
            Input(),
            __metadata("design:type", Object)
          ], Clazz.prototype, "selected", void 0);
          __decorate([
            NotInput(),
            __metadata("design:type", Object)
          ], Clazz.prototype, "other", void 0);
          return Clazz;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('recognizes tslib as well', () => {
            const input = core_1.tags.stripIndent `
        import * as tslib from "tslib";
        import * as tslib_2 from "tslib";
        import { Input } from '@angular/core';
        var Clazz = (function () {
          function Clazz() { }
          tslib.__decorate([
            Input(),
            tslib.__metadata("design:type", Object)
          ], Clazz.prototype, "selected", void 0);
          return Clazz;
        }());

        var Clazz2 = (function () {
          function Clazz2() { }
          tslib_2.__decorate([
            Input(),
            tslib_2.__metadata("design:type", Object)
          ], Clazz.prototype, "selected", void 0);
          return Clazz2;
        }());
      `;
            const output = core_1.tags.stripIndent `
        import * as tslib from "tslib";
        import * as tslib_2 from "tslib";
        import { Input } from '@angular/core';
        var Clazz = (function () {
          function Clazz() { }
          return Clazz;
        }());

        var Clazz2 = (function () {
          function Clazz2() { }
          return Clazz2;
        }());
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
    describe('propDecorators', () => {
        it('removes top-level Angular propDecorators', () => {
            const output = core_1.tags.stripIndent `
        import { Input } from '@angular/core';
        ${clazz}
      `;
            const input = core_1.tags.stripIndent `
        ${output}
        Clazz.propDecorators = { 'ngIf': [{ type: Input }] }
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('removes nested Angular propDecorators', () => {
            const output = core_1.tags.stripIndent `
        import { Input } from '@angular/core';
        var Clazz = (function () {
          function Clazz() { }
          return Clazz;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Input } from '@angular/core';
        var Clazz = (function () {
          function Clazz() {}
          Clazz.propDecorators = { 'ngIf': [{ type: Input }] };
          return Clazz;
        }());
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\'t remove non Angular propDecorators', () => {
            const input = core_1.tags.stripIndent `
        import { Input } from 'another-lib';
        ${clazz}
        Clazz.propDecorators = { 'ngIf': [{ type: Input }] };
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${input}`);
        });
        it('leaves non-Angular propDecorators in mixed arrays', () => {
            const output = core_1.tags.stripIndent `
        import { Input } from '@angular/core';
        import { NotInput } from 'another-lib';
        ${clazz}
        Clazz.propDecorators = {
          'notNgIf': [{ type: NotInput }]
        };
      `;
            const input = core_1.tags.stripIndent `
        import { Input } from '@angular/core';
        import { NotInput } from 'another-lib';
        ${clazz}
        Clazz.propDecorators = {
          'ngIf': [{ type: Input }],
          'notNgIf': [{ type: NotInput }]
        };
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
    });
    describe('ctorParameters', () => {
        it('removes empty constructor parameters', () => {
            const output = core_1.tags.stripIndent `
        ${clazz}
      `;
            const input = core_1.tags.stripIndent `
        ${output}
        Clazz.ctorParameters = function () { return []; };
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('removes non-empty top-level style constructor parameters', () => {
            const output = core_1.tags.stripIndent `
        ${clazz}
      `;
            const input = core_1.tags.stripIndent `
        ${clazz}
        Clazz.ctorParameters = function () { return [{type: Injector}]; };
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('removes top-level Angular constructor parameters in es2015', () => {
            const output = core_1.tags.stripIndent `
        class Clazz extends BaseClazz { constructor(e) { super(e); } }
      `;
            const input = core_1.tags.stripIndent `
        ${output}
        Clazz.ctorParameters = () => [ { type: Injectable } ];
      `;
            expect(scrub_file_1.testScrubFile(input)).toBeTruthy();
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('removes nested constructor parameters', () => {
            const output = core_1.tags.stripIndent `
        import { Injector } from '@angular/core';
        var Clazz = (function () {
          function Clazz() { }
          return Clazz;
        }());
      `;
            const input = core_1.tags.stripIndent `
        import { Injector } from '@angular/core';
        var Clazz = (function () {
          function Clazz() {}
          Clazz.ctorParameters = function () { return [{type: Injector}]; };
          return Clazz;
        }());
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${output}`);
        });
        it('doesn\'t remove constructor parameters from whitelisted classes', () => {
            const input = core_1.tags.stripIndent `
        ${clazz.replace('Clazz', 'PlatformRef_')}
        PlatformRef_.ctorParameters = function () { return []; };
      `;
            expect(core_1.tags.oneLine `${transform(input)}`).toEqual(core_1.tags.oneLine `${input}`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NydWItZmlsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9idWlsZF9vcHRpbWl6ZXIvc3JjL3RyYW5zZm9ybXMvc2NydWItZmlsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUNBQWlDO0FBQ2pDLG9EQUFvRDtBQUNwRCwrQ0FBNEM7QUFDNUMsMEVBQXNFO0FBQ3RFLDZDQUFzRTtBQUd0RSxNQUFNLFNBQVMsR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFFLENBQUMsMENBQW1CLENBQ3hELEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDLG9DQUF1QixDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO0FBRWxGLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLE1BQU0sS0FBSyxHQUFHLHFFQUFxRSxDQUFDO0lBRXBGLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDOUMsTUFBTSxNQUFNLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQTs7VUFFM0IsS0FBSztPQUNSLENBQUM7WUFDRixNQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFBO1VBQzFCLE1BQU07O09BRVQsQ0FBQztZQUVGLE1BQU0sQ0FBQywwQkFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDMUMsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM3RSxDQUFD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QUFDOztPQUV6QyxDQUFDO1lBRUYsTUFBTSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsT0FBTyxDQUFBLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaWctZnVuY3Rpb25cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1KYXZhc2NyaXB0IH0gZnJvbSAnLi4vaGVscGVycy90cmFuc2Zvcm0tamF2YXNjcmlwdCc7XG5pbXBvcnQgeyBnZXRTY3J1YkZpbGVUcmFuc2Zvcm1lciwgdGVzdFNjcnViRmlsZSB9IGZyb20gJy4vc2NydWItZmlsZSc7XG5cblxuY29uc3QgdHJhbnNmb3JtID0gKGNvbnRlbnQ6IHN0cmluZykgPT4gdHJhbnNmb3JtSmF2YXNjcmlwdChcbiAgeyBjb250ZW50LCBnZXRUcmFuc2Zvcm1zOiBbZ2V0U2NydWJGaWxlVHJhbnNmb3JtZXJdLCB0eXBlQ2hlY2s6IHRydWUgfSkuY29udGVudDtcblxuZGVzY3JpYmUoJ3NjcnViLWZpbGUnLCAoKSA9PiB7XG4gIGNvbnN0IGNsYXp6ID0gJ3ZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIENsYXp6KCkgeyB9IHJldHVybiBDbGF6ejsgfSgpKTsnO1xuXG4gIGRlc2NyaWJlKCdkZWNvcmF0b3JzJywgKCkgPT4ge1xuICAgIGl0KCdyZW1vdmVzIHRvcC1sZXZlbCBBbmd1bGFyIGRlY29yYXRvcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgICR7Y2xhenp9XG4gICAgICBgO1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke291dHB1dH1cbiAgICAgICAgQ2xhenouZGVjb3JhdG9ycyA9IFsgeyB0eXBlOiBJbmplY3RhYmxlIH0gXTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0ZXN0U2NydWJGaWxlKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlcyBuZXN0ZWQgQW5ndWxhciBkZWNvcmF0b3JzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkgeyB9XG4gICAgICAgICAgcmV0dXJuIENsYXp6O1xuICAgICAgICB9KCkpO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkge31cbiAgICAgICAgICBDbGF6ei5kZWNvcmF0b3JzID0gWyB7IHR5cGU6IEluamVjdGFibGUgfSBdO1xuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXNuXFwndCByZW1vdmUgbm9uIEFuZ3VsYXIgZGVjb3JhdG9ycycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ2Fub3RoZXItbGliJztcbiAgICAgICAgJHtjbGF6en1cbiAgICAgICAgQ2xhenouZGVjb3JhdG9ycyA9IFt7IHR5cGU6IEluamVjdGFibGUgfV07XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke2lucHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2xlYXZlcyBub24tQW5ndWxhciBkZWNvcmF0b3JzIGluIG1peGVkIGFycmF5cycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBOb3RJbmplY3RhYmxlIH0gZnJvbSAnYW5vdGhlci1saWInO1xuICAgICAgICAke2NsYXp6fVxuICAgICAgICBDbGF6ei5kZWNvcmF0b3JzID0gW3sgdHlwZTogSW5qZWN0YWJsZSB9LCB7IHR5cGU6IE5vdEluamVjdGFibGUgfV07XG4gICAgICBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBOb3RJbmplY3RhYmxlIH0gZnJvbSAnYW5vdGhlci1saWInO1xuICAgICAgICAke2NsYXp6fVxuICAgICAgICBDbGF6ei5kZWNvcmF0b3JzID0gW3sgdHlwZTogTm90SW5qZWN0YWJsZSB9XTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnX19kZWNvcmF0ZScsICgpID0+IHtcbiAgICBpdCgncmVtb3ZlcyBBbmd1bGFyIGRlY29yYXRvcnMgY2FsbHMgaW4gX19kZWNvcmF0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkgeyB9XG4gICAgICAgICAgcmV0dXJuIENsYXp6O1xuICAgICAgICB9KCkpO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIHZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuY3Rpb24gQ2xhenooKSB7IH1cbiAgICAgICAgICBDbGF6eiA9IF9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgSW5qZWN0YWJsZSgpLFxuICAgICAgICAgICAgQ29tcG9uZW50KHtcbiAgICAgICAgICAgICAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgICAgICAgICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LmNzcyddXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0sIENsYXp6KTtcbiAgICAgICAgICByZXR1cm4gQ2xheno7XG4gICAgICAgIH0oKSk7XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdFNjcnViRmlsZShpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZXMgY29uc3RydWN0b3IgcGFyYW1ldGVyIG1ldGFkYXRhIGluIF9fZGVjb3JhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgTGliU2VydmljZSB9IGZyb20gJ2Fub3RoZXItbGliJztcbiAgICAgICAgdmFyIENsYXp6ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBDbGF6eigpIHsgfVxuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcbiAgICAgIGA7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBMaWJTZXJ2aWNlIH0gZnJvbSAnYW5vdGhlci1saWInO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkgeyB9XG4gICAgICAgICAgQ2xhenogPSBfX2RlY29yYXRlKFtcbiAgICAgICAgICAgIENvbXBvbmVudCh7XG4gICAgICAgICAgICAgIHNlbGVjdG9yOiAnYXBwLXJvb3QnLFxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy4vYXBwLmNvbXBvbmVudC5odG1sJyxcbiAgICAgICAgICAgICAgc3R5bGVVcmxzOiBbJy4vYXBwLmNvbXBvbmVudC5jc3MnXVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW0VsZW1lbnRSZWYsIExpYlNlcnZpY2VdKVxuICAgICAgICAgIF0sIENsYXp6KTtcbiAgICAgICAgICByZXR1cm4gQ2xheno7XG4gICAgICAgIH0oKSk7XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdFNjcnViRmlsZShpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZXMgY29uc3RydWN0b3IgcGFyYW1ldGVyIG1ldGFkYXRhIHdoZW4gc3RhdGljIHByb3BlcnRpZXMgYXJlIHByZXNlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IExvZ2dlciB9IGZyb20gJ2Fub3RoZXItbGliJztcbiAgICAgICAgdmFyIEdhU2VydmljZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuY3Rpb24gR2FTZXJ2aWNlKGxvZ2dlcikge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgIEdhU2VydmljZV8xID0gR2FTZXJ2aWNlO1xuICAgICAgICAgIEdhU2VydmljZS5wcm90b3R5cGUuaW5pdGlhbGl6ZUdhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coR2FTZXJ2aWNlXzEuaW5pdGlhbGl6ZURlbGF5KTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIEdhU2VydmljZS5pbml0aWFsaXplRGVsYXkgPSAxMDAwO1xuICAgICAgICAgIHJldHVybiBHYVNlcnZpY2U7XG4gICAgICAgICAgdmFyIEdhU2VydmljZV8xO1xuICAgICAgICB9KCkpO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBMb2dnZXIgfSBmcm9tICdhbm90aGVyLWxpYic7XG4gICAgICAgIHZhciBHYVNlcnZpY2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIEdhU2VydmljZShsb2dnZXIpIHtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBHYVNlcnZpY2VfMSA9IEdhU2VydmljZTtcbiAgICAgICAgICBHYVNlcnZpY2UucHJvdG90eXBlLmluaXRpYWxpemVHYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEdhU2VydmljZV8xLmluaXRpYWxpemVEZWxheSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICBHYVNlcnZpY2UuaW5pdGlhbGl6ZURlbGF5ID0gMTAwMDtcbiAgICAgICAgICBHYVNlcnZpY2UgPSBHYVNlcnZpY2VfMSA9IF9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgSW5qZWN0YWJsZSgpLFxuICAgICAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtMb2dnZXJdKVxuICAgICAgICAgIF0sIEdhU2VydmljZSk7XG4gICAgICAgICAgcmV0dXJuIEdhU2VydmljZTtcbiAgICAgICAgICB2YXIgR2FTZXJ2aWNlXzE7XG4gICAgICAgIH0oKSk7XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdFNjcnViRmlsZShpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2RvZXNuXFx0IHJlbW92ZSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXIgbWV0YWRhdGEgZm9yIHdoaXRlbGlzdGVkIGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgTGliU2VydmljZSB9IGZyb20gJ2Fub3RoZXItbGliJztcbiAgICAgICAgdmFyIEJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBCcm93c2VyUGxhdGZvcm1Mb2NhdGlvbigpIHsgfVxuICAgICAgICAgIEJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uID0gX19kZWNvcmF0ZShbXG4gICAgICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW0VsZW1lbnRSZWYsIExpYlNlcnZpY2VdKVxuICAgICAgICAgIF0sIEJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uKTtcbiAgICAgICAgICByZXR1cm4gQnJvd3NlclBsYXRmb3JtTG9jYXRpb247XG4gICAgICAgIH0oKSk7XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdFNjcnViRmlsZShpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7aW5wdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlcyBvbmx5IEFuZ3VsYXIgZGVjb3JhdG9ycyBjYWxscyBpbiBfX2RlY29yYXRlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IE5vdENvbXBvbmVudCB9IGZyb20gJ2Fub3RoZXItbGliJztcbiAgICAgICAgdmFyIENsYXp6ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBDbGF6eigpIHsgfVxuICAgICAgICAgIENsYXp6ID0gX19kZWNvcmF0ZShbXG4gICAgICAgICAgICBOb3RDb21wb25lbnQoKVxuICAgICAgICAgIF0sIENsYXp6KTtcbiAgICAgICAgICByZXR1cm4gQ2xheno7XG4gICAgICAgIH0oKSk7XG4gICAgICBgO1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgTm90Q29tcG9uZW50IH0gZnJvbSAnYW5vdGhlci1saWInO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkgeyB9XG4gICAgICAgICAgQ2xhenogPSBfX2RlY29yYXRlKFtcbiAgICAgICAgICAgIE5vdENvbXBvbmVudCgpLFxuICAgICAgICAgICAgQ29tcG9uZW50KHtcbiAgICAgICAgICAgICAgc2VsZWN0b3I6ICdhcHAtcm9vdCcsXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi9hcHAuY29tcG9uZW50Lmh0bWwnLFxuICAgICAgICAgICAgICBzdHlsZVVybHM6IFsnLi9hcHAuY29tcG9uZW50LmNzcyddXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0sIENsYXp6KTtcbiAgICAgICAgICByZXR1cm4gQ2xheno7XG4gICAgICAgIH0oKSk7XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdFNjcnViRmlsZShpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlY29nbml6ZXMgdHNsaWIgYXMgd2VsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0ICogYXMgdHNsaWIgZnJvbSBcInRzbGliXCI7XG4gICAgICAgIGltcG9ydCAqIGFzIHRzbGliXzIgZnJvbSBcInRzbGliXCI7XG4gICAgICAgIGltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBOb3RDb21wb25lbnQgfSBmcm9tICdhbm90aGVyLWxpYic7XG4gICAgICAgIHZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuY3Rpb24gQ2xhenooKSB7IH1cbiAgICAgICAgICBDbGF6eiA9IHRzbGliLl9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgTm90Q29tcG9uZW50KCksXG4gICAgICAgICAgICBDb21wb25lbnQoe1xuICAgICAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL2FwcC5jb21wb25lbnQuaHRtbCcsXG4gICAgICAgICAgICAgIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuY3NzJ11cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXSwgQ2xhenopO1xuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcblxuICAgICAgICB2YXIgQ2xhenoyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBDbGF6ejIoKSB7IH1cbiAgICAgICAgICBDbGF6ejIgPSB0c2xpYl8yLl9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgTm90Q29tcG9uZW50KCksXG4gICAgICAgICAgICBDb21wb25lbnQoe1xuICAgICAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcuL2FwcC5jb21wb25lbnQuaHRtbCcsXG4gICAgICAgICAgICAgIHN0eWxlVXJsczogWycuL2FwcC5jb21wb25lbnQuY3NzJ11cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgXSwgQ2xhenoyKTtcbiAgICAgICAgICByZXR1cm4gQ2xhenoyO1xuICAgICAgICB9KCkpO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCAqIGFzIHRzbGliIGZyb20gXCJ0c2xpYlwiO1xuICAgICAgICBpbXBvcnQgKiBhcyB0c2xpYl8yIGZyb20gXCJ0c2xpYlwiO1xuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgTm90Q29tcG9uZW50IH0gZnJvbSAnYW5vdGhlci1saWInO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkgeyB9XG4gICAgICAgICAgQ2xhenogPSB0c2xpYi5fX2RlY29yYXRlKFtcbiAgICAgICAgICAgIE5vdENvbXBvbmVudCgpXG4gICAgICAgICAgXSwgQ2xhenopO1xuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcblxuICAgICAgICB2YXIgQ2xhenoyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBDbGF6ejIoKSB7IH1cbiAgICAgICAgICBDbGF6ejIgPSB0c2xpYl8yLl9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgTm90Q29tcG9uZW50KClcbiAgICAgICAgICBdLCBDbGF6ejIpO1xuICAgICAgICAgIHJldHVybiBDbGF6ejI7XG4gICAgICAgIH0oKSk7XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdFNjcnViRmlsZShpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnX19tZXRhZGF0YScsICgpID0+IHtcbiAgICBpdCgncmVtb3ZlcyBBbmd1bGFyIGRlY29yYXRvcnMgbWV0YWRhdGEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcbiAgICAgIGA7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IE5vdElucHV0IH0gZnJvbSAnYW5vdGhlci1saWInO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIF9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXG4gICAgICAgICAgXSwgQ2xhenoucHJvdG90eXBlLCBcInNlbGVjdGVkXCIsIHZvaWQgMCk7XG4gICAgICAgICAgX19kZWNvcmF0ZShbXG4gICAgICAgICAgICAgIE91dHB1dCgpLFxuICAgICAgICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxuICAgICAgICAgIF0sIENsYXp6LnByb3RvdHlwZSwgXCJjaGFuZ2VcIiwgdm9pZCAwKTtcbiAgICAgICAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgICAgIEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5ZG93bi5lc2NhcGUnKSxcbiAgICAgICAgICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXG4gICAgICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW10pLFxuICAgICAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcbiAgICAgICAgICBdLCBDbGF6ei5wcm90b3R5cGUsIFwib25LZXlEb3duXCIsIG51bGwpO1xuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0ZXN0U2NydWJGaWxlKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlcyBvbmx5IEFuZ3VsYXIgZGVjb3JhdG9yIG1ldGFkYXRhJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgTm90SW5wdXQgfSBmcm9tICdhbm90aGVyLWxpYic7XG4gICAgICAgIHZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuY3Rpb24gQ2xhenooKSB7IH1cbiAgICAgICAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgICAgIE5vdElucHV0KCksXG4gICAgICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxuICAgICAgICAgIF0sIENsYXp6LnByb3RvdHlwZSwgXCJvdGhlclwiLCB2b2lkIDApO1xuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcbiAgICAgIGA7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIGltcG9ydCB7IE5vdElucHV0IH0gZnJvbSAnYW5vdGhlci1saWInO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkgeyB9XG4gICAgICAgICAgX19kZWNvcmF0ZShbXG4gICAgICAgICAgICBJbnB1dCgpLFxuICAgICAgICAgICAgX19tZXRhZGF0YShcImRlc2lnbjp0eXBlXCIsIE9iamVjdClcbiAgICAgICAgICBdLCBDbGF6ei5wcm90b3R5cGUsIFwic2VsZWN0ZWRcIiwgdm9pZCAwKTtcbiAgICAgICAgICBfX2RlY29yYXRlKFtcbiAgICAgICAgICAgIE5vdElucHV0KCksXG4gICAgICAgICAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxuICAgICAgICAgIF0sIENsYXp6LnByb3RvdHlwZSwgXCJvdGhlclwiLCB2b2lkIDApO1xuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0ZXN0U2NydWJGaWxlKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVjb2duaXplcyB0c2xpYiBhcyB3ZWxsJywgKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgKiBhcyB0c2xpYiBmcm9tIFwidHNsaWJcIjtcbiAgICAgICAgaW1wb3J0ICogYXMgdHNsaWJfMiBmcm9tIFwidHNsaWJcIjtcbiAgICAgICAgaW1wb3J0IHsgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgdmFyIENsYXp6ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBDbGF6eigpIHsgfVxuICAgICAgICAgIHRzbGliLl9fZGVjb3JhdGUoW1xuICAgICAgICAgICAgSW5wdXQoKSxcbiAgICAgICAgICAgIHRzbGliLl9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBPYmplY3QpXG4gICAgICAgICAgXSwgQ2xhenoucHJvdG90eXBlLCBcInNlbGVjdGVkXCIsIHZvaWQgMCk7XG4gICAgICAgICAgcmV0dXJuIENsYXp6O1xuICAgICAgICB9KCkpO1xuXG4gICAgICAgIHZhciBDbGF6ejIgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6MigpIHsgfVxuICAgICAgICAgIHRzbGliXzIuX19kZWNvcmF0ZShbXG4gICAgICAgICAgICBJbnB1dCgpLFxuICAgICAgICAgICAgdHNsaWJfMi5fX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgT2JqZWN0KVxuICAgICAgICAgIF0sIENsYXp6LnByb3RvdHlwZSwgXCJzZWxlY3RlZFwiLCB2b2lkIDApO1xuICAgICAgICAgIHJldHVybiBDbGF6ejI7XG4gICAgICAgIH0oKSk7XG4gICAgICBgO1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0ICogYXMgdHNsaWIgZnJvbSBcInRzbGliXCI7XG4gICAgICAgIGltcG9ydCAqIGFzIHRzbGliXzIgZnJvbSBcInRzbGliXCI7XG4gICAgICAgIGltcG9ydCB7IElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIHZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuY3Rpb24gQ2xhenooKSB7IH1cbiAgICAgICAgICByZXR1cm4gQ2xheno7XG4gICAgICAgIH0oKSk7XG5cbiAgICAgICAgdmFyIENsYXp6MiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuY3Rpb24gQ2xhenoyKCkgeyB9XG4gICAgICAgICAgcmV0dXJuIENsYXp6MjtcbiAgICAgICAgfSgpKTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0ZXN0U2NydWJGaWxlKGlucHV0KSkudG9CZVRydXRoeSgpO1xuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwcm9wRGVjb3JhdG9ycycsICgpID0+IHtcbiAgICBpdCgncmVtb3ZlcyB0b3AtbGV2ZWwgQW5ndWxhciBwcm9wRGVjb3JhdG9ycycsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgICR7Y2xhenp9XG4gICAgICBgO1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke291dHB1dH1cbiAgICAgICAgQ2xhenoucHJvcERlY29yYXRvcnMgPSB7ICduZ0lmJzogW3sgdHlwZTogSW5wdXQgfV0gfVxuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRlc3RTY3J1YkZpbGUoaW5wdXQpKS50b0JlVHJ1dGh5KCk7XG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVzIG5lc3RlZCBBbmd1bGFyIHByb3BEZWNvcmF0b3JzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgdmFyIENsYXp6ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBDbGF6eigpIHsgfVxuICAgICAgICAgIHJldHVybiBDbGF6ejtcbiAgICAgICAgfSgpKTtcbiAgICAgIGA7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGltcG9ydCB7IElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgICAgIHZhciBDbGF6eiA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZnVuY3Rpb24gQ2xhenooKSB7fVxuICAgICAgICAgIENsYXp6LnByb3BEZWNvcmF0b3JzID0geyAnbmdJZic6IFt7IHR5cGU6IElucHV0IH1dIH07XG4gICAgICAgICAgcmV0dXJuIENsYXp6O1xuICAgICAgICB9KCkpO1xuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lc25cXCd0IHJlbW92ZSBub24gQW5ndWxhciBwcm9wRGVjb3JhdG9ycycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5wdXQgfSBmcm9tICdhbm90aGVyLWxpYic7XG4gICAgICAgICR7Y2xhenp9XG4gICAgICAgIENsYXp6LnByb3BEZWNvcmF0b3JzID0geyAnbmdJZic6IFt7IHR5cGU6IElucHV0IH1dIH07XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke2lucHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ2xlYXZlcyBub24tQW5ndWxhciBwcm9wRGVjb3JhdG9ycyBpbiBtaXhlZCBhcnJheXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICBpbXBvcnQgeyBOb3RJbnB1dCB9IGZyb20gJ2Fub3RoZXItbGliJztcbiAgICAgICAgJHtjbGF6en1cbiAgICAgICAgQ2xhenoucHJvcERlY29yYXRvcnMgPSB7XG4gICAgICAgICAgJ25vdE5nSWYnOiBbeyB0eXBlOiBOb3RJbnB1dCB9XVxuICAgICAgICB9O1xuICAgICAgYDtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgTm90SW5wdXQgfSBmcm9tICdhbm90aGVyLWxpYic7XG4gICAgICAgICR7Y2xhenp9XG4gICAgICAgIENsYXp6LnByb3BEZWNvcmF0b3JzID0ge1xuICAgICAgICAgICduZ0lmJzogW3sgdHlwZTogSW5wdXQgfV0sXG4gICAgICAgICAgJ25vdE5nSWYnOiBbeyB0eXBlOiBOb3RJbnB1dCB9XVxuICAgICAgICB9O1xuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjdG9yUGFyYW1ldGVycycsICgpID0+IHtcbiAgICBpdCgncmVtb3ZlcyBlbXB0eSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgJHtjbGF6en1cbiAgICAgIGA7XG4gICAgICBjb25zdCBpbnB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgICR7b3V0cHV0fVxuICAgICAgICBDbGF6ei5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9O1xuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRlc3RTY3J1YkZpbGUoaW5wdXQpKS50b0JlVHJ1dGh5KCk7XG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke291dHB1dH1gKTtcbiAgICB9KTtcblxuICAgIGl0KCdyZW1vdmVzIG5vbi1lbXB0eSB0b3AtbGV2ZWwgc3R5bGUgY29uc3RydWN0b3IgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgICR7Y2xhenp9XG4gICAgICBgO1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke2NsYXp6fVxuICAgICAgICBDbGF6ei5jdG9yUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFt7dHlwZTogSW5qZWN0b3J9XTsgfTtcbiAgICAgIGA7XG5cbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG5cbiAgICBpdCgncmVtb3ZlcyB0b3AtbGV2ZWwgQW5ndWxhciBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJzIGluIGVzMjAxNScsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dCA9IHRhZ3Muc3RyaXBJbmRlbnRgXG4gICAgICAgIGNsYXNzIENsYXp6IGV4dGVuZHMgQmFzZUNsYXp6IHsgY29uc3RydWN0b3IoZSkgeyBzdXBlcihlKTsgfSB9XG4gICAgICBgO1xuICAgICAgY29uc3QgaW5wdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICAke291dHB1dH1cbiAgICAgICAgQ2xhenouY3RvclBhcmFtZXRlcnMgPSAoKSA9PiBbIHsgdHlwZTogSW5qZWN0YWJsZSB9IF07XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGVzdFNjcnViRmlsZShpbnB1dCkpLnRvQmVUcnV0aHkoKTtcbiAgICAgIGV4cGVjdCh0YWdzLm9uZUxpbmVgJHt0cmFuc2Zvcm0oaW5wdXQpfWApLnRvRXF1YWwodGFncy5vbmVMaW5lYCR7b3V0cHV0fWApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZXMgbmVzdGVkIGNvbnN0cnVjdG9yIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXQgPSB0YWdzLnN0cmlwSW5kZW50YFxuICAgICAgICBpbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuICAgICAgICB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGZ1bmN0aW9uIENsYXp6KCkgeyB9XG4gICAgICAgICAgcmV0dXJuIENsYXp6O1xuICAgICAgICB9KCkpO1xuICAgICAgYDtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgdmFyIENsYXp6ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBmdW5jdGlvbiBDbGF6eigpIHt9XG4gICAgICAgICAgQ2xhenouY3RvclBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBbe3R5cGU6IEluamVjdG9yfV07IH07XG4gICAgICAgICAgcmV0dXJuIENsYXp6O1xuICAgICAgICB9KCkpO1xuICAgICAgYDtcblxuICAgICAgZXhwZWN0KHRhZ3Mub25lTGluZWAke3RyYW5zZm9ybShpbnB1dCl9YCkudG9FcXVhbCh0YWdzLm9uZUxpbmVgJHtvdXRwdXR9YCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZG9lc25cXCd0IHJlbW92ZSBjb25zdHJ1Y3RvciBwYXJhbWV0ZXJzIGZyb20gd2hpdGVsaXN0ZWQgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGFncy5zdHJpcEluZGVudGBcbiAgICAgICAgJHtjbGF6ei5yZXBsYWNlKCdDbGF6eicsICdQbGF0Zm9ybVJlZl8nKX1cbiAgICAgICAgUGxhdGZvcm1SZWZfLmN0b3JQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH07XG4gICAgICBgO1xuXG4gICAgICBleHBlY3QodGFncy5vbmVMaW5lYCR7dHJhbnNmb3JtKGlucHV0KX1gKS50b0VxdWFsKHRhZ3Mub25lTGluZWAke2lucHV0fWApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19