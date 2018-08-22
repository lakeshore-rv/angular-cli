"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-any no-big-function
const path_1 = require("../path");
const buffer_1 = require("./buffer");
const record_1 = require("./record");
const test_1 = require("./test");
describe('CordHost', () => {
    const mutatingTestRecord = ['write', 'delete', 'rename'];
    it('works (create)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `hi`).subscribe(undefined, done.fail);
        const target = new test_1.TestHost();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'write', path: path_1.path `/blue` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(true);
        done();
    });
    it('works (create -> create)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `hi`).subscribe(undefined, done.fail);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `hi again`).subscribe(undefined, done.fail);
        const target = new test_1.TestHost();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'write', path: path_1.path `/blue` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(true);
        expect(target.$read('/blue')).toBe('hi again');
        done();
    });
    it('works (create -> delete)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `hi`).subscribe(undefined, done.fail);
        host.delete(path_1.path `/blue`).subscribe(undefined, done.fail);
        const target = new test_1.TestHost();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(false);
        done();
    });
    it('works (create -> rename)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `hi`).subscribe(undefined, done.fail);
        host.rename(path_1.path `/blue`, path_1.path `/red`).subscribe(undefined, done.fail);
        const target = new test_1.TestHost();
        host.commit(target).subscribe(undefined, done.fail);
        // Check that there's only 1 write done.
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'write', path: path_1.path `/red` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(false);
        expect(target.$exists('/red')).toBe(true);
        done();
    });
    it('works (create -> rename (identity))', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `hi`).subscribe(undefined, done.fail);
        host.rename(path_1.path `/blue`, path_1.path `/blue`).subscribe(undefined, done.fail);
        const target = new test_1.TestHost();
        host.commit(target).subscribe(undefined, done.fail);
        // Check that there's only 1 write done.
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'write', path: path_1.path `/blue` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(true);
        done();
    });
    it('works (create -> rename -> rename)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `hi`).subscribe(undefined, done.fail);
        host.rename(path_1.path `/blue`, path_1.path `/red`).subscribe(undefined, done.fail);
        host.rename(path_1.path `/red`, path_1.path `/yellow`).subscribe(undefined, done.fail);
        const target = new test_1.TestHost();
        host.commit(target).subscribe(undefined, done.fail);
        // Check that there's only 1 write done.
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'write', path: path_1.path `/yellow` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(false);
        expect(target.$exists('/red')).toBe(false);
        expect(target.$exists('/yellow')).toBe(true);
        done();
    });
    it('works (rename)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        // Check that there's only 1 write done.
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'rename', from: path_1.path `/hello`, to: path_1.path `/blue` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(true);
        done();
    });
    it('works (rename -> rename)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe(undefined, done.fail);
        host.rename(path_1.path `/blue`, path_1.path `/red`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        // Check that there's only 1 write done.
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'rename', from: path_1.path `/hello`, to: path_1.path `/red` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(false);
        expect(target.$exists('/red')).toBe(true);
        done();
    });
    it('works (rename -> create)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe(undefined, done.fail);
        host.write(path_1.path `/hello`, buffer_1.fileBuffer `beautiful world`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        // Check that there's only 1 write done.
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'rename', from: path_1.path `/hello`, to: path_1.path `/blue` },
            { kind: 'write', path: path_1.path `/hello` },
        ]);
        expect(target.$exists('/hello')).toBe(true);
        expect(target.$exists('/blue')).toBe(true);
        done();
    });
    it('works (overwrite)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/hello`, buffer_1.fileBuffer `beautiful world`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        // Check that there's only 1 write done.
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'write', path: path_1.path `/hello` },
        ]);
        expect(target.$exists('/hello')).toBe(true);
        expect(target.$read('/hello')).toBe('beautiful world');
        done();
    });
    it('works (overwrite -> overwrite)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/hello`, buffer_1.fileBuffer `beautiful world`).subscribe(undefined, done.fail);
        host.write(path_1.path `/hello`, buffer_1.fileBuffer `again`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        // Check that there's only 1 write done.
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'write', path: path_1.path `/hello` },
        ]);
        expect(target.$exists('/hello')).toBe(true);
        expect(target.$read('/hello')).toBe('again');
        done();
    });
    it('works (overwrite -> rename)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/hello`, buffer_1.fileBuffer `beautiful world`).subscribe(undefined, done.fail);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'rename', from: path_1.path `/hello`, to: path_1.path `/blue` },
            { kind: 'write', path: path_1.path `/blue` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(true);
        expect(target.$read('/blue')).toBe('beautiful world');
        done();
    });
    it('works (overwrite -> delete)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/hello`, buffer_1.fileBuffer `beautiful world`).subscribe(undefined, done.fail);
        host.delete(path_1.path `/hello`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'delete', path: path_1.path `/hello` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        done();
    });
    it('works (rename -> overwrite)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe(undefined, done.fail);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `beautiful world`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'rename', from: path_1.path `/hello`, to: path_1.path `/blue` },
            { kind: 'write', path: path_1.path `/blue` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(true);
        expect(target.$read('/blue')).toBe('beautiful world');
        done();
    });
    it('works (delete)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.delete(path_1.path `/hello`).subscribe(undefined, done.fail);
        const target = new test_1.TestHost();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'delete', path: path_1.path `/hello` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        done();
    });
    it('works (delete -> create)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.delete(path_1.path `/hello`).subscribe(undefined, done.fail);
        host.write(path_1.path `/hello`, buffer_1.fileBuffer `beautiful world`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'write', path: path_1.path `/hello` },
        ]);
        expect(target.$exists('/hello')).toBe(true);
        expect(target.$read('/hello')).toBe('beautiful world');
        done();
    });
    it('works (rename -> delete)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe(undefined, done.fail);
        host.delete(path_1.path `/blue`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'delete', path: path_1.path `/hello` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        done();
    });
    it('works (delete -> rename)', done => {
        const base = new test_1.TestHost({
            '/hello': 'world',
            '/blue': 'foo',
        });
        const host = new record_1.CordHost(base);
        host.delete(path_1.path `/blue`).subscribe(undefined, done.fail);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe(undefined, done.fail);
        const target = base.clone();
        host.commit(target).subscribe(undefined, done.fail);
        expect(target.records.filter(x => mutatingTestRecord.includes(x.kind))).toEqual([
            { kind: 'delete', path: path_1.path `/hello` },
            { kind: 'write', path: path_1.path `/blue` },
        ]);
        expect(target.$exists('/hello')).toBe(false);
        expect(target.$exists('/blue')).toBe(true);
        done();
    });
    it('errors: commit (create: exists)', () => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/blue`, buffer_1.fileBuffer `hi`).subscribe();
        const target = new test_1.TestHost({
            '/blue': 'test',
        });
        let error = false;
        host.commit(target).subscribe(undefined, () => error = true, () => error = false);
        expect(error).toBe(true);
    });
    it('errors: commit (overwrite: not exist)', () => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.write(path_1.path `/hello`, buffer_1.fileBuffer `hi`).subscribe();
        const target = new test_1.TestHost({});
        let error = false;
        host.commit(target).subscribe(undefined, () => error = true, () => error = false);
        expect(error).toBe(true);
    });
    it('errors: commit (rename: not exist)', () => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe();
        const target = new test_1.TestHost({});
        let error = false;
        host.commit(target).subscribe(undefined, () => error = true, () => error = false);
        expect(error).toBe(true);
    });
    it('errors: commit (rename: exist)', () => {
        const base = new test_1.TestHost({
            '/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        host.rename(path_1.path `/hello`, path_1.path `/blue`).subscribe();
        const target = new test_1.TestHost({
            '/blue': 'foo',
        });
        let error = false;
        host.commit(target).subscribe(undefined, () => error = true, () => error = false);
        expect(error).toBe(true);
    });
    it('errors (write directory)', () => {
        const base = new test_1.TestHost({
            '/dir/hello': 'world',
        });
        const host = new record_1.CordHost(base);
        let error = false;
        host.write(path_1.path `/dir`, buffer_1.fileBuffer `beautiful world`)
            .subscribe(undefined, () => error = true, () => error = false);
        expect(error).toBe(true);
    });
    it('errors (delete: not exist)', () => {
        const base = new test_1.TestHost({});
        const host = new record_1.CordHost(base);
        let error = false;
        host.delete(path_1.path `/hello`)
            .subscribe(undefined, () => error = true, () => error = false);
        expect(error).toBe(true);
    });
    it('errors (rename: exist)', () => {
        const base = new test_1.TestHost({
            '/hello': 'world',
            '/blue': 'foo',
        });
        const host = new record_1.CordHost(base);
        let error = false;
        host.rename(path_1.path `/hello`, path_1.path `/blue`)
            .subscribe(undefined, () => error = true, () => error = false);
        expect(error).toBe(true);
    });
    it('errors (rename: not exist)', () => {
        const base = new test_1.TestHost({});
        const host = new record_1.CordHost(base);
        let error = false;
        host.rename(path_1.path `/hello`, path_1.path `/blue`)
            .subscribe(undefined, () => error = true, () => error = false);
        expect(error).toBe(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb3JkX3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL3ZpcnR1YWwtZnMvaG9zdC9yZWNvcmRfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILHdDQUF3QztBQUN4QyxrQ0FBK0I7QUFDL0IscUNBQXNDO0FBQ3RDLHFDQUFvQztBQUNwQyxpQ0FBa0M7QUFHbEMsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7SUFDeEIsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFekQsRUFBRSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxFQUFFO1FBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksZUFBUSxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxPQUFPO1NBQ2xCLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUFHLElBQUksaUJBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQUksQ0FBQSxPQUFPLEVBQUUsbUJBQVUsQ0FBQSxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV4RSxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQVEsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENB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QUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNsRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxNQUFNLElBQUksR0FBRyxJQUFJLGVBQVEsQ0FBQztZQUN4QixRQUFRLEVBQUUsT0FBTztTQUNsQixDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxJQUFJLGlCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFJLENBQUEsUUFBUSxFQUFFLG1CQUFVLENBQUEsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFckQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFaEMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNsRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUM1QyxNQUFNLElBQUksR0FBRyxJQUFJLGVBQVEsQ0FBQztZQUN4QixRQUFRLEVBQUUsT0FBTztTQUNsQixDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxJQUFJLGlCQUFRLENBQUMsSUFBSSxD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XG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGU6bm8tYW55IG5vLWJpZy1mdW5jdGlvblxuaW1wb3J0IHsgcGF0aCB9IGZyb20gJy4uL3BhdGgnO1xuaW1wb3J0IHsgZmlsZUJ1ZmZlciB9IGZyb20gJy4vYnVmZmVyJztcbmltcG9ydCB7IENvcmRIb3N0IH0gZnJvbSAnLi9yZWNvcmQnO1xuaW1wb3J0IHsgVGVzdEhvc3QgfSBmcm9tICcuL3Rlc3QnO1xuXG5cbmRlc2NyaWJlKCdDb3JkSG9zdCcsICgpID0+IHtcbiAgY29uc3QgbXV0YXRpbmdUZXN0UmVjb3JkID0gWyd3cml0ZScsICdkZWxldGUnLCAncmVuYW1lJ107XG5cbiAgaXQoJ3dvcmtzIChjcmVhdGUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC53cml0ZShwYXRoYC9ibHVlYCwgZmlsZUJ1ZmZlcmBoaWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBuZXcgVGVzdEhvc3QoKTtcbiAgICBob3N0LmNvbW1pdCh0YXJnZXQpLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBleHBlY3QodGFyZ2V0LnJlY29yZHMuZmlsdGVyKHggPT4gbXV0YXRpbmdUZXN0UmVjb3JkLmluY2x1ZGVzKHgua2luZCkpKS50b0VxdWFsKFtcbiAgICAgIHsga2luZDogJ3dyaXRlJywgcGF0aDogcGF0aGAvYmx1ZWAgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2JsdWUnKSkudG9CZSh0cnVlKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCd3b3JrcyAoY3JlYXRlIC0+IGNyZWF0ZSknLCBkb25lID0+IHtcbiAgICBjb25zdCBiYXNlID0gbmV3IFRlc3RIb3N0KHtcbiAgICAgICcvaGVsbG8nOiAnd29ybGQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaG9zdCA9IG5ldyBDb3JkSG9zdChiYXNlKTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2JsdWVgLCBmaWxlQnVmZmVyYGhpYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2JsdWVgLCBmaWxlQnVmZmVyYGhpIGFnYWluYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIGNvbnN0IHRhcmdldCA9IG5ldyBUZXN0SG9zdCgpO1xuICAgIGhvc3QuY29tbWl0KHRhcmdldCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIGV4cGVjdCh0YXJnZXQucmVjb3Jkcy5maWx0ZXIoeCA9PiBtdXRhdGluZ1Rlc3RSZWNvcmQuaW5jbHVkZXMoeC5raW5kKSkpLnRvRXF1YWwoW1xuICAgICAgeyBraW5kOiAnd3JpdGUnLCBwYXRoOiBwYXRoYC9ibHVlYCB9LFxuICAgIF0pO1xuXG4gICAgZXhwZWN0KHRhcmdldC4kZXhpc3RzKCcvaGVsbG8nKSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KHRhcmdldC4kZXhpc3RzKCcvYmx1ZScpKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdCh0YXJnZXQuJHJlYWQoJy9ibHVlJykpLnRvQmUoJ2hpIGFnYWluJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnd29ya3MgKGNyZWF0ZSAtPiBkZWxldGUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC53cml0ZShwYXRoYC9ibHVlYCwgZmlsZUJ1ZmZlcmBoaWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG4gICAgaG9zdC5kZWxldGUocGF0aGAvYmx1ZWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBuZXcgVGVzdEhvc3QoKTtcbiAgICBob3N0LmNvbW1pdCh0YXJnZXQpLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBleHBlY3QodGFyZ2V0LnJlY29yZHMuZmlsdGVyKHggPT4gbXV0YXRpbmdUZXN0UmVjb3JkLmluY2x1ZGVzKHgua2luZCkpKS50b0VxdWFsKFtcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2JsdWUnKSkudG9CZShmYWxzZSk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnd29ya3MgKGNyZWF0ZSAtPiByZW5hbWUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC53cml0ZShwYXRoYC9ibHVlYCwgZmlsZUJ1ZmZlcmBoaWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG4gICAgaG9zdC5yZW5hbWUocGF0aGAvYmx1ZWAsIHBhdGhgL3JlZGApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBuZXcgVGVzdEhvc3QoKTtcbiAgICBob3N0LmNvbW1pdCh0YXJnZXQpLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICAvLyBDaGVjayB0aGF0IHRoZXJlJ3Mgb25seSAxIHdyaXRlIGRvbmUuXG4gICAgZXhwZWN0KHRhcmdldC5yZWNvcmRzLmZpbHRlcih4ID0+IG11dGF0aW5nVGVzdFJlY29yZC5pbmNsdWRlcyh4LmtpbmQpKSkudG9FcXVhbChbXG4gICAgICB7IGtpbmQ6ICd3cml0ZScsIHBhdGg6IHBhdGhgL3JlZGAgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2JsdWUnKSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KHRhcmdldC4kZXhpc3RzKCcvcmVkJykpLnRvQmUodHJ1ZSk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCd3b3JrcyAoY3JlYXRlIC0+IHJlbmFtZSAoaWRlbnRpdHkpKScsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGhvc3Qud3JpdGUocGF0aGAvYmx1ZWAsIGZpbGVCdWZmZXJgaGlgKS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuICAgIGhvc3QucmVuYW1lKHBhdGhgL2JsdWVgLCBwYXRoYC9ibHVlYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIGNvbnN0IHRhcmdldCA9IG5ldyBUZXN0SG9zdCgpO1xuICAgIGhvc3QuY29tbWl0KHRhcmdldCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlcmUncyBvbmx5IDEgd3JpdGUgZG9uZS5cbiAgICBleHBlY3QodGFyZ2V0LnJlY29yZHMuZmlsdGVyKHggPT4gbXV0YXRpbmdUZXN0UmVjb3JkLmluY2x1ZGVzKHgua2luZCkpKS50b0VxdWFsKFtcbiAgICAgIHsga2luZDogJ3dyaXRlJywgcGF0aDogcGF0aGAvYmx1ZWAgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2JsdWUnKSkudG9CZSh0cnVlKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIChjcmVhdGUgLT4gcmVuYW1lIC0+IHJlbmFtZSknLCBkb25lID0+IHtcbiAgICBjb25zdCBiYXNlID0gbmV3IFRlc3RIb3N0KHtcbiAgICAgICcvaGVsbG8nOiAnd29ybGQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaG9zdCA9IG5ldyBDb3JkSG9zdChiYXNlKTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2JsdWVgLCBmaWxlQnVmZmVyYGhpYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcbiAgICBob3N0LnJlbmFtZShwYXRoYC9ibHVlYCwgcGF0aGAvcmVkYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcbiAgICBob3N0LnJlbmFtZShwYXRoYC9yZWRgLCBwYXRoYC95ZWxsb3dgKS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gbmV3IFRlc3RIb3N0KCk7XG4gICAgaG9zdC5jb21taXQodGFyZ2V0KS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGVyZSdzIG9ubHkgMSB3cml0ZSBkb25lLlxuICAgIGV4cGVjdCh0YXJnZXQucmVjb3Jkcy5maWx0ZXIoeCA9PiBtdXRhdGluZ1Rlc3RSZWNvcmQuaW5jbHVkZXMoeC5raW5kKSkpLnRvRXF1YWwoW1xuICAgICAgeyBraW5kOiAnd3JpdGUnLCBwYXRoOiBwYXRoYC95ZWxsb3dgIH0sXG4gICAgXSk7XG5cbiAgICBleHBlY3QodGFyZ2V0LiRleGlzdHMoJy9oZWxsbycpKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3QodGFyZ2V0LiRleGlzdHMoJy9ibHVlJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL3JlZCcpKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3QodGFyZ2V0LiRleGlzdHMoJy95ZWxsb3cnKSkudG9CZSh0cnVlKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIChyZW5hbWUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC5yZW5hbWUocGF0aGAvaGVsbG9gLCBwYXRoYC9ibHVlYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIGNvbnN0IHRhcmdldCA9IGJhc2UuY2xvbmUoKTtcbiAgICBob3N0LmNvbW1pdCh0YXJnZXQpLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICAvLyBDaGVjayB0aGF0IHRoZXJlJ3Mgb25seSAxIHdyaXRlIGRvbmUuXG4gICAgZXhwZWN0KHRhcmdldC5yZWNvcmRzLmZpbHRlcih4ID0+IG11dGF0aW5nVGVzdFJlY29yZC5pbmNsdWRlcyh4LmtpbmQpKSkudG9FcXVhbChbXG4gICAgICB7IGtpbmQ6ICdyZW5hbWUnLCBmcm9tOiBwYXRoYC9oZWxsb2AsIHRvOiBwYXRoYC9ibHVlYCB9LFxuICAgIF0pO1xuXG4gICAgZXhwZWN0KHRhcmdldC4kZXhpc3RzKCcvaGVsbG8nKSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KHRhcmdldC4kZXhpc3RzKCcvYmx1ZScpKS50b0JlKHRydWUpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnd29ya3MgKHJlbmFtZSAtPiByZW5hbWUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC5yZW5hbWUocGF0aGAvaGVsbG9gLCBwYXRoYC9ibHVlYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcbiAgICBob3N0LnJlbmFtZShwYXRoYC9ibHVlYCwgcGF0aGAvcmVkYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIGNvbnN0IHRhcmdldCA9IGJhc2UuY2xvbmUoKTtcbiAgICBob3N0LmNvbW1pdCh0YXJnZXQpLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICAvLyBDaGVjayB0aGF0IHRoZXJlJ3Mgb25seSAxIHdyaXRlIGRvbmUuXG4gICAgZXhwZWN0KHRhcmdldC5yZWNvcmRzLmZpbHRlcih4ID0+IG11dGF0aW5nVGVzdFJlY29yZC5pbmNsdWRlcyh4LmtpbmQpKSkudG9FcXVhbChbXG4gICAgICB7IGtpbmQ6ICdyZW5hbWUnLCBmcm9tOiBwYXRoYC9oZWxsb2AsIHRvOiBwYXRoYC9yZWRgIH0sXG4gICAgXSk7XG5cbiAgICBleHBlY3QodGFyZ2V0LiRleGlzdHMoJy9oZWxsbycpKS50b0JlKGZhbHNlKTtcbiAgICBleHBlY3QodGFyZ2V0LiRleGlzdHMoJy9ibHVlJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL3JlZCcpKS50b0JlKHRydWUpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnd29ya3MgKHJlbmFtZSAtPiBjcmVhdGUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC5yZW5hbWUocGF0aGAvaGVsbG9gLCBwYXRoYC9ibHVlYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2hlbGxvYCwgZmlsZUJ1ZmZlcmBiZWF1dGlmdWwgd29ybGRgKS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gYmFzZS5jbG9uZSgpO1xuICAgIGhvc3QuY29tbWl0KHRhcmdldCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlcmUncyBvbmx5IDEgd3JpdGUgZG9uZS5cbiAgICBleHBlY3QodGFyZ2V0LnJlY29yZHMuZmlsdGVyKHggPT4gbXV0YXRpbmdUZXN0UmVjb3JkLmluY2x1ZGVzKHgua2luZCkpKS50b0VxdWFsKFtcbiAgICAgIHsga2luZDogJ3JlbmFtZScsIGZyb206IHBhdGhgL2hlbGxvYCwgdG86IHBhdGhgL2JsdWVgIH0sXG4gICAgICB7IGtpbmQ6ICd3cml0ZScsIHBhdGg6IHBhdGhgL2hlbGxvYCB9LFxuICAgIF0pO1xuXG4gICAgZXhwZWN0KHRhcmdldC4kZXhpc3RzKCcvaGVsbG8nKSkudG9CZSh0cnVlKTtcbiAgICBleHBlY3QodGFyZ2V0LiRleGlzdHMoJy9ibHVlJykpLnRvQmUodHJ1ZSk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCd3b3JrcyAob3ZlcndyaXRlKScsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGhvc3Qud3JpdGUocGF0aGAvaGVsbG9gLCBmaWxlQnVmZmVyYGJlYXV0aWZ1bCB3b3JsZGApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBiYXNlLmNsb25lKCk7XG4gICAgaG9zdC5jb21taXQodGFyZ2V0KS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGVyZSdzIG9ubHkgMSB3cml0ZSBkb25lLlxuICAgIGV4cGVjdCh0YXJnZXQucmVjb3Jkcy5maWx0ZXIoeCA9PiBtdXRhdGluZ1Rlc3RSZWNvcmQuaW5jbHVkZXMoeC5raW5kKSkpLnRvRXF1YWwoW1xuICAgICAgeyBraW5kOiAnd3JpdGUnLCBwYXRoOiBwYXRoYC9oZWxsb2AgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHRhcmdldC4kcmVhZCgnL2hlbGxvJykpLnRvQmUoJ2JlYXV0aWZ1bCB3b3JsZCcpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnd29ya3MgKG92ZXJ3cml0ZSAtPiBvdmVyd3JpdGUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC53cml0ZShwYXRoYC9oZWxsb2AsIGZpbGVCdWZmZXJgYmVhdXRpZnVsIHdvcmxkYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2hlbGxvYCwgZmlsZUJ1ZmZlcmBhZ2FpbmApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBiYXNlLmNsb25lKCk7XG4gICAgaG9zdC5jb21taXQodGFyZ2V0KS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGVyZSdzIG9ubHkgMSB3cml0ZSBkb25lLlxuICAgIGV4cGVjdCh0YXJnZXQucmVjb3Jkcy5maWx0ZXIoeCA9PiBtdXRhdGluZ1Rlc3RSZWNvcmQuaW5jbHVkZXMoeC5raW5kKSkpLnRvRXF1YWwoW1xuICAgICAgeyBraW5kOiAnd3JpdGUnLCBwYXRoOiBwYXRoYC9oZWxsb2AgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHRhcmdldC4kcmVhZCgnL2hlbGxvJykpLnRvQmUoJ2FnYWluJyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCd3b3JrcyAob3ZlcndyaXRlIC0+IHJlbmFtZSknLCBkb25lID0+IHtcbiAgICBjb25zdCBiYXNlID0gbmV3IFRlc3RIb3N0KHtcbiAgICAgICcvaGVsbG8nOiAnd29ybGQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaG9zdCA9IG5ldyBDb3JkSG9zdChiYXNlKTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2hlbGxvYCwgZmlsZUJ1ZmZlcmBiZWF1dGlmdWwgd29ybGRgKS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuICAgIGhvc3QucmVuYW1lKHBhdGhgL2hlbGxvYCwgcGF0aGAvYmx1ZWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBiYXNlLmNsb25lKCk7XG4gICAgaG9zdC5jb21taXQodGFyZ2V0KS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgZXhwZWN0KHRhcmdldC5yZWNvcmRzLmZpbHRlcih4ID0+IG11dGF0aW5nVGVzdFJlY29yZC5pbmNsdWRlcyh4LmtpbmQpKSkudG9FcXVhbChbXG4gICAgICB7IGtpbmQ6ICdyZW5hbWUnLCBmcm9tOiBwYXRoYC9oZWxsb2AsIHRvOiBwYXRoYC9ibHVlYCB9LFxuICAgICAgeyBraW5kOiAnd3JpdGUnLCBwYXRoOiBwYXRoYC9ibHVlYCB9LFxuICAgIF0pO1xuXG4gICAgZXhwZWN0KHRhcmdldC4kZXhpc3RzKCcvaGVsbG8nKSkudG9CZShmYWxzZSk7XG4gICAgZXhwZWN0KHRhcmdldC4kZXhpc3RzKCcvYmx1ZScpKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdCh0YXJnZXQuJHJlYWQoJy9ibHVlJykpLnRvQmUoJ2JlYXV0aWZ1bCB3b3JsZCcpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnd29ya3MgKG92ZXJ3cml0ZSAtPiBkZWxldGUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC53cml0ZShwYXRoYC9oZWxsb2AsIGZpbGVCdWZmZXJgYmVhdXRpZnVsIHdvcmxkYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcbiAgICBob3N0LmRlbGV0ZShwYXRoYC9oZWxsb2ApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBiYXNlLmNsb25lKCk7XG4gICAgaG9zdC5jb21taXQodGFyZ2V0KS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgZXhwZWN0KHRhcmdldC5yZWNvcmRzLmZpbHRlcih4ID0+IG11dGF0aW5nVGVzdFJlY29yZC5pbmNsdWRlcyh4LmtpbmQpKSkudG9FcXVhbChbXG4gICAgICB7IGtpbmQ6ICdkZWxldGUnLCBwYXRoOiBwYXRoYC9oZWxsb2AgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIChyZW5hbWUgLT4gb3ZlcndyaXRlKScsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGhvc3QucmVuYW1lKHBhdGhgL2hlbGxvYCwgcGF0aGAvYmx1ZWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG4gICAgaG9zdC53cml0ZShwYXRoYC9ibHVlYCwgZmlsZUJ1ZmZlcmBiZWF1dGlmdWwgd29ybGRgKS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gYmFzZS5jbG9uZSgpO1xuICAgIGhvc3QuY29tbWl0KHRhcmdldCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIGV4cGVjdCh0YXJnZXQucmVjb3Jkcy5maWx0ZXIoeCA9PiBtdXRhdGluZ1Rlc3RSZWNvcmQuaW5jbHVkZXMoeC5raW5kKSkpLnRvRXF1YWwoW1xuICAgICAgeyBraW5kOiAncmVuYW1lJywgZnJvbTogcGF0aGAvaGVsbG9gLCB0bzogcGF0aGAvYmx1ZWAgfSxcbiAgICAgIHsga2luZDogJ3dyaXRlJywgcGF0aDogcGF0aGAvYmx1ZWAgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2JsdWUnKSkudG9CZSh0cnVlKTtcbiAgICBleHBlY3QodGFyZ2V0LiRyZWFkKCcvYmx1ZScpKS50b0JlKCdiZWF1dGlmdWwgd29ybGQnKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIChkZWxldGUpJywgZG9uZSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC5kZWxldGUocGF0aGAvaGVsbG9gKS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gbmV3IFRlc3RIb3N0KCk7XG4gICAgaG9zdC5jb21taXQodGFyZ2V0KS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgZXhwZWN0KHRhcmdldC5yZWNvcmRzLmZpbHRlcih4ID0+IG11dGF0aW5nVGVzdFJlY29yZC5pbmNsdWRlcyh4LmtpbmQpKSkudG9FcXVhbChbXG4gICAgICB7IGtpbmQ6ICdkZWxldGUnLCBwYXRoOiBwYXRoYC9oZWxsb2AgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIChkZWxldGUgLT4gY3JlYXRlKScsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGhvc3QuZGVsZXRlKHBhdGhgL2hlbGxvYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2hlbGxvYCwgZmlsZUJ1ZmZlcmBiZWF1dGlmdWwgd29ybGRgKS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gYmFzZS5jbG9uZSgpO1xuICAgIGhvc3QuY29tbWl0KHRhcmdldCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIGV4cGVjdCh0YXJnZXQucmVjb3Jkcy5maWx0ZXIoeCA9PiBtdXRhdGluZ1Rlc3RSZWNvcmQuaW5jbHVkZXMoeC5raW5kKSkpLnRvRXF1YWwoW1xuICAgICAgeyBraW5kOiAnd3JpdGUnLCBwYXRoOiBwYXRoYC9oZWxsb2AgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHRhcmdldC4kcmVhZCgnL2hlbGxvJykpLnRvQmUoJ2JlYXV0aWZ1bCB3b3JsZCcpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIChyZW5hbWUgLT4gZGVsZXRlKScsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGhvc3QucmVuYW1lKHBhdGhgL2hlbGxvYCwgcGF0aGAvYmx1ZWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG4gICAgaG9zdC5kZWxldGUocGF0aGAvYmx1ZWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBiYXNlLmNsb25lKCk7XG4gICAgaG9zdC5jb21taXQodGFyZ2V0KS5zdWJzY3JpYmUodW5kZWZpbmVkLCBkb25lLmZhaWwpO1xuXG4gICAgZXhwZWN0KHRhcmdldC5yZWNvcmRzLmZpbHRlcih4ID0+IG11dGF0aW5nVGVzdFJlY29yZC5pbmNsdWRlcyh4LmtpbmQpKSkudG9FcXVhbChbXG4gICAgICB7IGtpbmQ6ICdkZWxldGUnLCBwYXRoOiBwYXRoYC9oZWxsb2AgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3dvcmtzIChkZWxldGUgLT4gcmVuYW1lKScsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgICAnL2JsdWUnOiAnZm9vJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC5kZWxldGUocGF0aGAvYmx1ZWApLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG4gICAgaG9zdC5yZW5hbWUocGF0aGAvaGVsbG9gLCBwYXRoYC9ibHVlYCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgZG9uZS5mYWlsKTtcblxuICAgIGNvbnN0IHRhcmdldCA9IGJhc2UuY2xvbmUoKTtcbiAgICBob3N0LmNvbW1pdCh0YXJnZXQpLnN1YnNjcmliZSh1bmRlZmluZWQsIGRvbmUuZmFpbCk7XG4gICAgZXhwZWN0KHRhcmdldC5yZWNvcmRzLmZpbHRlcih4ID0+IG11dGF0aW5nVGVzdFJlY29yZC5pbmNsdWRlcyh4LmtpbmQpKSkudG9FcXVhbChbXG4gICAgICB7IGtpbmQ6ICdkZWxldGUnLCBwYXRoOiBwYXRoYC9oZWxsb2AgfSxcbiAgICAgIHsga2luZDogJ3dyaXRlJywgcGF0aDogcGF0aGAvYmx1ZWAgfSxcbiAgICBdKTtcblxuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2hlbGxvJykpLnRvQmUoZmFsc2UpO1xuICAgIGV4cGVjdCh0YXJnZXQuJGV4aXN0cygnL2JsdWUnKSkudG9CZSh0cnVlKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdlcnJvcnM6IGNvbW1pdCAoY3JlYXRlOiBleGlzdHMpJywgKCkgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGhvc3Qud3JpdGUocGF0aGAvYmx1ZWAsIGZpbGVCdWZmZXJgaGlgKS5zdWJzY3JpYmUoKTtcblxuICAgIGNvbnN0IHRhcmdldCA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2JsdWUnOiAndGVzdCcsXG4gICAgfSk7XG5cbiAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICBob3N0LmNvbW1pdCh0YXJnZXQpLnN1YnNjcmliZSh1bmRlZmluZWQsICgpID0+IGVycm9yID0gdHJ1ZSwgKCkgPT4gZXJyb3IgPSBmYWxzZSk7XG4gICAgZXhwZWN0KGVycm9yKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnZXJyb3JzOiBjb21taXQgKG92ZXJ3cml0ZTogbm90IGV4aXN0KScsICgpID0+IHtcbiAgICBjb25zdCBiYXNlID0gbmV3IFRlc3RIb3N0KHtcbiAgICAgICcvaGVsbG8nOiAnd29ybGQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaG9zdCA9IG5ldyBDb3JkSG9zdChiYXNlKTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2hlbGxvYCwgZmlsZUJ1ZmZlcmBoaWApLnN1YnNjcmliZSgpO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gbmV3IFRlc3RIb3N0KHt9KTtcblxuICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgIGhvc3QuY29tbWl0KHRhcmdldCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgKCkgPT4gZXJyb3IgPSB0cnVlLCAoKSA9PiBlcnJvciA9IGZhbHNlKTtcbiAgICBleHBlY3QoZXJyb3IpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdlcnJvcnM6IGNvbW1pdCAocmVuYW1lOiBub3QgZXhpc3QpJywgKCkgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9oZWxsbyc6ICd3b3JsZCcsXG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGhvc3QucmVuYW1lKHBhdGhgL2hlbGxvYCwgcGF0aGAvYmx1ZWApLnN1YnNjcmliZSgpO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gbmV3IFRlc3RIb3N0KHt9KTtcblxuICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgIGhvc3QuY29tbWl0KHRhcmdldCkuc3Vic2NyaWJlKHVuZGVmaW5lZCwgKCkgPT4gZXJyb3IgPSB0cnVlLCAoKSA9PiBlcnJvciA9IGZhbHNlKTtcbiAgICBleHBlY3QoZXJyb3IpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdlcnJvcnM6IGNvbW1pdCAocmVuYW1lOiBleGlzdCknLCAoKSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgICAnL2hlbGxvJzogJ3dvcmxkJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGhvc3QgPSBuZXcgQ29yZEhvc3QoYmFzZSk7XG4gICAgaG9zdC5yZW5hbWUocGF0aGAvaGVsbG9gLCBwYXRoYC9ibHVlYCkuc3Vic2NyaWJlKCk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9ibHVlJzogJ2ZvbycsXG4gICAgfSk7XG5cbiAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICBob3N0LmNvbW1pdCh0YXJnZXQpLnN1YnNjcmliZSh1bmRlZmluZWQsICgpID0+IGVycm9yID0gdHJ1ZSwgKCkgPT4gZXJyb3IgPSBmYWxzZSk7XG4gICAgZXhwZWN0KGVycm9yKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnZXJyb3JzICh3cml0ZSBkaXJlY3RvcnkpJywgKCkgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgICAgJy9kaXIvaGVsbG8nOiAnd29ybGQnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaG9zdCA9IG5ldyBDb3JkSG9zdChiYXNlKTtcbiAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICBob3N0LndyaXRlKHBhdGhgL2RpcmAsIGZpbGVCdWZmZXJgYmVhdXRpZnVsIHdvcmxkYClcbiAgICAgIC5zdWJzY3JpYmUodW5kZWZpbmVkLCAoKSA9PiBlcnJvciA9IHRydWUsICgpID0+IGVycm9yID0gZmFsc2UpO1xuXG4gICAgZXhwZWN0KGVycm9yKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnZXJyb3JzIChkZWxldGU6IG5vdCBleGlzdCknLCAoKSA9PiB7XG4gICAgY29uc3QgYmFzZSA9IG5ldyBUZXN0SG9zdCh7XG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgIGhvc3QuZGVsZXRlKHBhdGhgL2hlbGxvYClcbiAgICAgIC5zdWJzY3JpYmUodW5kZWZpbmVkLCAoKSA9PiBlcnJvciA9IHRydWUsICgpID0+IGVycm9yID0gZmFsc2UpO1xuXG4gICAgZXhwZWN0KGVycm9yKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnZXJyb3JzIChyZW5hbWU6IGV4aXN0KScsICgpID0+IHtcbiAgICBjb25zdCBiYXNlID0gbmV3IFRlc3RIb3N0KHtcbiAgICAgICcvaGVsbG8nOiAnd29ybGQnLFxuICAgICAgJy9ibHVlJzogJ2ZvbycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBob3N0ID0gbmV3IENvcmRIb3N0KGJhc2UpO1xuICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgIGhvc3QucmVuYW1lKHBhdGhgL2hlbGxvYCwgcGF0aGAvYmx1ZWApXG4gICAgICAuc3Vic2NyaWJlKHVuZGVmaW5lZCwgKCkgPT4gZXJyb3IgPSB0cnVlLCAoKSA9PiBlcnJvciA9IGZhbHNlKTtcblxuICAgIGV4cGVjdChlcnJvcikudG9CZSh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoJ2Vycm9ycyAocmVuYW1lOiBub3QgZXhpc3QpJywgKCkgPT4ge1xuICAgIGNvbnN0IGJhc2UgPSBuZXcgVGVzdEhvc3Qoe1xuICAgIH0pO1xuXG4gICAgY29uc3QgaG9zdCA9IG5ldyBDb3JkSG9zdChiYXNlKTtcbiAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICBob3N0LnJlbmFtZShwYXRoYC9oZWxsb2AsIHBhdGhgL2JsdWVgKVxuICAgICAgLnN1YnNjcmliZSh1bmRlZmluZWQsICgpID0+IGVycm9yID0gdHJ1ZSwgKCkgPT4gZXJyb3IgPSBmYWxzZSk7XG5cbiAgICBleHBlY3QoZXJyb3IpLnRvQmUodHJ1ZSk7XG4gIH0pO1xufSk7XG4iXX0=