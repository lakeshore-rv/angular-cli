/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { JsonObject } from '@angular-devkit/core';
export interface PackageInfo {
    name: string;
    root: string;
    bin: {
        [name: string]: string;
    };
    relative: string;
    main: string;
    dist: string;
    build: string;
    tar: string;
    private: boolean;
    packageJson: JsonObject;
    dependencies: string[];
    snapshot: boolean;
    snapshotRepo: string;
    snapshotHash: string;
    dirty: boolean;
    hash: string;
    version: string;
}
export declare type PackageMap = {
    [name: string]: PackageInfo;
};
export declare const packages: PackageMap;
