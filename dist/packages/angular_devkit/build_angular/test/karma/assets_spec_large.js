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
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
describe('Karma Builder assets', () => {
    beforeEach(done => utils_1.host.initialize().toPromise().then(done, done.fail));
    afterEach(done => utils_1.host.restore().toPromise().then(done, done.fail));
    it('works', (done) => {
        const assets = {
            './src/string-file-asset.txt': 'string-file-asset.txt',
            './src/string-folder-asset/file.txt': 'string-folder-asset.txt',
            './src/glob-asset.txt': 'glob-asset.txt',
            './src/folder/folder-asset.txt': 'folder-asset.txt',
            './src/output-asset.txt': 'output-asset.txt',
        };
        utils_1.host.writeMultipleFiles(assets);
        utils_1.host.writeMultipleFiles({
            'src/app/app.module.ts': `
        import { BrowserModule } from '@angular/platform-browser';
        import { NgModule } from '@angular/core';
        import { HttpModule } from '@angular/http';
        import { AppComponent } from './app.component';

        @NgModule({
          declarations: [
            AppComponent
          ],
          imports: [
            BrowserModule,
            HttpModule
          ],
          providers: [],
          bootstrap: [AppComponent]
        })
        export class AppModule { }
      `,
            'src/app/app.component.ts': `
        import { Component } from '@angular/core';
        import { Http, Response } from '@angular/http';

        @Component({
          selector: 'app-root',
          template: '<p *ngFor="let asset of assets">{{asset.content }}</p>'
        })
        export class AppComponent {
          public assets = [
            { path: './string-file-asset.txt', content: '' },
            { path: './string-folder-asset/file.txt', content: '' },
            { path: './glob-asset.txt', content: '' },
            { path: './folder/folder-asset.txt', content: '' },
            { path: './output-folder/output-asset.txt', content: '' },
          ];
          constructor(private http: Http) {
            this.assets.forEach(asset => http.get(asset.path)
              .subscribe(res => asset.content = res['_body']));
          }
        }`,
            'src/app/app.component.spec.ts': `
        import { TestBed, async } from '@angular/core/testing';
        import { HttpModule } from '@angular/http';
        import { AppComponent } from './app.component';

        describe('AppComponent', () => {
          beforeEach(async(() => {
            TestBed.configureTestingModule({
              imports: [
                HttpModule
              ],
              declarations: [
                AppComponent
              ]
            }).compileComponents();
          }));

          it('should create the app', async(() => {
            const fixture = TestBed.createComponent(AppComponent);
            const app = fixture.debugElement.componentInstance;
            expect(app).toBeTruthy();
          }));
        });`,
        });
        const overrides = {
            assets: [
                'src/string-file-asset.txt',
                'src/string-folder-asset',
                { glob: 'glob-asset.txt', input: 'src/', output: '/' },
                { glob: 'output-asset.txt', input: 'src/', output: '/output-folder' },
                { glob: '**/*', input: 'src/folder', output: '/folder' },
            ],
        };
        testing_1.runTargetSpec(utils_1.host, utils_1.karmaTargetSpec, overrides).pipe(operators_1.tap(buildEvent => expect(buildEvent.success).toBe(true))).toPromise().then(done, done.fail);
    }, 45000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXRzX3NwZWNfbGFyZ2UuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvdGVzdC9rYXJtYS9hc3NldHNfc3BlY19sYXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtEQUFrRTtBQUNsRSw4Q0FBcUM7QUFDckMsb0NBQWlEO0FBR2pELFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFcEUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ25CLE1BQU0sTUFBTSxHQUErQjtZQUN6Qyw2QkFBNkIsRUFBRSx1QkFBdUI7WUFDdEQsb0NBQW9DLEVBQUUseUJBQXlCO1lBQy9ELHNCQUFzQixFQUFFLGdCQUFnQjtZQUN4QywrQkFBK0IsRUFBRSxrQkFBa0I7WUFDbkQsd0JBQXdCLEVBQUUsa0JBQWtCO1NBQzdDLENBQUM7UUFDRixZQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsWUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQ3RCLHVCQUF1QixFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQnhCO1lBQ0QsMEJBQTBCLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBb0J4QjtZQUNKLCtCQUErQixFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBc0IzQjtTQUNQLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHO1lBQ2hCLE1BQU0sRUFBRTtnQkFDTiwyQkFBMkI7Z0JBQzNCLHlCQUF5QjtnQkFDekIsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUN0RCxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRTtnQkFDckUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTthQUN6RDtTQUNGLENBQUM7UUFFRix1QkFBYSxDQUFDLFlBQUksRUFBRSx1QkFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FDbEQsZUFBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FDekQsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDWixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgcnVuVGFyZ2V0U3BlYyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QvdGVzdGluZyc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBob3N0LCBrYXJtYVRhcmdldFNwZWMgfSBmcm9tICcuLi91dGlscyc7XG5cblxuZGVzY3JpYmUoJ0thcm1hIEJ1aWxkZXIgYXNzZXRzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGRvbmUgPT4gaG9zdC5pbml0aWFsaXplKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcbiAgYWZ0ZXJFYWNoKGRvbmUgPT4gaG9zdC5yZXN0b3JlKCkudG9Qcm9taXNlKCkudGhlbihkb25lLCBkb25lLmZhaWwpKTtcblxuICBpdCgnd29ya3MnLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IGFzc2V0czogeyBbcGF0aDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAnLi9zcmMvc3RyaW5nLWZpbGUtYXNzZXQudHh0JzogJ3N0cmluZy1maWxlLWFzc2V0LnR4dCcsXG4gICAgICAnLi9zcmMvc3RyaW5nLWZvbGRlci1hc3NldC9maWxlLnR4dCc6ICdzdHJpbmctZm9sZGVyLWFzc2V0LnR4dCcsXG4gICAgICAnLi9zcmMvZ2xvYi1hc3NldC50eHQnOiAnZ2xvYi1hc3NldC50eHQnLFxuICAgICAgJy4vc3JjL2ZvbGRlci9mb2xkZXItYXNzZXQudHh0JzogJ2ZvbGRlci1hc3NldC50eHQnLFxuICAgICAgJy4vc3JjL291dHB1dC1hc3NldC50eHQnOiAnb3V0cHV0LWFzc2V0LnR4dCcsXG4gICAgfTtcbiAgICBob3N0LndyaXRlTXVsdGlwbGVGaWxlcyhhc3NldHMpO1xuICAgIGhvc3Qud3JpdGVNdWx0aXBsZUZpbGVzKHtcbiAgICAgICdzcmMvYXBwL2FwcC5tb2R1bGUudHMnOiBgXG4gICAgICAgIGltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbiAgICAgICAgaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgSHR0cE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuICAgICAgICBpbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuXG4gICAgICAgIEBOZ01vZHVsZSh7XG4gICAgICAgICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgICAgICBBcHBDb21wb25lbnRcbiAgICAgICAgICBdLFxuICAgICAgICAgIGltcG9ydHM6IFtcbiAgICAgICAgICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgICAgICAgICBIdHRwTW9kdWxlXG4gICAgICAgICAgXSxcbiAgICAgICAgICBwcm92aWRlcnM6IFtdLFxuICAgICAgICAgIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbiAgICAgICAgfSlcbiAgICAgICAgZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cbiAgICAgIGAsXG4gICAgICAnc3JjL2FwcC9hcHAuY29tcG9uZW50LnRzJzogYFxuICAgICAgICBpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICAgICAgaW1wb3J0IHsgSHR0cCwgUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9odHRwJztcblxuICAgICAgICBAQ29tcG9uZW50KHtcbiAgICAgICAgICBzZWxlY3RvcjogJ2FwcC1yb290JyxcbiAgICAgICAgICB0ZW1wbGF0ZTogJzxwICpuZ0Zvcj1cImxldCBhc3NldCBvZiBhc3NldHNcIj57e2Fzc2V0LmNvbnRlbnQgfX08L3A+J1xuICAgICAgICB9KVxuICAgICAgICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAgICAgICAgICBwdWJsaWMgYXNzZXRzID0gW1xuICAgICAgICAgICAgeyBwYXRoOiAnLi9zdHJpbmctZmlsZS1hc3NldC50eHQnLCBjb250ZW50OiAnJyB9LFxuICAgICAgICAgICAgeyBwYXRoOiAnLi9zdHJpbmctZm9sZGVyLWFzc2V0L2ZpbGUudHh0JywgY29udGVudDogJycgfSxcbiAgICAgICAgICAgIHsgcGF0aDogJy4vZ2xvYi1hc3NldC50eHQnLCBjb250ZW50OiAnJyB9LFxuICAgICAgICAgICAgeyBwYXRoOiAnLi9mb2xkZXIvZm9sZGVyLWFzc2V0LnR4dCcsIGNvbnRlbnQ6ICcnIH0sXG4gICAgICAgICAgICB7IHBhdGg6ICcuL291dHB1dC1mb2xkZXIvb3V0cHV0LWFzc2V0LnR4dCcsIGNvbnRlbnQ6ICcnIH0sXG4gICAgICAgICAgXTtcbiAgICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHtcbiAgICAgICAgICAgIHRoaXMuYXNzZXRzLmZvckVhY2goYXNzZXQgPT4gaHR0cC5nZXQoYXNzZXQucGF0aClcbiAgICAgICAgICAgICAgLnN1YnNjcmliZShyZXMgPT4gYXNzZXQuY29udGVudCA9IHJlc1snX2JvZHknXSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfWAsXG4gICAgICAnc3JjL2FwcC9hcHAuY29tcG9uZW50LnNwZWMudHMnOiBgXG4gICAgICAgIGltcG9ydCB7IFRlc3RCZWQsIGFzeW5jIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS90ZXN0aW5nJztcbiAgICAgICAgaW1wb3J0IHsgSHR0cE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2h0dHAnO1xuICAgICAgICBpbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuXG4gICAgICAgIGRlc2NyaWJlKCdBcHBDb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaChhc3luYygoKSA9PiB7XG4gICAgICAgICAgICBUZXN0QmVkLmNvbmZpZ3VyZVRlc3RpbmdNb2R1bGUoe1xuICAgICAgICAgICAgICBpbXBvcnRzOiBbXG4gICAgICAgICAgICAgICAgSHR0cE1vZHVsZVxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgICAgICAgICBBcHBDb21wb25lbnRcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSkuY29tcGlsZUNvbXBvbmVudHMoKTtcbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSB0aGUgYXBwJywgYXN5bmMoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZml4dHVyZSA9IFRlc3RCZWQuY3JlYXRlQ29tcG9uZW50KEFwcENvbXBvbmVudCk7XG4gICAgICAgICAgICBjb25zdCBhcHAgPSBmaXh0dXJlLmRlYnVnRWxlbWVudC5jb21wb25lbnRJbnN0YW5jZTtcbiAgICAgICAgICAgIGV4cGVjdChhcHApLnRvQmVUcnV0aHkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO2AsXG4gICAgfSk7XG5cbiAgICBjb25zdCBvdmVycmlkZXMgPSB7XG4gICAgICBhc3NldHM6IFtcbiAgICAgICAgJ3NyYy9zdHJpbmctZmlsZS1hc3NldC50eHQnLFxuICAgICAgICAnc3JjL3N0cmluZy1mb2xkZXItYXNzZXQnLFxuICAgICAgICB7IGdsb2I6ICdnbG9iLWFzc2V0LnR4dCcsIGlucHV0OiAnc3JjLycsIG91dHB1dDogJy8nIH0sXG4gICAgICAgIHsgZ2xvYjogJ291dHB1dC1hc3NldC50eHQnLCBpbnB1dDogJ3NyYy8nLCBvdXRwdXQ6ICcvb3V0cHV0LWZvbGRlcicgfSxcbiAgICAgICAgeyBnbG9iOiAnKiovKicsIGlucHV0OiAnc3JjL2ZvbGRlcicsIG91dHB1dDogJy9mb2xkZXInIH0sXG4gICAgICBdLFxuICAgIH07XG5cbiAgICBydW5UYXJnZXRTcGVjKGhvc3QsIGthcm1hVGFyZ2V0U3BlYywgb3ZlcnJpZGVzKS5waXBlKFxuICAgICAgdGFwKGJ1aWxkRXZlbnQgPT4gZXhwZWN0KGJ1aWxkRXZlbnQuc3VjY2VzcykudG9CZSh0cnVlKSksXG4gICAgKS50b1Byb21pc2UoKS50aGVuKGRvbmUsIGRvbmUuZmFpbCk7XG4gIH0sIDQ1MDAwKTtcbn0pO1xuIl19