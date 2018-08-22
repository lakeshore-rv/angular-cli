"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const semver = require("semver");
const packages_1 = require("../lib/packages");
const monorepo = require('../.monorepo.json');
function _showVersions(logger) {
    for (const pkgName of Object.keys(packages_1.packages)) {
        const pkg = packages_1.packages[pkgName];
        const version = pkg.version || '???';
        const hash = pkg.hash;
        const diff = pkg.dirty ? '!' : '';
        const pad1 = '                                  '.slice(pkgName.length);
        const pad2 = '                 '.slice(version.length);
        const message = `${pkgName} ${pad1}v${version}${pad2}${hash} ${diff}`;
        if (pkg.private) {
            logger.debug(message);
        }
        else {
            logger.info(message);
        }
    }
}
function _upgrade(release, force, logger) {
    for (const pkg of Object.keys(packages_1.packages)) {
        const hash = packages_1.packages[pkg].hash;
        const version = packages_1.packages[pkg].version;
        const dirty = packages_1.packages[pkg].dirty || force;
        let newVersion = version;
        if (release == 'minor-beta') {
            if (dirty) {
                if (version.match(/-beta\.\d+$/)) {
                    newVersion = semver.inc(version, 'prerelease');
                }
                else {
                    newVersion = semver.inc(version, 'minor') + '-beta.0';
                }
            }
        }
        else if (release == 'minor-rc') {
            if (dirty) {
                if (version.match(/-rc/)) {
                    newVersion = semver.inc(version, 'prerelease');
                }
                else if (version.match(/-beta\.\d+$/)) {
                    newVersion = version.replace(/-beta\.\d+$/, '-rc.0');
                }
                else {
                    newVersion = semver.inc(version, 'minor') + '-rc.0';
                }
            }
        }
        else if (release == 'major-beta') {
            if (dirty) {
                if (version.match(/-beta\.\d+$/)) {
                    newVersion = semver.inc(version, 'prerelease');
                }
                else {
                    newVersion = semver.inc(version, 'major') + '-beta.0';
                }
            }
        }
        else if (release == 'major-rc') {
            if (dirty) {
                if (version.match(/-rc/)) {
                    newVersion = semver.inc(version, 'prerelease');
                }
                else if (version.match(/-beta\.\d+$/)) {
                    newVersion = version.replace(/-beta\.\d+$/, '-rc.0');
                }
                else {
                    newVersion = semver.inc(version, 'major') + '-rc.0';
                }
            }
        }
        else if (dirty || release !== 'patch') {
            newVersion = semver.inc(version, release);
        }
        let message = '';
        if (!(pkg in monorepo.packages)) {
            message = `${pkg} is new... setting v${newVersion}`;
            monorepo.packages[pkg] = {
                version: newVersion,
                hash: hash,
            };
        }
        else if (newVersion && version !== newVersion) {
            message = `${pkg} changed... updating v${version} => v${newVersion}`;
            monorepo.packages[pkg].version = newVersion;
            monorepo.packages[pkg].hash = hash;
        }
        else {
            message = `${pkg} SAME: v${version}`;
        }
        if (packages_1.packages[pkg].private) {
            logger.debug(message);
        }
        else {
            logger.info(message);
        }
    }
}
function default_1(args, logger) {
    const maybeRelease = args._.shift();
    const dryRun = args['dry-run'] !== undefined;
    switch (maybeRelease) {
        case undefined:
            _showVersions(logger);
            process.exit(0);
            break;
        case 'major-beta':
        case 'major-rc':
        case 'minor-beta':
        case 'minor-rc':
        case 'major':
        case 'minor':
        case 'patch':
            _upgrade(maybeRelease, args.force || false, logger);
            if (!dryRun) {
                fs.writeFileSync(path.join(__dirname, '../.monorepo.json'), JSON.stringify(monorepo, null, 2) + '\n');
            }
            process.exit(0);
            break;
    }
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsZWFzZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsic2NyaXB0cy9yZWxlYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixpQ0FBaUM7QUFFakMsOENBQTJDO0FBRzNDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRzlDLHVCQUF1QixNQUFzQjtJQUMzQyxLQUFLLE1BQU0sT0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQVEsQ0FBQyxFQUFFO1FBQzNDLE1BQU0sR0FBRyxHQUFHLG1CQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUN0QixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVsQyxNQUFNLElBQUksR0FBRyxvQ0FBb0MsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkQsTUFBTSxPQUFPLEdBQUcsR0FBRyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3RFLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtZQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEI7S0FD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O1FBQ2xCLEtBQUssVUFBVSxDQUFDO1FBQ2hCLEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxPQUFPLENBQUM7UUFDYixLQUFLLE9BQU87WUFDVixRQUFRLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxFQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDNUQ7WUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU07S0FDVDtBQUNILENBQUM7QUF4QkQsNEJBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGU6bm8taW1wbGljaXQtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBsb2dnaW5nIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHsgUmVsZWFzZVR5cGUgfSBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHsgcGFja2FnZXMgfSBmcm9tICcuLi9saWIvcGFja2FnZXMnO1xuXG5cbmNvbnN0IG1vbm9yZXBvID0gcmVxdWlyZSgnLi4vLm1vbm9yZXBvLmpzb24nKTtcblxuXG5mdW5jdGlvbiBfc2hvd1ZlcnNpb25zKGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXIpIHtcbiAgZm9yIChjb25zdCBwa2dOYW1lIG9mIE9iamVjdC5rZXlzKHBhY2thZ2VzKSkge1xuICAgIGNvbnN0IHBrZyA9IHBhY2thZ2VzW3BrZ05hbWVdO1xuXG4gICAgY29uc3QgdmVyc2lvbiA9IHBrZy52ZXJzaW9uIHx8ICc/Pz8nO1xuICAgIGNvbnN0IGhhc2ggPSBwa2cuaGFzaDtcbiAgICBjb25zdCBkaWZmID0gcGtnLmRpcnR5ID8gJyEnIDogJyc7XG5cbiAgICBjb25zdCBwYWQxID0gJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnLnNsaWNlKHBrZ05hbWUubGVuZ3RoKTtcbiAgICBjb25zdCBwYWQyID0gJyAgICAgICAgICAgICAgICAgJy5zbGljZSh2ZXJzaW9uLmxlbmd0aCk7XG4gICAgY29uc3QgbWVzc2FnZSA9IGAke3BrZ05hbWV9ICR7cGFkMX12JHt2ZXJzaW9ufSR7cGFkMn0ke2hhc2h9ICR7ZGlmZn1gO1xuICAgIGlmIChwa2cucHJpdmF0ZSkge1xuICAgICAgbG9nZ2VyLmRlYnVnKG1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIuaW5mbyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBfdXBncmFkZShyZWxlYXNlOiBzdHJpbmcsIGZvcmNlOiBib29sZWFuLCBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyKSB7XG4gIGZvciAoY29uc3QgcGtnIG9mIE9iamVjdC5rZXlzKHBhY2thZ2VzKSkge1xuICAgIGNvbnN0IGhhc2ggPSBwYWNrYWdlc1twa2ddLmhhc2g7XG4gICAgY29uc3QgdmVyc2lvbiA9IHBhY2thZ2VzW3BrZ10udmVyc2lvbjtcbiAgICBjb25zdCBkaXJ0eSA9IHBhY2thZ2VzW3BrZ10uZGlydHkgfHwgZm9yY2U7XG4gICAgbGV0IG5ld1ZlcnNpb246IHN0cmluZyB8IG51bGwgPSB2ZXJzaW9uO1xuXG4gICAgaWYgKHJlbGVhc2UgPT0gJ21pbm9yLWJldGEnKSB7XG4gICAgICBpZiAoZGlydHkpIHtcbiAgICAgICAgaWYgKHZlcnNpb24ubWF0Y2goLy1iZXRhXFwuXFxkKyQvKSkge1xuICAgICAgICAgIG5ld1ZlcnNpb24gPSBzZW12ZXIuaW5jKHZlcnNpb24sICdwcmVyZWxlYXNlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmVyc2lvbiA9IHNlbXZlci5pbmModmVyc2lvbiwgJ21pbm9yJykgKyAnLWJldGEuMCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlbGVhc2UgPT0gJ21pbm9yLXJjJykge1xuICAgICAgaWYgKGRpcnR5KSB7XG4gICAgICAgIGlmICh2ZXJzaW9uLm1hdGNoKC8tcmMvKSkge1xuICAgICAgICAgIG5ld1ZlcnNpb24gPSBzZW12ZXIuaW5jKHZlcnNpb24sICdwcmVyZWxlYXNlJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodmVyc2lvbi5tYXRjaCgvLWJldGFcXC5cXGQrJC8pKSB7XG4gICAgICAgICAgbmV3VmVyc2lvbiA9IHZlcnNpb24ucmVwbGFjZSgvLWJldGFcXC5cXGQrJC8sICctcmMuMCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZlcnNpb24gPSBzZW12ZXIuaW5jKHZlcnNpb24sICdtaW5vcicpICsgJy1yYy4wJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVsZWFzZSA9PSAnbWFqb3ItYmV0YScpIHtcbiAgICAgIGlmIChkaXJ0eSkge1xuICAgICAgICBpZiAodmVyc2lvbi5tYXRjaCgvLWJldGFcXC5cXGQrJC8pKSB7XG4gICAgICAgICAgbmV3VmVyc2lvbiA9IHNlbXZlci5pbmModmVyc2lvbiwgJ3ByZXJlbGVhc2UnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWZXJzaW9uID0gc2VtdmVyLmluYyh2ZXJzaW9uLCAnbWFqb3InKSArICctYmV0YS4wJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVsZWFzZSA9PSAnbWFqb3ItcmMnKSB7XG4gICAgICBpZiAoZGlydHkpIHtcbiAgICAgICAgaWYgKHZlcnNpb24ubWF0Y2goLy1yYy8pKSB7XG4gICAgICAgICAgbmV3VmVyc2lvbiA9IHNlbXZlci5pbmModmVyc2lvbiwgJ3ByZXJlbGVhc2UnKTtcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJzaW9uLm1hdGNoKC8tYmV0YVxcLlxcZCskLykpIHtcbiAgICAgICAgICBuZXdWZXJzaW9uID0gdmVyc2lvbi5yZXBsYWNlKC8tYmV0YVxcLlxcZCskLywgJy1yYy4wJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmVyc2lvbiA9IHNlbXZlci5pbmModmVyc2lvbiwgJ21ham9yJykgKyAnLXJjLjAnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkaXJ0eSB8fCByZWxlYXNlICE9PSAncGF0Y2gnKSB7XG4gICAgICBuZXdWZXJzaW9uID0gc2VtdmVyLmluYyh2ZXJzaW9uLCByZWxlYXNlIGFzIFJlbGVhc2VUeXBlKTtcbiAgICB9XG5cbiAgICBsZXQgbWVzc2FnZSA9ICcnO1xuICAgIGlmICghKHBrZyBpbiBtb25vcmVwby5wYWNrYWdlcykpIHtcbiAgICAgIG1lc3NhZ2UgPSBgJHtwa2d9IGlzIG5ldy4uLiBzZXR0aW5nIHYke25ld1ZlcnNpb259YDtcbiAgICAgIG1vbm9yZXBvLnBhY2thZ2VzW3BrZ10gPSB7XG4gICAgICAgIHZlcnNpb246IG5ld1ZlcnNpb24sXG4gICAgICAgIGhhc2g6IGhhc2gsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAobmV3VmVyc2lvbiAmJiB2ZXJzaW9uICE9PSBuZXdWZXJzaW9uKSB7XG4gICAgICBtZXNzYWdlID0gYCR7cGtnfSBjaGFuZ2VkLi4uIHVwZGF0aW5nIHYke3ZlcnNpb259ID0+IHYke25ld1ZlcnNpb259YDtcbiAgICAgIG1vbm9yZXBvLnBhY2thZ2VzW3BrZ10udmVyc2lvbiA9IG5ld1ZlcnNpb247XG4gICAgICBtb25vcmVwby5wYWNrYWdlc1twa2ddLmhhc2ggPSBoYXNoO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlID0gYCR7cGtnfSBTQU1FOiB2JHt2ZXJzaW9ufWA7XG4gICAgfVxuXG4gICAgaWYgKHBhY2thZ2VzW3BrZ10ucHJpdmF0ZSkge1xuICAgICAgbG9nZ2VyLmRlYnVnKG1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIuaW5mbyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIFJlbGVhc2VPcHRpb25zIHtcbiAgXzogc3RyaW5nW107XG4gICdmb3JjZSc/OiBib29sZWFuO1xuICAnZHJ5LXJ1bic/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhcmdzOiBSZWxlYXNlT3B0aW9ucywgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlcikge1xuICBjb25zdCBtYXliZVJlbGVhc2UgPSBhcmdzLl8uc2hpZnQoKTtcbiAgY29uc3QgZHJ5UnVuID0gYXJnc1snZHJ5LXJ1biddICE9PSB1bmRlZmluZWQ7XG4gIHN3aXRjaCAobWF5YmVSZWxlYXNlKSB7XG4gICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICBfc2hvd1ZlcnNpb25zKGxvZ2dlcik7XG4gICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ21ham9yLWJldGEnOlxuICAgIGNhc2UgJ21ham9yLXJjJzpcbiAgICBjYXNlICdtaW5vci1iZXRhJzpcbiAgICBjYXNlICdtaW5vci1yYyc6XG4gICAgY2FzZSAnbWFqb3InOlxuICAgIGNhc2UgJ21pbm9yJzpcbiAgICBjYXNlICdwYXRjaCc6XG4gICAgICBfdXBncmFkZShtYXliZVJlbGVhc2UsIGFyZ3MuZm9yY2UgfHwgZmFsc2UsIGxvZ2dlcik7XG4gICAgICBpZiAoIWRyeVJ1bikge1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8ubW9ub3JlcG8uanNvbicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KG1vbm9yZXBvLCBudWxsLCAyKSArICdcXG4nKTtcbiAgICAgIH1cbiAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICAgIGJyZWFrO1xuICB9XG59XG4iXX0=