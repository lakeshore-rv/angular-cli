/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { logging } from '@angular-devkit/core';
export interface ChangelogOptions {
    from: string;
    to?: string;
    githubTokenFile?: string;
    githubToken?: string;
    stdout?: boolean;
}
export default function (args: ChangelogOptions, logger: logging.Logger): Promise<any>;
