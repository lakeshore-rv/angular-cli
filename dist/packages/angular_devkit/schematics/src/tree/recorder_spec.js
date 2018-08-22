"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const entry_1 = require("./entry");
const recorder_1 = require("./recorder");
describe('UpdateRecorderBase', () => {
    it('works for simple files', () => {
        const buffer = Buffer.from('Hello World');
        const entry = new entry_1.SimpleFileEntry(core_1.normalize('/some/path'), buffer);
        const recorder = new recorder_1.UpdateRecorderBase(entry);
        recorder.insertLeft(5, ' beautiful');
        const result = recorder.apply(buffer);
        expect(result.toString()).toBe('Hello beautiful World');
    });
    it('works for simple files (2)', () => {
        const buffer = Buffer.from('Hello World');
        const entry = new entry_1.SimpleFileEntry(core_1.normalize('/some/path'), buffer);
        const recorder = new recorder_1.UpdateRecorderBase(entry);
        recorder.insertRight(5, ' beautiful');
        const result = recorder.apply(buffer);
        expect(result.toString()).toBe('Hello beautiful World');
    });
    it('can create the proper recorder', () => {
        const e = new entry_1.SimpleFileEntry(core_1.normalize('/some/path'), Buffer.from('hello'));
        expect(recorder_1.UpdateRecorderBase.createFromFileEntry(e) instanceof recorder_1.UpdateRecorderBase).toBe(true);
        expect(recorder_1.UpdateRecorderBase.createFromFileEntry(e) instanceof recorder_1.UpdateRecorderBom).toBe(false);
    });
    it('can create the proper recorder (bom)', () => {
        const eBom = new entry_1.SimpleFileEntry(core_1.normalize('/some/path'), Buffer.from('\uFEFFhello'));
        expect(recorder_1.UpdateRecorderBase.createFromFileEntry(eBom) instanceof recorder_1.UpdateRecorderBase).toBe(true);
        expect(recorder_1.UpdateRecorderBase.createFromFileEntry(eBom) instanceof recorder_1.UpdateRecorderBom).toBe(true);
    });
    it('supports empty files', () => {
        const e = new entry_1.SimpleFileEntry(core_1.normalize('/some/path'), Buffer.from(''));
        expect(recorder_1.UpdateRecorderBase.createFromFileEntry(e) instanceof recorder_1.UpdateRecorderBase).toBe(true);
    });
    it('supports empty files (bom)', () => {
        const eBom = new entry_1.SimpleFileEntry(core_1.normalize('/some/path'), Buffer.from('\uFEFF'));
        expect(recorder_1.UpdateRecorderBase.createFromFileEntry(eBom) instanceof recorder_1.UpdateRecorderBase).toBe(true);
    });
});
describe('UpdateRecorderBom', () => {
    it('works for simple files', () => {
        const buffer = Buffer.from('\uFEFFHello World');
        const entry = new entry_1.SimpleFileEntry(core_1.normalize('/some/path'), buffer);
        const recorder = new recorder_1.UpdateRecorderBom(entry);
        recorder.insertLeft(5, ' beautiful');
        const result = recorder.apply(buffer);
        expect(result.toString()).toBe('\uFEFFHello beautiful World');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvdHJlZS9yZWNvcmRlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQWlEO0FBQ2pELG1DQUEwQztBQUMxQyx5Q0FBbUU7QUFFbkUsUUFBUSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtJQUNsQyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDMUMsTUFBTSxLQUFLLEdBQUcsSUFBSSx1QkFBZSxDQUFDLGdCQUFTLENBQUMsWUFBWSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbkUsTUFBTSxRQUFRLEdBQUcsSUFBSSw2QkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNyQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFJLHVCQUFlLENBQUMsZ0JBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVuRSxNQUFNLFFBQVEsR0FBRyxJ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QUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUNoRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgbm9ybWFsaXplIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgU2ltcGxlRmlsZUVudHJ5IH0gZnJvbSAnLi9lbnRyeSc7XG5pbXBvcnQgeyBVcGRhdGVSZWNvcmRlckJhc2UsIFVwZGF0ZVJlY29yZGVyQm9tIH0gZnJvbSAnLi9yZWNvcmRlcic7XG5cbmRlc2NyaWJlKCdVcGRhdGVSZWNvcmRlckJhc2UnLCAoKSA9PiB7XG4gIGl0KCd3b3JrcyBmb3Igc2ltcGxlIGZpbGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKCdIZWxsbyBXb3JsZCcpO1xuICAgIGNvbnN0IGVudHJ5ID0gbmV3IFNpbXBsZUZpbGVFbnRyeShub3JtYWxpemUoJy9zb21lL3BhdGgnKSwgYnVmZmVyKTtcblxuICAgIGNvbnN0IHJlY29yZGVyID0gbmV3IFVwZGF0ZVJlY29yZGVyQmFzZShlbnRyeSk7XG4gICAgcmVjb3JkZXIuaW5zZXJ0TGVmdCg1LCAnIGJlYXV0aWZ1bCcpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHJlY29yZGVyLmFwcGx5KGJ1ZmZlcik7XG4gICAgZXhwZWN0KHJlc3VsdC50b1N0cmluZygpKS50b0JlKCdIZWxsbyBiZWF1dGlmdWwgV29ybGQnKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIGZvciBzaW1wbGUgZmlsZXMgKDIpJywgKCkgPT4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKCdIZWxsbyBXb3JsZCcpO1xuICAgIGNvbnN0IGVudHJ5ID0gbmV3IFNpbXBsZUZpbGVFbnRyeShub3JtYWxpemUoJy9zb21lL3BhdGgnKSwgYnVmZmVyKTtcblxuICAgIGNvbnN0IHJlY29yZGVyID0gbmV3IFVwZGF0ZVJlY29yZGVyQmFzZShlbnRyeSk7XG4gICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoNSwgJyBiZWF1dGlmdWwnKTtcbiAgICBjb25zdCByZXN1bHQgPSByZWNvcmRlci5hcHBseShidWZmZXIpO1xuICAgIGV4cGVjdChyZXN1bHQudG9TdHJpbmcoKSkudG9CZSgnSGVsbG8gYmVhdXRpZnVsIFdvcmxkJyk7XG4gIH0pO1xuXG4gIGl0KCdjYW4gY3JlYXRlIHRoZSBwcm9wZXIgcmVjb3JkZXInLCAoKSA9PiB7XG4gICAgY29uc3QgZSA9IG5ldyBTaW1wbGVGaWxlRW50cnkobm9ybWFsaXplKCcvc29tZS9wYXRoJyksICBCdWZmZXIuZnJvbSgnaGVsbG8nKSk7XG4gICAgZXhwZWN0KFVwZGF0ZVJlY29yZGVyQmFzZS5jcmVhdGVGcm9tRmlsZUVudHJ5KGUpIGluc3RhbmNlb2YgVXBkYXRlUmVjb3JkZXJCYXNlKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdChVcGRhdGVSZWNvcmRlckJhc2UuY3JlYXRlRnJvbUZpbGVFbnRyeShlKSBpbnN0YW5jZW9mIFVwZGF0ZVJlY29yZGVyQm9tKS50b0JlKGZhbHNlKTtcbiAgfSk7XG5cbiAgaXQoJ2NhbiBjcmVhdGUgdGhlIHByb3BlciByZWNvcmRlciAoYm9tKScsICgpID0+IHtcbiAgICBjb25zdCBlQm9tID0gbmV3IFNpbXBsZUZpbGVFbnRyeShub3JtYWxpemUoJy9zb21lL3BhdGgnKSwgQnVmZmVyLmZyb20oJ1xcdUZFRkZoZWxsbycpKTtcbiAgICBleHBlY3QoVXBkYXRlUmVjb3JkZXJCYXNlLmNyZWF0ZUZyb21GaWxlRW50cnkoZUJvbSkgaW5zdGFuY2VvZiBVcGRhdGVSZWNvcmRlckJhc2UpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KFVwZGF0ZVJlY29yZGVyQmFzZS5jcmVhdGVGcm9tRmlsZUVudHJ5KGVCb20pIGluc3RhbmNlb2YgVXBkYXRlUmVjb3JkZXJCb20pLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdzdXBwb3J0cyBlbXB0eSBmaWxlcycsICgpID0+IHtcbiAgICBjb25zdCBlID0gbmV3IFNpbXBsZUZpbGVFbnRyeShub3JtYWxpemUoJy9zb21lL3BhdGgnKSwgIEJ1ZmZlci5mcm9tKCcnKSk7XG4gICAgZXhwZWN0KFVwZGF0ZVJlY29yZGVyQmFzZS5jcmVhdGVGcm9tRmlsZUVudHJ5KGUpIGluc3RhbmNlb2YgVXBkYXRlUmVjb3JkZXJCYXNlKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnc3VwcG9ydHMgZW1wdHkgZmlsZXMgKGJvbSknLCAoKSA9PiB7XG4gICAgY29uc3QgZUJvbSA9IG5ldyBTaW1wbGVGaWxlRW50cnkobm9ybWFsaXplKCcvc29tZS9wYXRoJyksIEJ1ZmZlci5mcm9tKCdcXHVGRUZGJykpO1xuICAgIGV4cGVjdChVcGRhdGVSZWNvcmRlckJhc2UuY3JlYXRlRnJvbUZpbGVFbnRyeShlQm9tKSBpbnN0YW5jZW9mIFVwZGF0ZVJlY29yZGVyQmFzZSkudG9CZSh0cnVlKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ1VwZGF0ZVJlY29yZGVyQm9tJywgKCkgPT4ge1xuICBpdCgnd29ya3MgZm9yIHNpbXBsZSBmaWxlcycsICgpID0+IHtcbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbSgnXFx1RkVGRkhlbGxvIFdvcmxkJyk7XG4gICAgY29uc3QgZW50cnkgPSBuZXcgU2ltcGxlRmlsZUVudHJ5KG5vcm1hbGl6ZSgnL3NvbWUvcGF0aCcpLCBidWZmZXIpO1xuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBuZXcgVXBkYXRlUmVjb3JkZXJCb20oZW50cnkpO1xuICAgIHJlY29yZGVyLmluc2VydExlZnQoNSwgJyBiZWF1dGlmdWwnKTtcbiAgICBjb25zdCByZXN1bHQgPSByZWNvcmRlci5hcHBseShidWZmZXIpO1xuICAgIGV4cGVjdChyZXN1bHQudG9TdHJpbmcoKSkudG9CZSgnXFx1RkVGRkhlbGxvIGJlYXV0aWZ1bCBXb3JsZCcpO1xuICB9KTtcbn0pO1xuIl19