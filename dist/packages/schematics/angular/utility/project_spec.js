"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("./project");
describe('project', () => {
    describe('buildDefaultPath', () => {
        let project;
        beforeEach(() => {
            project = {
                projectType: 'application',
                root: 'foo',
                prefix: 'app',
            };
        });
        it('should handle projectType of application', () => {
            const result = project_1.buildDefaultPath(project);
            expect(result).toEqual('/foo/src/app');
        });
        it('should handle projectType of library', () => {
            project = Object.assign({}, project, { projectType: 'library' });
            const result = project_1.buildDefaultPath(project);
            expect(result).toEqual('/foo/src/lib');
        });
        it('should handle sourceRoot', () => {
            project = Object.assign({}, project, { sourceRoot: 'foo/bar/custom' });
            const result = project_1.buildDefaultPath(project);
            expect(result).toEqual('/foo/bar/custom/app');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdF9zcGVjLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJwYWNrYWdlcy9zY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9wcm9qZWN0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSx1Q0FBNkM7QUFHN0MsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxJQUFJLE9BQXlCLENBQUM7UUFDOUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLE9BQU8sR0FBRztnQkFDUixXQUFXLEVBQUUsYUFBYTtnQkFDMUIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsTUFBTSxFQUFFLEtBQUs7YUFDZCxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELE1BQU0sTUFBTSxHQUFHLDBCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLE9BQU8scUJBQVEsT0FBTyxJQUFFLFdBQVcsRUFBRSxTQUFTLEdBQUUsQ0FBQztZQUNqRCxNQUFNLE1BQU0sR0FBRywwQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtZQUNsQyxPQUFPLHFCQUFRLE9BQU8sSUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEdBQUUsQ0FBQztZQUN2RCxNQUFNLE1BQU0sR0FBRywwQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgV29ya3NwYWNlUHJvamVjdCB9IGZyb20gJy4uL3V0aWxpdHkvY29uZmlnJztcbmltcG9ydCB7IGJ1aWxkRGVmYXVsdFBhdGggfSBmcm9tICcuL3Byb2plY3QnO1xuXG5cbmRlc2NyaWJlKCdwcm9qZWN0JywgKCkgPT4ge1xuICBkZXNjcmliZSgnYnVpbGREZWZhdWx0UGF0aCcsICgpID0+IHtcbiAgICBsZXQgcHJvamVjdDogV29ya3NwYWNlUHJvamVjdDtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHByb2plY3QgPSB7XG4gICAgICAgIHByb2plY3RUeXBlOiAnYXBwbGljYXRpb24nLFxuICAgICAgICByb290OiAnZm9vJyxcbiAgICAgICAgcHJlZml4OiAnYXBwJyxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwcm9qZWN0VHlwZSBvZiBhcHBsaWNhdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJ1aWxkRGVmYXVsdFBhdGgocHJvamVjdCk7XG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKCcvZm9vL3NyYy9hcHAnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHByb2plY3RUeXBlIG9mIGxpYnJhcnknLCAoKSA9PiB7XG4gICAgICBwcm9qZWN0ID0geyAuLi5wcm9qZWN0LCBwcm9qZWN0VHlwZTogJ2xpYnJhcnknIH07XG4gICAgICBjb25zdCByZXN1bHQgPSBidWlsZERlZmF1bHRQYXRoKHByb2plY3QpO1xuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCgnL2Zvby9zcmMvbGliJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzb3VyY2VSb290JywgKCkgPT4ge1xuICAgICAgcHJvamVjdCA9IHsgLi4ucHJvamVjdCwgc291cmNlUm9vdDogJ2Zvby9iYXIvY3VzdG9tJyB9O1xuICAgICAgY29uc3QgcmVzdWx0ID0gYnVpbGREZWZhdWx0UGF0aChwcm9qZWN0KTtcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoJy9mb28vYmFyL2N1c3RvbS9hcHAnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==