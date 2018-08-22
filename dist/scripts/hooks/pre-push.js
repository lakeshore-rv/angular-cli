"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const validate_commits_1 = require("../validate-commits");
const emptySha = '0'.repeat(40);
function default_1(_, logger) {
    // Work on POSIX and Windows
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
    rl.on('line', line => {
        const [, localSha, , remoteSha] = line.split(/\s+/);
        if (localSha == emptySha) {
            // Deleted branch.
            return;
        }
        if (remoteSha == emptySha) {
            // New branch.
            validate_commits_1.default({ base: localSha }, logger);
        }
        else {
            validate_commits_1.default({ base: remoteSha, head: localSha }, logger);
        }
    });
    rl.on('end', () => process.exit(0));
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlLXB1c2guanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInNjcmlwdHMvaG9va3MvcHJlLXB1c2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxxQ0FBcUM7QUFDckMsMERBQWtEO0FBR2xELE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFHaEMsbUJBQXlCLENBQUssRUFBRSxNQUFzQjtJQUNwRCw0QkFBNEI7SUFDNUIsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztRQUNsQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7UUFDcEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1FBQ3RCLFFBQVEsRUFBRSxLQUFLO0tBQ2hCLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ25CLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxBQUFELEVBQUcsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVwRCxJQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUU7WUFDeEIsa0JBQWtCO1lBQ2xCLE9BQU87U0FDUjtRQUVELElBQUksU0FBUyxJQUFJLFFBQVEsRUFBRTtZQUN6QixjQUFjO1lBQ2QsMEJBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUM3QzthQUFNO1lBQ0wsMEJBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzlEO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQXhCRCw0QkF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnlcbi8vIHRzbGludDpkaXNhYmxlOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgbG9nZ2luZyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCAqIGFzIHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcbmltcG9ydCB2YWxpZGF0ZUNvbW1pdHMgZnJvbSAnLi4vdmFsaWRhdGUtY29tbWl0cyc7XG5cblxuY29uc3QgZW1wdHlTaGEgPSAnMCcucmVwZWF0KDQwKTtcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoXzoge30sIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXIpIHtcbiAgLy8gV29yayBvbiBQT1NJWCBhbmQgV2luZG93c1xuICBjb25zdCBybCA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XG4gICAgaW5wdXQ6IHByb2Nlc3Muc3RkaW4sXG4gICAgb3V0cHV0OiBwcm9jZXNzLnN0ZG91dCxcbiAgICB0ZXJtaW5hbDogZmFsc2UsXG4gIH0pO1xuXG4gIHJsLm9uKCdsaW5lJywgbGluZSA9PiB7XG4gICAgY29uc3QgWywgbG9jYWxTaGEsICwgcmVtb3RlU2hhXSA9IGxpbmUuc3BsaXQoL1xccysvKTtcblxuICAgIGlmIChsb2NhbFNoYSA9PSBlbXB0eVNoYSkge1xuICAgICAgLy8gRGVsZXRlZCBicmFuY2guXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHJlbW90ZVNoYSA9PSBlbXB0eVNoYSkge1xuICAgICAgLy8gTmV3IGJyYW5jaC5cbiAgICAgIHZhbGlkYXRlQ29tbWl0cyh7IGJhc2U6IGxvY2FsU2hhIH0sIGxvZ2dlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbGlkYXRlQ29tbWl0cyh7IGJhc2U6IHJlbW90ZVNoYSwgaGVhZDogbG9jYWxTaGEgfSwgbG9nZ2VyKTtcbiAgICB9XG4gIH0pO1xuICBybC5vbignZW5kJywgKCkgPT4gcHJvY2Vzcy5leGl0KDApKTtcbn1cbiJdfQ==