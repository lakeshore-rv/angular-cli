"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const path = require("path");
const Lint = require("tslint");
const ts = require("typescript");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: 'no-global-tslint-disable',
    type: 'style',
    description: `Ensure global tslint disable are only used for unit tests.`,
    rationale: `Some projects want to disallow tslint disable and only use per-line ones.`,
    options: null,
    optionsDescription: `Not configurable.`,
    typescriptOnly: false,
};
Rule.FAILURE_STRING = 'tslint:disable is not allowed in this context.';
exports.Rule = Rule;
class Walker extends Lint.RuleWalker {
    _findComments(node) {
        return [].concat(ts.getLeadingCommentRanges(node.getFullText(), 0) || [], ts.getTrailingCommentRanges(node.getFullText(), 0) || [], node.getChildren().reduce((acc, n) => {
            return acc.concat(this._findComments(n));
        }, []));
    }
    walk(sourceFile) {
        super.walk(sourceFile);
        // Ignore spec files.
        if (sourceFile.fileName.match(/_spec(_large)?.ts$/)) {
            return;
        }
        // Ignore benchmark files.
        if (sourceFile.fileName.match(/_benchmark.ts$/)) {
            return;
        }
        // TODO(filipesilva): remove this once the files are cleaned up.
        // Ignore Angular CLI files files.
        if (sourceFile.fileName.includes('/angular-cli-files/')) {
            return;
        }
        const scriptsPath = path.join(process.cwd(), 'scripts').replace(/\\/g, '/');
        if (sourceFile.fileName.startsWith(scriptsPath)) {
            return;
        }
        // Find all comment nodes.
        const ranges = this._findComments(sourceFile);
        ranges.forEach(range => {
            const text = sourceFile.getFullText().substring(range.pos, range.end);
            let i = text.indexOf('tslint:disable:');
            while (i != -1) {
                this.addFailureAt(range.pos + i + 1, range.pos + i + 15, Rule.FAILURE_STRING);
                i = text.indexOf('tslint:disable:', i + 1);
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9HbG9iYWxUc2xpbnREaXNhYmxlUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicnVsZXMvbm9HbG9iYWxUc2xpbnREaXNhYmxlUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsaUNBQWlDO0FBR2pDLFVBQWtCLFNBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0lBYXhDLEtBQUssQ0FBQyxVQUF5QjtRQUNwQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQzs7QUFkYSxhQUFRLEdBQXVCO0lBQzNDLFFBQVEsRUFBRSwwQkFBMEI7SUFDcEMsSUFBSSxFQUFFLE9BQU87SUFDYixXQUFXLEVBQUUsNERBQTREO0lBQ3pFLFNBQVMsRUFBRSwyRUFBMkU7SUFDdEYsT0FBTyxFQUFFLElBQUk7SUFDYixrQkFBa0IsRUFBRSxtQkFBbUI7SUFDdkMsY0FBYyxFQUFFLEtBQUs7Q0FDdEIsQ0FBQztBQUVZLG1CQUFjLEdBQUcsZ0RBQWdELENBQUM7QUFYbEYsb0JBZ0JDO0FBR0QsWUFBYSxTQUFRLElBQUksQ0FBQyxVQUFVO0lBQzFCLGFBQWEsQ0FBQyxJQUFhO1FBQ2pDLE9BQVEsRUFBd0IsQ0FBQyxNQUFNLENBQ3JDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUN2RCxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFDeEQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsRUFBRSxFQUF1QixDQUFDLENBQzVCLENBQUM7SUFDSixDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCO1FBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdkIscUJBQXFCO1FBQ3JCLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsRUFBRTtZQUNuRCxPQUFPO1NBQ1I7UUFDRCwwQkFBMEI7UUFDMUIsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQy9DLE9BQU87U0FDUjtRQUVELGdFQUFnRTtRQUNoRSxrQ0FBa0M7UUFDbEMsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO1lBQ3ZELE9BQU87U0FDUjtRQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDNUUsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUMvQyxPQUFPO1NBQ1I7UUFFRCwwQkFBMEI7UUFDMUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRXhDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzlFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUM1QztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIExpbnQgZnJvbSAndHNsaW50JztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuICBwdWJsaWMgc3RhdGljIG1ldGFkYXRhOiBMaW50LklSdWxlTWV0YWRhdGEgPSB7XG4gICAgcnVsZU5hbWU6ICduby1nbG9iYWwtdHNsaW50LWRpc2FibGUnLFxuICAgIHR5cGU6ICdzdHlsZScsXG4gICAgZGVzY3JpcHRpb246IGBFbnN1cmUgZ2xvYmFsIHRzbGludCBkaXNhYmxlIGFyZSBvbmx5IHVzZWQgZm9yIHVuaXQgdGVzdHMuYCxcbiAgICByYXRpb25hbGU6IGBTb21lIHByb2plY3RzIHdhbnQgdG8gZGlzYWxsb3cgdHNsaW50IGRpc2FibGUgYW5kIG9ubHkgdXNlIHBlci1saW5lIG9uZXMuYCxcbiAgICBvcHRpb25zOiBudWxsLFxuICAgIG9wdGlvbnNEZXNjcmlwdGlvbjogYE5vdCBjb25maWd1cmFibGUuYCxcbiAgICB0eXBlc2NyaXB0T25seTogZmFsc2UsXG4gIH07XG5cbiAgcHVibGljIHN0YXRpYyBGQUlMVVJFX1NUUklORyA9ICd0c2xpbnQ6ZGlzYWJsZSBpcyBub3QgYWxsb3dlZCBpbiB0aGlzIGNvbnRleHQuJztcblxuICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlXaXRoV2Fsa2VyKG5ldyBXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgfVxufVxuXG5cbmNsYXNzIFdhbGtlciBleHRlbmRzIExpbnQuUnVsZVdhbGtlciB7XG4gIHByaXZhdGUgX2ZpbmRDb21tZW50cyhub2RlOiB0cy5Ob2RlKTogdHMuQ29tbWVudFJhbmdlW10ge1xuICAgIHJldHVybiAoW10gYXMgdHMuQ29tbWVudFJhbmdlW10pLmNvbmNhdChcbiAgICAgIHRzLmdldExlYWRpbmdDb21tZW50UmFuZ2VzKG5vZGUuZ2V0RnVsbFRleHQoKSwgMCkgfHwgW10sXG4gICAgICB0cy5nZXRUcmFpbGluZ0NvbW1lbnRSYW5nZXMobm9kZS5nZXRGdWxsVGV4dCgpLCAwKSB8fCBbXSxcbiAgICAgIG5vZGUuZ2V0Q2hpbGRyZW4oKS5yZWR1Y2UoKGFjYywgbikgPT4ge1xuICAgICAgICByZXR1cm4gYWNjLmNvbmNhdCh0aGlzLl9maW5kQ29tbWVudHMobikpO1xuICAgICAgfSwgW10gYXMgdHMuQ29tbWVudFJhbmdlW10pLFxuICAgICk7XG4gIH1cblxuICB3YWxrKHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUpIHtcbiAgICBzdXBlci53YWxrKHNvdXJjZUZpbGUpO1xuXG4gICAgLy8gSWdub3JlIHNwZWMgZmlsZXMuXG4gICAgaWYgKHNvdXJjZUZpbGUuZmlsZU5hbWUubWF0Y2goL19zcGVjKF9sYXJnZSk/LnRzJC8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElnbm9yZSBiZW5jaG1hcmsgZmlsZXMuXG4gICAgaWYgKHNvdXJjZUZpbGUuZmlsZU5hbWUubWF0Y2goL19iZW5jaG1hcmsudHMkLykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUT0RPKGZpbGlwZXNpbHZhKTogcmVtb3ZlIHRoaXMgb25jZSB0aGUgZmlsZXMgYXJlIGNsZWFuZWQgdXAuXG4gICAgLy8gSWdub3JlIEFuZ3VsYXIgQ0xJIGZpbGVzIGZpbGVzLlxuICAgIGlmIChzb3VyY2VGaWxlLmZpbGVOYW1lLmluY2x1ZGVzKCcvYW5ndWxhci1jbGktZmlsZXMvJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JpcHRzUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnc2NyaXB0cycpLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICBpZiAoc291cmNlRmlsZS5maWxlTmFtZS5zdGFydHNXaXRoKHNjcmlwdHNQYXRoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZpbmQgYWxsIGNvbW1lbnQgbm9kZXMuXG4gICAgY29uc3QgcmFuZ2VzID0gdGhpcy5fZmluZENvbW1lbnRzKHNvdXJjZUZpbGUpO1xuICAgIHJhbmdlcy5mb3JFYWNoKHJhbmdlID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSBzb3VyY2VGaWxlLmdldEZ1bGxUZXh0KCkuc3Vic3RyaW5nKHJhbmdlLnBvcywgcmFuZ2UuZW5kKTtcbiAgICAgIGxldCBpID0gdGV4dC5pbmRleE9mKCd0c2xpbnQ6ZGlzYWJsZTonKTtcblxuICAgICAgd2hpbGUgKGkgIT0gLTEpIHtcbiAgICAgICAgdGhpcy5hZGRGYWlsdXJlQXQocmFuZ2UucG9zICsgaSArIDEsIHJhbmdlLnBvcyArIGkgKyAxNSwgUnVsZS5GQUlMVVJFX1NUUklORyk7XG4gICAgICAgIGkgPSB0ZXh0LmluZGV4T2YoJ3RzbGludDpkaXNhYmxlOicsIGkgKyAxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19