"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const Lint = require("tslint");
const ts = require("typescript");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}
Rule.metadata = {
    ruleName: 'import-groups',
    type: 'style',
    description: `Ensure imports are grouped.`,
    rationale: `Imports can be grouped or not depending on a project. A group is a sequence of
                import statements separated by blank lines.`,
    options: null,
    optionsDescription: `Not configurable.`,
    typescriptOnly: false,
};
Rule.FAILURE_STRING = 'You need to keep imports grouped.';
exports.Rule = Rule;
class Walker extends Lint.RuleWalker {
    walk(sourceFile) {
        super.walk(sourceFile);
        const statements = sourceFile.statements;
        const imports = statements.filter(s => s.kind == ts.SyntaxKind.ImportDeclaration);
        const nonImports = statements.filter(s => s.kind != ts.SyntaxKind.ImportDeclaration);
        for (let i = 1; i < imports.length; i++) {
            const node = imports[i];
            const previous = imports[i - 1];
            if (previous && previous.kind == ts.SyntaxKind.ImportDeclaration) {
                const nodeLine = sourceFile.getLineAndCharacterOfPosition(node.getStart());
                const previousLine = sourceFile.getLineAndCharacterOfPosition(previous.getEnd());
                if (previousLine.line < nodeLine.line - 1) {
                    if (nonImports.some(s => s.getStart() > previous.getEnd()
                        && s.getStart() < node.getStart())) {
                        // Ignore imports with non-imports statements in between.
                        continue;
                    }
                    this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING, Lint.Replacement.deleteFromTo(previous.getEnd() + 1, node.getStart()));
                }
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0R3JvdXBzUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicnVsZXMvaW1wb3J0R3JvdXBzUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtCQUErQjtBQUMvQixpQ0FBaUM7QUFHakMsVUFBa0IsU0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7SUFjeEMsS0FBSyxDQUFDLFVBQXlCO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDOztBQWZhLGFBQVEsR0FBdUI7SUFDM0MsUUFBUSxFQUFFLGVBQWU7SUFDekIsSUFBSSxFQUFFLE9BQU87SUFDYixXQUFXLEVBQUUsNkJBQTZCO0lBQzFDLFNBQVMsRUFBRTs0REFDNkM7SUFDeEQsT0FBTyxFQUFFLElBQUk7SUFDYixrQkFBa0IsRUFBRSxtQkFBbUI7SUFDdkMsY0FBYyxFQUFFLEtBQUs7Q0FDdEIsQ0FBQztBQUVZLG1CQUFjLEdBQUcsbUNBQW1DLENBQUM7QUFackUsb0JBaUJDO0FBR0QsWUFBYSxTQUFRLElBQUksQ0FBQyxVQUFVO0lBQ2xDLElBQUksQ0FBQyxVQUF5QjtRQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXZCLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFDekMsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2xGLE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUVyRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUVoQyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ2hFLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDM0UsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLDZCQUE2QixDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUVqRixJQUFJLFlBQVksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7b0JBQ3pDLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFOzJCQUNwRCxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUU7d0JBQ3BDLHlEQUF5RDt3QkFDekQsU0FBUztxQkFDVjtvQkFFRCxJQUFJLENBQUMsWUFBWSxDQUNmLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFDZixJQUFJLENBQUMsUUFBUSxFQUFFLEVBQ2YsSUFBSSxDQUFDLGNBQWMsRUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FDdEUsQ0FBQztpQkFDSDthQUNGO1NBQ0Y7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyBMaW50IGZyb20gJ3RzbGludCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuXG5leHBvcnQgY2xhc3MgUnVsZSBleHRlbmRzIExpbnQuUnVsZXMuQWJzdHJhY3RSdWxlIHtcbiAgcHVibGljIHN0YXRpYyBtZXRhZGF0YTogTGludC5JUnVsZU1ldGFkYXRhID0ge1xuICAgIHJ1bGVOYW1lOiAnaW1wb3J0LWdyb3VwcycsXG4gICAgdHlwZTogJ3N0eWxlJyxcbiAgICBkZXNjcmlwdGlvbjogYEVuc3VyZSBpbXBvcnRzIGFyZSBncm91cGVkLmAsXG4gICAgcmF0aW9uYWxlOiBgSW1wb3J0cyBjYW4gYmUgZ3JvdXBlZCBvciBub3QgZGVwZW5kaW5nIG9uIGEgcHJvamVjdC4gQSBncm91cCBpcyBhIHNlcXVlbmNlIG9mXG4gICAgICAgICAgICAgICAgaW1wb3J0IHN0YXRlbWVudHMgc2VwYXJhdGVkIGJ5IGJsYW5rIGxpbmVzLmAsXG4gICAgb3B0aW9uczogbnVsbCxcbiAgICBvcHRpb25zRGVzY3JpcHRpb246IGBOb3QgY29uZmlndXJhYmxlLmAsXG4gICAgdHlwZXNjcmlwdE9ubHk6IGZhbHNlLFxuICB9O1xuXG4gIHB1YmxpYyBzdGF0aWMgRkFJTFVSRV9TVFJJTkcgPSAnWW91IG5lZWQgdG8ga2VlcCBpbXBvcnRzIGdyb3VwZWQuJztcblxuICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHlXaXRoV2Fsa2VyKG5ldyBXYWxrZXIoc291cmNlRmlsZSwgdGhpcy5nZXRPcHRpb25zKCkpKTtcbiAgfVxufVxuXG5cbmNsYXNzIFdhbGtlciBleHRlbmRzIExpbnQuUnVsZVdhbGtlciB7XG4gIHdhbGsoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICAgIHN1cGVyLndhbGsoc291cmNlRmlsZSk7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gc291cmNlRmlsZS5zdGF0ZW1lbnRzO1xuICAgIGNvbnN0IGltcG9ydHMgPSBzdGF0ZW1lbnRzLmZpbHRlcihzID0+IHMua2luZCA9PSB0cy5TeW50YXhLaW5kLkltcG9ydERlY2xhcmF0aW9uKTtcbiAgICBjb25zdCBub25JbXBvcnRzID0gc3RhdGVtZW50cy5maWx0ZXIocyA9PiBzLmtpbmQgIT0gdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbik7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGltcG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBpbXBvcnRzW2ldO1xuICAgICAgY29uc3QgcHJldmlvdXMgPSBpbXBvcnRzW2kgLSAxXTtcblxuICAgICAgaWYgKHByZXZpb3VzICYmIHByZXZpb3VzLmtpbmQgPT0gdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbikge1xuICAgICAgICBjb25zdCBub2RlTGluZSA9IHNvdXJjZUZpbGUuZ2V0TGluZUFuZENoYXJhY3Rlck9mUG9zaXRpb24obm9kZS5nZXRTdGFydCgpKTtcbiAgICAgICAgY29uc3QgcHJldmlvdXNMaW5lID0gc291cmNlRmlsZS5nZXRMaW5lQW5kQ2hhcmFjdGVyT2ZQb3NpdGlvbihwcmV2aW91cy5nZXRFbmQoKSk7XG5cbiAgICAgICAgaWYgKHByZXZpb3VzTGluZS5saW5lIDwgbm9kZUxpbmUubGluZSAtIDEpIHtcbiAgICAgICAgICBpZiAobm9uSW1wb3J0cy5zb21lKHMgPT4gcy5nZXRTdGFydCgpID4gcHJldmlvdXMuZ2V0RW5kKClcbiAgICAgICAgICAgICYmIHMuZ2V0U3RhcnQoKSA8IG5vZGUuZ2V0U3RhcnQoKSkpIHtcbiAgICAgICAgICAgIC8vIElnbm9yZSBpbXBvcnRzIHdpdGggbm9uLWltcG9ydHMgc3RhdGVtZW50cyBpbiBiZXR3ZWVuLlxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5hZGRGYWlsdXJlQXQoXG4gICAgICAgICAgICBub2RlLmdldFN0YXJ0KCksXG4gICAgICAgICAgICBub2RlLmdldFdpZHRoKCksXG4gICAgICAgICAgICBSdWxlLkZBSUxVUkVfU1RSSU5HLFxuICAgICAgICAgICAgTGludC5SZXBsYWNlbWVudC5kZWxldGVGcm9tVG8ocHJldmlvdXMuZ2V0RW5kKCkgKyAxLCBub2RlLmdldFN0YXJ0KCkpLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==