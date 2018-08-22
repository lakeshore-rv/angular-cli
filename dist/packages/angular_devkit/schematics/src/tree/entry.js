"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SimpleFileEntry {
    constructor(_path, _content) {
        this._path = _path;
        this._content = _content;
    }
    get path() { return this._path; }
    get content() { return this._content; }
}
exports.SimpleFileEntry = SimpleFileEntry;
class LazyFileEntry {
    constructor(_path, _load) {
        this._path = _path;
        this._load = _load;
        this._content = null;
    }
    get path() { return this._path; }
    get content() { return this._content || (this._content = this._load(this._path)); }
}
exports.LazyFileEntry = LazyFileEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnkuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L3NjaGVtYXRpY3Mvc3JjL3RyZWUvZW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFXQTtJQUNFLFlBQW9CLEtBQVcsRUFBVSxRQUFnQjtRQUFyQyxVQUFLLEdBQUwsS0FBSyxDQUFNO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUFHLENBQUM7SUFFN0QsSUFBSSxJQUFJLEtBQUssT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqQyxJQUFJLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0NBQ3hDO0FBTEQsMENBS0M7QUFHRDtJQUdFLFlBQW9CLEtBQVcsRUFBVSxLQUE4QjtRQUFuRCxVQUFLLEdBQUwsS0FBSyxDQUFNO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBeUI7UUFGL0QsYUFBUSxHQUFrQixJQUFJLENBQUM7SUFFbUMsQ0FBQztJQUUzRSxJQUFJLElBQUksS0FBSyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLElBQUksT0FBTyxLQUFLLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDcEY7QUFQRCxzQ0FPQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IFBhdGggfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBGaWxlRW50cnkgfSBmcm9tICcuL2ludGVyZmFjZSc7XG5cblxuZXhwb3J0IGNsYXNzIFNpbXBsZUZpbGVFbnRyeSBpbXBsZW1lbnRzIEZpbGVFbnRyeSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3BhdGg6IFBhdGgsIHByaXZhdGUgX2NvbnRlbnQ6IEJ1ZmZlcikge31cblxuICBnZXQgcGF0aCgpIHsgcmV0dXJuIHRoaXMuX3BhdGg7IH1cbiAgZ2V0IGNvbnRlbnQoKSB7IHJldHVybiB0aGlzLl9jb250ZW50OyB9XG59XG5cblxuZXhwb3J0IGNsYXNzIExhenlGaWxlRW50cnkgaW1wbGVtZW50cyBGaWxlRW50cnkge1xuICBwcml2YXRlIF9jb250ZW50OiBCdWZmZXIgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXRoOiBQYXRoLCBwcml2YXRlIF9sb2FkOiAocGF0aD86IFBhdGgpID0+IEJ1ZmZlcikge31cblxuICBnZXQgcGF0aCgpIHsgcmV0dXJuIHRoaXMuX3BhdGg7IH1cbiAgZ2V0IGNvbnRlbnQoKSB7IHJldHVybiB0aGlzLl9jb250ZW50IHx8ICh0aGlzLl9jb250ZW50ID0gdGhpcy5fbG9hZCh0aGlzLl9wYXRoKSk7IH1cbn1cbiJdfQ==