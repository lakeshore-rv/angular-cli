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
// An empty rule so that tslint does not error on rules '//' (which are comments).
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return [];
    }
}
Rule.metadata = {
    ruleName: '//',
    type: 'typescript',
    description: ``,
    rationale: '',
    options: null,
    optionsDescription: `Not configurable.`,
    typescriptOnly: false,
};
exports.Rule = Rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicnVsZXMvUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtCQUErQjtBQUkvQixrRkFBa0Y7QUFDbEYsVUFBa0IsU0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7SUFXeEMsS0FBSyxDQUFDLFVBQXlCO1FBQ3BDLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQzs7QUFaYSxhQUFRLEdBQXVCO0lBQzNDLFFBQVEsRUFBRSxJQUFJO0lBQ2QsSUFBSSxFQUFFLFlBQVk7SUFDbEIsV0FBVyxFQUFFLEVBQUU7SUFDZixTQUFTLEVBQUUsRUFBRTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2Isa0JBQWtCLEVBQUUsbUJBQW1CO0lBQ3ZDLGNBQWMsRUFBRSxLQUFLO0NBQ3RCLENBQUM7QUFUSixvQkFjQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIExpbnQgZnJvbSAndHNsaW50JztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG5cbi8vIEFuIGVtcHR5IHJ1bGUgc28gdGhhdCB0c2xpbnQgZG9lcyBub3QgZXJyb3Igb24gcnVsZXMgJy8vJyAod2hpY2ggYXJlIGNvbW1lbnRzKS5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuICBwdWJsaWMgc3RhdGljIG1ldGFkYXRhOiBMaW50LklSdWxlTWV0YWRhdGEgPSB7XG4gICAgcnVsZU5hbWU6ICcvLycsXG4gICAgdHlwZTogJ3R5cGVzY3JpcHQnLFxuICAgIGRlc2NyaXB0aW9uOiBgYCxcbiAgICByYXRpb25hbGU6ICcnLFxuICAgIG9wdGlvbnM6IG51bGwsXG4gICAgb3B0aW9uc0Rlc2NyaXB0aW9uOiBgTm90IGNvbmZpZ3VyYWJsZS5gLFxuICAgIHR5cGVzY3JpcHRPbmx5OiBmYWxzZSxcbiAgfTtcblxuICBwdWJsaWMgYXBwbHkoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSk6IExpbnQuUnVsZUZhaWx1cmVbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG4iXX0=