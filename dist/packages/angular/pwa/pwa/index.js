"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const config_1 = require("../utility/config");
function addServiceWorker(options) {
    return (host, context) => {
        context.logger.debug('Adding service worker...');
        const swOptions = Object.assign({}, options);
        delete swOptions.title;
        return schematics_1.externalSchematic('@schematics/angular', 'service-worker', swOptions);
    };
}
function getIndent(text) {
    let indent = '';
    for (const char of text) {
        if (char === ' ' || char === '\t') {
            indent += char;
        }
        else {
            break;
        }
    }
    return indent;
}
function updateIndexFile(options) {
    return (host, context) => {
        const workspace = config_1.getWorkspace(host);
        const project = workspace.projects[options.project];
        let path;
        if (project && project.architect && project.architect.build &&
            project.architect.build.options.index) {
            path = project.architect.build.options.index;
        }
        else {
            throw new schematics_1.SchematicsException('Could not find index file for the project');
        }
        const buffer = host.read(path);
        if (buffer === null) {
            throw new schematics_1.SchematicsException(`Could not read index file: ${path}`);
        }
        const content = buffer.toString();
        const lines = content.split('\n');
        let closingHeadTagLineIndex = -1;
        let closingBodyTagLineIndex = -1;
        lines.forEach((line, index) => {
            if (closingHeadTagLineIndex === -1 && /<\/head>/.test(line)) {
                closingHeadTagLineIndex = index;
            }
            else if (closingBodyTagLineIndex === -1 && /<\/body>/.test(line)) {
                closingBodyTagLineIndex = index;
            }
        });
        const headIndent = getIndent(lines[closingHeadTagLineIndex]) + '  ';
        const itemsToAddToHead = [
            '<link rel="manifest" href="manifest.json">',
            '<meta name="theme-color" content="#1976d2">',
        ];
        const bodyIndent = getIndent(lines[closingBodyTagLineIndex]) + '  ';
        const itemsToAddToBody = [
            '<noscript>Please enable JavaScript to continue using this application.</noscript>',
        ];
        const updatedIndex = [
            ...lines.slice(0, closingHeadTagLineIndex),
            ...itemsToAddToHead.map(line => headIndent + line),
            ...lines.slice(closingHeadTagLineIndex, closingBodyTagLineIndex),
            ...itemsToAddToBody.map(line => bodyIndent + line),
            ...lines.slice(closingHeadTagLineIndex),
        ].join('\n');
        host.overwrite(path, updatedIndex);
        return host;
    };
}
function addManifestToAssetsConfig(options) {
    return (host, context) => {
        const workspacePath = config_1.getWorkspacePath(host);
        const workspace = config_1.getWorkspace(host);
        const project = workspace.projects[options.project];
        if (!project) {
            throw new Error(`Project is not defined in this workspace.`);
        }
        const assetEntry = core_1.join(core_1.normalize(project.root), 'src', 'manifest.json');
        if (!project.architect) {
            throw new Error(`Architect is not defined for this project.`);
        }
        const architect = project.architect;
        ['build', 'test'].forEach((target) => {
            const applyTo = architect[target].options;
            const assets = applyTo.assets || (applyTo.assets = []);
            assets.push(assetEntry);
        });
        host.overwrite(workspacePath, JSON.stringify(workspace, null, 2));
        return host;
    };
}
function default_1(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        if (!options.project) {
            throw new schematics_1.SchematicsException('Option "project" is required.');
        }
        const project = workspace.projects[options.project];
        if (project.projectType !== 'application') {
            throw new schematics_1.SchematicsException(`PWA requires a project type of "application".`);
        }
        const sourcePath = core_1.join(project.root, 'src');
        const assetsPath = core_1.join(sourcePath, 'assets');
        options.title = options.title || options.project;
        const rootTemplateSource = schematics_1.apply(schematics_1.url('./files/root'), [
            schematics_1.template(Object.assign({}, options)),
            schematics_1.move(sourcePath),
        ]);
        const assetsTemplateSource = schematics_1.apply(schematics_1.url('./files/assets'), [
            schematics_1.template(Object.assign({}, options)),
            schematics_1.move(assetsPath),
        ]);
        return schematics_1.chain([
            addServiceWorker(options),
            schematics_1.mergeWith(rootTemplateSource),
            schematics_1.mergeWith(assetsTemplateSource),
            updateIndexFile(options),
            addManifestToAssetsConfig(options),
        ]);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXIvcHdhL3B3YS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7RUFNRTtBQUNGLCtDQUE2RDtBQUM3RCwyREFZb0M7QUFDcEMsOENBQW1FO0FBSW5FLDBCQUEwQixPQUFtQjtJQUMzQyxPQUFPLENBQUMsSUFBVSxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUMvQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBRWpELE1BQU0sU0FBUyxxQkFDVixPQUFPLENBQ1gsQ0FBQztRQUNGLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQztRQUV2QixPQUFPLDhCQUFpQixDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxtQkFBbUIsSUFBWTtJQUM3QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFFaEIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDdkIsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7WUFDakMsTUFBTSxJQUFJLElBQUksQ0FBQztTQUNoQjthQUFNO1lBQ0wsTUFBTTtTQUNQO0tBQ0Y7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQseUJBQXlCLE9BQW1CO0lBQzFDLE9BQU8sQ0FBQyxJQUFVLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQy9DLE1BQU0sU0FBUyxHQUFHLHFCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBaUIsQ0FBQyxDQUFDO1FBQzlELElBQUksSUFBWSxDQUFDO1FBQ2pC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LE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxJQUFJLE9BQU8sQ0FBQyxXQUFXLEtBQUssYUFBYSxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQ2hGO1FBRUQsTUFBTSxVQUFVLEdBQUcsV0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsTUFBTSxVQUFVLEdBQUcsV0FBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUU5QyxPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUVqRCxNQUFNLGtCQUFrQixHQUFHLGtCQUFLLENBQUMsZ0JBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNwRCxxQkFBUSxtQkFBTSxPQUFPLEVBQUc7WUFDeEIsaUJBQUksQ0FBQyxVQUFVLENBQUM7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxvQkFBb0IsR0FBRyxrQkFBSyxDQUFDLGdCQUFHLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUN4RCxxQkFBUSxtQkFBTSxPQUFPLEVBQUc7WUFDeEIsaUJBQUksQ0FBQyxVQUFVLENBQUM7U0FDakIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxrQkFBSyxDQUFDO1lBQ1gsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO1lBQ3pCLHNCQUFTLENBQUMsa0JBQWtCLENBQUM7WUFDN0Isc0JBQVMsQ0FBQyxvQkFBb0IsQ0FBQztZQUMvQixlQUFlLENBQUMsT0FBTyxDQUFDO1lBQ3hCLHlCQUF5QixDQUFDLE9BQU8sQ0FBQztTQUNuQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDSixDQUFDO0FBakNELDRCQWlDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuKiBAbGljZW5zZVxuKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbipcbiogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuKi9cbmltcG9ydCB7IFBhdGgsIGpvaW4sIG5vcm1hbGl6ZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIGFwcGx5LFxuICBjaGFpbixcbiAgZXh0ZXJuYWxTY2hlbWF0aWMsXG4gIG1lcmdlV2l0aCxcbiAgbW92ZSxcbiAgdGVtcGxhdGUsXG4gIHVybCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgZ2V0V29ya3NwYWNlLCBnZXRXb3Jrc3BhY2VQYXRoIH0gZnJvbSAnLi4vdXRpbGl0eS9jb25maWcnO1xuaW1wb3J0IHsgU2NoZW1hIGFzIFB3YU9wdGlvbnMgfSBmcm9tICcuL3NjaGVtYSc7XG5cblxuZnVuY3Rpb24gYWRkU2VydmljZVdvcmtlcihvcHRpb25zOiBQd2FPcHRpb25zKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnRleHQubG9nZ2VyLmRlYnVnKCdBZGRpbmcgc2VydmljZSB3b3JrZXIuLi4nKTtcblxuICAgIGNvbnN0IHN3T3B0aW9ucyA9IHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfTtcbiAgICBkZWxldGUgc3dPcHRpb25zLnRpdGxlO1xuXG4gICAgcmV0dXJuIGV4dGVybmFsU2NoZW1hdGljKCdAc2NoZW1hdGljcy9hbmd1bGFyJywgJ3NlcnZpY2Utd29ya2VyJywgc3dPcHRpb25zKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0SW5kZW50KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBpbmRlbnQgPSAnJztcblxuICBmb3IgKGNvbnN0IGNoYXIgb2YgdGV4dCkge1xuICAgIGlmIChjaGFyID09PSAnICcgfHwgY2hhciA9PT0gJ1xcdCcpIHtcbiAgICAgIGluZGVudCArPSBjaGFyO1xuICAgIH0gZWxzZSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5kZW50O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVJbmRleEZpbGUob3B0aW9uczogUHdhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0c1tvcHRpb25zLnByb2plY3QgYXMgc3RyaW5nXTtcbiAgICBsZXQgcGF0aDogc3RyaW5nO1xuICAgIGlmIChwcm9qZWN0ICYmIHByb2plY3QuYXJjaGl0ZWN0ICYmIHByb2plY3QuYXJjaGl0ZWN0LmJ1aWxkICYmXG4gICAgICAgIHByb2plY3QuYXJjaGl0ZWN0LmJ1aWxkLm9wdGlvbnMuaW5kZXgpIHtcbiAgICAgIHBhdGggPSBwcm9qZWN0LmFyY2hpdGVjdC5idWlsZC5vcHRpb25zLmluZGV4O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignQ291bGQgbm90IGZpbmQgaW5kZXggZmlsZSBmb3IgdGhlIHByb2plY3QnKTtcbiAgICB9XG4gICAgY29uc3QgYnVmZmVyID0gaG9zdC5yZWFkKHBhdGgpO1xuICAgIGlmIChidWZmZXIgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBDb3VsZCBub3QgcmVhZCBpbmRleCBmaWxlOiAke3BhdGh9YCk7XG4gICAgfVxuICAgIGNvbnN0IGNvbnRlbnQgPSBidWZmZXIudG9TdHJpbmcoKTtcbiAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xuICAgIGxldCBjbG9zaW5nSGVhZFRhZ0xpbmVJbmRleCA9IC0xO1xuICAgIGxldCBjbG9zaW5nQm9keVRhZ0xpbmVJbmRleCA9IC0xO1xuICAgIGxpbmVzLmZvckVhY2goKGxpbmUsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoY2xvc2luZ0hlYWRUYWdMaW5lSW5kZXggPT09IC0xICYmIC88XFwvaGVhZD4vLnRlc3QobGluZSkpIHtcbiAgICAgICAgY2xvc2luZ0hlYWRUYWdMaW5lSW5kZXggPSBpbmRleDtcbiAgICAgIH0gZWxzZSBpZiAoY2xvc2luZ0JvZHlUYWdMaW5lSW5kZXggPT09IC0xICYmIC88XFwvYm9keT4vLnRlc3QobGluZSkpIHtcbiAgICAgICAgY2xvc2luZ0JvZHlUYWdMaW5lSW5kZXggPSBpbmRleDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGhlYWRJbmRlbnQgPSBnZXRJbmRlbnQobGluZXNbY2xvc2luZ0hlYWRUYWdMaW5lSW5kZXhdKSArICcgICc7XG4gICAgY29uc3QgaXRlbXNUb0FkZFRvSGVhZCA9IFtcbiAgICAgICc8bGluayByZWw9XCJtYW5pZmVzdFwiIGhyZWY9XCJtYW5pZmVzdC5qc29uXCI+JyxcbiAgICAgICc8bWV0YSBuYW1lPVwidGhlbWUtY29sb3JcIiBjb250ZW50PVwiIzE5NzZkMlwiPicsXG4gICAgXTtcblxuICAgIGNvbnN0IGJvZHlJbmRlbnQgPSBnZXRJbmRlbnQobGluZXNbY2xvc2luZ0JvZHlUYWdMaW5lSW5kZXhdKSArICcgICc7XG4gICAgY29uc3QgaXRlbXNUb0FkZFRvQm9keSA9IFtcbiAgICAgICc8bm9zY3JpcHQ+UGxlYXNlIGVuYWJsZSBKYXZhU2NyaXB0IHRvIGNvbnRpbnVlIHVzaW5nIHRoaXMgYXBwbGljYXRpb24uPC9ub3NjcmlwdD4nLFxuICAgIF07XG5cbiAgICBjb25zdCB1cGRhdGVkSW5kZXggPSBbXG4gICAgICAuLi5saW5lcy5zbGljZSgwLCBjbG9zaW5nSGVhZFRhZ0xpbmVJbmRleCksXG4gICAgICAuLi5pdGVtc1RvQWRkVG9IZWFkLm1hcChsaW5lID0+IGhlYWRJbmRlbnQgKyBsaW5lKSxcbiAgICAgIC4uLmxpbmVzLnNsaWNlKGNsb3NpbmdIZWFkVGFnTGluZUluZGV4LCBjbG9zaW5nQm9keVRhZ0xpbmVJbmRleCksXG4gICAgICAuLi5pdGVtc1RvQWRkVG9Cb2R5Lm1hcChsaW5lID0+IGJvZHlJbmRlbnQgKyBsaW5lKSxcbiAgICAgIC4uLmxpbmVzLnNsaWNlKGNsb3NpbmdIZWFkVGFnTGluZUluZGV4KSxcbiAgICBdLmpvaW4oJ1xcbicpO1xuXG4gICAgaG9zdC5vdmVyd3JpdGUocGF0aCwgdXBkYXRlZEluZGV4KTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRNYW5pZmVzdFRvQXNzZXRzQ29uZmlnKG9wdGlvbnM6IFB3YU9wdGlvbnMpIHtcbiAgcmV0dXJuIChob3N0OiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG5cbiAgICBjb25zdCB3b3Jrc3BhY2VQYXRoID0gZ2V0V29ya3NwYWNlUGF0aChob3N0KTtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0c1tvcHRpb25zLnByb2plY3QgYXMgc3RyaW5nXTtcblxuICAgIGlmICghcHJvamVjdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQcm9qZWN0IGlzIG5vdCBkZWZpbmVkIGluIHRoaXMgd29ya3NwYWNlLmApO1xuICAgIH1cblxuICAgIGNvbnN0IGFzc2V0RW50cnkgPSBqb2luKG5vcm1hbGl6ZShwcm9qZWN0LnJvb3QpLCAnc3JjJywgJ21hbmlmZXN0Lmpzb24nKTtcblxuICAgIGlmICghcHJvamVjdC5hcmNoaXRlY3QpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJjaGl0ZWN0IGlzIG5vdCBkZWZpbmVkIGZvciB0aGlzIHByb2plY3QuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXJjaGl0ZWN0ID0gcHJvamVjdC5hcmNoaXRlY3Q7XG5cbiAgICBbJ2J1aWxkJywgJ3Rlc3QnXS5mb3JFYWNoKCh0YXJnZXQpID0+IHtcblxuICAgICAgY29uc3QgYXBwbHlUbyA9IGFyY2hpdGVjdFt0YXJnZXRdLm9wdGlvbnM7XG4gICAgICBjb25zdCBhc3NldHMgPSBhcHBseVRvLmFzc2V0cyB8fCAoYXBwbHlUby5hc3NldHMgPSBbXSk7XG5cbiAgICAgIGFzc2V0cy5wdXNoKGFzc2V0RW50cnkpO1xuXG4gICAgfSk7XG5cbiAgICBob3N0Lm92ZXJ3cml0ZSh3b3Jrc3BhY2VQYXRoLCBKU09OLnN0cmluZ2lmeSh3b3Jrc3BhY2UsIG51bGwsIDIpKTtcblxuICAgIHJldHVybiBob3N0O1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9uczogUHdhT3B0aW9ucyk6IFJ1bGUge1xuICByZXR1cm4gKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCB3b3Jrc3BhY2UgPSBnZXRXb3Jrc3BhY2UoaG9zdCk7XG4gICAgaWYgKCFvcHRpb25zLnByb2plY3QpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCdPcHRpb24gXCJwcm9qZWN0XCIgaXMgcmVxdWlyZWQuJyk7XG4gICAgfVxuICAgIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdHNbb3B0aW9ucy5wcm9qZWN0XTtcbiAgICBpZiAocHJvamVjdC5wcm9qZWN0VHlwZSAhPT0gJ2FwcGxpY2F0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYFBXQSByZXF1aXJlcyBhIHByb2plY3QgdHlwZSBvZiBcImFwcGxpY2F0aW9uXCIuYCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlUGF0aCA9IGpvaW4ocHJvamVjdC5yb290IGFzIFBhdGgsICdzcmMnKTtcbiAgICBjb25zdCBhc3NldHNQYXRoID0gam9pbihzb3VyY2VQYXRoLCAnYXNzZXRzJyk7XG5cbiAgICBvcHRpb25zLnRpdGxlID0gb3B0aW9ucy50aXRsZSB8fCBvcHRpb25zLnByb2plY3Q7XG5cbiAgICBjb25zdCByb290VGVtcGxhdGVTb3VyY2UgPSBhcHBseSh1cmwoJy4vZmlsZXMvcm9vdCcpLCBbXG4gICAgICB0ZW1wbGF0ZSh7IC4uLm9wdGlvbnMgfSksXG4gICAgICBtb3ZlKHNvdXJjZVBhdGgpLFxuICAgIF0pO1xuICAgIGNvbnN0IGFzc2V0c1RlbXBsYXRlU291cmNlID0gYXBwbHkodXJsKCcuL2ZpbGVzL2Fzc2V0cycpLCBbXG4gICAgICB0ZW1wbGF0ZSh7IC4uLm9wdGlvbnMgfSksXG4gICAgICBtb3ZlKGFzc2V0c1BhdGgpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIGNoYWluKFtcbiAgICAgIGFkZFNlcnZpY2VXb3JrZXIob3B0aW9ucyksXG4gICAgICBtZXJnZVdpdGgocm9vdFRlbXBsYXRlU291cmNlKSxcbiAgICAgIG1lcmdlV2l0aChhc3NldHNUZW1wbGF0ZVNvdXJjZSksXG4gICAgICB1cGRhdGVJbmRleEZpbGUob3B0aW9ucyksXG4gICAgICBhZGRNYW5pZmVzdFRvQXNzZXRzQ29uZmlnKG9wdGlvbnMpLFxuICAgIF0pO1xuICB9O1xufVxuIl19