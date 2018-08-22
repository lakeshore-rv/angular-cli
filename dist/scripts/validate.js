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
const child_process_1 = require("child_process");
const templates_1 = require("./templates");
const validate_build_files_1 = require("./validate-build-files");
const validate_commits_1 = require("./validate-commits");
const validate_licenses_1 = require("./validate-licenses");
function default_1(options, logger) {
    return __awaiter(this, void 0, void 0, function* () {
        let error = false;
        logger.info('Running templates validation...');
        const templateLogger = logger.createChild('templates');
        if (child_process_1.execSync(`git status --porcelain`).toString()) {
            logger.error('There are local changes.');
            if (!options.verbose) {
                return 101;
            }
            error = true;
        }
        templates_1.default({}, templateLogger);
        if (child_process_1.execSync(`git status --porcelain`).toString()) {
            logger.error(core_1.tags.oneLine `
      Running templates updated files... Please run "devkit-admin templates" before submitting
      a PR.
    `);
            if (!options.verbose) {
                process.exit(2);
            }
            error = true;
        }
        logger.info('');
        logger.info('Running commit validation...');
        error = (yield validate_commits_1.default({}, logger.createChild('validate-commits'))) != 0
            || error;
        logger.info('');
        logger.info('Running license validation...');
        error = (yield validate_licenses_1.default({}, logger.createChild('validate-commits'))) != 0
            || error;
        logger.info('');
        logger.info('Running BUILD files validation...');
        error = (yield validate_build_files_1.default({}, logger.createChild('validate-build-files'))) != 0
            || error;
        if (error) {
            return 101;
        }
        return 0;
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInNjcmlwdHMvdmFsaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILDBDQUEwQztBQUMxQywrQ0FBcUQ7QUFDckQsaURBQXlDO0FBQ3pDLDJDQUFvQztBQUNwQyxpRUFBd0Q7QUFDeEQseURBQWlEO0FBQ2pELDJEQUFtRDtBQUVuRCxtQkFBK0IsT0FBNkIsRUFBRSxNQUFzQjs7UUFDbEYsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUMvQyxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZELElBQUksd0JBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDcEIsT0FBTyxHQUFHLENBQUM7YUFDWjtZQUNELEtBQUssR0FBRyxJQUFJLENBQUM7U0FDZDtRQUNELG1CQUFTLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzlCLElBQUksd0JBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQTs7O0tBR3hCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pCO1lBQ0QsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNkO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDNUMsS0FBSyxHQUFHLENBQUEsTUFBTSwwQkFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSSxDQUFDO2VBQ3RFLEtBQUssQ0FBQztRQUVkLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQzdDLEtBQUssR0FBRyxDQUFBLE1BQU0sMkJBQWdCLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFJLENBQUM7ZUFDdkUsS0FBSyxDQUFDO1FBRWQsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7UUFDakQsS0FBSyxHQUFHLENBQUEsTUFBTSw4QkFBa0IsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEtBQUksQ0FBQztlQUM3RSxLQUFLLENBQUM7UUFFZCxJQUFJLEtBQUssRUFBRTtZQUNULE9BQU8sR0FBRyxDQUFDO1NBQ1o7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FBQTtBQTVDRCw0QkE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1pbXBsaWNpdC1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IGxvZ2dpbmcsIHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHRlbXBsYXRlcyBmcm9tICcuL3RlbXBsYXRlcyc7XG5pbXBvcnQgdmFsaWRhdGVCdWlsZEZpbGVzIGZyb20gJy4vdmFsaWRhdGUtYnVpbGQtZmlsZXMnO1xuaW1wb3J0IHZhbGlkYXRlQ29tbWl0cyBmcm9tICcuL3ZhbGlkYXRlLWNvbW1pdHMnO1xuaW1wb3J0IHZhbGlkYXRlTGljZW5zZXMgZnJvbSAnLi92YWxpZGF0ZS1saWNlbnNlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChvcHRpb25zOiB7IHZlcmJvc2U6IGJvb2xlYW4gfSwgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlcikge1xuICBsZXQgZXJyb3IgPSBmYWxzZTtcblxuICBsb2dnZXIuaW5mbygnUnVubmluZyB0ZW1wbGF0ZXMgdmFsaWRhdGlvbi4uLicpO1xuICBjb25zdCB0ZW1wbGF0ZUxvZ2dlciA9IGxvZ2dlci5jcmVhdGVDaGlsZCgndGVtcGxhdGVzJyk7XG4gIGlmIChleGVjU3luYyhgZ2l0IHN0YXR1cyAtLXBvcmNlbGFpbmApLnRvU3RyaW5nKCkpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ1RoZXJlIGFyZSBsb2NhbCBjaGFuZ2VzLicpO1xuICAgIGlmICghb3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICByZXR1cm4gMTAxO1xuICAgIH1cbiAgICBlcnJvciA9IHRydWU7XG4gIH1cbiAgdGVtcGxhdGVzKHt9LCB0ZW1wbGF0ZUxvZ2dlcik7XG4gIGlmIChleGVjU3luYyhgZ2l0IHN0YXR1cyAtLXBvcmNlbGFpbmApLnRvU3RyaW5nKCkpIHtcbiAgICBsb2dnZXIuZXJyb3IodGFncy5vbmVMaW5lYFxuICAgICAgUnVubmluZyB0ZW1wbGF0ZXMgdXBkYXRlZCBmaWxlcy4uLiBQbGVhc2UgcnVuIFwiZGV2a2l0LWFkbWluIHRlbXBsYXRlc1wiIGJlZm9yZSBzdWJtaXR0aW5nXG4gICAgICBhIFBSLlxuICAgIGApO1xuICAgIGlmICghb3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICBwcm9jZXNzLmV4aXQoMik7XG4gICAgfVxuICAgIGVycm9yID0gdHJ1ZTtcbiAgfVxuXG4gIGxvZ2dlci5pbmZvKCcnKTtcbiAgbG9nZ2VyLmluZm8oJ1J1bm5pbmcgY29tbWl0IHZhbGlkYXRpb24uLi4nKTtcbiAgZXJyb3IgPSBhd2FpdCB2YWxpZGF0ZUNvbW1pdHMoe30sIGxvZ2dlci5jcmVhdGVDaGlsZCgndmFsaWRhdGUtY29tbWl0cycpKSAhPSAwXG4gICAgICAgfHwgZXJyb3I7XG5cbiAgbG9nZ2VyLmluZm8oJycpO1xuICBsb2dnZXIuaW5mbygnUnVubmluZyBsaWNlbnNlIHZhbGlkYXRpb24uLi4nKTtcbiAgZXJyb3IgPSBhd2FpdCB2YWxpZGF0ZUxpY2Vuc2VzKHt9LCBsb2dnZXIuY3JlYXRlQ2hpbGQoJ3ZhbGlkYXRlLWNvbW1pdHMnKSkgIT0gMFxuICAgICAgIHx8IGVycm9yO1xuXG4gIGxvZ2dlci5pbmZvKCcnKTtcbiAgbG9nZ2VyLmluZm8oJ1J1bm5pbmcgQlVJTEQgZmlsZXMgdmFsaWRhdGlvbi4uLicpO1xuICBlcnJvciA9IGF3YWl0IHZhbGlkYXRlQnVpbGRGaWxlcyh7fSwgbG9nZ2VyLmNyZWF0ZUNoaWxkKCd2YWxpZGF0ZS1idWlsZC1maWxlcycpKSAhPSAwXG4gICAgICAgfHwgZXJyb3I7XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgcmV0dXJuIDEwMTtcbiAgfVxuXG4gIHJldHVybiAwO1xufVxuIl19