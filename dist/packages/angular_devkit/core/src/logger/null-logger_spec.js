"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const operators_1 = require("rxjs/operators");
const logger_1 = require("./logger");
const null_logger_1 = require("./null-logger");
describe('NullLogger', () => {
    it('works', (done) => {
        const logger = new null_logger_1.NullLogger();
        logger.pipe(operators_1.toArray())
            .toPromise()
            .then((observed) => {
            expect(observed).toEqual([]);
        })
            .then(() => done(), err => done.fail(err));
        logger.debug('hello');
        logger.info('world');
        logger.complete();
    });
    it('nullifies children', (done) => {
        const logger = new logger_1.Logger('test');
        logger.pipe(operators_1.toArray())
            .toPromise()
            .then((observed) => {
            expect(observed).toEqual([]);
        })
            .then(() => done(), err => done.fail(err));
        const nullLogger = new null_logger_1.NullLogger(logger);
        const child = new logger_1.Logger('test', nullLogger);
        child.debug('hello');
        child.info('world');
        logger.complete();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbC1sb2dnZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvbG9nZ2VyL251bGwtbG9nZ2VyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4Q0FBeUM7QUFDekMscUNBQTRDO0FBQzVDLCtDQUEyQztBQUczQyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUU7UUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBTyxFQUFFLENBQUM7YUFDbkIsU0FBUyxFQUFFO2FBQ1gsSUFBSSxDQUFDLENBQUMsUUFBb0IsRUFBRSxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRTtRQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFPLEVBQUUsQ0FBQzthQUNuQixTQUFTLEVBQUU7YUFDWCxJQUFJLENBQUMsQ0FBQyxRQUFvQixFQUFFLEVBQUU7WUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFN0MsTUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM3QyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyB0b0FycmF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgTG9nRW50cnksIExvZ2dlciB9IGZyb20gJy4vbG9nZ2VyJztcbmltcG9ydCB7IE51bGxMb2dnZXIgfSBmcm9tICcuL251bGwtbG9nZ2VyJztcblxuXG5kZXNjcmliZSgnTnVsbExvZ2dlcicsICgpID0+IHtcbiAgaXQoJ3dvcmtzJywgKGRvbmU6IERvbmVGbikgPT4ge1xuICAgIGNvbnN0IGxvZ2dlciA9IG5ldyBOdWxsTG9nZ2VyKCk7XG4gICAgbG9nZ2VyLnBpcGUodG9BcnJheSgpKVxuICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAudGhlbigob2JzZXJ2ZWQ6IExvZ0VudHJ5W10pID0+IHtcbiAgICAgICAgZXhwZWN0KG9ic2VydmVkKS50b0VxdWFsKFtdKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoKSA9PiBkb25lKCksIGVyciA9PiBkb25lLmZhaWwoZXJyKSk7XG5cbiAgICBsb2dnZXIuZGVidWcoJ2hlbGxvJyk7XG4gICAgbG9nZ2VyLmluZm8oJ3dvcmxkJyk7XG4gICAgbG9nZ2VyLmNvbXBsZXRlKCk7XG4gIH0pO1xuXG4gIGl0KCdudWxsaWZpZXMgY2hpbGRyZW4nLCAoZG9uZTogRG9uZUZuKSA9PiB7XG4gICAgY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcigndGVzdCcpO1xuICAgIGxvZ2dlci5waXBlKHRvQXJyYXkoKSlcbiAgICAgIC50b1Byb21pc2UoKVxuICAgICAgLnRoZW4oKG9ic2VydmVkOiBMb2dFbnRyeVtdKSA9PiB7XG4gICAgICAgIGV4cGVjdChvYnNlcnZlZCkudG9FcXVhbChbXSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4gZG9uZSgpLCBlcnIgPT4gZG9uZS5mYWlsKGVycikpO1xuXG4gICAgY29uc3QgbnVsbExvZ2dlciA9IG5ldyBOdWxsTG9nZ2VyKGxvZ2dlcik7XG4gICAgY29uc3QgY2hpbGQgPSBuZXcgTG9nZ2VyKCd0ZXN0JywgbnVsbExvZ2dlcik7XG4gICAgY2hpbGQuZGVidWcoJ2hlbGxvJyk7XG4gICAgY2hpbGQuaW5mbygnd29ybGQnKTtcbiAgICBsb2dnZXIuY29tcGxldGUoKTtcbiAgfSk7XG59KTtcbiJdfQ==