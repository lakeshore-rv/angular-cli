"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-implicit-dependencies
const core_1 = require("@angular-devkit/core");
const json_schema_1 = require("@ngtools/json-schema");
const fs = require("fs");
function buildSchema(inFile, mimetype) {
    const jsonSchema = JSON.parse(fs.readFileSync(inFile, 'utf-8'));
    const SchemaClass = json_schema_1.SchemaClassFactory(jsonSchema);
    const schemaInstance = new SchemaClass({});
    let name = inFile.split(/[\/\\]/g).pop();
    if (name) {
        name = core_1.strings.classify(name.replace(/\.[^.]*$/, ''));
    }
    const license = `/**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    `.replace(/^ {4}/gm, '');
    return license + schemaInstance.$$serialize(mimetype, name);
}
exports.buildSchema = buildSchema;
function default_1(opts, logger) {
    const inFile = opts._[0];
    const outFile = opts._[1];
    const mimetype = opts.mimetype || 'text/x.dts';
    if (!inFile) {
        logger.fatal('Command serialize needs an input file.');
    }
    else {
        const output = buildSchema(inFile, mimetype);
        if (outFile) {
            fs.writeFileSync(outFile, output, { encoding: 'utf-8' });
        }
        else {
            logger.info(output);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9lcm5pZWRhdmlzL0NvZGUvYW5ndWxhci1jbGkvIiwic291cmNlcyI6WyJzY3JpcHRzL3NlcmlhbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDBDQUEwQztBQUMxQywrQ0FBd0Q7QUFDeEQsc0RBQTBEO0FBQzFELHlCQUF5QjtBQUd6QixxQkFBNEIsTUFBYyxFQUFFLFFBQWdCO0lBQzFELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNoRSxNQUFNLFdBQVcsR0FBRyxnQ0FBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRCxNQUFNLGNBQWMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUUzQyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLElBQUksSUFBSSxFQUFFO1FBQ1IsSUFBSSxHQUFHLGNBQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN2RDtJQUVELE1BQU0sT0FBTyxHQUFHOzs7Ozs7OztLQVFiLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUUzQixPQUFPLE9BQU8sR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBckJELGtDQXFCQztBQUdELG1CQUF3QixJQUF3QyxFQUFFLE1BQXNCO0lBQ3RGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFXLENBQUM7SUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQVcsQ0FBQztJQUNwQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLFlBQVksQ0FBQztJQUUvQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQ3hEO1NBQU07UUFDTCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLElBQUksT0FBTyxFQUFFO1lBQ1gsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDMUQ7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckI7S0FDRjtBQUNILENBQUM7QUFmRCw0QkFlQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgbG9nZ2luZywgc3RyaW5ncyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IFNjaGVtYUNsYXNzRmFjdG9yeSB9IGZyb20gJ0BuZ3Rvb2xzL2pzb24tc2NoZW1hJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcblxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTY2hlbWEoaW5GaWxlOiBzdHJpbmcsIG1pbWV0eXBlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBqc29uU2NoZW1hID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoaW5GaWxlLCAndXRmLTgnKSk7XG4gIGNvbnN0IFNjaGVtYUNsYXNzID0gU2NoZW1hQ2xhc3NGYWN0b3J5KGpzb25TY2hlbWEpO1xuICBjb25zdCBzY2hlbWFJbnN0YW5jZSA9IG5ldyBTY2hlbWFDbGFzcyh7fSk7XG5cbiAgbGV0IG5hbWUgPSBpbkZpbGUuc3BsaXQoL1tcXC9cXFxcXS9nKS5wb3AoKTtcbiAgaWYgKG5hbWUpIHtcbiAgICBuYW1lID0gc3RyaW5ncy5jbGFzc2lmeShuYW1lLnJlcGxhY2UoL1xcLlteLl0qJC8sICcnKSk7XG4gIH1cblxuICBjb25zdCBsaWNlbnNlID0gYC8qKlxuICAgICAqIEBsaWNlbnNlXG4gICAgICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gICAgICpcbiAgICAgKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICAgICAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAgICAgKi9cblxuICAgIGAucmVwbGFjZSgvXiB7NH0vZ20sICcnKTtcblxuICByZXR1cm4gbGljZW5zZSArIHNjaGVtYUluc3RhbmNlLiQkc2VyaWFsaXplKG1pbWV0eXBlLCBuYW1lKTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvcHRzOiB7IF86IHN0cmluZ1tdLCBtaW1ldHlwZT86IHN0cmluZyB9LCBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyKSB7XG4gIGNvbnN0IGluRmlsZSA9IG9wdHMuX1swXSBhcyBzdHJpbmc7XG4gIGNvbnN0IG91dEZpbGUgPSBvcHRzLl9bMV0gYXMgc3RyaW5nO1xuICBjb25zdCBtaW1ldHlwZSA9IG9wdHMubWltZXR5cGUgfHwgJ3RleHQveC5kdHMnO1xuXG4gIGlmICghaW5GaWxlKSB7XG4gICAgbG9nZ2VyLmZhdGFsKCdDb21tYW5kIHNlcmlhbGl6ZSBuZWVkcyBhbiBpbnB1dCBmaWxlLicpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IG91dHB1dCA9IGJ1aWxkU2NoZW1hKGluRmlsZSwgbWltZXR5cGUpO1xuICAgIGlmIChvdXRGaWxlKSB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG91dEZpbGUsIG91dHB1dCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nZ2VyLmluZm8ob3V0cHV0KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==