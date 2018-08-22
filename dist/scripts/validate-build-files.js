"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-implicit-dependencies
const core_1 = require("@angular-devkit/core");
const fs_1 = require("fs");
const path_1 = require("path");
const packages_1 = require("../lib/packages");
function default_1(_options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        let error = false;
        for (const pkgName of Object.keys(packages_1.packages)) {
            const pkg = packages_1.packages[pkgName];
            if (pkg.packageJson.private) {
                // Ignore private packages.
                continue;
            }
            // There should be at least one BUILD file next to each package.json.
            if (!fs_1.existsSync(path_1.join(pkg.root, 'BUILD'))) {
                logger.error(core_1.tags.oneLine `
        The package ${JSON.stringify(pkgName)} does not have a BUILD file associated to it. You
        must either set an exception or make sure it can be built using Bazel.
      `);
                error = true;
            }
        }
        // TODO: enable this to break
        if (error) {
            // process.exit(1);
            logger.warn('Found some BUILD files missing, which will be breaking your PR soon.');
        }
        return 0;
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtYnVpbGQtZmlsZXMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInNjcmlwdHMvdmFsaWRhdGUtYnVpbGQtZmlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILDBDQUEwQztBQUMxQywrQ0FBcUQ7QUFDckQsMkJBQWdDO0FBQ2hDLCtCQUE0QjtBQUM1Qiw4Q0FBMkM7QUFFM0MsbUJBQStCLFFBQVksRUFBRSxNQUFzQjs7UUFDakUsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRWxCLEtBQUssTUFBTSxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBUSxDQUFDLEVBQUU7WUFDM0MsTUFBTSxHQUFHLEdBQUcsbUJBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU5QixJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO2dCQUMzQiwyQkFBMkI7Z0JBQzNCLFNBQVM7YUFDVjtZQUVELHFFQUFxRTtZQUNyRSxJQUFJLENBQUMsZUFBVSxDQUFDLFdBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUU7Z0JBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQTtzQkFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQzs7T0FFdEMsQ0FBQyxDQUFDO2dCQUNILEtBQUssR0FBRyxJQUFJLENBQUM7YUFDZDtTQUNGO1FBRUQsNkJBQTZCO1FBQzdCLElBQUksS0FBSyxFQUFFO1lBQ1QsbUJBQW1CO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0VBQXNFLENBQUMsQ0FBQztTQUNyRjtRQUVELE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztDQUFBO0FBNUJELDRCQTRCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgbG9nZ2luZywgdGFncyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IGV4aXN0c1N5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBwYWNrYWdlcyB9IGZyb20gJy4uL2xpYi9wYWNrYWdlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChfb3B0aW9uczoge30sIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXIpIHtcbiAgbGV0IGVycm9yID0gZmFsc2U7XG5cbiAgZm9yIChjb25zdCBwa2dOYW1lIG9mIE9iamVjdC5rZXlzKHBhY2thZ2VzKSkge1xuICAgIGNvbnN0IHBrZyA9IHBhY2thZ2VzW3BrZ05hbWVdO1xuXG4gICAgaWYgKHBrZy5wYWNrYWdlSnNvbi5wcml2YXRlKSB7XG4gICAgICAvLyBJZ25vcmUgcHJpdmF0ZSBwYWNrYWdlcy5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIFRoZXJlIHNob3VsZCBiZSBhdCBsZWFzdCBvbmUgQlVJTEQgZmlsZSBuZXh0IHRvIGVhY2ggcGFja2FnZS5qc29uLlxuICAgIGlmICghZXhpc3RzU3luYyhqb2luKHBrZy5yb290LCAnQlVJTEQnKSkpIHtcbiAgICAgIGxvZ2dlci5lcnJvcih0YWdzLm9uZUxpbmVgXG4gICAgICAgIFRoZSBwYWNrYWdlICR7SlNPTi5zdHJpbmdpZnkocGtnTmFtZSl9IGRvZXMgbm90IGhhdmUgYSBCVUlMRCBmaWxlIGFzc29jaWF0ZWQgdG8gaXQuIFlvdVxuICAgICAgICBtdXN0IGVpdGhlciBzZXQgYW4gZXhjZXB0aW9uIG9yIG1ha2Ugc3VyZSBpdCBjYW4gYmUgYnVpbHQgdXNpbmcgQmF6ZWwuXG4gICAgICBgKTtcbiAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBUT0RPOiBlbmFibGUgdGhpcyB0byBicmVha1xuICBpZiAoZXJyb3IpIHtcbiAgICAvLyBwcm9jZXNzLmV4aXQoMSk7XG4gICAgbG9nZ2VyLndhcm4oJ0ZvdW5kIHNvbWUgQlVJTEQgZmlsZXMgbWlzc2luZywgd2hpY2ggd2lsbCBiZSBicmVha2luZyB5b3VyIFBSIHNvb24uJyk7XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbiJdfQ==