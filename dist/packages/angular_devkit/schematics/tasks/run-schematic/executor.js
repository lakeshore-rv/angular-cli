"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return (options, context) => {
        const maybeWorkflow = context.engine.workflow;
        const collection = options.collection || context.schematic.collection.description.name;
        if (!maybeWorkflow) {
            throw new Error('Need Workflow to support executing schematics as post tasks.');
        }
        return maybeWorkflow.execute({
            collection: collection,
            schematic: options.name,
            options: options.options,
            // Allow private when calling from the same collection.
            allowPrivate: collection == context.schematic.collection.description.name,
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MvcnVuLXNjaGVtYXRpYy9leGVjdXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdBO0lBQ0UsT0FBTyxDQUFDLE9BQW9DLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQ3pFLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQzlDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztRQUV2RixJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQztTQUNqRjtRQUVELE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUMzQixVQUFVLEVBQUUsVUFBVTtZQUN0QixTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDdkIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQ3hCLHVEQUF1RDtZQUN2RCxZQUFZLEVBQUUsVUFBVSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJO1NBQzFFLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNKLENBQUM7QUFqQkQsNEJBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgU2NoZW1hdGljQ29udGV4dCwgVGFza0V4ZWN1dG9yIH0gZnJvbSAnLi4vLi4vc3JjJztcbmltcG9ydCB7IFJ1blNjaGVtYXRpY1Rhc2tPcHRpb25zIH0gZnJvbSAnLi9vcHRpb25zJztcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpOiBUYXNrRXhlY3V0b3I8UnVuU2NoZW1hdGljVGFza09wdGlvbnM8e30+PiB7XG4gIHJldHVybiAob3B0aW9uczogUnVuU2NoZW1hdGljVGFza09wdGlvbnM8e30+LCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgbWF5YmVXb3JrZmxvdyA9IGNvbnRleHQuZW5naW5lLndvcmtmbG93O1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBvcHRpb25zLmNvbGxlY3Rpb24gfHwgY29udGV4dC5zY2hlbWF0aWMuY29sbGVjdGlvbi5kZXNjcmlwdGlvbi5uYW1lO1xuXG4gICAgaWYgKCFtYXliZVdvcmtmbG93KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05lZWQgV29ya2Zsb3cgdG8gc3VwcG9ydCBleGVjdXRpbmcgc2NoZW1hdGljcyBhcyBwb3N0IHRhc2tzLicpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXliZVdvcmtmbG93LmV4ZWN1dGUoe1xuICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbixcbiAgICAgIHNjaGVtYXRpYzogb3B0aW9ucy5uYW1lLFxuICAgICAgb3B0aW9uczogb3B0aW9ucy5vcHRpb25zLFxuICAgICAgLy8gQWxsb3cgcHJpdmF0ZSB3aGVuIGNhbGxpbmcgZnJvbSB0aGUgc2FtZSBjb2xsZWN0aW9uLlxuICAgICAgYWxsb3dQcml2YXRlOiBjb2xsZWN0aW9uID09IGNvbnRleHQuc2NoZW1hdGljLmNvbGxlY3Rpb24uZGVzY3JpcHRpb24ubmFtZSxcbiAgICB9KTtcbiAgfTtcbn1cbiJdfQ==