/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { logging } from '@angular-devkit/core';
export interface SnapshotsOptions {
    force?: boolean;
    githubTokenFile?: string;
    githubToken?: string;
}
export default function (opts: SnapshotsOptions, logger: logging.Logger): void;
