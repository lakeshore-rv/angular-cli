"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const parse_name_1 = require("./parse-name");
describe('parse-name', () => {
    it('should handle just the name', () => {
        const result = parse_name_1.parseName('src/app', 'foo');
        expect(result.name).toEqual('foo');
        expect(result.path).toEqual('/src/app');
    });
    it('should handle no path', () => {
        const result = parse_name_1.parseName('', 'foo');
        expect(result.name).toEqual('foo');
        expect(result.path).toEqual('/');
    });
    it('should handle name has a path (sub-dir)', () => {
        const result = parse_name_1.parseName('src/app', 'bar/foo');
        expect(result.name).toEqual('foo');
        expect(result.path).toEqual('/src/app/bar');
    });
    it('should handle name has a higher path', () => {
        const result = parse_name_1.parseName('src/app', '../foo');
        expect(result.name).toEqual('foo');
        expect(result.path).toEqual('/src');
    });
    it('should handle name has a higher path above root', () => {
        expect(() => parse_name_1.parseName('src/app', '../../../foo')).toThrow();
    });
    it('should handle Windows paths', () => {
        const result = parse_name_1.parseName('', 'foo\\bar\\baz');
        expect(result.name).toEqual('baz');
        expect(result.path).toEqual('/foo/bar');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UtbmFtZV9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9zY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9wYXJzZS1uYW1lX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw2Q0FBeUM7QUFHekMsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDMUIsRUFBRSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUNyQyxNQUFNLE1BQU0sR0FBRyxzQkFBUyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsTUFBTSxNQUFNLEdBQUcsc0JBQVMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELE1BQU0sTUFBTSxHQUFHLHNCQUFTLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxNQUFNLE1BQU0sR0FBRyxzQkFBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDekQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFTLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLHNCQUFTLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBwYXJzZU5hbWUgfSBmcm9tICcuL3BhcnNlLW5hbWUnO1xuXG5cbmRlc2NyaWJlKCdwYXJzZS1uYW1lJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIGhhbmRsZSBqdXN0IHRoZSBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlTmFtZSgnc3JjL2FwcCcsICdmb28nKTtcbiAgICBleHBlY3QocmVzdWx0Lm5hbWUpLnRvRXF1YWwoJ2ZvbycpO1xuICAgIGV4cGVjdChyZXN1bHQucGF0aCkudG9FcXVhbCgnL3NyYy9hcHAnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbm8gcGF0aCcsICgpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBwYXJzZU5hbWUoJycsICdmb28nKTtcbiAgICBleHBlY3QocmVzdWx0Lm5hbWUpLnRvRXF1YWwoJ2ZvbycpO1xuICAgIGV4cGVjdChyZXN1bHQucGF0aCkudG9FcXVhbCgnLycpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBuYW1lIGhhcyBhIHBhdGggKHN1Yi1kaXIpJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlTmFtZSgnc3JjL2FwcCcsICdiYXIvZm9vJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5uYW1lKS50b0VxdWFsKCdmb28nKTtcbiAgICBleHBlY3QocmVzdWx0LnBhdGgpLnRvRXF1YWwoJy9zcmMvYXBwL2JhcicpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBuYW1lIGhhcyBhIGhpZ2hlciBwYXRoJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlTmFtZSgnc3JjL2FwcCcsICcuLi9mb28nKTtcbiAgICBleHBlY3QocmVzdWx0Lm5hbWUpLnRvRXF1YWwoJ2ZvbycpO1xuICAgIGV4cGVjdChyZXN1bHQucGF0aCkudG9FcXVhbCgnL3NyYycpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBuYW1lIGhhcyBhIGhpZ2hlciBwYXRoIGFib3ZlIHJvb3QnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHBhcnNlTmFtZSgnc3JjL2FwcCcsICcuLi8uLi8uLi9mb28nKSkudG9UaHJvdygpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBXaW5kb3dzIHBhdGhzJywgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlTmFtZSgnJywgJ2Zvb1xcXFxiYXJcXFxcYmF6Jyk7XG4gICAgZXhwZWN0KHJlc3VsdC5uYW1lKS50b0VxdWFsKCdiYXonKTtcbiAgICBleHBlY3QocmVzdWx0LnBhdGgpLnRvRXF1YWwoJy9mb28vYmFyJyk7XG4gIH0pO1xufSk7XG4iXX0=