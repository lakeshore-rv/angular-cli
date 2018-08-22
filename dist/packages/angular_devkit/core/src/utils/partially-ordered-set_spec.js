"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const partially_ordered_set_1 = require("./partially-ordered-set");
describe('PartiallyOrderedSet', () => {
    it('can add an item', () => {
        const set = new partially_ordered_set_1.PartiallyOrderedSet();
        set.add('hello');
        expect([...set]).toEqual(['hello']);
    });
    it('can remove an item', () => {
        const set = new partially_ordered_set_1.PartiallyOrderedSet();
        set.add('hello');
        set.add('world');
        set.delete('world');
        expect([...set]).toEqual(['hello']);
    });
    it('list items in determistic order of dependency', () => {
        const set = new partially_ordered_set_1.PartiallyOrderedSet();
        set.add('red');
        set.add('yellow', ['red']);
        set.add('green', ['red']);
        set.add('blue');
        set.add('purple', ['red', 'blue']);
        expect([...set]).toEqual(['red', 'blue', 'yellow', 'green', 'purple']);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGlhbGx5LW9yZGVyZWQtc2V0X3NwZWMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL3V0aWxzL3BhcnRpYWxseS1vcmRlcmVkLXNldF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsbUVBQThEO0FBRTlELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtRQUN6QixNQUFNLEdBQUcsR0FBRyxJQUFJLDJDQUFtQixFQUFVLENBQUM7UUFFOUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSwyQ0FBbUIsRUFBVSxDQUFDO1FBRTlDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVqQixHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtRQUN2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLDJDQUFtQixFQUFVLENBQUM7UUFFOUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNmLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMzQixHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBRW5DLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgUGFydGlhbGx5T3JkZXJlZFNldCB9IGZyb20gJy4vcGFydGlhbGx5LW9yZGVyZWQtc2V0JztcblxuZGVzY3JpYmUoJ1BhcnRpYWxseU9yZGVyZWRTZXQnLCAoKSA9PiB7XG4gIGl0KCdjYW4gYWRkIGFuIGl0ZW0nLCAoKSA9PiB7XG4gICAgY29uc3Qgc2V0ID0gbmV3IFBhcnRpYWxseU9yZGVyZWRTZXQ8c3RyaW5nPigpO1xuXG4gICAgc2V0LmFkZCgnaGVsbG8nKTtcblxuICAgIGV4cGVjdChbLi4uc2V0XSkudG9FcXVhbChbJ2hlbGxvJ10pO1xuICB9KTtcblxuICBpdCgnY2FuIHJlbW92ZSBhbiBpdGVtJywgKCkgPT4ge1xuICAgIGNvbnN0IHNldCA9IG5ldyBQYXJ0aWFsbHlPcmRlcmVkU2V0PHN0cmluZz4oKTtcblxuICAgIHNldC5hZGQoJ2hlbGxvJyk7XG4gICAgc2V0LmFkZCgnd29ybGQnKTtcblxuICAgIHNldC5kZWxldGUoJ3dvcmxkJyk7XG5cbiAgICBleHBlY3QoWy4uLnNldF0pLnRvRXF1YWwoWydoZWxsbyddKTtcbiAgfSk7XG5cbiAgaXQoJ2xpc3QgaXRlbXMgaW4gZGV0ZXJtaXN0aWMgb3JkZXIgb2YgZGVwZW5kZW5jeScsICgpID0+IHtcbiAgICBjb25zdCBzZXQgPSBuZXcgUGFydGlhbGx5T3JkZXJlZFNldDxzdHJpbmc+KCk7XG5cbiAgICBzZXQuYWRkKCdyZWQnKTtcbiAgICBzZXQuYWRkKCd5ZWxsb3cnLCBbJ3JlZCddKTtcbiAgICBzZXQuYWRkKCdncmVlbicsIFsncmVkJ10pO1xuICAgIHNldC5hZGQoJ2JsdWUnKTtcbiAgICBzZXQuYWRkKCdwdXJwbGUnLCBbJ3JlZCcsICdibHVlJ10pO1xuXG4gICAgZXhwZWN0KFsuLi5zZXRdKS50b0VxdWFsKFsncmVkJywgJ2JsdWUnLCAneWVsbG93JywgJ2dyZWVuJywgJ3B1cnBsZSddKTtcbiAgfSk7XG59KTtcbiJdfQ==