/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { logging } from '@angular-devkit/core';
export interface ReleaseOptions {
    _: string[];
    'force'?: boolean;
    'dry-run'?: boolean;
}
export default function (args: ReleaseOptions, logger: logging.Logger): void;
