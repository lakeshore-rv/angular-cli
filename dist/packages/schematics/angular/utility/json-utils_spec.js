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
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const json_utils_1 = require("./json-utils");
describe('json-utils', () => {
    const filePath = '/temp';
    let tree;
    beforeEach(() => {
        tree = new testing_1.UnitTestTree(new schematics_1.HostTree());
    });
    describe('insertPropertyInAstObjectInOrder', () => {
        function runTest(obj, prop, val) {
            const content = JSON.stringify(obj, null, 2);
            tree.create(filePath, content);
            const ast = core_1.parseJsonAst(content);
            const rec = tree.beginUpdate(filePath);
            if (ast.kind === 'object') {
                json_utils_1.insertPropertyInAstObjectInOrder(rec, ast, prop, val, 2);
            }
            tree.commitUpdate(rec);
            const result = JSON.parse(tree.readContent(filePath));
            // Clean up the tree by deleting the file.
            tree.delete(filePath);
            return result;
        }
        it('should insert a first prop', () => {
            const obj = {
                m: 'm',
                z: 'z',
            };
            const result = runTest(obj, 'a', 'val');
            expect(Object.keys(result)).toEqual(['a', 'm', 'z']);
        });
        it('should insert a middle prop', () => {
            const obj = {
                a: 'a',
                z: 'z',
            };
            const result = runTest(obj, 'm', 'val');
            expect(Object.keys(result)).toEqual(['a', 'm', 'z']);
        });
        it('should insert a last prop', () => {
            const obj = {
                a: 'a',
                m: 'm',
            };
            const result = runTest(obj, 'z', 'val');
            expect(Object.keys(result)).toEqual(['a', 'm', 'z']);
        });
        it('should insert multiple props', () => {
            let obj = {};
            obj = runTest(obj, 'z', 'val');
            expect(Object.keys(obj)).toEqual(['z']);
            obj = runTest(obj, 'm', 'val');
            expect(Object.keys(obj)).toEqual(['m', 'z']);
            obj = runTest(obj, 'a', 'val');
            expect(Object.keys(obj)).toEqual(['a', 'm', 'z']);
            obj = runTest(obj, 'b', 'val');
            expect(Object.keys(obj)).toEqual(['a', 'b', 'm', 'z']);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi11dGlsc19zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9zY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9qc29uLXV0aWxzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBb0Q7QUFDcEQsMkRBQXNEO0FBQ3RELGdFQUFrRTtBQUNsRSw2Q0FBZ0U7QUFNaEUsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDMUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLElBQUksSUFBa0IsQ0FBQztJQUN2QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsSUFBSSxHQUFHLElBQUksc0JBQVksQ0FBQyxJQUFJLHFCQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtRQUNoRCxpQkFBaUIsR0FBVSxFQUFFLElBQVksRUFBRSxHQUFXO1lBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvQixNQUFNLEdBQUcsR0FBRyxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtnQkFDekIsNkNBQWdDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzFEO1lBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFH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QUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IHBhcnNlSnNvbkFzdCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IEhvc3RUcmVlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgVW5pdFRlc3RUcmVlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGVzdGluZyc7XG5pbXBvcnQgeyBpbnNlcnRQcm9wZXJ0eUluQXN0T2JqZWN0SW5PcmRlciB9IGZyb20gJy4vanNvbi11dGlscyc7XG5cbnR5cGUgUG9qc28gPSB7XG4gIFtrZXk6IHN0cmluZ106IHN0cmluZztcbn07XG5cbmRlc2NyaWJlKCdqc29uLXV0aWxzJywgKCkgPT4ge1xuICBjb25zdCBmaWxlUGF0aCA9ICcvdGVtcCc7XG4gIGxldCB0cmVlOiBVbml0VGVzdFRyZWU7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHRyZWUgPSBuZXcgVW5pdFRlc3RUcmVlKG5ldyBIb3N0VHJlZSgpKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2luc2VydFByb3BlcnR5SW5Bc3RPYmplY3RJbk9yZGVyJywgKCkgPT4ge1xuICAgIGZ1bmN0aW9uIHJ1blRlc3Qob2JqOiBQb2pzbywgcHJvcDogc3RyaW5nLCB2YWw6IHN0cmluZyk6IFBvanNvIHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpO1xuICAgICAgdHJlZS5jcmVhdGUoZmlsZVBhdGgsIGNvbnRlbnQpO1xuICAgICAgY29uc3QgYXN0ID0gcGFyc2VKc29uQXN0KGNvbnRlbnQpO1xuICAgICAgY29uc3QgcmVjID0gdHJlZS5iZWdpblVwZGF0ZShmaWxlUGF0aCk7XG4gICAgICBpZiAoYXN0LmtpbmQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGluc2VydFByb3BlcnR5SW5Bc3RPYmplY3RJbk9yZGVyKHJlYywgYXN0LCBwcm9wLCB2YWwsIDIpO1xuICAgICAgfVxuICAgICAgdHJlZS5jb21taXRVcGRhdGUocmVjKTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KGZpbGVQYXRoKSk7XG4gICAgICAvLyBDbGVhbiB1cCB0aGUgdHJlZSBieSBkZWxldGluZyB0aGUgZmlsZS5cbiAgICAgIHRyZWUuZGVsZXRlKGZpbGVQYXRoKTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIGluc2VydCBhIGZpcnN0IHByb3AnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgIG06ICdtJyxcbiAgICAgICAgejogJ3onLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHJ1blRlc3Qob2JqLCAnYScsICd2YWwnKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhyZXN1bHQpKS50b0VxdWFsKFsnYScsICdtJywgJ3onXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGluc2VydCBhIG1pZGRsZSBwcm9wJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICBhOiAnYScsXG4gICAgICAgIHo6ICd6JyxcbiAgICAgIH07XG4gICAgICBjb25zdCByZXN1bHQgPSBydW5UZXN0KG9iaiwgJ20nLCAndmFsJyk7XG4gICAgICBleHBlY3QoT2JqZWN0LmtleXMocmVzdWx0KSkudG9FcXVhbChbJ2EnLCAnbScsICd6J10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBpbnNlcnQgYSBsYXN0IHByb3AnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgIGE6ICdhJyxcbiAgICAgICAgbTogJ20nLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHJ1blRlc3Qob2JqLCAneicsICd2YWwnKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhyZXN1bHQpKS50b0VxdWFsKFsnYScsICdtJywgJ3onXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGluc2VydCBtdWx0aXBsZSBwcm9wcycsICgpID0+IHtcbiAgICAgIGxldCBvYmogPSB7fTtcbiAgICAgIG9iaiA9IHJ1blRlc3Qob2JqLCAneicsICd2YWwnKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhvYmopKS50b0VxdWFsKFsneiddKTtcbiAgICAgIG9iaiA9IHJ1blRlc3Qob2JqLCAnbScsICd2YWwnKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhvYmopKS50b0VxdWFsKFsnbScsICd6J10pO1xuICAgICAgb2JqID0gcnVuVGVzdChvYmosICdhJywgJ3ZhbCcpO1xuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKG9iaikpLnRvRXF1YWwoWydhJywgJ20nLCAneiddKTtcbiAgICAgIG9iaiA9IHJ1blRlc3Qob2JqLCAnYicsICd2YWwnKTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhvYmopKS50b0VxdWFsKFsnYScsICdiJywgJ20nLCAneiddKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==