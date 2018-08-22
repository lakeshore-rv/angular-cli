"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
describe('Ng New Schematic', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('@schematics/angular', path.join(__dirname, '../collection.json'));
    const defaultOptions = {
        name: 'foo',
        directory: 'bar',
        version: '6.0.0',
    };
    it('should create files of a workspace', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = schematicRunner.runSchematic('ng-new', options);
        const files = tree.files;
        expect(files.indexOf('/bar/angular.json')).toBeGreaterThanOrEqual(0);
    });
    it('should create files of an application', () => {
        const options = Object.assign({}, defaultOptions);
        const tree = schematicRunner.runSchematic('ng-new', options);
        const files = tree.files;
        expect(files.indexOf('/bar/src/tsconfig.app.json')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/bar/src/main.ts')).toBeGreaterThanOrEqual(0);
        expect(files.indexOf('/bar/src/app/app.module.ts')).toBeGreaterThanOrEqual(0);
    });
    it('should should set the prefix in angular.json and in app.component.ts', () => {
        const options = Object.assign({}, defaultOptions, { prefix: 'pre' });
        const tree = schematicRunner.runSchematic('ng-new', options);
        const content = tree.readContent('/bar/angular.json');
        expect(content).toMatch(/"prefix": "pre"/);
    });
    it('should set up the app module', () => {
        const options = {
            name: 'foo',
            version: '6.0.0',
        };
        const tree = schematicRunner.runSchematic('ng-new', options);
        const moduleContent = tree.readContent('/foo/src/app/app.module.ts');
        expect(moduleContent).toMatch(/declarations:\s*\[\s*AppComponent\s*\]/m);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL25nLW5ldy9pbmRleF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsZ0VBQXlFO0FBQ3pFLDZCQUE2QjtBQUk3QixRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLE1BQU0sZUFBZSxHQUFHLElBQUksNkJBQW1CLENBQzdDLHFCQUFxQixFQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUMzQyxDQUFDO0lBQ0YsTUFBTSxjQUFjLEdBQWlCO1FBQ25DLElBQUksRUFBRSxLQUFLO1FBQ1gsU0FBUyxFQUFFLEtBQUs7UUFDaEIsT0FBTyxFQUFFLE9BQU87S0FDakIsQ0FBQztJQUVGLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsTUFBTSxPQUFPLHFCQUFRLGNBQWMsQ0FBRSxDQUFDO1FBRXRDLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxNQUFNLE9BQU8scUJBQVEsY0FBYyxDQUFFLENBQUM7UUFFdEMsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzRUFBc0UsRUFBRSxHQUFHLEVBQUU7UUFDOUUsTUFBTSxPQUFPLHFCQUFRLGNBQWMsSUFBRSxNQUFNLEVBQUUsS0FBSyxHQUFFLENBQUM7UUFFckQsTUFBTSxJQUFJLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7UUFDdEMsTUFBTSxPQUFPLEdBQWlCO1lBQzVCLElBQUksRUFBRSxLQUFLO1lBQ1gsT0FBTyxFQUFFLE9BQU87U0FDakIsQ0FBQztRQUVGLE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUNyRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7SUFDM0UsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IFNjaGVtYXRpY1Rlc3RSdW5uZXIgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90ZXN0aW5nJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBTY2hlbWEgYXMgTmdOZXdPcHRpb25zIH0gZnJvbSAnLi9zY2hlbWEnO1xuXG5cbmRlc2NyaWJlKCdOZyBOZXcgU2NoZW1hdGljJywgKCkgPT4ge1xuICBjb25zdCBzY2hlbWF0aWNSdW5uZXIgPSBuZXcgU2NoZW1hdGljVGVzdFJ1bm5lcihcbiAgICAnQHNjaGVtYXRpY3MvYW5ndWxhcicsXG4gICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2NvbGxlY3Rpb24uanNvbicpLFxuICApO1xuICBjb25zdCBkZWZhdWx0T3B0aW9uczogTmdOZXdPcHRpb25zID0ge1xuICAgIG5hbWU6ICdmb28nLFxuICAgIGRpcmVjdG9yeTogJ2JhcicsXG4gICAgdmVyc2lvbjogJzYuMC4wJyxcbiAgfTtcblxuICBpdCgnc2hvdWxkIGNyZWF0ZSBmaWxlcyBvZiBhIHdvcmtzcGFjZScsICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0geyAuLi5kZWZhdWx0T3B0aW9ucyB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ25nLW5ldycsIG9wdGlvbnMpO1xuICAgIGNvbnN0IGZpbGVzID0gdHJlZS5maWxlcztcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL2Jhci9hbmd1bGFyLmpzb24nKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgZmlsZXMgb2YgYW4gYXBwbGljYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMgfTtcblxuICAgIGNvbnN0IHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCduZy1uZXcnLCBvcHRpb25zKTtcbiAgICBjb25zdCBmaWxlcyA9IHRyZWUuZmlsZXM7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9iYXIvc3JjL3RzY29uZmlnLmFwcC5qc29uJykpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMCk7XG4gICAgZXhwZWN0KGZpbGVzLmluZGV4T2YoJy9iYXIvc3JjL21haW4udHMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgICBleHBlY3QoZmlsZXMuaW5kZXhPZignL2Jhci9zcmMvYXBwL2FwcC5tb2R1bGUudHMnKSkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzaG91bGQgc2V0IHRoZSBwcmVmaXggaW4gYW5ndWxhci5qc29uIGFuZCBpbiBhcHAuY29tcG9uZW50LnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCBwcmVmaXg6ICdwcmUnIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbmctbmV3Jywgb3B0aW9ucyk7XG4gICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9iYXIvYW5ndWxhci5qc29uJyk7XG4gICAgZXhwZWN0KGNvbnRlbnQpLnRvTWF0Y2goL1wicHJlZml4XCI6IFwicHJlXCIvKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzZXQgdXAgdGhlIGFwcCBtb2R1bGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9uczogTmdOZXdPcHRpb25zID0ge1xuICAgICAgbmFtZTogJ2ZvbycsXG4gICAgICB2ZXJzaW9uOiAnNi4wLjAnLFxuICAgIH07XG5cbiAgICBjb25zdCB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbmctbmV3Jywgb3B0aW9ucyk7XG4gICAgY29uc3QgbW9kdWxlQ29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9mb28vc3JjL2FwcC9hcHAubW9kdWxlLnRzJyk7XG4gICAgZXhwZWN0KG1vZHVsZUNvbnRlbnQpLnRvTWF0Y2goL2RlY2xhcmF0aW9uczpcXHMqXFxbXFxzKkFwcENvbXBvbmVudFxccypcXF0vbSk7XG4gIH0pO1xufSk7XG4iXX0=