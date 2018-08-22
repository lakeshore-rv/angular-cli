"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const priority_queue_1 = require("./priority-queue");
describe('PriorityQueue', () => {
    it('adds an item', () => {
        const queue = new priority_queue_1.PriorityQueue((x, y) => x - y);
        queue.push(99);
        expect(queue.size).toBe(1);
        expect(queue.peek()).toBe(99);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpb3JpdHktcXVldWVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvdXRpbHMvcHJpb3JpdHktcXVldWVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILHFEQUFpRDtBQUdqRCxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixFQUFFLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLDhCQUFhLENBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFekQsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVmLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IFByaW9yaXR5UXVldWUgfSBmcm9tICcuL3ByaW9yaXR5LXF1ZXVlJztcblxuXG5kZXNjcmliZSgnUHJpb3JpdHlRdWV1ZScsICgpID0+IHtcbiAgaXQoJ2FkZHMgYW4gaXRlbScsICgpID0+IHtcbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBQcmlvcml0eVF1ZXVlPG51bWJlcj4oKHgsIHkpID0+IHggLSB5KTtcblxuICAgIHF1ZXVlLnB1c2goOTkpO1xuXG4gICAgZXhwZWN0KHF1ZXVlLnNpemUpLnRvQmUoMSk7XG4gICAgZXhwZWN0KHF1ZXVlLnBlZWsoKSkudG9CZSg5OSk7XG4gIH0pO1xufSk7XG4iXX0=