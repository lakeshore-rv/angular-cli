"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('../lib/bootstrap-local');
const path = require('path');
const spdxSatisfies = require('spdx-satisfies');
/**
 * A general note on some black listed specific licenses:
 * - CC0
 *    This is not a valid license. It does not grant copyright of the code/asset, and does not
 *    resolve patents or other licensed work. The different claims also have no standing in court
 *    and do not provide protection to or from Google and/or third parties.
 *    We cannot use nor contribute to CC0 licenses.
 * - Public Domain
 *    Same as CC0, it is not a valid license.
 */
const licensesWhitelist = [
    // Regular valid open source licenses supported by Google.
    'MIT',
    'ISC',
    'Apache-2.0',
    'BSD-2-Clause',
    'BSD-3-Clause',
    'BSD-4-Clause',
    // All CC-BY licenses have a full copyright grant and attribution section.
    'CC-BY-3.0',
    'CC-BY-4.0',
    // Have a full copyright grant. Validated by opensource team.
    'Unlicense',
    // Combinations.
    '(AFL-2.1 OR BSD-2-Clause)',
    '(MIT OR CC-BY-3.0)',
    '(MIT OR Apache-2.0)',
    '(MIT OR BSD-3-Clause)',
];
// Name variations of SPDX licenses that some packages have.
// Licenses not included in SPDX but accepted will be converted to MIT.
const licenseReplacements = {
    // Just a longer string that our script catches. SPDX official name is the shorter one.
    'Apache License, Version 2.0': 'Apache-2.0',
    'Apache2': 'Apache-2.0',
    'Apache 2.0': 'Apache-2.0',
    'Apache v2': 'Apache-2.0',
    'AFLv2.1': 'AFL-2.1',
    // BSD is BSD-2-clause by default.
    'BSD': 'BSD-2-Clause',
};
// Specific packages to ignore, add a reason in a comment. Format: package-name@version.
const ignoredPackages = [
    'spdx-license-ids@2.0.1',
    'spdx-license-ids@3.0.0',
    'map-stream@0.1.0',
    'xmldom@0.1.27',
    'true-case-path@1.0.2',
    'pako@1.0.6',
    'jsonify@0.0.0',
    // so hard to manage. In talk with owner and users to switch over.
    'uws@0.14.5',
    // TODO(filipesilva): remove this when spec_large is moved to e2e tests.
    'font-awesome@4.7.0',
    '@webassemblyjs/ieee754@1.5.10',
    '@webassemblyjs/leb128@1.5.10',
    '@webassemblyjs/leb128@1.4.3',
    'tslint-sonarts@1.7.0',
];
// Find all folders directly under a `node_modules` that have a package.json.
const checker = require('license-checker');
// Check if a license is accepted by an array of accepted licenses
function _passesSpdx(licenses, accepted) {
    return accepted.some(l => {
        try {
            return spdxSatisfies(licenses.join(' AND '), l);
        }
        catch (_) {
            return false;
        }
    });
}
function default_1(_options, logger) {
    return new Promise(resolve => {
        checker.init({ start: path.join(__dirname, '..') }, (err, json) => {
            if (err) {
                logger.fatal(`Something happened:\n${err.message}`);
                resolve(1);
            }
            else {
                logger.info(`Testing ${Object.keys(json).length} packages.\n`);
                // Packages with bad licenses are those that neither pass SPDX nor are ignored.
                const badLicensePackages = Object.keys(json)
                    .map(key => ({
                    id: key,
                    licenses: []
                        // tslint:disable-next-line:non-null-operator
                        .concat(json[key].licenses)
                        // `*` is used when the license is guessed.
                        .map(x => x.replace(/\*$/, ''))
                        .map(x => x in licenseReplacements ? licenseReplacements[x] : x),
                }))
                    .filter(pkg => !_passesSpdx(pkg.licenses, licensesWhitelist))
                    .filter(pkg => !ignoredPackages.find(ignored => ignored === pkg.id));
                // Report packages with bad licenses
                if (badLicensePackages.length > 0) {
                    logger.error('Invalid package licences found:');
                    badLicensePackages.forEach(pkg => {
                        logger.error(`${pkg.id}: ${JSON.stringify(pkg.licenses)}`);
                    });
                    logger.fatal(`\n${badLicensePackages.length} total packages with invalid licenses.`);
                    resolve(2);
                }
                else {
                    logger.info('All package licenses are valid.');
                    resolve(0);
                }
            }
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtbGljZW5zZXMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2VybmllZGF2aXMvQ29kZS9hbmd1bGFyLWNsaS8iLCJzb3VyY2VzIjpbInNjcmlwdHMvdmFsaWRhdGUtbGljZW5zZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUVsQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFHaEQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxpQkFBaUIsR0FBRztJQUN4QiwwREFBMEQ7SUFDMUQsS0FBSztJQUNMLEtBQUs7SUFDTCxZQUFZO0lBRVosY0FBYztJQUNkLGNBQWM7SUFDZCxjQUFjO0lBRWQsMEVBQTBFO0lBQzFFLFdBQVc7SUFDWCxXQUFXO0lBRVgsNkRBQTZEO0lBQzdELFdBQVc7SUFFWCxnQkFBZ0I7SUFDaEIsMkJBQTJCO0lBQzNCLG9CQUFvQjtJQUNwQixxQkFBcUI7SUFDckIsdUJBQXVCO0NBQ3hCLENBQUM7QUFFRiw0REFBNEQ7QUFDNUQsdUVBQXVFO0FBQ3ZFLE1BQU0sbUJBQW1CLEdBQThCO0lBQ3JELHVGQUF1RjtJQUN2Riw2QkFBNkIsRUFBRSxZQUFZO0lBQzNDLFNBQVMsRUFBRSxZQUFZO0lBQ3ZCLFlBQVksRUFBRSxZQUFZO0lBQzFCLFdBQVcsRUFBRSxZQUFZO0lBQ3pCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLGtDQUFrQztJQUNsQyxLQUFLLEVBQUUsY0FBYztDQUN0QixDQUFDO0FBRUYsd0ZBQXdGO0FBQ3hGLE1BQU0sZUFBZSxHQUFHO0lBQ3RCLHdCQUF3QjtJQUN4Qix3QkFBd0I7SUFDeEIsa0JBQWtCO0lBQ2xCLGVBQWU7SUFDZixzQkFBc0I7SUFDdEIsWUFBWTtJQUVaLGVBQWU7SUFDRSxrRUFBa0U7SUFFbkYsWUFBWTtJQUNaLHdFQUF3RTtJ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LENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ1o7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO29CQUMvQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ1o7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBdENELDRCQXNDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgSnNvbk9iamVjdCwgbG9nZ2luZyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcblxucmVxdWlyZSgnLi4vbGliL2Jvb3RzdHJhcC1sb2NhbCcpO1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3Qgc3BkeFNhdGlzZmllcyA9IHJlcXVpcmUoJ3NwZHgtc2F0aXNmaWVzJyk7XG5cblxuLyoqXG4gKiBBIGdlbmVyYWwgbm90ZSBvbiBzb21lIGJsYWNrIGxpc3RlZCBzcGVjaWZpYyBsaWNlbnNlczpcbiAqIC0gQ0MwXG4gKiAgICBUaGlzIGlzIG5vdCBhIHZhbGlkIGxpY2Vuc2UuIEl0IGRvZXMgbm90IGdyYW50IGNvcHlyaWdodCBvZiB0aGUgY29kZS9hc3NldCwgYW5kIGRvZXMgbm90XG4gKiAgICByZXNvbHZlIHBhdGVudHMgb3Igb3RoZXIgbGljZW5zZWQgd29yay4gVGhlIGRpZmZlcmVudCBjbGFpbXMgYWxzbyBoYXZlIG5vIHN0YW5kaW5nIGluIGNvdXJ0XG4gKiAgICBhbmQgZG8gbm90IHByb3ZpZGUgcHJvdGVjdGlvbiB0byBvciBmcm9tIEdvb2dsZSBhbmQvb3IgdGhpcmQgcGFydGllcy5cbiAqICAgIFdlIGNhbm5vdCB1c2Ugbm9yIGNvbnRyaWJ1dGUgdG8gQ0MwIGxpY2Vuc2VzLlxuICogLSBQdWJsaWMgRG9tYWluXG4gKiAgICBTYW1lIGFzIENDMCwgaXQgaXMgbm90IGEgdmFsaWQgbGljZW5zZS5cbiAqL1xuY29uc3QgbGljZW5zZXNXaGl0ZWxpc3QgPSBbXG4gIC8vIFJlZ3VsYXIgdmFsaWQgb3BlbiBzb3VyY2UgbGljZW5zZXMgc3VwcG9ydGVkIGJ5IEdvb2dsZS5cbiAgJ01JVCcsXG4gICdJU0MnLFxuICAnQXBhY2hlLTIuMCcsXG5cbiAgJ0JTRC0yLUNsYXVzZScsXG4gICdCU0QtMy1DbGF1c2UnLFxuICAnQlNELTQtQ2xhdXNlJyxcblxuICAvLyBBbGwgQ0MtQlkgbGljZW5zZXMgaGF2ZSBhIGZ1bGwgY29weXJpZ2h0IGdyYW50IGFuZCBhdHRyaWJ1dGlvbiBzZWN0aW9uLlxuICAnQ0MtQlktMy4wJyxcbiAgJ0NDLUJZLTQuMCcsXG5cbiAgLy8gSGF2ZSBhIGZ1bGwgY29weXJpZ2h0IGdyYW50LiBWYWxpZGF0ZWQgYnkgb3BlbnNvdXJjZSB0ZWFtLlxuICAnVW5saWNlbnNlJyxcblxuICAvLyBDb21iaW5hdGlvbnMuXG4gICcoQUZMLTIuMSBPUiBCU0QtMi1DbGF1c2UpJyxcbiAgJyhNSVQgT1IgQ0MtQlktMy4wKScsXG4gICcoTUlUIE9SIEFwYWNoZS0yLjApJyxcbiAgJyhNSVQgT1IgQlNELTMtQ2xhdXNlKScsXG5dO1xuXG4vLyBOYW1lIHZhcmlhdGlvbnMgb2YgU1BEWCBsaWNlbnNlcyB0aGF0IHNvbWUgcGFja2FnZXMgaGF2ZS5cbi8vIExpY2Vuc2VzIG5vdCBpbmNsdWRlZCBpbiBTUERYIGJ1dCBhY2NlcHRlZCB3aWxsIGJlIGNvbnZlcnRlZCB0byBNSVQuXG5jb25zdCBsaWNlbnNlUmVwbGFjZW1lbnRzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge1xuICAvLyBKdXN0IGEgbG9uZ2VyIHN0cmluZyB0aGF0IG91ciBzY3JpcHQgY2F0Y2hlcy4gU1BEWCBvZmZpY2lhbCBuYW1lIGlzIHRoZSBzaG9ydGVyIG9uZS5cbiAgJ0FwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCc6ICdBcGFjaGUtMi4wJyxcbiAgJ0FwYWNoZTInOiAnQXBhY2hlLTIuMCcsXG4gICdBcGFjaGUgMi4wJzogJ0FwYWNoZS0yLjAnLFxuICAnQXBhY2hlIHYyJzogJ0FwYWNoZS0yLjAnLFxuICAnQUZMdjIuMSc6ICdBRkwtMi4xJyxcbiAgLy8gQlNEIGlzIEJTRC0yLWNsYXVzZSBieSBkZWZhdWx0LlxuICAnQlNEJzogJ0JTRC0yLUNsYXVzZScsXG59O1xuXG4vLyBTcGVjaWZpYyBwYWNrYWdlcyB0byBpZ25vcmUsIGFkZCBhIHJlYXNvbiBpbiBhIGNvbW1lbnQuIEZvcm1hdDogcGFja2FnZS1uYW1lQHZlcnNpb24uXG5jb25zdCBpZ25vcmVkUGFja2FnZXMgPSBbXG4gICdzcGR4LWxpY2Vuc2UtaWRzQDIuMC4xJywgIC8vIENDMCBidXQgaXQncyBjb250ZW50IG9ubHkgKGluZGV4Lmpzb24sIG5vIGNvZGUpIGFuZCBub3QgZGlzdHJpYnV0ZWQuXG4gICdzcGR4LWxpY2Vuc2UtaWRzQDMuMC4wJywgIC8vIENDMCBidXQgaXQncyBjb250ZW50IG9ubHkgKGluZGV4Lmpzb24sIG5vIGNvZGUpIGFuZCBub3QgZGlzdHJpYnV0ZWQuXG4gICdtYXAtc3RyZWFtQDAuMS4wJywgLy8gTUlULCBsaWNlbnNlIGJ1dCBpdCdzIG5vdCBsaXN0ZWQgaW4gcGFja2FnZS5qc29uLlxuICAneG1sZG9tQDAuMS4yNycsIC8vIExHUEwsTUlUIGJ1dCBoYXMgYSBicm9rZW4gbGljZW5zZXMgYXJyYXkuXG4gICd0cnVlLWNhc2UtcGF0aEAxLjAuMicsIC8vIEFwYWNoZS0yLjAgYnV0IGJyb2tlbiBsaWNlbnNlIGluIHBhY2thZ2UuanNvblxuICAncGFrb0AxLjAuNicsIC8vIE1JVCBidXQgYnJva2VuIGxpY2Vuc2UgaW4gcGFja2FnZS5qc29uXG5cbiAgJ2pzb25pZnlAMC4wLjAnLCAvLyBUT0RPKGhhbnNsKTogZml4IHRoaXMuIHRoaXMgaXMgbm90IGFuIGFjY2VwdGFibGUgbGljZW5zZSwgYnV0IGlzIDggZGVwcyBkb3duXG4gICAgICAgICAgICAgICAgICAgLy8gc28gaGFyZCB0byBtYW5hZ2UuIEluIHRhbGsgd2l0aCBvd25lciBhbmQgdXNlcnMgdG8gc3dpdGNoIG92ZXIuXG5cbiAgJ3V3c0AwLjE0LjUnLCAvLyBUT0RPKGZpbGlwZXNpbHZhKTogcmVtb3ZlIHRoaXMgd2hlbiBrYXJtYSBpcyBtb3ZlZCB0byBlMmUgdGVzdHMuXG4gIC8vIFRPRE8oZmlsaXBlc2lsdmEpOiByZW1vdmUgdGhpcyB3aGVuIHNwZWNfbGFyZ2UgaXMgbW92ZWQgdG8gZTJlIHRlc3RzLlxuICAnZm9udC1hd2Vzb21lQDQuNy4wJywgLy8gKE9GTC0xLjEgQU5EIE1JVClcblxuICAnQHdlYmFzc2VtYmx5anMvaWVlZTc1NEAxLjUuMTAnLCAvLyBNSVQgYnV0IG5vIExJQ0VOU0UgZmlsZS4gYGxpY2Vuc2VgIGZpZWxkIGluIHBhY2thZ2UuanNvbi5cbiAgJ0B3ZWJhc3NlbWJseWpzL2xlYjEyOEAxLjUuMTAnLCAvLyBBcGFjaGUgMi4wIGxpY2Vuc2UsIGJ1dCBnZXQgZGlzY292ZXJlZCBhcyBcIkFwYWNoZVwiLlxuICAnQHdlYmFzc2VtYmx5anMvbGViMTI4QDEuNC4zJywgLy8gQXBhY2hlIDIuMCBsaWNlbnNlLCBidXQgZ2V0IGRpc2NvdmVyZWQgYXMgXCJBcGFjaGVcIi5cblxuICAndHNsaW50LXNvbmFydHNAMS43LjAnLCAvLyBMR1BMLTMuMCBidXQgb25seSB1c2VkIGFzIGEgdG9vbCwgbm90IGxpbmtlZCBpbiB0aGUgYnVpbGQuXG5dO1xuXG4vLyBGaW5kIGFsbCBmb2xkZXJzIGRpcmVjdGx5IHVuZGVyIGEgYG5vZGVfbW9kdWxlc2AgdGhhdCBoYXZlIGEgcGFja2FnZS5qc29uLlxuY29uc3QgY2hlY2tlciA9IHJlcXVpcmUoJ2xpY2Vuc2UtY2hlY2tlcicpO1xuXG5cbi8vIENoZWNrIGlmIGEgbGljZW5zZSBpcyBhY2NlcHRlZCBieSBhbiBhcnJheSBvZiBhY2NlcHRlZCBsaWNlbnNlc1xuZnVuY3Rpb24gX3Bhc3Nlc1NwZHgobGljZW5zZXM6IHN0cmluZ1tdLCBhY2NlcHRlZDogc3RyaW5nW10pIHtcbiAgcmV0dXJuIGFjY2VwdGVkLnNvbWUobCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBzcGR4U2F0aXNmaWVzKGxpY2Vuc2VzLmpvaW4oJyBBTkQgJyksIGwpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChfb3B0aW9uczoge30sIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgY2hlY2tlci5pbml0KHsgc3RhcnQ6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicpIH0sIChlcnI6IEVycm9yLCBqc29uOiBKc29uT2JqZWN0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGxvZ2dlci5mYXRhbChgU29tZXRoaW5nIGhhcHBlbmVkOlxcbiR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgICAgIHJlc29sdmUoMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuaW5mbyhgVGVzdGluZyAke09iamVjdC5rZXlzKGpzb24pLmxlbmd0aH0gcGFja2FnZXMuXFxuYCk7XG5cbiAgICAgICAgLy8gUGFja2FnZXMgd2l0aCBiYWQgbGljZW5zZXMgYXJlIHRob3NlIHRoYXQgbmVpdGhlciBwYXNzIFNQRFggbm9yIGFyZSBpZ25vcmVkLlxuICAgICAgICBjb25zdCBiYWRMaWNlbnNlUGFja2FnZXMgPSBPYmplY3Qua2V5cyhqc29uKVxuICAgICAgICAgIC5tYXAoa2V5ID0+ICh7XG4gICAgICAgICAgICBpZDoga2V5LFxuICAgICAgICAgICAgbGljZW5zZXM6IChbXSBhcyBzdHJpbmdbXSlcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vbi1udWxsLW9wZXJhdG9yXG4gICAgICAgICAgICAgIC5jb25jYXQoKGpzb25ba2V5XSAhIGFzIEpzb25PYmplY3QpLmxpY2Vuc2VzIGFzIHN0cmluZ1tdKVxuICAgICAgICAgICAgICAvLyBgKmAgaXMgdXNlZCB3aGVuIHRoZSBsaWNlbnNlIGlzIGd1ZXNzZWQuXG4gICAgICAgICAgICAgIC5tYXAoeCA9PiB4LnJlcGxhY2UoL1xcKiQvLCAnJykpXG4gICAgICAgICAgICAgIC5tYXAoeCA9PiB4IGluIGxpY2Vuc2VSZXBsYWNlbWVudHMgPyBsaWNlbnNlUmVwbGFjZW1lbnRzW3hdIDogeCksXG4gICAgICAgICAgfSkpXG4gICAgICAgICAgLmZpbHRlcihwa2cgPT4gIV9wYXNzZXNTcGR4KHBrZy5saWNlbnNlcywgbGljZW5zZXNXaGl0ZWxpc3QpKVxuICAgICAgICAgIC5maWx0ZXIocGtnID0+ICFpZ25vcmVkUGFja2FnZXMuZmluZChpZ25vcmVkID0+IGlnbm9yZWQgPT09IHBrZy5pZCkpO1xuXG4gICAgICAgIC8vIFJlcG9ydCBwYWNrYWdlcyB3aXRoIGJhZCBsaWNlbnNlc1xuICAgICAgICBpZiAoYmFkTGljZW5zZVBhY2thZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0ludmFsaWQgcGFja2FnZSBsaWNlbmNlcyBmb3VuZDonKTtcbiAgICAgICAgICBiYWRMaWNlbnNlUGFja2FnZXMuZm9yRWFjaChwa2cgPT4ge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGAke3BrZy5pZH06ICR7SlNPTi5zdHJpbmdpZnkocGtnLmxpY2Vuc2VzKX1gKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBsb2dnZXIuZmF0YWwoYFxcbiR7YmFkTGljZW5zZVBhY2thZ2VzLmxlbmd0aH0gdG90YWwgcGFja2FnZXMgd2l0aCBpbnZhbGlkIGxpY2Vuc2VzLmApO1xuICAgICAgICAgIHJlc29sdmUoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ0FsbCBwYWNrYWdlIGxpY2Vuc2VzIGFyZSB2YWxpZC4nKTtcbiAgICAgICAgICByZXNvbHZlKDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIl19