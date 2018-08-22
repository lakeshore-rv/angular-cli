/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { logging } from '@angular-devkit/core';
export interface ValidateCommitsOptions {
    ci?: boolean;
    base?: string;
    head?: string;
}
export default function (argv: ValidateCommitsOptions, logger: logging.Logger): number;
