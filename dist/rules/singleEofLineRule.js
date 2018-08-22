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
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        const length = sourceFile.text.length;
        if (length === 0) {
            // Allow empty files.
            return [];
        }
        const matchEof = /\r?\n((\r?\n)*)$/.exec(sourceFile.text);
        if (!matchEof) {
            const lines = sourceFile.getLineStarts();
            const fix = Lint.Replacement.appendText(length, sourceFile.text[lines[1] - 2] === '\r' ? '\r\n' : '\n');
            return [
                new Lint.RuleFailure(sourceFile, length, length, Rule.FAILURE_STRING, this.ruleName, fix),
            ];
        }
        else if (matchEof[1]) {
            const lines = sourceFile.getLineStarts();
            const fix = Lint.Replacement.replaceFromTo(matchEof.index, length, sourceFile.text[lines[1] - 2] === '\r' ? '\r\n' : '\n');
            return [
                new Lint.RuleFailure(sourceFile, length, length, Rule.FAILURE_STRING, this.ruleName, fix),
            ];
        }
        return [];
    }
}
Rule.metadata = {
    ruleName: 'single-eof-line',
    type: 'style',
    description: `Ensure the file ends with a single new line.`,
    rationale: `This is similar to eofline, but ensure an exact count instead of just any new
                line.`,
    options: null,
    optionsDescription: `Two integers indicating minimum and maximum number of new lines.`,
    typescriptOnly: false,
};
Rule.FAILURE_STRING = 'You need to have a single blank line at end of file.';
exports.Rule = Rule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlRW9mTGluZVJ1bGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInJ1bGVzL3NpbmdsZUVvZkxpbmVSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0JBQStCO0FBSS9CLFVBQWtCLFNBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0lBY3hDLEtBQUssQ0FBQyxVQUF5QjtRQUNwQyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN0QyxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDaEIscUJBQXFCO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxNQUFNLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQ3JDLE1BQU0sRUFDTixVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUN2RCxDQUFDO1lBRUYsT0FBTztnQkFDTCxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQzthQUMxRixDQUFDO1NBQ0g7YUFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQ3hDLFFBQVEsQ0FBQyxLQUFLLEVBQ2QsTUFBTSxFQUNOLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ3ZELENBQUM7WUFFRixPQUFPO2dCQUNMLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO2FBQzFGLENBQUM7U0FDSDtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQzs7QUE3Q2EsYUFBUSxHQUF1QjtJQUMzQyxRQUFRLEVBQUUsaUJBQWlCO0lBQzNCLElBQUksRUFBRSxPQUFPO0lBQ2IsV0FBVyxFQUFFLDhDQUE4QztJQUMzRCxTQUFTLEVBQUU7c0JBQ087SUFDbEIsT0FBTyxFQUFFLElBQUk7SUFDYixrQkFBa0IsRUFBRSxrRUFBa0U7SUFDdEYsY0FBYyxFQUFFLEtBQUs7Q0FDdEIsQ0FBQztBQUVZLG1CQUFjLEdBQUcsc0RBQXNELENBQUM7QUFaeEYsb0JBK0NDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgTGludCBmcm9tICd0c2xpbnQnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cblxuZXhwb3J0IGNsYXNzIFJ1bGUgZXh0ZW5kcyBMaW50LlJ1bGVzLkFic3RyYWN0UnVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgbWV0YWRhdGE6IExpbnQuSVJ1bGVNZXRhZGF0YSA9IHtcbiAgICBydWxlTmFtZTogJ3NpbmdsZS1lb2YtbGluZScsXG4gICAgdHlwZTogJ3N0eWxlJyxcbiAgICBkZXNjcmlwdGlvbjogYEVuc3VyZSB0aGUgZmlsZSBlbmRzIHdpdGggYSBzaW5nbGUgbmV3IGxpbmUuYCxcbiAgICByYXRpb25hbGU6IGBUaGlzIGlzIHNpbWlsYXIgdG8gZW9mbGluZSwgYnV0IGVuc3VyZSBhbiBleGFjdCBjb3VudCBpbnN0ZWFkIG9mIGp1c3QgYW55IG5ld1xuICAgICAgICAgICAgICAgIGxpbmUuYCxcbiAgICBvcHRpb25zOiBudWxsLFxuICAgIG9wdGlvbnNEZXNjcmlwdGlvbjogYFR3byBpbnRlZ2VycyBpbmRpY2F0aW5nIG1pbmltdW0gYW5kIG1heGltdW0gbnVtYmVyIG9mIG5ldyBsaW5lcy5gLFxuICAgIHR5cGVzY3JpcHRPbmx5OiBmYWxzZSxcbiAgfTtcblxuICBwdWJsaWMgc3RhdGljIEZBSUxVUkVfU1RSSU5HID0gJ1lvdSBuZWVkIHRvIGhhdmUgYSBzaW5nbGUgYmxhbmsgbGluZSBhdCBlbmQgb2YgZmlsZS4nO1xuXG4gIHB1YmxpYyBhcHBseShzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlKTogTGludC5SdWxlRmFpbHVyZVtdIHtcbiAgICBjb25zdCBsZW5ndGggPSBzb3VyY2VGaWxlLnRleHQubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPT09IDApIHtcbiAgICAgIC8vIEFsbG93IGVtcHR5IGZpbGVzLlxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoRW9mID0gL1xccj9cXG4oKFxccj9cXG4pKikkLy5leGVjKHNvdXJjZUZpbGUudGV4dCk7XG4gICAgaWYgKCFtYXRjaEVvZikge1xuICAgICAgY29uc3QgbGluZXMgPSBzb3VyY2VGaWxlLmdldExpbmVTdGFydHMoKTtcbiAgICAgIGNvbnN0IGZpeCA9IExpbnQuUmVwbGFjZW1lbnQuYXBwZW5kVGV4dChcbiAgICAgICAgbGVuZ3RoLFxuICAgICAgICBzb3VyY2VGaWxlLnRleHRbbGluZXNbMV0gLSAyXSA9PT0gJ1xccicgPyAnXFxyXFxuJyA6ICdcXG4nLFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgbmV3IExpbnQuUnVsZUZhaWx1cmUoc291cmNlRmlsZSwgbGVuZ3RoLCBsZW5ndGgsIFJ1bGUuRkFJTFVSRV9TVFJJTkcsIHRoaXMucnVsZU5hbWUsIGZpeCksXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hFb2ZbMV0pIHtcbiAgICAgIGNvbnN0IGxpbmVzID0gc291cmNlRmlsZS5nZXRMaW5lU3RhcnRzKCk7XG4gICAgICBjb25zdCBmaXggPSBMaW50LlJlcGxhY2VtZW50LnJlcGxhY2VGcm9tVG8oXG4gICAgICAgIG1hdGNoRW9mLmluZGV4LFxuICAgICAgICBsZW5ndGgsXG4gICAgICAgIHNvdXJjZUZpbGUudGV4dFtsaW5lc1sxXSAtIDJdID09PSAnXFxyJyA/ICdcXHJcXG4nIDogJ1xcbicsXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gW1xuICAgICAgICBuZXcgTGludC5SdWxlRmFpbHVyZShzb3VyY2VGaWxlLCBsZW5ndGgsIGxlbmd0aCwgUnVsZS5GQUlMVVJFX1NUUklORywgdGhpcy5ydWxlTmFtZSwgZml4KSxcbiAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG4iXX0=