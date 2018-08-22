"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Taken from https://github.com/Sergiioo/tslint-defocus
 * Copyright (c) 2016 Sergio Annecchiarico
 * MIT - https://github.com/Sergiioo/tslint-defocus/blob/master/LICENSE
 */
const Lint = require("tslint");
const ts = require("typescript");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithFunction(sourceFile, walk);
    }
}
Rule.metadata = {
    ruleName: 'defocus',
    description: "Bans the use of `fdescribe` and 'fit' Jasmine functions.",
    rationale: 'It is all too easy to mistakenly commit a focussed Jasmine test suite or spec.',
    options: null,
    optionsDescription: 'Not configurable.',
    type: 'functionality',
    typescriptOnly: false,
};
exports.Rule = Rule;
function walk(ctx) {
    return ts.forEachChild(ctx.sourceFile, function cb(node) {
        if (node.kind === ts.SyntaxKind.CallExpression) {
            const expression = node.expression;
            const functionName = expression.getText();
            bannedFunctions.forEach((banned) => {
                if (banned === functionName) {
                    ctx.addFailureAtNode(expression, failureMessage(functionName));
                }
            });
        }
        return ts.forEachChild(node, cb);
    });
}
const bannedFunctions = ['fdescribe', 'fit'];
const failureMessage = (functionName) => {
    return `Calls to '${functionName}' are not allowed.`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmb2N1c1J1bGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInJ1bGVzL2RlZm9jdXNSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7Ozs7R0FJRztBQUVILCtCQUErQjtBQUMvQixpQ0FBaUM7QUFFakMsVUFBa0IsU0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7SUFZeEMsS0FBSyxDQUFDLFVBQXlCO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDOztBQVphLGFBQVEsR0FBdUI7SUFDM0MsUUFBUSxFQUFFLFNBQVM7SUFDbkIsV0FBVyxFQUFFLDBEQUEwRDtJQUN2RSxTQUFTLEVBQUUsZ0ZBQWdGO0lBQzNGLE9BQU8sRUFBRSxJQUFJO0lBQ2Isa0JBQWtCLEVBQUUsbUJBQW1CO0lBQ3ZDLElBQUksRUFBRSxlQUFlO0lBQ3JCLGNBQWMsRUFBRSxLQUFLO0NBQ3RCLENBQUM7QUFWSixvQkFlQztBQUVELGNBQWMsR0FBMkI7SUFDdkMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsWUFBWSxJQUFhO1FBQzlELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRTtZQUM5QyxNQUFNLFVBQVUsR0FBSSxJQUEwQixDQUFDLFVBQVUsQ0FBQztZQUMxRCxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNqQyxJQUFJLE1BQU0sS0FBSyxZQUFZLEVBQUU7b0JBQzNCLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQ2hFO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxlQUFlLEdBQTBCLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBRXBFLE1BQU0sY0FBYyxHQUFHLENBQUMsWUFBb0IsRUFBRSxFQUFFO0lBQzlDLE9BQU8sYUFBYSxZQUFZLG9CQUFvQixDQUFDO0FBQ3ZELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLypcbiAqIFRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL1NlcmdpaW9vL3RzbGludC1kZWZvY3VzXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgU2VyZ2lvIEFubmVjY2hpYXJpY29cbiAqIE1JVCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9TZXJnaWlvby90c2xpbnQtZGVmb2N1cy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0ICogYXMgTGludCBmcm9tICd0c2xpbnQnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmV4cG9ydCBjbGFzcyBSdWxlIGV4dGVuZHMgTGludC5SdWxlcy5BYnN0cmFjdFJ1bGUge1xuXG4gIHB1YmxpYyBzdGF0aWMgbWV0YWRhdGE6IExpbnQuSVJ1bGVNZXRhZGF0YSA9IHtcbiAgICBydWxlTmFtZTogJ2RlZm9jdXMnLFxuICAgIGRlc2NyaXB0aW9uOiBcIkJhbnMgdGhlIHVzZSBvZiBgZmRlc2NyaWJlYCBhbmQgJ2ZpdCcgSmFzbWluZSBmdW5jdGlvbnMuXCIsXG4gICAgcmF0aW9uYWxlOiAnSXQgaXMgYWxsIHRvbyBlYXN5IHRvIG1pc3Rha2VubHkgY29tbWl0IGEgZm9jdXNzZWQgSmFzbWluZSB0ZXN0IHN1aXRlIG9yIHNwZWMuJyxcbiAgICBvcHRpb25zOiBudWxsLFxuICAgIG9wdGlvbnNEZXNjcmlwdGlvbjogJ05vdCBjb25maWd1cmFibGUuJyxcbiAgICB0eXBlOiAnZnVuY3Rpb25hbGl0eScsXG4gICAgdHlwZXNjcmlwdE9ubHk6IGZhbHNlLFxuICB9O1xuXG4gIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTGludC5SdWxlRmFpbHVyZVtdIHtcbiAgICByZXR1cm4gdGhpcy5hcHBseVdpdGhGdW5jdGlvbihzb3VyY2VGaWxlLCB3YWxrKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB3YWxrKGN0eDogTGludC5XYWxrQ29udGV4dDx2b2lkPikge1xuICByZXR1cm4gdHMuZm9yRWFjaENoaWxkKGN0eC5zb3VyY2VGaWxlLCBmdW5jdGlvbiBjYihub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5DYWxsRXhwcmVzc2lvbikge1xuICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IChub2RlIGFzIHRzLkNhbGxFeHByZXNzaW9uKS5leHByZXNzaW9uO1xuICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gZXhwcmVzc2lvbi5nZXRUZXh0KCk7XG4gICAgICBiYW5uZWRGdW5jdGlvbnMuZm9yRWFjaCgoYmFubmVkKSA9PiB7XG4gICAgICAgIGlmIChiYW5uZWQgPT09IGZ1bmN0aW9uTmFtZSkge1xuICAgICAgICAgIGN0eC5hZGRGYWlsdXJlQXROb2RlKGV4cHJlc3Npb24sIGZhaWx1cmVNZXNzYWdlKGZ1bmN0aW9uTmFtZSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHMuZm9yRWFjaENoaWxkKG5vZGUsIGNiKTtcbiAgfSk7XG59XG5cbmNvbnN0IGJhbm5lZEZ1bmN0aW9uczogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gWydmZGVzY3JpYmUnLCAnZml0J107XG5cbmNvbnN0IGZhaWx1cmVNZXNzYWdlID0gKGZ1bmN0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG4gIHJldHVybiBgQ2FsbHMgdG8gJyR7ZnVuY3Rpb25OYW1lfScgYXJlIG5vdCBhbGxvd2VkLmA7XG59O1xuIl19