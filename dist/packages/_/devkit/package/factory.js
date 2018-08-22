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
function appendPropertyInAstObject(recorder, node, propertyName, value, indent = 4) {
    const indentStr = '\n' + new Array(indent + 1).join(' ');
    if (node.properties.length > 0) {
        // Insert comma.
        const last = node.properties[node.properties.length - 1];
        recorder.insertRight(last.start.offset + last.text.replace(/\s+$/, '').length, ',');
    }
    recorder.insertLeft(node.end.offset - 1, '  '
        + `"${propertyName}": ${JSON.stringify(value, null, 2).replace(/\n/g, indentStr)}`
        + indentStr.slice(0, -2));
}
function addPackageToMonorepo(options, path) {
    return (tree) => {
        const collectionJsonContent = tree.read('/.monorepo.json');
        if (!collectionJsonContent) {
            throw new Error('Could not find monorepo.json');
        }
        const collectionJsonAst = core_1.parseJsonAst(collectionJsonContent.toString('utf-8'));
        if (collectionJsonAst.kind !== 'object') {
            throw new Error('Invalid monorepo content.');
        }
        const packages = collectionJsonAst.properties.find(x => x.key.value == 'packages');
        if (!packages) {
            throw new Error('Cannot find packages key in monorepo.');
        }
        if (packages.value.kind != 'object') {
            throw new Error('Invalid packages key.');
        }
        const readmeUrl = `https://github.com/angular/angular-cli/blob/master/${path}/README.md`;
        const recorder = tree.beginUpdate('/.monorepo.json');
        appendPropertyInAstObject(recorder, packages.value, options.name, {
            name: options.displayName,
            links: [{ label: 'README', url: readmeUrl }],
            version: '0.0.1',
            hash: '',
        });
        tree.commitUpdate(recorder);
    };
}
function default_1(options) {
    const path = 'packages/'
        + options.name
            .replace(/^@/, '')
            .replace(/-/g, '_');
    // Verify if we need to create a full project, or just add a new schematic.
    const source = schematics_1.apply(schematics_1.url('./project-files'), [
        schematics_1.template(Object.assign({}, options, { dot: '.', path })),
    ]);
    return schematics_1.chain([
        schematics_1.mergeWith(source),
        addPackageToMonorepo(options, path),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvXy9kZXZraXQvcGFja2FnZS9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQThFO0FBQzlFLDJEQVNvQztBQUlwQyxtQ0FDRSxRQUF3QixFQUN4QixJQUFtQixFQUNuQixZQUFvQixFQUNwQixLQUFnQixFQUNoQixNQUFNLEdBQUcsQ0FBQztJQUVWLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXpELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzlCLGdCQUFnQjtRQUNoQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNyRjtJQUVELFFBQVEsQ0FBQyxVQUFVLENBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDbkIsSUFBSTtVQUNGLElBQUksWUFBWSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUFFO1VBQ2hGLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQ3pCLENBQUM7QUFDSixDQUFDO0FBRUQsOEJBQThCLE9BQWUsRUFBRSxJQUFZO0lBQ3pELE9BQU8sQ0FBQyxJQUFVLEVBQUUsRUFBRTtRQUNwQixNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1NBQ2pEO1FBQ0QsTUFBTSxpQkFBaUIsR0FBRyxtQkFBWSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLElBQUksaUJBQWlCLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7U0FDOUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksVUFBVSxDQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUMxRDtRQUNELElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUMxQztRQUVELE1BQU0sU0FBUyxHQUFHLHNEQUFzRCxJQUFJLFlBQVksQ0FBQztRQUV6RixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDckQseUJBQXlCLENBQ3ZCLFFBQVEsRUFDUixRQUFRLENBQUMsS0FBSyxFQUNkLE9BQU8sQ0FBQyxJQUFJLEVBQ1o7WUFDRSxJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVc7WUFDekIsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUM1QyxPQUFPLEVBQUUsT0FBTztZQUNoQixJQUFJLEVBQUUsRUFBRTtTQUNULENBQ0YsQ0FBQztRQUNGLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUdELG1CQUF5QixPQUFlO0lBQ3RDLE1BQU0sSUFBSSxHQUFHLFdBQVc7VUFDcEIsT0FBTyxDQUFDLElBQUk7YUFDSixPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQzthQUNqQixPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRS9CLDJFQUEyRTtJQUMzRSxNQUFNLE1BQU0sR0FBRyxrQkFBSyxDQUFDLGdCQUFHLENBQUMsaUJBQWlCLENBQUMsRUFBRTtRQUMzQyxxQkFBUSxtQkFDSCxPQUFpQixJQUNwQixHQUFHLEVBQUUsR0FBRyxFQUNSLElBQUksSUFDSjtLQUNILENBQUMsQ0FBQztJQUVILE9BQU8sa0JBQUssQ0FBQztRQUNYLHNCQUFTLENBQUMsTUFBTSxDQUFDO1FBQ2pCLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUM7S0FDcEMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQW5CRCw0QkFtQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBKc29uQXN0T2JqZWN0LCBKc29uVmFsdWUsIHBhcnNlSnNvbkFzdCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFRyZWUsXG4gIFVwZGF0ZVJlY29yZGVyLFxuICBhcHBseSxcbiAgY2hhaW4sXG4gIG1lcmdlV2l0aCxcbiAgdGVtcGxhdGUsXG4gIHVybCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnO1xuXG5cbmZ1bmN0aW9uIGFwcGVuZFByb3BlcnR5SW5Bc3RPYmplY3QoXG4gIHJlY29yZGVyOiBVcGRhdGVSZWNvcmRlcixcbiAgbm9kZTogSnNvbkFzdE9iamVjdCxcbiAgcHJvcGVydHlOYW1lOiBzdHJpbmcsXG4gIHZhbHVlOiBKc29uVmFsdWUsXG4gIGluZGVudCA9IDQsXG4pIHtcbiAgY29uc3QgaW5kZW50U3RyID0gJ1xcbicgKyBuZXcgQXJyYXkoaW5kZW50ICsgMSkuam9pbignICcpO1xuXG4gIGlmIChub2RlLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgIC8vIEluc2VydCBjb21tYS5cbiAgICBjb25zdCBsYXN0ID0gbm9kZS5wcm9wZXJ0aWVzW25vZGUucHJvcGVydGllcy5sZW5ndGggLSAxXTtcbiAgICByZWNvcmRlci5pbnNlcnRSaWdodChsYXN0LnN0YXJ0Lm9mZnNldCArIGxhc3QudGV4dC5yZXBsYWNlKC9cXHMrJC8sICcnKS5sZW5ndGgsICcsJyk7XG4gIH1cblxuICByZWNvcmRlci5pbnNlcnRMZWZ0KFxuICAgIG5vZGUuZW5kLm9mZnNldCAtIDEsXG4gICAgJyAgJ1xuICAgICsgYFwiJHtwcm9wZXJ0eU5hbWV9XCI6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUsIG51bGwsIDIpLnJlcGxhY2UoL1xcbi9nLCBpbmRlbnRTdHIpfWBcbiAgICArIGluZGVudFN0ci5zbGljZSgwLCAtMiksXG4gICk7XG59XG5cbmZ1bmN0aW9uIGFkZFBhY2thZ2VUb01vbm9yZXBvKG9wdGlvbnM6IFNjaGVtYSwgcGF0aDogc3RyaW5nKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSkgPT4ge1xuICAgIGNvbnN0IGNvbGxlY3Rpb25Kc29uQ29udGVudCA9IHRyZWUucmVhZCgnLy5tb25vcmVwby5qc29uJyk7XG4gICAgaWYgKCFjb2xsZWN0aW9uSnNvbkNvbnRlbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgbW9ub3JlcG8uanNvbicpO1xuICAgIH1cbiAgICBjb25zdCBjb2xsZWN0aW9uSnNvbkFzdCA9IHBhcnNlSnNvbkFzdChjb2xsZWN0aW9uSnNvbkNvbnRlbnQudG9TdHJpbmcoJ3V0Zi04JykpO1xuICAgIGlmIChjb2xsZWN0aW9uSnNvbkFzdC5raW5kICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1vbm9yZXBvIGNvbnRlbnQuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFja2FnZXMgPSBjb2xsZWN0aW9uSnNvbkFzdC5wcm9wZXJ0aWVzLmZpbmQoeCA9PiB4LmtleS52YWx1ZSA9PSAncGFja2FnZXMnKTtcbiAgICBpZiAoIXBhY2thZ2VzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBmaW5kIHBhY2thZ2VzIGtleSBpbiBtb25vcmVwby4nKTtcbiAgICB9XG4gICAgaWYgKHBhY2thZ2VzLnZhbHVlLmtpbmQgIT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYWNrYWdlcyBrZXkuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVhZG1lVXJsID0gYGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXItY2xpL2Jsb2IvbWFzdGVyLyR7cGF0aH0vUkVBRE1FLm1kYDtcblxuICAgIGNvbnN0IHJlY29yZGVyID0gdHJlZS5iZWdpblVwZGF0ZSgnLy5tb25vcmVwby5qc29uJyk7XG4gICAgYXBwZW5kUHJvcGVydHlJbkFzdE9iamVjdChcbiAgICAgIHJlY29yZGVyLFxuICAgICAgcGFja2FnZXMudmFsdWUsXG4gICAgICBvcHRpb25zLm5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IG9wdGlvbnMuZGlzcGxheU5hbWUsXG4gICAgICAgIGxpbmtzOiBbeyBsYWJlbDogJ1JFQURNRScsIHVybDogcmVhZG1lVXJsIH1dLFxuICAgICAgICB2ZXJzaW9uOiAnMC4wLjEnLFxuICAgICAgICBoYXNoOiAnJyxcbiAgICAgIH0sXG4gICAgKTtcbiAgICB0cmVlLmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gIH07XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICBjb25zdCBwYXRoID0gJ3BhY2thZ2VzLydcbiAgICArIG9wdGlvbnMubmFtZVxuICAgICAgICAgICAgIC5yZXBsYWNlKC9eQC8sICcnKVxuICAgICAgICAgICAgIC5yZXBsYWNlKC8tL2csICdfJyk7XG5cbiAgLy8gVmVyaWZ5IGlmIHdlIG5lZWQgdG8gY3JlYXRlIGEgZnVsbCBwcm9qZWN0LCBvciBqdXN0IGFkZCBhIG5ldyBzY2hlbWF0aWMuXG4gIGNvbnN0IHNvdXJjZSA9IGFwcGx5KHVybCgnLi9wcm9qZWN0LWZpbGVzJyksIFtcbiAgICB0ZW1wbGF0ZSh7XG4gICAgICAuLi5vcHRpb25zIGFzIG9iamVjdCxcbiAgICAgIGRvdDogJy4nLFxuICAgICAgcGF0aCxcbiAgICB9KSxcbiAgXSk7XG5cbiAgcmV0dXJuIGNoYWluKFtcbiAgICBtZXJnZVdpdGgoc291cmNlKSxcbiAgICBhZGRQYWNrYWdlVG9Nb25vcmVwbyhvcHRpb25zLCBwYXRoKSxcbiAgXSk7XG59XG4iXX0=