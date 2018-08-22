"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const find_module_1 = require("./find-module");
describe('find-module', () => {
    describe('findModule', () => {
        let host;
        const modulePath = '/foo/src/app/app.module.ts';
        beforeEach(() => {
            host = new schematics_1.EmptyTree();
            host.create(modulePath, 'app module');
        });
        it('should find a module', () => {
            const foundModule = find_module_1.findModule(host, 'foo/src/app/bar');
            expect(foundModule).toEqual(modulePath);
        });
        it('should not find a module in another sub dir', () => {
            host.create('/foo/src/app/buzz/buzz.module.ts', 'app module');
            const foundModule = find_module_1.findModule(host, 'foo/src/app/bar');
            expect(foundModule).toEqual(modulePath);
        });
        it('should ignore routing modules', () => {
            host.create('/foo/src/app/app-routing.module.ts', 'app module');
            const foundModule = find_module_1.findModule(host, 'foo/src/app/bar');
            expect(foundModule).toEqual(modulePath);
        });
        it('should work with weird paths', () => {
            host.create('/foo/src/app/app-routing.module.ts', 'app module');
            const foundModule = find_module_1.findModule(host, 'foo//src//app/bar/');
            expect(foundModule).toEqual(modulePath);
        });
        it('should throw if no modules found', () => {
            host.create('/foo/src/app/oops.module.ts', 'app module');
            try {
                find_module_1.findModule(host, 'foo/src/app/bar');
                throw new Error('Succeeded, should have failed');
            }
            catch (err) {
                expect(err.message).toMatch(/More than one module matches/);
            }
        });
        it('should throw if two modules found', () => {
            try {
                host = new schematics_1.EmptyTree();
                find_module_1.findModule(host, 'foo/src/app/bar');
                throw new Error('Succeeded, should have failed');
            }
            catch (err) {
                expect(err.message).toMatch(/Could not find an NgModule/);
            }
        });
    });
    describe('findModuleFromOptions', () => {
        let tree;
        let options;
        beforeEach(() => {
            tree = new schematics_1.EmptyTree();
            options = { name: 'foo' };
        });
        it('should find a module', () => {
            tree.create('/projects/my-proj/src/app.module.ts', '');
            options.module = 'app.module.ts';
            options.path = '/projects/my-proj/src';
            const modPath = find_module_1.findModuleFromOptions(tree, options);
            expect(modPath).toEqual('/projects/my-proj/src/app.module.ts');
        });
        it('should find a module in a sub dir', () => {
            tree.create('/projects/my-proj/src/admin/foo.module.ts', '');
            options.name = 'other/test';
            options.module = 'admin/foo';
            options.path = '/projects/my-proj/src';
            const modPath = find_module_1.findModuleFromOptions(tree, options);
            expect(modPath).toEqual('/projects/my-proj/src/admin/foo.module.ts');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1tb2R1bGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvZmluZC1tb2R1bGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLDJEQUE2RDtBQUM3RCwrQ0FBaUY7QUFHakYsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDM0IsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFFMUIsSUFBSSxJQUFVLENBQUM7UUFDZixNQUFNLFVBQVUsR0FBRyw0QkFBNEIsQ0FBQztRQUNoRCxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxHQUFHLElBQUksc0JBQVMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtZQUM5QixNQUFNLFdBQVcsR0FBRyx3QkFBVSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsa0NBQWtDLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDOUQsTUFBTSxXQUFXLEdBQUcsd0JBQVUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFLEdB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QU8sQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsMkNBQW1ELENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBQYXRoIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgRW1wdHlUcmVlLCBUcmVlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgTW9kdWxlT3B0aW9ucywgZmluZE1vZHVsZSwgZmluZE1vZHVsZUZyb21PcHRpb25zIH0gZnJvbSAnLi9maW5kLW1vZHVsZSc7XG5cblxuZGVzY3JpYmUoJ2ZpbmQtbW9kdWxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZmluZE1vZHVsZScsICgpID0+IHtcblxuICAgIGxldCBob3N0OiBUcmVlO1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSAnL2Zvby9zcmMvYXBwL2FwcC5tb2R1bGUudHMnO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgaG9zdCA9IG5ldyBFbXB0eVRyZWUoKTtcbiAgICAgIGhvc3QuY3JlYXRlKG1vZHVsZVBhdGgsICdhcHAgbW9kdWxlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGZpbmQgYSBtb2R1bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmb3VuZE1vZHVsZSA9IGZpbmRNb2R1bGUoaG9zdCwgJ2Zvby9zcmMvYXBwL2JhcicpO1xuICAgICAgZXhwZWN0KGZvdW5kTW9kdWxlKS50b0VxdWFsKG1vZHVsZVBhdGgpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgZmluZCBhIG1vZHVsZSBpbiBhbm90aGVyIHN1YiBkaXInLCAoKSA9PiB7XG4gICAgICBob3N0LmNyZWF0ZSgnL2Zvby9zcmMvYXBwL2J1enovYnV6ei5tb2R1bGUudHMnLCAnYXBwIG1vZHVsZScpO1xuICAgICAgY29uc3QgZm91bmRNb2R1bGUgPSBmaW5kTW9kdWxlKGhvc3QsICdmb28vc3JjL2FwcC9iYXInKTtcbiAgICAgIGV4cGVjdChmb3VuZE1vZHVsZSkudG9FcXVhbChtb2R1bGVQYXRoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaWdub3JlIHJvdXRpbmcgbW9kdWxlcycsICgpID0+IHtcbiAgICAgIGhvc3QuY3JlYXRlKCcvZm9vL3NyYy9hcHAvYXBwLXJvdXRpbmcubW9kdWxlLnRzJywgJ2FwcCBtb2R1bGUnKTtcbiAgICAgIGNvbnN0IGZvdW5kTW9kdWxlID0gZmluZE1vZHVsZShob3N0LCAnZm9vL3NyYy9hcHAvYmFyJyk7XG4gICAgICBleHBlY3QoZm91bmRNb2R1bGUpLnRvRXF1YWwobW9kdWxlUGF0aCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aCB3ZWlyZCBwYXRocycsICgpID0+IHtcbiAgICAgIGhvc3QuY3JlYXRlKCcvZm9vL3NyYy9hcHAvYXBwLXJvdXRpbmcubW9kdWxlLnRzJywgJ2FwcCBtb2R1bGUnKTtcbiAgICAgIGNvbnN0IGZvdW5kTW9kdWxlID0gZmluZE1vZHVsZShob3N0LCAnZm9vLy9zcmMvL2FwcC9iYXIvJyk7XG4gICAgICBleHBlY3QoZm91bmRNb2R1bGUpLnRvRXF1YWwobW9kdWxlUGF0aCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGlmIG5vIG1vZHVsZXMgZm91bmQnLCAoKSA9PiB7XG4gICAgICBob3N0LmNyZWF0ZSgnL2Zvby9zcmMvYXBwL29vcHMubW9kdWxlLnRzJywgJ2FwcCBtb2R1bGUnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZpbmRNb2R1bGUoaG9zdCwgJ2Zvby9zcmMvYXBwL2JhcicpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1Y2NlZWRlZCwgc2hvdWxkIGhhdmUgZmFpbGVkJyk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKS50b01hdGNoKC9Nb3JlIHRoYW4gb25lIG1vZHVsZSBtYXRjaGVzLyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGlmIHR3byBtb2R1bGVzIGZvdW5kJywgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaG9zdCA9IG5ldyBFbXB0eVRyZWUoKTtcbiAgICAgICAgZmluZE1vZHVsZShob3N0LCAnZm9vL3NyYy9hcHAvYmFyJyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3VjY2VlZGVkLCBzaG91bGQgaGF2ZSBmYWlsZWQnKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBleHBlY3QoZXJyLm1lc3NhZ2UpLnRvTWF0Y2goL0NvdWxkIG5vdCBmaW5kIGFuIE5nTW9kdWxlLyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmaW5kTW9kdWxlRnJvbU9wdGlvbnMnLCAoKSA9PiB7XG4gICAgbGV0IHRyZWU6IFRyZWU7XG4gICAgbGV0IG9wdGlvbnM6IE1vZHVsZU9wdGlvbnM7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB0cmVlID0gbmV3IEVtcHR5VHJlZSgpO1xuICAgICAgb3B0aW9ucyA9IHsgbmFtZTogJ2ZvbycgfTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZmluZCBhIG1vZHVsZScsICgpID0+IHtcbiAgICAgIHRyZWUuY3JlYXRlKCcvcHJvamVjdHMvbXktcHJvai9zcmMvYXBwLm1vZHVsZS50cycsICcnKTtcbiAgICAgIG9wdGlvbnMubW9kdWxlID0gJ2FwcC5tb2R1bGUudHMnO1xuICAgICAgb3B0aW9ucy5wYXRoID0gJy9wcm9qZWN0cy9teS1wcm9qL3NyYyc7XG4gICAgICBjb25zdCBtb2RQYXRoID0gZmluZE1vZHVsZUZyb21PcHRpb25zKHRyZWUsIG9wdGlvbnMpO1xuICAgICAgZXhwZWN0KG1vZFBhdGgpLnRvRXF1YWwoJy9wcm9qZWN0cy9teS1wcm9qL3NyYy9hcHAubW9kdWxlLnRzJyBhcyBQYXRoKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgZmluZCBhIG1vZHVsZSBpbiBhIHN1YiBkaXInLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZSgnL3Byb2plY3RzL215LXByb2ovc3JjL2FkbWluL2Zvby5tb2R1bGUudHMnLCAnJyk7XG4gICAgICBvcHRpb25zLm5hbWUgPSAnb3RoZXIvdGVzdCc7XG4gICAgICBvcHRpb25zLm1vZHVsZSA9ICdhZG1pbi9mb28nO1xuICAgICAgb3B0aW9ucy5wYXRoID0gJy9wcm9qZWN0cy9teS1wcm9qL3NyYyc7XG4gICAgICBjb25zdCBtb2RQYXRoID0gZmluZE1vZHVsZUZyb21PcHRpb25zKHRyZWUsIG9wdGlvbnMpO1xuICAgICAgZXhwZWN0KG1vZFBhdGgpLnRvRXF1YWwoJy9wcm9qZWN0cy9teS1wcm9qL3NyYy9hZG1pbi9mb28ubW9kdWxlLnRzJyBhcyBQYXRoKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==