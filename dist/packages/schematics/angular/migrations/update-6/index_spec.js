"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
const latest_versions_1 = require("../../utility/latest-versions");
describe('Migration to v6', () => {
    const schematicRunner = new testing_1.SchematicTestRunner('migrations', path.join(__dirname, '../migration-collection.json'));
    // tslint:disable-next-line:no-any
    let baseConfig;
    const defaultOptions = {};
    let tree;
    const oldConfigPath = `/.angular-cli.json`;
    const configPath = `/angular.json`;
    beforeEach(() => {
        baseConfig = {
            schema: './node_modules/@angular/cli/lib/config/schema.json',
            project: {
                name: 'foo',
            },
            apps: [
                {
                    root: 'src',
                    outDir: 'dist',
                    assets: [
                        'assets',
                        'favicon.ico',
                        { glob: '**/*', input: './assets/', output: './assets/' },
                        { glob: 'favicon.ico', input: './', output: './' },
                        {
                            'glob': '**/*.*',
                            'input': '../server/',
                            'output': '../',
                            'allowOutsideOutDir': true,
                        },
                    ],
                    index: 'index.html',
                    main: 'main.ts',
                    polyfills: 'polyfills.ts',
                    test: 'test.ts',
                    tsconfig: 'tsconfig.app.json',
                    testTsconfig: 'tsconfig.spec.json',
                    prefix: 'app',
                    styles: [
                        'styles.css',
                    ],
                    stylePreprocessorOptions: {
                        includePaths: [
                            'styleInc',
                        ],
                    },
                    scripts: [],
                    environmentSource: 'environments/environment.ts',
                    environments: {
                        dev: 'environments/environment.ts',
                        prod: 'environments/environment.prod.ts',
                    },
                },
            ],
            e2e: {
                protractor: {
                    config: './protractor.conf.js',
                },
            },
            lint: [
                {
                    project: 'src/tsconfig.app.json',
                    exclude: '**/node_modules/**',
                },
                {
                    project: 'src/tsconfig.spec.json',
                    exclude: '**/node_modules/**',
                },
                {
                    project: 'e2e/tsconfig.e2e.json',
                    exclude: '**/node_modules/**',
                },
            ],
            test: {
                karma: {
                    config: './karma.conf.js',
                },
            },
            defaults: {
                styleExt: 'css',
                build: {
                    namedChunks: true,
                },
                serve: {
                    port: 8080,
                },
            },
        };
        tree = new testing_1.UnitTestTree(new schematics_1.EmptyTree());
        const packageJson = {
            devDependencies: {},
        };
        tree.create('/package.json', JSON.stringify(packageJson, null, 2));
        // Create a prod environment.
        tree.create('/src/environments/environment.prod.ts', `
      export const environment = {
        production: true
      };
    `);
        tree.create('/src/favicon.ico', '');
    });
    // tslint:disable-next-line:no-any
    function getConfig(tree) {
        return JSON.parse(tree.readContent(configPath));
    }
    describe('file creation/deletion', () => {
        it('should delete the old config file', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            expect(tree.exists(oldConfigPath)).toEqual(false);
        });
        it('should create the new config file', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            expect(tree.exists(configPath)).toEqual(true);
        });
    });
    describe('config file contents', () => {
        it('should set root values', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const config = getConfig(tree);
            expect(config.version).toEqual(1);
            expect(config.newProjectRoot).toEqual('projects');
            expect(config.defaultProject).toEqual('foo');
        });
        describe('schematics', () => {
            it('should define schematics collection root', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                expect(config.schematics['@schematics/angular:component']).toBeDefined();
            });
            function getSchematicConfig(host, name) {
                return getConfig(host).schematics['@schematics/angular:' + name];
            }
            describe('component config', () => {
                it('should move prefix', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.prefix).toEqual('app');
                });
                it('should move styleExt to component', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.styleext).toEqual('css');
                });
                it('should move inlineStyle', () => {
                    baseConfig.defaults.component = { inlineStyle: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.inlineStyle).toEqual(true);
                });
                it('should not move inlineStyle if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.inlineStyle).toBeUndefined();
                });
                it('should move inlineTemplate', () => {
                    baseConfig.defaults.component = { inlineTemplate: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.inlineTemplate).toEqual(true);
                });
                it('should not move inlineTemplate if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.inlineTemplate).toBeUndefined();
                });
                it('should move flat', () => {
                    baseConfig.defaults.component = { flat: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.flat).toEqual(true);
                });
                it('should not move flat if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.flat).toBeUndefined();
                });
                it('should move spec', () => {
                    baseConfig.defaults.component = { spec: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.spec).toEqual(true);
                });
                it('should not move spec if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.spec).toBeUndefined();
                });
                it('should move viewEncapsulation', () => {
                    baseConfig.defaults.component = { viewEncapsulation: 'Native' };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.viewEncapsulation).toEqual('Native');
                });
                it('should not move viewEncapsulation if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.viewEncapsulation).toBeUndefined();
                });
                it('should move changeDetection', () => {
                    baseConfig.defaults.component = { changeDetection: 'OnPush' };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.changeDetection).toEqual('OnPush');
                });
                it('should not move changeDetection if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'component');
                    expect(config.changeDetection).toBeUndefined();
                });
            });
            describe('directive config', () => {
                it('should move prefix', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'directive');
                    expect(config.prefix).toEqual('app');
                });
                it('should move flat', () => {
                    baseConfig.defaults.directive = { flat: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'directive');
                    expect(config.flat).toEqual(true);
                });
                it('should not move flat if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'directive');
                    expect(config.flat).toBeUndefined();
                });
                it('should move spec', () => {
                    baseConfig.defaults.directive = { spec: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'directive');
                    expect(config.spec).toEqual(true);
                });
                it('should not move spec if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'directive');
                    expect(config.spec).toBeUndefined();
                });
            });
            describe('class config', () => {
                it('should move spec', () => {
                    baseConfig.defaults.class = { spec: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'class');
                    expect(config.spec).toEqual(true);
                });
                it('should not move spec if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'class');
                    expect(config).toBeUndefined();
                });
            });
            describe('guard config', () => {
                it('should move flat', () => {
                    baseConfig.defaults.guard = { flat: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'guard');
                    expect(config.flat).toEqual(true);
                });
                it('should not move flat if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'guard');
                    expect(config).toBeUndefined();
                });
                it('should move spec', () => {
                    baseConfig.defaults.guard = { spec: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'guard');
                    expect(config.spec).toEqual(true);
                });
                it('should not move spec if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'guard');
                    expect(config).toBeUndefined();
                });
            });
            describe('interface config', () => {
                it('should move flat', () => {
                    baseConfig.defaults.interface = { prefix: 'I' };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'interface');
                    expect(config.prefix).toEqual('I');
                });
                it('should not move flat if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'interface');
                    expect(config).toBeUndefined();
                });
            });
            describe('module config', () => {
                it('should move flat', () => {
                    baseConfig.defaults.module = { flat: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'module');
                    expect(config.flat).toEqual(true);
                });
                it('should not move flat if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'module');
                    expect(config).toBeUndefined();
                });
                it('should move spec', () => {
                    baseConfig.defaults.module = { spec: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'module');
                    expect(config.spec).toEqual(true);
                });
                it('should not move spec if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'module');
                    expect(config).toBeUndefined();
                });
            });
            describe('pipe config', () => {
                it('should move flat', () => {
                    baseConfig.defaults.pipe = { flat: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'pipe');
                    expect(config.flat).toEqual(true);
                });
                it('should not move flat if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'pipe');
                    expect(config).toBeUndefined();
                });
                it('should move spec', () => {
                    baseConfig.defaults.pipe = { spec: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'pipe');
                    expect(config.spec).toEqual(true);
                });
                it('should not move spec if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'pipe');
                    expect(config).toBeUndefined();
                });
            });
            describe('service config', () => {
                it('should move flat', () => {
                    baseConfig.defaults.service = { flat: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'service');
                    expect(config.flat).toEqual(true);
                });
                it('should not move flat if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'service');
                    expect(config).toBeUndefined();
                });
                it('should move spec', () => {
                    baseConfig.defaults.service = { spec: true };
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'service');
                    expect(config.spec).toEqual(true);
                });
                it('should not move spec if not defined', () => {
                    tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                    tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                    const config = getSchematicConfig(tree, 'service');
                    expect(config).toBeUndefined();
                });
            });
        });
        describe('architect', () => {
            it('should exist', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                expect(config.architect).not.toBeDefined();
            });
        });
        describe('app projects', () => {
            it('should create two projects per app', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                expect(Object.keys(config.projects).length).toEqual(2);
            });
            it('should create two projects per app', () => {
                baseConfig.apps.push(baseConfig.apps[0]);
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                expect(Object.keys(config.projects).length).toEqual(4);
            });
            it('should use the app name if defined', () => {
                baseConfig.apps[0].name = 'foo';
                baseConfig.apps.push(baseConfig.apps[0]);
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                expect(config.projects.foo).toBeDefined();
                expect(config.projects['foo-e2e']).toBeDefined();
            });
            it('should set the project root values', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const project = getConfig(tree).projects.foo;
                expect(project.root).toEqual('');
                expect(project.sourceRoot).toEqual('src');
                expect(project.projectType).toEqual('application');
            });
            it('should set the project root values for a different root', () => {
                baseConfig.apps[0].root = 'apps/app1/src';
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const project = getConfig(tree).projects.foo;
                expect(project.root).toEqual('apps/app1');
                expect(project.sourceRoot).toEqual('apps/app1/src');
                expect(project.projectType).toEqual('application');
            });
            it('should set build target', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const build = getConfig(tree).projects.foo.architect.build;
                expect(build.builder).toEqual('@angular-devkit/build-angular:browser');
                expect(build.options.scripts).toEqual([]);
                expect(build.options.styles).toEqual(['src/styles.css']);
                expect(build.options.stylePreprocessorOptions).toEqual({ includePaths: ['src/styleInc'] });
                expect(build.options.assets).toEqual([
                    'src/assets',
                    'src/favicon.ico',
                    { glob: '**/*', input: 'src/assets', output: '/assets' },
                    { glob: 'favicon.ico', input: 'src', output: '/' },
                ]);
                expect(build.options.namedChunks).toEqual(true);
                expect(build.configurations).toEqual({
                    production: {
                        optimization: true,
                        outputHashing: 'all',
                        sourceMap: false,
                        extractCss: true,
                        namedChunks: false,
                        aot: true,
                        extractLicenses: true,
                        vendorChunk: false,
                        buildOptimizer: true,
                        fileReplacements: [{
                                replace: 'src/environments/environment.ts',
                                with: 'src/environments/environment.prod.ts',
                            }],
                    },
                });
            });
            it('should not set baseHref on build & serve targets if not defined', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const build = getConfig(tree).projects.foo.architect.build;
                expect(build.options.baseHref).toBeUndefined();
            });
            it('should set baseHref on build & serve targets if defined', () => {
                const config = Object.assign({}, baseConfig);
                config.apps[0].baseHref = '/base/href/';
                tree.create(oldConfigPath, JSON.stringify(config, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const build = getConfig(tree).projects.foo.architect.build;
                expect(build.options.baseHref).toEqual('/base/href/');
            });
            it('should add serviceWorker to production configuration', () => {
                baseConfig.apps[0].serviceWorker = true;
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                expect(config.projects.foo.architect.build.options.serviceWorker).toBeUndefined();
                expect(config.projects.foo.architect.build.configurations.production.serviceWorker).toBe(true);
            });
            it('should add production configuration when no environments', () => {
                delete baseConfig.apps[0].environments;
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                expect(config.projects.foo.architect.build.configurations).toEqual({
                    production: {
                        optimization: true,
                        outputHashing: 'all',
                        sourceMap: false,
                        extractCss: true,
                        namedChunks: false,
                        aot: true,
                        extractLicenses: true,
                        vendorChunk: false,
                        buildOptimizer: true,
                    },
                });
            });
            it('should add production configuration when no production environment', () => {
                tree.delete('/src/environments/environment.prod.ts');
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                expect(config.projects.foo.architect.build.configurations).toEqual({
                    prod: {
                        fileReplacements: [{
                                replace: 'src/environments/environment.ts',
                                with: 'src/environments/environment.prod.ts',
                            }],
                    },
                    production: {
                        optimization: true,
                        outputHashing: 'all',
                        sourceMap: false,
                        extractCss: true,
                        namedChunks: false,
                        aot: true,
                        extractLicenses: true,
                        vendorChunk: false,
                        buildOptimizer: true,
                    },
                });
            });
            it('should set the serve target', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const serve = getConfig(tree).projects.foo.architect.serve;
                expect(serve.builder).toEqual('@angular-devkit/build-angular:dev-server');
                expect(serve.options).toEqual({
                    browserTarget: 'foo:build',
                    port: 8080,
                });
                const prodConfig = serve.configurations.production;
                expect(prodConfig.browserTarget).toEqual('foo:build:production');
            });
            it('should set the test target', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const test = getConfig(tree).projects.foo.architect['test'];
                expect(test.builder).toEqual('@angular-devkit/build-angular:karma');
                expect(test.options.main).toEqual('src/test.ts');
                expect(test.options.polyfills).toEqual('src/polyfills.ts');
                expect(test.options.tsConfig).toEqual('src/tsconfig.spec.json');
                expect(test.options.karmaConfig).toEqual('./karma.conf.js');
                expect(test.options.scripts).toEqual([]);
                expect(test.options.styles).toEqual(['src/styles.css']);
                expect(test.options.assets).toEqual([
                    'src/assets',
                    'src/favicon.ico',
                    { glob: '**/*', input: 'src/assets', output: '/assets' },
                    { glob: 'favicon.ico', input: 'src', output: '/' },
                ]);
            });
            it('should set the extract i18n target', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const extract = getConfig(tree).projects.foo.architect['extract-i18n'];
                expect(extract.builder).toEqual('@angular-devkit/build-angular:extract-i18n');
                expect(extract.options).toBeDefined();
                expect(extract.options.browserTarget).toEqual(`foo:build`);
            });
            it('should set the lint target', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const tslint = getConfig(tree).projects.foo.architect['lint'];
                expect(tslint.builder).toEqual('@angular-devkit/build-angular:tslint');
                expect(tslint.options).toBeDefined();
                expect(tslint.options.tsConfig)
                    .toEqual(['src/tsconfig.app.json', 'src/tsconfig.spec.json']);
                expect(tslint.options.exclude).toEqual(['**/node_modules/**']);
            });
            it('should set the budgets configuration', () => {
                baseConfig.apps[0].budgets = [{
                        type: 'bundle',
                        name: 'main',
                        error: '123kb',
                    }];
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const config = getConfig(tree);
                const budgets = config.projects.foo.architect.build.configurations.production.budgets;
                expect(budgets.length).toEqual(1);
                expect(budgets[0].type).toEqual('bundle');
                expect(budgets[0].name).toEqual('main');
                expect(budgets[0].error).toEqual('123kb');
            });
        });
        describe('e2e projects', () => {
            it('should set the project root values', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const e2eProject = getConfig(tree).projects['foo-e2e'];
                expect(e2eProject.root).toBe('e2e');
                expect(e2eProject.sourceRoot).toBe('e2e');
                const e2eOptions = e2eProject.architect.e2e;
                expect(e2eOptions.builder).toEqual('@angular-devkit/build-angular:protractor');
                const options = e2eOptions.options;
                expect(options.protractorConfig).toEqual('./protractor.conf.js');
                expect(options.devServerTarget).toEqual('foo:serve');
            });
            it('should set the project root values for a different root', () => {
                baseConfig.apps[0].root = 'apps/app1/src';
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const e2eProject = getConfig(tree).projects['foo-e2e'];
                expect(e2eProject.root).toBe('apps/app1/e2e');
                expect(e2eProject.sourceRoot).toBe('apps/app1/e2e');
                const e2eOptions = e2eProject.architect.e2e;
                expect(e2eOptions.builder).toEqual('@angular-devkit/build-angular:protractor');
                const options = e2eOptions.options;
                expect(options.protractorConfig).toEqual('./protractor.conf.js');
                expect(options.devServerTarget).toEqual('foo:serve');
            });
            it('should set the lint target', () => {
                tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
                tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
                const tslint = getConfig(tree).projects['foo-e2e'].architect.lint;
                expect(tslint.builder).toEqual('@angular-devkit/build-angular:tslint');
                expect(tslint.options).toBeDefined();
                expect(tslint.options.tsConfig).toEqual(['e2e/tsconfig.e2e.json']);
                expect(tslint.options.exclude).toEqual(['**/node_modules/**']);
            });
        });
    });
    describe('karma config', () => {
        const karmaPath = '/karma.conf.js';
        beforeEach(() => {
            tree.create(karmaPath, `
        // @angular/cli
        // reports
      `);
        });
        it('should replace references to "@angular/cli"', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent(karmaPath);
            expect(content).not.toContain('@angular/cli');
            expect(content).toContain('@angular-devkit/build-angular');
        });
        it('should replace references to "reports"', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent(karmaPath);
            expect(content).toContain(`dir: require('path').join(__dirname, 'coverage'), reports`);
        });
        it('should remove unused properties in 1.0 configs', () => {
            tree.overwrite(karmaPath, `
        files: [
          { pattern: './src/test.ts', watched: false }
        ],
        preprocessors: {
          './src/test.ts': ['@angular/cli']
        },
        angularCli: {
          environment: 'dev'
        },
      `);
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent(karmaPath);
            expect(content).not.toContain(`{ pattern: './src/test.ts', watched: false }`);
            expect(content).not.toContain(`'./src/test.ts': ['@angular/cli']`);
            expect(content).not.toMatch(/angularCli[^}]*},?/);
        });
    });
    describe('spec ts config', () => {
        const testTsconfigPath = '/src/tsconfig.spec.json';
        beforeEach(() => {
            tree.create(testTsconfigPath, `
        {
          "files": [ "test.ts" ]
        }
      `);
        });
        it('should add polyfills', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent(testTsconfigPath);
            expect(content).toContain('polyfills.ts');
            const config = JSON.parse(content);
            expect(config.files.length).toEqual(2);
            expect(config.files[1]).toEqual('polyfills.ts');
        });
        it('should not add polyfills it if it already exists', () => {
            tree.overwrite(testTsconfigPath, `
        {
          "files": [ "test.ts", "polyfills.ts" ]
        }
      `);
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent(testTsconfigPath);
            expect(content).toContain('polyfills.ts');
            const config = JSON.parse(content);
            expect(config.files.length).toEqual(2);
        });
    });
    describe('root ts config', () => {
        const rootTsConfig = '/tsconfig.json';
        let compilerOptions;
        beforeEach(() => {
            tree.create(rootTsConfig, `
        {
          "compilerOptions": {
            "noEmitOnError": true
          }
        }
      `);
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent(rootTsConfig);
            compilerOptions = JSON.parse(content).compilerOptions;
        });
        it('should add baseUrl', () => {
            expect(compilerOptions.baseUrl).toEqual('./');
        });
        it('should add module', () => {
            expect(compilerOptions.module).toEqual('es2015');
        });
        it('should not remove existing options', () => {
            expect(compilerOptions.noEmitOnError).toBeDefined();
        });
    });
    describe('package.json', () => {
        it('should add a dev dependency to @angular-devkit/build-angular', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent('/package.json');
            const pkg = JSON.parse(content);
            expect(pkg.devDependencies['@angular-devkit/build-angular'])
                .toBe(latest_versions_1.latestVersions.DevkitBuildAngular);
        });
        it('should add a dev dependency to @angular-devkit/build-angular (present)', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree.overwrite('/package.json', JSON.stringify({
                devDependencies: {
                    '@angular-devkit/build-angular': '0.0.0',
                },
            }, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent('/package.json');
            const pkg = JSON.parse(content);
            expect(pkg.devDependencies['@angular-devkit/build-angular'])
                .toBe(latest_versions_1.latestVersions.DevkitBuildAngular);
        });
        it('should add a dev dependency to @angular-devkit/build-angular (no dev)', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree.overwrite('/package.json', JSON.stringify({}, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const content = tree.readContent('/package.json');
            const pkg = JSON.parse(content);
            expect(pkg.devDependencies['@angular-devkit/build-angular'])
                .toBe(latest_versions_1.latestVersions.DevkitBuildAngular);
        });
    });
    describe('tslint.json', () => {
        const tslintPath = '/tslint.json';
        // tslint:disable-next-line:no-any
        let tslintConfig;
        beforeEach(() => {
            tslintConfig = {
                rules: {
                    'import-blacklist': ['some', 'rxjs', 'else'],
                },
            };
        });
        it('should remove "rxjs" from the "import-blacklist" rule', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree.create(tslintPath, JSON.stringify(tslintConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const tslint = JSON.parse(tree.readContent(tslintPath));
            expect(tslint.rules['import-blacklist']).toEqual(['some', 'else']);
        });
        it('should remove "rxjs" from the "import-blacklist" rule (only)', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tslintConfig.rules['import-blacklist'] = ['rxjs'];
            tree.create(tslintPath, JSON.stringify(tslintConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const tslint = JSON.parse(tree.readContent(tslintPath));
            expect(tslint.rules['import-blacklist']).toEqual([]);
        });
        it('should remove "rxjs" from the "import-blacklist" rule (first)', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tslintConfig.rules['import-blacklist'] = ['rxjs', 'else'];
            tree.create(tslintPath, JSON.stringify(tslintConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const tslint = JSON.parse(tree.readContent(tslintPath));
            expect(tslint.rules['import-blacklist']).toEqual(['else']);
        });
        it('should remove "rxjs" from the "import-blacklist" rule (last)', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tslintConfig.rules['import-blacklist'] = ['some', 'rxjs'];
            tree.create(tslintPath, JSON.stringify(tslintConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const tslint = JSON.parse(tree.readContent(tslintPath));
            expect(tslint.rules['import-blacklist']).toEqual(['some']);
        });
        it('should work if "rxjs" is not in the "import-blacklist" rule', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tslintConfig.rules['import-blacklist'] = [];
            tree.create(tslintPath, JSON.stringify(tslintConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const tslint = JSON.parse(tree.readContent(tslintPath));
            const blacklist = tslint.rules['import-blacklist'];
            expect(blacklist).toEqual([]);
        });
    });
    describe('server/universal apps', () => {
        let serverApp;
        beforeEach(() => {
            serverApp = {
                platform: 'server',
                root: 'src',
                outDir: 'dist/server',
                assets: [
                    'assets',
                    'favicon.ico',
                ],
                index: 'index.html',
                main: 'main.server.ts',
                test: 'test.ts',
                tsconfig: 'tsconfig.server.json',
                testTsconfig: 'tsconfig.spec.json',
                prefix: 'app',
                styles: [
                    'styles.css',
                ],
                scripts: [],
                environmentSource: 'environments/environment.ts',
                environments: {
                    dev: 'environments/environment.ts',
                    prod: 'environments/environment.prod.ts',
                },
            };
            baseConfig.apps.push(serverApp);
        });
        it('should not create a separate app for server apps', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const config = getConfig(tree);
            const appCount = Object.keys(config.projects).length;
            expect(appCount).toEqual(2);
        });
        it('should create a server target', () => {
            tree.create(oldConfigPath, JSON.stringify(baseConfig, null, 2));
            tree = schematicRunner.runSchematic('migration-01', defaultOptions, tree);
            const config = getConfig(tree);
            const target = config.projects.foo.architect.server;
            expect(target).toBeDefined();
            expect(target.builder).toEqual('@angular-devkit/build-angular:server');
            expect(target.options.outputPath).toEqual('dist/server');
            expect(target.options.main).toEqual('main.server.ts');
            expect(target.options.tsConfig).toEqual('tsconfig.server.json');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvZXJuaWVkYXZpcy9Db2RlL2FuZ3VsYXItY2xpLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL21pZ3JhdGlvbnMvdXBkYXRlLTYvaW5kZXhfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVNBLDJEQUF1RDtBQUN2RCxnRUFBdUY7QUFDdkYsNkJBQTZCO0FBQzdCLG1FQUErRDtBQUcvRCxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLE1BQU0sZUFBZSxHQUFHLElBQUksNkJBQW1CLENBQzdDLFlBQVksRUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSw4QkFBOEIsQ0FBQyxDQUNyRCxDQUFDO0lBRUYsa0NBQWtDO0lBQ2xDLElBQUksVUFBZSxDQUFDO0lBQ3BCLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUMxQixJQUFJLElBQWtCLENBQUM7SUFDdkIsTUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUM7SUFDM0MsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDO0lBRW5DLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxVQUFVLEdBQUc7WUFDWCxNQUFNLEVBQUUsb0RBQW9EO1lBQzVELE9BQU8sRUFBRTtnQkFDUCxJQUFJLEVBQUUsS0FBSzthQUNaO1lBQ0QsSUFBSSxFQUFFO2dCQUNKO29CQUNFLElBQUksRUFBRSxLQUFLO29CQUNYLE1BQU0sRUFBRSxNQUFNO29CQUNkLE1BQU0sRUFBRTt3QkFDTixRQUFRO3dCQUNSLGFBQWE7d0JBQ2IsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTt3QkFDekQsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt3QkFDbEQ7NEJBQ0UsTUFBTSxFQUFF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USxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxJQUFJLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN6RCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1iaWctZnVuY3Rpb25cbmltcG9ydCB7IEpzb25PYmplY3QgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBFbXB0eVRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBTY2hlbWF0aWNUZXN0UnVubmVyLCBVbml0VGVzdFRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90ZXN0aW5nJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBsYXRlc3RWZXJzaW9ucyB9IGZyb20gJy4uLy4uL3V0aWxpdHkvbGF0ZXN0LXZlcnNpb25zJztcblxuXG5kZXNjcmliZSgnTWlncmF0aW9uIHRvIHY2JywgKCkgPT4ge1xuICBjb25zdCBzY2hlbWF0aWNSdW5uZXIgPSBuZXcgU2NoZW1hdGljVGVzdFJ1bm5lcihcbiAgICAnbWlncmF0aW9ucycsXG4gICAgcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL21pZ3JhdGlvbi1jb2xsZWN0aW9uLmpzb24nKSxcbiAgKTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gIGxldCBiYXNlQ29uZmlnOiBhbnk7XG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge307XG4gIGxldCB0cmVlOiBVbml0VGVzdFRyZWU7XG4gIGNvbnN0IG9sZENvbmZpZ1BhdGggPSBgLy5hbmd1bGFyLWNsaS5qc29uYDtcbiAgY29uc3QgY29uZmlnUGF0aCA9IGAvYW5ndWxhci5qc29uYDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBiYXNlQ29uZmlnID0ge1xuICAgICAgc2NoZW1hOiAnLi9ub2RlX21vZHVsZXMvQGFuZ3VsYXIvY2xpL2xpYi9jb25maWcvc2NoZW1hLmpzb24nLFxuICAgICAgcHJvamVjdDoge1xuICAgICAgICBuYW1lOiAnZm9vJyxcbiAgICAgIH0sXG4gICAgICBhcHBzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByb290OiAnc3JjJyxcbiAgICAgICAgICBvdXREaXI6ICdkaXN0JyxcbiAgICAgICAgICBhc3NldHM6IFtcbiAgICAgICAgICAgICdhc3NldHMnLFxuICAgICAgICAgICAgJ2Zhdmljb24uaWNvJyxcbiAgICAgICAgICAgIHsgZ2xvYjogJyoqLyonLCBpbnB1dDogJy4vYXNzZXRzLycsIG91dHB1dDogJy4vYXNzZXRzLycgfSxcbiAgICAgICAgICAgIHsgZ2xvYjogJ2Zhdmljb24uaWNvJywgaW5wdXQ6ICcuLycsIG91dHB1dDogJy4vJyB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnZ2xvYic6ICcqKi8qLionLFxuICAgICAgICAgICAgICAnaW5wdXQnOiAnLi4vc2VydmVyLycsXG4gICAgICAgICAgICAgICdvdXRwdXQnOiAnLi4vJyxcbiAgICAgICAgICAgICAgJ2FsbG93T3V0c2lkZU91dERpcic6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgaW5kZXg6ICdpbmRleC5odG1sJyxcbiAgICAgICAgICBtYWluOiAnbWFpbi50cycsXG4gICAgICAgICAgcG9seWZpbGxzOiAncG9seWZpbGxzLnRzJyxcbiAgICAgICAgICB0ZXN0OiAndGVzdC50cycsXG4gICAgICAgICAgdHNjb25maWc6ICd0c2NvbmZpZy5hcHAuanNvbicsXG4gICAgICAgICAgdGVzdFRzY29uZmlnOiAndHNjb25maWcuc3BlYy5qc29uJyxcbiAgICAgICAgICBwcmVmaXg6ICdhcHAnLFxuICAgICAgICAgIHN0eWxlczogW1xuICAgICAgICAgICAgJ3N0eWxlcy5jc3MnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgc3R5bGVQcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgICAgICBpbmNsdWRlUGF0aHM6IFtcbiAgICAgICAgICAgICAgJ3N0eWxlSW5jJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzY3JpcHRzOiBbXSxcbiAgICAgICAgICBlbnZpcm9ubWVudFNvdXJjZTogJ2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC50cycsXG4gICAgICAgICAgZW52aXJvbm1lbnRzOiB7XG4gICAgICAgICAgICBkZXY6ICdlbnZpcm9ubWVudHMvZW52aXJvbm1lbnQudHMnLFxuICAgICAgICAgICAgcHJvZDogJ2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5wcm9kLnRzJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGUyZToge1xuICAgICAgICBwcm90cmFjdG9yOiB7XG4gICAgICAgICAgY29uZmlnOiAnLi9wcm90cmFjdG9yLmNvbmYuanMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGxpbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb2plY3Q6ICdzcmMvdHNjb25maWcuYXBwLmpzb24nLFxuICAgICAgICAgIGV4Y2x1ZGU6ICcqKi9ub2RlX21vZHVsZXMvKionLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvamVjdDogJ3NyYy90c2NvbmZpZy5zcGVjLmpzb24nLFxuICAgICAgICAgIGV4Y2x1ZGU6ICcqKi9ub2RlX21vZHVsZXMvKionLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvamVjdDogJ2UyZS90c2NvbmZpZy5lMmUuanNvbicsXG4gICAgICAgICAgZXhjbHVkZTogJyoqL25vZGVfbW9kdWxlcy8qKicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgdGVzdDoge1xuICAgICAgICBrYXJtYToge1xuICAgICAgICAgIGNvbmZpZzogJy4va2FybWEuY29uZi5qcycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgc3R5bGVFeHQ6ICdjc3MnLFxuICAgICAgICBidWlsZDoge1xuICAgICAgICAgIG5hbWVkQ2h1bmtzOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBzZXJ2ZToge1xuICAgICAgICAgIHBvcnQ6IDgwODAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdHJlZSA9IG5ldyBVbml0VGVzdFRyZWUobmV3IEVtcHR5VHJlZSgpKTtcbiAgICBjb25zdCBwYWNrYWdlSnNvbiA9IHtcbiAgICAgIGRldkRlcGVuZGVuY2llczoge30sXG4gICAgfTtcbiAgICB0cmVlLmNyZWF0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHBhY2thZ2VKc29uLCBudWxsLCAyKSk7XG5cbiAgICAvLyBDcmVhdGUgYSBwcm9kIGVudmlyb25tZW50LlxuICAgIHRyZWUuY3JlYXRlKCcvc3JjL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5wcm9kLnRzJywgYFxuICAgICAgZXhwb3J0IGNvbnN0IGVudmlyb25tZW50ID0ge1xuICAgICAgICBwcm9kdWN0aW9uOiB0cnVlXG4gICAgICB9O1xuICAgIGApO1xuICAgIHRyZWUuY3JlYXRlKCcvc3JjL2Zhdmljb24uaWNvJywgJycpO1xuICB9KTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gIGZ1bmN0aW9uIGdldENvbmZpZyh0cmVlOiBVbml0VGVzdFRyZWUpOiBhbnkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQoY29uZmlnUGF0aCkpO1xuICB9XG5cbiAgZGVzY3JpYmUoJ2ZpbGUgY3JlYXRpb24vZGVsZXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkZWxldGUgdGhlIG9sZCBjb25maWcgZmlsZScsICgpID0+IHtcbiAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICBleHBlY3QodHJlZS5leGlzdHMob2xkQ29uZmlnUGF0aCkpLnRvRXF1YWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgdGhlIG5ldyBjb25maWcgZmlsZScsICgpID0+IHtcbiAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICBleHBlY3QodHJlZS5leGlzdHMoY29uZmlnUGF0aCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NvbmZpZyBmaWxlIGNvbnRlbnRzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2V0IHJvb3QgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyh0cmVlKTtcbiAgICAgIGV4cGVjdChjb25maWcudmVyc2lvbikudG9FcXVhbCgxKTtcbiAgICAgIGV4cGVjdChjb25maWcubmV3UHJvamVjdFJvb3QpLnRvRXF1YWwoJ3Byb2plY3RzJyk7XG4gICAgICBleHBlY3QoY29uZmlnLmRlZmF1bHRQcm9qZWN0KS50b0VxdWFsKCdmb28nKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdzY2hlbWF0aWNzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBkZWZpbmUgc2NoZW1hdGljcyBjb2xsZWN0aW9uIHJvb3QnLCAoKSA9PiB7XG4gICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKHRyZWUpO1xuICAgICAgICBleHBlY3QoY29uZmlnLnNjaGVtYXRpY3NbJ0BzY2hlbWF0aWNzL2FuZ3VsYXI6Y29tcG9uZW50J10pLnRvQmVEZWZpbmVkKCk7XG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gZ2V0U2NoZW1hdGljQ29uZmlnKGhvc3Q6IFVuaXRUZXN0VHJlZSwgbmFtZTogc3RyaW5nKTogSnNvbk9iamVjdCB7XG4gICAgICAgIHJldHVybiBnZXRDb25maWcoaG9zdCkuc2NoZW1hdGljc1snQHNjaGVtYXRpY3MvYW5ndWxhcjonICsgbmFtZV07XG4gICAgICB9XG5cbiAgICAgIGRlc2NyaWJlKCdjb21wb25lbnQgY29uZmlnJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgcHJlZml4JywgKCkgPT4ge1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnY29tcG9uZW50Jyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5wcmVmaXgpLnRvRXF1YWwoJ2FwcCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgc3R5bGVFeHQgdG8gY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnY29tcG9uZW50Jyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5zdHlsZWV4dCkudG9FcXVhbCgnY3NzJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBpbmxpbmVTdHlsZScsICgpID0+IHtcbiAgICAgICAgICBiYXNlQ29uZmlnLmRlZmF1bHRzLmNvbXBvbmVudCA9IHsgaW5saW5lU3R5bGU6IHRydWUgfTtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ2NvbXBvbmVudCcpO1xuICAgICAgICAgIGV4cGVjdChjb25maWcuaW5saW5lU3R5bGUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vdmUgaW5saW5lU3R5bGUgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdjb21wb25lbnQnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmlubGluZVN0eWxlKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBpbmxpbmVUZW1wbGF0ZScsICgpID0+IHtcbiAgICAgICAgICBiYXNlQ29uZmlnLmRlZmF1bHRzLmNvbXBvbmVudCA9IHsgaW5saW5lVGVtcGxhdGU6IHRydWUgfTtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ2NvbXBvbmVudCcpO1xuICAgICAgICAgIGV4cGVjdChjb25maWcuaW5saW5lVGVtcGxhdGUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vdmUgaW5saW5lVGVtcGxhdGUgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdjb21wb25lbnQnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmlubGluZVRlbXBsYXRlKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBmbGF0JywgKCkgPT4ge1xuICAgICAgICAgIGJhc2VDb25maWcuZGVmYXVsdHMuY29tcG9uZW50ID0geyBmbGF0OiB0cnVlIH07XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdjb21wb25lbnQnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmZsYXQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vdmUgZmxhdCBpZiBub3QgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ2NvbXBvbmVudCcpO1xuICAgICAgICAgIGV4cGVjdChjb25maWcuZmxhdCkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgc3BlYycsICgpID0+IHtcbiAgICAgICAgICBiYXNlQ29uZmlnLmRlZmF1bHRzLmNvbXBvbmVudCA9IHsgc3BlYzogdHJ1ZSB9O1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnY29tcG9uZW50Jyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5zcGVjKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBtb3ZlIHNwZWMgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdjb21wb25lbnQnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLnNwZWMpLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBtb3ZlIHZpZXdFbmNhcHN1bGF0aW9uJywgKCkgPT4ge1xuICAgICAgICAgIGJhc2VDb25maWcuZGVmYXVsdHMuY29tcG9uZW50ID0geyB2aWV3RW5jYXBzdWxhdGlvbjogJ05hdGl2ZScgfTtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ2NvbXBvbmVudCcpO1xuICAgICAgICAgIGV4cGVjdChjb25maWcudmlld0VuY2Fwc3VsYXRpb24pLnRvRXF1YWwoJ05hdGl2ZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBtb3ZlIHZpZXdFbmNhcHN1bGF0aW9uIGlmIG5vdCBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnY29tcG9uZW50Jyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy52aWV3RW5jYXBzdWxhdGlvbikudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgY2hhbmdlRGV0ZWN0aW9uJywgKCkgPT4ge1xuICAgICAgICAgIGJhc2VDb25maWcuZGVmYXVsdHMuY29tcG9uZW50ID0geyBjaGFuZ2VEZXRlY3Rpb246ICdPblB1c2gnIH07XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdjb21wb25lbnQnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmNoYW5nZURldGVjdGlvbikudG9FcXVhbCgnT25QdXNoJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vdmUgY2hhbmdlRGV0ZWN0aW9uIGlmIG5vdCBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnY29tcG9uZW50Jyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5jaGFuZ2VEZXRlY3Rpb24pLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ2RpcmVjdGl2ZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBwcmVmaXgnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdkaXJlY3RpdmUnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLnByZWZpeCkudG9FcXVhbCgnYXBwJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBmbGF0JywgKCkgPT4ge1xuICAgICAgICAgIGJhc2VDb25maWcuZGVmYXVsdHMuZGlyZWN0aXZlID0geyBmbGF0OiB0cnVlIH07XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdkaXJlY3RpdmUnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLmZsYXQpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vdmUgZmxhdCBpZiBub3QgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ2RpcmVjdGl2ZScpO1xuICAgICAgICAgIGV4cGVjdChjb25maWcuZmxhdCkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgc3BlYycsICgpID0+IHtcbiAgICAgICAgICBiYXNlQ29uZmlnLmRlZmF1bHRzLmRpcmVjdGl2ZSA9IHsgc3BlYzogdHJ1ZSB9O1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnZGlyZWN0aXZlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5zcGVjKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBtb3ZlIHNwZWMgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdkaXJlY3RpdmUnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLnNwZWMpLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ2NsYXNzIGNvbmZpZycsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBtb3ZlIHNwZWMnLCAoKSA9PiB7XG4gICAgICAgICAgYmFzZUNvbmZpZy5kZWZhdWx0cy5jbGFzcyA9IHsgc3BlYzogdHJ1ZSB9O1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnY2xhc3MnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLnNwZWMpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vdmUgc3BlYyBpZiBub3QgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ2NsYXNzJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZykudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgnZ3VhcmQgY29uZmlnJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgZmxhdCcsICgpID0+IHtcbiAgICAgICAgICBiYXNlQ29uZmlnLmRlZmF1bHRzLmd1YXJkID0geyBmbGF0OiB0cnVlIH07XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdndWFyZCcpO1xuICAgICAgICAgIGV4cGVjdChjb25maWcuZmxhdCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgbW92ZSBmbGF0IGlmIG5vdCBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnZ3VhcmQnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBzcGVjJywgKCkgPT4ge1xuICAgICAgICAgIGJhc2VDb25maWcuZGVmYXVsdHMuZ3VhcmQgPSB7IHNwZWM6IHRydWUgfTtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ2d1YXJkJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5zcGVjKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBtb3ZlIHNwZWMgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdndWFyZCcpO1xuICAgICAgICAgIGV4cGVjdChjb25maWcpLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ2ludGVyZmFjZSBjb25maWcnLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgbW92ZSBmbGF0JywgKCkgPT4ge1xuICAgICAgICAgIGJhc2VDb25maWcuZGVmYXVsdHMuaW50ZXJmYWNlID0geyBwcmVmaXg6ICdJJyB9O1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnaW50ZXJmYWNlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5wcmVmaXgpLnRvRXF1YWwoJ0knKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgbW92ZSBmbGF0IGlmIG5vdCBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnaW50ZXJmYWNlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZykudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgnbW9kdWxlIGNvbmZpZycsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBtb3ZlIGZsYXQnLCAoKSA9PiB7XG4gICAgICAgICAgYmFzZUNvbmZpZy5kZWZhdWx0cy5tb2R1bGUgPSB7IGZsYXQ6IHRydWUgfTtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ21vZHVsZScpO1xuICAgICAgICAgIGV4cGVjdChjb25maWcuZmxhdCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBub3QgbW92ZSBmbGF0IGlmIG5vdCBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnbW9kdWxlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZykudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgc3BlYycsICgpID0+IHtcbiAgICAgICAgICBiYXNlQ29uZmlnLmRlZmF1bHRzLm1vZHVsZSA9IHsgc3BlYzogdHJ1ZSB9O1xuICAgICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldFNjaGVtYXRpY0NvbmZpZyh0cmVlLCAnbW9kdWxlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5zcGVjKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBtb3ZlIHNwZWMgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdtb2R1bGUnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCdwaXBlIGNvbmZpZycsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBtb3ZlIGZsYXQnLCAoKSA9PiB7XG4gICAgICAgICAgYmFzZUNvbmZpZy5kZWZhdWx0cy5waXBlID0geyBmbGF0OiB0cnVlIH07XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdwaXBlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5mbGF0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBtb3ZlIGZsYXQgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdwaXBlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZykudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgc3BlYycsICgpID0+IHtcbiAgICAgICAgICBiYXNlQ29uZmlnLmRlZmF1bHRzLnBpcGUgPSB7IHNwZWM6IHRydWUgfTtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ3BpcGUnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLnNwZWMpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vdmUgc3BlYyBpZiBub3QgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ3BpcGUnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCdzZXJ2aWNlIGNvbmZpZycsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBtb3ZlIGZsYXQnLCAoKSA9PiB7XG4gICAgICAgICAgYmFzZUNvbmZpZy5kZWZhdWx0cy5zZXJ2aWNlID0geyBmbGF0OiB0cnVlIH07XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdzZXJ2aWNlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZy5mbGF0KS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG5vdCBtb3ZlIGZsYXQgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0U2NoZW1hdGljQ29uZmlnKHRyZWUsICdzZXJ2aWNlJyk7XG4gICAgICAgICAgZXhwZWN0KGNvbmZpZykudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIG1vdmUgc3BlYycsICgpID0+IHtcbiAgICAgICAgICBiYXNlQ29uZmlnLmRlZmF1bHRzLnNlcnZpY2UgPSB7IHNwZWM6IHRydWUgfTtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ3NlcnZpY2UnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnLnNwZWMpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgbm90IG1vdmUgc3BlYyBpZiBub3QgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgICBjb25zdCBjb25maWcgPSBnZXRTY2hlbWF0aWNDb25maWcodHJlZSwgJ3NlcnZpY2UnKTtcbiAgICAgICAgICBleHBlY3QoY29uZmlnKS50b0JlVW5kZWZpbmVkKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYXJjaGl0ZWN0JywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBleGlzdCcsICgpID0+IHtcbiAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcodHJlZSk7XG4gICAgICAgIGV4cGVjdChjb25maWcuYXJjaGl0ZWN0KS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2FwcCBwcm9qZWN0cycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIHR3byBwcm9qZWN0cyBwZXIgYXBwJywgKCkgPT4ge1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyh0cmVlKTtcbiAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGNvbmZpZy5wcm9qZWN0cykubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgY3JlYXRlIHR3byBwcm9qZWN0cyBwZXIgYXBwJywgKCkgPT4ge1xuICAgICAgICBiYXNlQ29uZmlnLmFwcHMucHVzaChiYXNlQ29uZmlnLmFwcHNbMF0pO1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyh0cmVlKTtcbiAgICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKGNvbmZpZy5wcm9qZWN0cykubGVuZ3RoKS50b0VxdWFsKDQpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIHRoZSBhcHAgbmFtZSBpZiBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgICBiYXNlQ29uZmlnLmFwcHNbMF0ubmFtZSA9ICdmb28nO1xuICAgICAgICBiYXNlQ29uZmlnLmFwcHMucHVzaChiYXNlQ29uZmlnLmFwcHNbMF0pO1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyh0cmVlKTtcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5wcm9qZWN0cy5mb28pLnRvQmVEZWZpbmVkKCk7XG4gICAgICAgIGV4cGVjdChjb25maWcucHJvamVjdHNbJ2Zvby1lMmUnXSkudG9CZURlZmluZWQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNldCB0aGUgcHJvamVjdCByb290IHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gZ2V0Q29uZmlnKHRyZWUpLnByb2plY3RzLmZvbztcbiAgICAgICAgZXhwZWN0KHByb2plY3Qucm9vdCkudG9FcXVhbCgnJyk7XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LnNvdXJjZVJvb3QpLnRvRXF1YWwoJ3NyYycpO1xuICAgICAgICBleHBlY3QocHJvamVjdC5wcm9qZWN0VHlwZSkudG9FcXVhbCgnYXBwbGljYXRpb24nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNldCB0aGUgcHJvamVjdCByb290IHZhbHVlcyBmb3IgYSBkaWZmZXJlbnQgcm9vdCcsICgpID0+IHtcbiAgICAgICAgYmFzZUNvbmZpZy5hcHBzWzBdLnJvb3QgPSAnYXBwcy9hcHAxL3NyYyc7XG4gICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IGdldENvbmZpZyh0cmVlKS5wcm9qZWN0cy5mb287XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LnJvb3QpLnRvRXF1YWwoJ2FwcHMvYXBwMScpO1xuICAgICAgICBleHBlY3QocHJvamVjdC5zb3VyY2VSb290KS50b0VxdWFsKCdhcHBzL2FwcDEvc3JjJyk7XG4gICAgICAgIGV4cGVjdChwcm9qZWN0LnByb2plY3RUeXBlKS50b0VxdWFsKCdhcHBsaWNhdGlvbicpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgc2V0IGJ1aWxkIHRhcmdldCcsICgpID0+IHtcbiAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICBjb25zdCBidWlsZCA9IGdldENvbmZpZyh0cmVlKS5wcm9qZWN0cy5mb28uYXJjaGl0ZWN0LmJ1aWxkO1xuICAgICAgICBleHBlY3QoYnVpbGQuYnVpbGRlcikudG9FcXVhbCgnQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXI6YnJvd3NlcicpO1xuICAgICAgICBleHBlY3QoYnVpbGQub3B0aW9ucy5zY3JpcHRzKS50b0VxdWFsKFtdKTtcbiAgICAgICAgZXhwZWN0KGJ1aWxkLm9wdGlvbnMuc3R5bGVzKS50b0VxdWFsKFsnc3JjL3N0eWxlcy5jc3MnXSk7XG4gICAgICAgIGV4cGVjdChidWlsZC5vcHRpb25zLnN0eWxlUHJlcHJvY2Vzc29yT3B0aW9ucykudG9FcXVhbCh7aW5jbHVkZVBhdGhzOiBbJ3NyYy9zdHlsZUluYyddfSk7XG4gICAgICAgIGV4cGVjdChidWlsZC5vcHRpb25zLmFzc2V0cykudG9FcXVhbChbXG4gICAgICAgICAgJ3NyYy9hc3NldHMnLFxuICAgICAgICAgICdzcmMvZmF2aWNvbi5pY28nLFxuICAgICAgICAgIHsgZ2xvYjogJyoqLyonLCBpbnB1dDogJ3NyYy9hc3NldHMnLCBvdXRwdXQ6ICcvYXNzZXRzJyB9LFxuICAgICAgICAgIHsgZ2xvYjogJ2Zhdmljb24uaWNvJywgaW5wdXQ6ICdzcmMnLCBvdXRwdXQ6ICcvJyB9LFxuICAgICAgICBdKTtcbiAgICAgICAgZXhwZWN0KGJ1aWxkLm9wdGlvbnMubmFtZWRDaHVua3MpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChidWlsZC5jb25maWd1cmF0aW9ucykudG9FcXVhbCh7XG4gICAgICAgICAgcHJvZHVjdGlvbjoge1xuICAgICAgICAgICAgb3B0aW1pemF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgb3V0cHV0SGFzaGluZzogJ2FsbCcsXG4gICAgICAgICAgICBzb3VyY2VNYXA6IGZhbHNlLFxuICAgICAgICAgICAgZXh0cmFjdENzczogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWVkQ2h1bmtzOiBmYWxzZSxcbiAgICAgICAgICAgIGFvdDogdHJ1ZSxcbiAgICAgICAgICAgIGV4dHJhY3RMaWNlbnNlczogdHJ1ZSxcbiAgICAgICAgICAgIHZlbmRvckNodW5rOiBmYWxzZSxcbiAgICAgICAgICAgIGJ1aWxkT3B0aW1pemVyOiB0cnVlLFxuICAgICAgICAgICAgZmlsZVJlcGxhY2VtZW50czogW3tcbiAgICAgICAgICAgICAgcmVwbGFjZTogJ3NyYy9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQudHMnLFxuICAgICAgICAgICAgICB3aXRoOiAnc3JjL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5wcm9kLnRzJyxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHNldCBiYXNlSHJlZiBvbiBidWlsZCAmIHNlcnZlIHRhcmdldHMgaWYgbm90IGRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgY29uc3QgYnVpbGQgPSBnZXRDb25maWcodHJlZSkucHJvamVjdHMuZm9vLmFyY2hpdGVjdC5idWlsZDtcbiAgICAgICAgZXhwZWN0KGJ1aWxkLm9wdGlvbnMuYmFzZUhyZWYpLnRvQmVVbmRlZmluZWQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNldCBiYXNlSHJlZiBvbiBidWlsZCAmIHNlcnZlIHRhcmdldHMgaWYgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gey4uLmJhc2VDb25maWd9O1xuICAgICAgICBjb25maWcuYXBwc1swXS5iYXNlSHJlZiA9ICcvYmFzZS9ocmVmLyc7XG4gICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICBjb25zdCBidWlsZCA9IGdldENvbmZpZyh0cmVlKS5wcm9qZWN0cy5mb28uYXJjaGl0ZWN0LmJ1aWxkO1xuICAgICAgICBleHBlY3QoYnVpbGQub3B0aW9ucy5iYXNlSHJlZikudG9FcXVhbCgnL2Jhc2UvaHJlZi8nKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGFkZCBzZXJ2aWNlV29ya2VyIHRvIHByb2R1Y3Rpb24gY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgICAgYmFzZUNvbmZpZy5hcHBzWzBdLnNlcnZpY2VXb3JrZXIgPSB0cnVlO1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyh0cmVlKTtcbiAgICAgICAgZXhwZWN0KGNvbmZpZy5wcm9qZWN0cy5mb28uYXJjaGl0ZWN0LmJ1aWxkLm9wdGlvbnMuc2VydmljZVdvcmtlcikudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QoXG4gICAgICAgICAgY29uZmlnLnByb2plY3RzLmZvby5hcmNoaXRlY3QuYnVpbGQuY29uZmlndXJhdGlvbnMucHJvZHVjdGlvbi5zZXJ2aWNlV29ya2VyLFxuICAgICAgICApLnRvQmUodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBhZGQgcHJvZHVjdGlvbiBjb25maWd1cmF0aW9uIHdoZW4gbm8gZW52aXJvbm1lbnRzJywgKCkgPT4ge1xuICAgICAgICBkZWxldGUgYmFzZUNvbmZpZy5hcHBzWzBdLmVudmlyb25tZW50cztcbiAgICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcodHJlZSk7XG4gICAgICAgIGV4cGVjdChjb25maWcucHJvamVjdHMuZm9vLmFyY2hpdGVjdC5idWlsZC5jb25maWd1cmF0aW9ucykudG9FcXVhbCh7XG4gICAgICAgICAgcHJvZHVjdGlvbjoge1xuICAgICAgICAgICAgb3B0aW1pemF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgb3V0cHV0SGFzaGluZzogJ2FsbCcsXG4gICAgICAgICAgICBzb3VyY2VNYXA6IGZhbHNlLFxuICAgICAgICAgICAgZXh0cmFjdENzczogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWVkQ2h1bmtzOiBmYWxzZSxcbiAgICAgICAgICAgIGFvdDogdHJ1ZSxcbiAgICAgICAgICAgIGV4dHJhY3RMaWNlbnNlczogdHJ1ZSxcbiAgICAgICAgICAgIHZlbmRvckNodW5rOiBmYWxzZSxcbiAgICAgICAgICAgIGJ1aWxkT3B0aW1pemVyOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgYWRkIHByb2R1Y3Rpb24gY29uZmlndXJhdGlvbiB3aGVuIG5vIHByb2R1Y3Rpb24gZW52aXJvbm1lbnQnLCAoKSA9PiB7XG4gICAgICAgIHRyZWUuZGVsZXRlKCcvc3JjL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5wcm9kLnRzJyk7XG4gICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKHRyZWUpO1xuICAgICAgICBleHBlY3QoY29uZmlnLnByb2plY3RzLmZvby5hcmNoaXRlY3QuYnVpbGQuY29uZmlndXJhdGlvbnMpLnRvRXF1YWwoe1xuICAgICAgICAgIHByb2Q6IHtcbiAgICAgICAgICAgIGZpbGVSZXBsYWNlbWVudHM6IFt7XG4gICAgICAgICAgICAgIHJlcGxhY2U6ICdzcmMvZW52aXJvbm1lbnRzL2Vudmlyb25tZW50LnRzJyxcbiAgICAgICAgICAgICAgd2l0aDogJ3NyYy9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZC50cycsXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHByb2R1Y3Rpb246IHtcbiAgICAgICAgICAgIG9wdGltaXphdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIG91dHB1dEhhc2hpbmc6ICdhbGwnLFxuICAgICAgICAgICAgc291cmNlTWFwOiBmYWxzZSxcbiAgICAgICAgICAgIGV4dHJhY3RDc3M6IHRydWUsXG4gICAgICAgICAgICBuYW1lZENodW5rczogZmFsc2UsXG4gICAgICAgICAgICBhb3Q6IHRydWUsXG4gICAgICAgICAgICBleHRyYWN0TGljZW5zZXM6IHRydWUsXG4gICAgICAgICAgICB2ZW5kb3JDaHVuazogZmFsc2UsXG4gICAgICAgICAgICBidWlsZE9wdGltaXplcjogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNldCB0aGUgc2VydmUgdGFyZ2V0JywgKCkgPT4ge1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IHNlcnZlID0gZ2V0Q29uZmlnKHRyZWUpLnByb2plY3RzLmZvby5hcmNoaXRlY3Quc2VydmU7XG4gICAgICAgIGV4cGVjdChzZXJ2ZS5idWlsZGVyKS50b0VxdWFsKCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcjpkZXYtc2VydmVyJyk7XG4gICAgICAgIGV4cGVjdChzZXJ2ZS5vcHRpb25zKS50b0VxdWFsKHtcbiAgICAgICAgICBicm93c2VyVGFyZ2V0OiAnZm9vOmJ1aWxkJyxcbiAgICAgICAgICBwb3J0OiA4MDgwLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcHJvZENvbmZpZyA9IHNlcnZlLmNvbmZpZ3VyYXRpb25zLnByb2R1Y3Rpb247XG4gICAgICAgIGV4cGVjdChwcm9kQ29uZmlnLmJyb3dzZXJUYXJnZXQpLnRvRXF1YWwoJ2ZvbzpidWlsZDpwcm9kdWN0aW9uJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBzZXQgdGhlIHRlc3QgdGFyZ2V0JywgKCkgPT4ge1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IHRlc3QgPSBnZXRDb25maWcodHJlZSkucHJvamVjdHMuZm9vLmFyY2hpdGVjdFsndGVzdCddO1xuICAgICAgICBleHBlY3QodGVzdC5idWlsZGVyKS50b0VxdWFsKCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcjprYXJtYScpO1xuICAgICAgICBleHBlY3QodGVzdC5vcHRpb25zLm1haW4pLnRvRXF1YWwoJ3NyYy90ZXN0LnRzJyk7XG4gICAgICAgIGV4cGVjdCh0ZXN0Lm9wdGlvbnMucG9seWZpbGxzKS50b0VxdWFsKCdzcmMvcG9seWZpbGxzLnRzJyk7XG4gICAgICAgIGV4cGVjdCh0ZXN0Lm9wdGlvbnMudHNDb25maWcpLnRvRXF1YWwoJ3NyYy90c2NvbmZpZy5zcGVjLmpzb24nKTtcbiAgICAgICAgZXhwZWN0KHRlc3Qub3B0aW9ucy5rYXJtYUNvbmZpZykudG9FcXVhbCgnLi9rYXJtYS5jb25mLmpzJyk7XG4gICAgICAgIGV4cGVjdCh0ZXN0Lm9wdGlvbnMuc2NyaXB0cykudG9FcXVhbChbXSk7XG4gICAgICAgIGV4cGVjdCh0ZXN0Lm9wdGlvbnMuc3R5bGVzKS50b0VxdWFsKFsnc3JjL3N0eWxlcy5jc3MnXSk7XG4gICAgICAgIGV4cGVjdCh0ZXN0Lm9wdGlvbnMuYXNzZXRzKS50b0VxdWFsKFtcbiAgICAgICAgICAnc3JjL2Fzc2V0cycsXG4gICAgICAgICAgJ3NyYy9mYXZpY29uLmljbycsXG4gICAgICAgICAgeyBnbG9iOiAnKiovKicsIGlucHV0OiAnc3JjL2Fzc2V0cycsIG91dHB1dDogJy9hc3NldHMnIH0sXG4gICAgICAgICAgeyBnbG9iOiAnZmF2aWNvbi5pY28nLCBpbnB1dDogJ3NyYycsIG91dHB1dDogJy8nIH0sXG4gICAgICAgIF0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgc2V0IHRoZSBleHRyYWN0IGkxOG4gdGFyZ2V0JywgKCkgPT4ge1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IGV4dHJhY3QgPSBnZXRDb25maWcodHJlZSkucHJvamVjdHMuZm9vLmFyY2hpdGVjdFsnZXh0cmFjdC1pMThuJ107XG4gICAgICAgIGV4cGVjdChleHRyYWN0LmJ1aWxkZXIpLnRvRXF1YWwoJ0Bhbmd1bGFyLWRldmtpdC9idWlsZC1hbmd1bGFyOmV4dHJhY3QtaTE4bicpO1xuICAgICAgICBleHBlY3QoZXh0cmFjdC5vcHRpb25zKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QoZXh0cmFjdC5vcHRpb25zLmJyb3dzZXJUYXJnZXQpLnRvRXF1YWwoYGZvbzpidWlsZGAgKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNldCB0aGUgbGludCB0YXJnZXQnLCAoKSA9PiB7XG4gICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgY29uc3QgdHNsaW50ID0gZ2V0Q29uZmlnKHRyZWUpLnByb2plY3RzLmZvby5hcmNoaXRlY3RbJ2xpbnQnXTtcbiAgICAgICAgZXhwZWN0KHRzbGludC5idWlsZGVyKS50b0VxdWFsKCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcjp0c2xpbnQnKTtcbiAgICAgICAgZXhwZWN0KHRzbGludC5vcHRpb25zKS50b0JlRGVmaW5lZCgpO1xuICAgICAgICBleHBlY3QodHNsaW50Lm9wdGlvbnMudHNDb25maWcpXG4gICAgICAgICAgLnRvRXF1YWwoWydzcmMvdHNjb25maWcuYXBwLmpzb24nLCAnc3JjL3RzY29uZmlnLnNwZWMuanNvbiddKTtcbiAgICAgICAgZXhwZWN0KHRzbGludC5vcHRpb25zLmV4Y2x1ZGUpLnRvRXF1YWwoWyAnKiovbm9kZV9tb2R1bGVzLyoqJyBdKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNldCB0aGUgYnVkZ2V0cyBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgICBiYXNlQ29uZmlnLmFwcHNbMF0uYnVkZ2V0cyA9IFt7XG4gICAgICAgICAgdHlwZTogJ2J1bmRsZScsXG4gICAgICAgICAgbmFtZTogJ21haW4nLFxuICAgICAgICAgIGVycm9yOiAnMTIza2InLFxuICAgICAgICB9XTtcblxuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyh0cmVlKTtcbiAgICAgICAgY29uc3QgYnVkZ2V0cyA9IGNvbmZpZy5wcm9qZWN0cy5mb28uYXJjaGl0ZWN0LmJ1aWxkLmNvbmZpZ3VyYXRpb25zLnByb2R1Y3Rpb24uYnVkZ2V0cztcbiAgICAgICAgZXhwZWN0KGJ1ZGdldHMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgICBleHBlY3QoYnVkZ2V0c1swXS50eXBlKS50b0VxdWFsKCdidW5kbGUnKTtcbiAgICAgICAgZXhwZWN0KGJ1ZGdldHNbMF0ubmFtZSkudG9FcXVhbCgnbWFpbicpO1xuICAgICAgICBleHBlY3QoYnVkZ2V0c1swXS5lcnJvcikudG9FcXVhbCgnMTIza2InKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2UyZSBwcm9qZWN0cycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2V0IHRoZSBwcm9qZWN0IHJvb3QgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IGUyZVByb2plY3QgPSBnZXRDb25maWcodHJlZSkucHJvamVjdHNbJ2Zvby1lMmUnXTtcbiAgICAgICAgZXhwZWN0KGUyZVByb2plY3Qucm9vdCkudG9CZSgnZTJlJyk7XG4gICAgICAgIGV4cGVjdChlMmVQcm9qZWN0LnNvdXJjZVJvb3QpLnRvQmUoJ2UyZScpO1xuICAgICAgICBjb25zdCBlMmVPcHRpb25zID0gZTJlUHJvamVjdC5hcmNoaXRlY3QuZTJlO1xuICAgICAgICBleHBlY3QoZTJlT3B0aW9ucy5idWlsZGVyKS50b0VxdWFsKCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcjpwcm90cmFjdG9yJyk7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBlMmVPcHRpb25zLm9wdGlvbnM7XG4gICAgICAgIGV4cGVjdChvcHRpb25zLnByb3RyYWN0b3JDb25maWcpLnRvRXF1YWwoJy4vcHJvdHJhY3Rvci5jb25mLmpzJyk7XG4gICAgICAgIGV4cGVjdChvcHRpb25zLmRldlNlcnZlclRhcmdldCkudG9FcXVhbCgnZm9vOnNlcnZlJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBzZXQgdGhlIHByb2plY3Qgcm9vdCB2YWx1ZXMgZm9yIGEgZGlmZmVyZW50IHJvb3QnLCAoKSA9PiB7XG4gICAgICAgIGJhc2VDb25maWcuYXBwc1swXS5yb290ID0gJ2FwcHMvYXBwMS9zcmMnO1xuICAgICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICAgIGNvbnN0IGUyZVByb2plY3QgPSBnZXRDb25maWcodHJlZSkucHJvamVjdHNbJ2Zvby1lMmUnXTtcbiAgICAgICAgZXhwZWN0KGUyZVByb2plY3Qucm9vdCkudG9CZSgnYXBwcy9hcHAxL2UyZScpO1xuICAgICAgICBleHBlY3QoZTJlUHJvamVjdC5zb3VyY2VSb290KS50b0JlKCdhcHBzL2FwcDEvZTJlJyk7XG4gICAgICAgIGNvbnN0IGUyZU9wdGlvbnMgPSBlMmVQcm9qZWN0LmFyY2hpdGVjdC5lMmU7XG4gICAgICAgIGV4cGVjdChlMmVPcHRpb25zLmJ1aWxkZXIpLnRvRXF1YWwoJ0Bhbmd1bGFyLWRldmtpdC9idWlsZC1hbmd1bGFyOnByb3RyYWN0b3InKTtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGUyZU9wdGlvbnMub3B0aW9ucztcbiAgICAgICAgZXhwZWN0KG9wdGlvbnMucHJvdHJhY3RvckNvbmZpZykudG9FcXVhbCgnLi9wcm90cmFjdG9yLmNvbmYuanMnKTtcbiAgICAgICAgZXhwZWN0KG9wdGlvbnMuZGV2U2VydmVyVGFyZ2V0KS50b0VxdWFsKCdmb286c2VydmUnKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNldCB0aGUgbGludCB0YXJnZXQnLCAoKSA9PiB7XG4gICAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgICAgY29uc3QgdHNsaW50ID0gZ2V0Q29uZmlnKHRyZWUpLnByb2plY3RzWydmb28tZTJlJ10uYXJjaGl0ZWN0LmxpbnQ7XG4gICAgICAgIGV4cGVjdCh0c2xpbnQuYnVpbGRlcikudG9FcXVhbCgnQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXI6dHNsaW50Jyk7XG4gICAgICAgIGV4cGVjdCh0c2xpbnQub3B0aW9ucykudG9CZURlZmluZWQoKTtcbiAgICAgICAgZXhwZWN0KHRzbGludC5vcHRpb25zLnRzQ29uZmlnKS50b0VxdWFsKFsnZTJlL3RzY29uZmlnLmUyZS5qc29uJ10pO1xuICAgICAgICBleHBlY3QodHNsaW50Lm9wdGlvbnMuZXhjbHVkZSkudG9FcXVhbChbICcqKi9ub2RlX21vZHVsZXMvKionIF0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdrYXJtYSBjb25maWcnLCAoKSA9PiB7XG4gICAgY29uc3Qga2FybWFQYXRoID0gJy9rYXJtYS5jb25mLmpzJztcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHRyZWUuY3JlYXRlKGthcm1hUGF0aCwgYFxuICAgICAgICAvLyBAYW5ndWxhci9jbGlcbiAgICAgICAgLy8gcmVwb3J0c1xuICAgICAgYCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2UgcmVmZXJlbmNlcyB0byBcIkBhbmd1bGFyL2NsaVwiJywgKCkgPT4ge1xuICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KGthcm1hUGF0aCk7XG4gICAgICBleHBlY3QoY29udGVudCkubm90LnRvQ29udGFpbignQGFuZ3VsYXIvY2xpJyk7XG4gICAgICBleHBlY3QoY29udGVudCkudG9Db250YWluKCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXBsYWNlIHJlZmVyZW5jZXMgdG8gXCJyZXBvcnRzXCInLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoa2FybWFQYXRoKTtcbiAgICAgIGV4cGVjdChjb250ZW50KS50b0NvbnRhaW4oYGRpcjogcmVxdWlyZSgncGF0aCcpLmpvaW4oX19kaXJuYW1lLCAnY292ZXJhZ2UnKSwgcmVwb3J0c2ApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgdW51c2VkIHByb3BlcnRpZXMgaW4gMS4wIGNvbmZpZ3MnLCAoKSA9PiB7XG4gICAgICB0cmVlLm92ZXJ3cml0ZShrYXJtYVBhdGgsIGBcbiAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICB7IHBhdHRlcm46ICcuL3NyYy90ZXN0LnRzJywgd2F0Y2hlZDogZmFsc2UgfVxuICAgICAgICBdLFxuICAgICAgICBwcmVwcm9jZXNzb3JzOiB7XG4gICAgICAgICAgJy4vc3JjL3Rlc3QudHMnOiBbJ0Bhbmd1bGFyL2NsaSddXG4gICAgICAgIH0sXG4gICAgICAgIGFuZ3VsYXJDbGk6IHtcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ2RldidcbiAgICAgICAgfSxcbiAgICAgIGApO1xuXG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoa2FybWFQYXRoKTtcbiAgICAgIGV4cGVjdChjb250ZW50KS5ub3QudG9Db250YWluKGB7IHBhdHRlcm46ICcuL3NyYy90ZXN0LnRzJywgd2F0Y2hlZDogZmFsc2UgfWApO1xuICAgICAgZXhwZWN0KGNvbnRlbnQpLm5vdC50b0NvbnRhaW4oYCcuL3NyYy90ZXN0LnRzJzogWydAYW5ndWxhci9jbGknXWApO1xuICAgICAgZXhwZWN0KGNvbnRlbnQpLm5vdC50b01hdGNoKC9hbmd1bGFyQ2xpW159XSp9LD8vKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NwZWMgdHMgY29uZmlnJywgKCkgPT4ge1xuICAgIGNvbnN0IHRlc3RUc2NvbmZpZ1BhdGggPSAnL3NyYy90c2NvbmZpZy5zcGVjLmpzb24nO1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgdHJlZS5jcmVhdGUodGVzdFRzY29uZmlnUGF0aCwgYFxuICAgICAgICB7XG4gICAgICAgICAgXCJmaWxlc1wiOiBbIFwidGVzdC50c1wiIF1cbiAgICAgICAgfVxuICAgICAgYCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGFkZCBwb2x5ZmlsbHMnLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQodGVzdFRzY29uZmlnUGF0aCk7XG4gICAgICBleHBlY3QoY29udGVudCkudG9Db250YWluKCdwb2x5ZmlsbHMudHMnKTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IEpTT04ucGFyc2UoY29udGVudCk7XG4gICAgICBleHBlY3QoY29uZmlnLmZpbGVzLmxlbmd0aCkudG9FcXVhbCgyKTtcbiAgICAgIGV4cGVjdChjb25maWcuZmlsZXNbMV0pLnRvRXF1YWwoJ3BvbHlmaWxscy50cycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgYWRkIHBvbHlmaWxscyBpdCBpZiBpdCBhbHJlYWR5IGV4aXN0cycsICgpID0+IHtcbiAgICAgIHRyZWUub3ZlcndyaXRlKHRlc3RUc2NvbmZpZ1BhdGgsIGBcbiAgICAgICAge1xuICAgICAgICAgIFwiZmlsZXNcIjogWyBcInRlc3QudHNcIiwgXCJwb2x5ZmlsbHMudHNcIiBdXG4gICAgICAgIH1cbiAgICAgIGApO1xuICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0cmVlLnJlYWRDb250ZW50KHRlc3RUc2NvbmZpZ1BhdGgpO1xuICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvQ29udGFpbigncG9seWZpbGxzLnRzJyk7XG4gICAgICBjb25zdCBjb25maWcgPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuICAgICAgZXhwZWN0KGNvbmZpZy5maWxlcy5sZW5ndGgpLnRvRXF1YWwoMik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdyb290IHRzIGNvbmZpZycsICgpID0+IHtcbiAgICBjb25zdCByb290VHNDb25maWcgPSAnL3RzY29uZmlnLmpzb24nO1xuICAgIGxldCBjb21waWxlck9wdGlvbnM6IEpzb25PYmplY3Q7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHRyZWUuY3JlYXRlKHJvb3RUc0NvbmZpZywgYFxuICAgICAgICB7XG4gICAgICAgICAgXCJjb21waWxlck9wdGlvbnNcIjoge1xuICAgICAgICAgICAgXCJub0VtaXRPbkVycm9yXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIGApO1xuXG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQocm9vdFRzQ29uZmlnKTtcbiAgICAgIGNvbXBpbGVyT3B0aW9ucyA9IEpTT04ucGFyc2UoY29udGVudCkuY29tcGlsZXJPcHRpb25zO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBhZGQgYmFzZVVybCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChjb21waWxlck9wdGlvbnMuYmFzZVVybCkudG9FcXVhbCgnLi8nKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIG1vZHVsZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChjb21waWxlck9wdGlvbnMubW9kdWxlKS50b0VxdWFsKCdlczIwMTUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbW92ZSBleGlzdGluZyBvcHRpb25zJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGNvbXBpbGVyT3B0aW9ucy5ub0VtaXRPbkVycm9yKS50b0JlRGVmaW5lZCgpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncGFja2FnZS5qc29uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYWRkIGEgZGV2IGRlcGVuZGVuY3kgdG8gQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXInLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wYWNrYWdlLmpzb24nKTtcbiAgICAgIGNvbnN0IHBrZyA9IEpTT04ucGFyc2UoY29udGVudCk7XG4gICAgICBleHBlY3QocGtnLmRldkRlcGVuZGVuY2llc1snQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXInXSlcbiAgICAgICAgLnRvQmUobGF0ZXN0VmVyc2lvbnMuRGV2a2l0QnVpbGRBbmd1bGFyKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGEgZGV2IGRlcGVuZGVuY3kgdG8gQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXIgKHByZXNlbnQpJywgKCkgPT4ge1xuICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgdHJlZS5vdmVyd3JpdGUoJy9wYWNrYWdlLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGRldkRlcGVuZGVuY2llczoge1xuICAgICAgICAgICdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcic6ICcwLjAuMCcsXG4gICAgICAgIH0sXG4gICAgICB9LCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wYWNrYWdlLmpzb24nKTtcbiAgICAgIGNvbnN0IHBrZyA9IEpTT04ucGFyc2UoY29udGVudCk7XG4gICAgICBleHBlY3QocGtnLmRldkRlcGVuZGVuY2llc1snQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXInXSlcbiAgICAgICAgLnRvQmUobGF0ZXN0VmVyc2lvbnMuRGV2a2l0QnVpbGRBbmd1bGFyKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYWRkIGEgZGV2IGRlcGVuZGVuY3kgdG8gQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXIgKG5vIGRldiknLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlLm92ZXJ3cml0ZSgnL3BhY2thZ2UuanNvbicsIEpTT04uc3RyaW5naWZ5KHt9LCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgY29udGVudCA9IHRyZWUucmVhZENvbnRlbnQoJy9wYWNrYWdlLmpzb24nKTtcbiAgICAgIGNvbnN0IHBrZyA9IEpTT04ucGFyc2UoY29udGVudCk7XG4gICAgICBleHBlY3QocGtnLmRldkRlcGVuZGVuY2llc1snQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXInXSlcbiAgICAgICAgLnRvQmUobGF0ZXN0VmVyc2lvbnMuRGV2a2l0QnVpbGRBbmd1bGFyKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3RzbGludC5qc29uJywgKCkgPT4ge1xuICAgIGNvbnN0IHRzbGludFBhdGggPSAnL3RzbGludC5qc29uJztcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgbGV0IHRzbGludENvbmZpZzogYW55O1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgdHNsaW50Q29uZmlnID0ge1xuICAgICAgICBydWxlczoge1xuICAgICAgICAgICdpbXBvcnQtYmxhY2tsaXN0JzogWydzb21lJywgJ3J4anMnLCAnZWxzZSddLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIFwicnhqc1wiIGZyb20gdGhlIFwiaW1wb3J0LWJsYWNrbGlzdFwiIHJ1bGUnLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlLmNyZWF0ZSh0c2xpbnRQYXRoLCBKU09OLnN0cmluZ2lmeSh0c2xpbnRDb25maWcsIG51bGwsIDIpKTtcbiAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICBjb25zdCB0c2xpbnQgPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQodHNsaW50UGF0aCkpO1xuICAgICAgZXhwZWN0KHRzbGludC5ydWxlc1snaW1wb3J0LWJsYWNrbGlzdCddKS50b0VxdWFsKFsnc29tZScsICdlbHNlJ10pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgXCJyeGpzXCIgZnJvbSB0aGUgXCJpbXBvcnQtYmxhY2tsaXN0XCIgcnVsZSAob25seSknLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0c2xpbnRDb25maWcucnVsZXNbJ2ltcG9ydC1ibGFja2xpc3QnXSA9IFsncnhqcyddO1xuICAgICAgdHJlZS5jcmVhdGUodHNsaW50UGF0aCwgSlNPTi5zdHJpbmdpZnkodHNsaW50Q29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgdHNsaW50ID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KHRzbGludFBhdGgpKTtcbiAgICAgIGV4cGVjdCh0c2xpbnQucnVsZXNbJ2ltcG9ydC1ibGFja2xpc3QnXSkudG9FcXVhbChbXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBcInJ4anNcIiBmcm9tIHRoZSBcImltcG9ydC1ibGFja2xpc3RcIiBydWxlIChmaXJzdCknLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0c2xpbnRDb25maWcucnVsZXNbJ2ltcG9ydC1ibGFja2xpc3QnXSA9IFsncnhqcycsICdlbHNlJ107XG4gICAgICB0cmVlLmNyZWF0ZSh0c2xpbnRQYXRoLCBKU09OLnN0cmluZ2lmeSh0c2xpbnRDb25maWcsIG51bGwsIDIpKTtcbiAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICBjb25zdCB0c2xpbnQgPSBKU09OLnBhcnNlKHRyZWUucmVhZENvbnRlbnQodHNsaW50UGF0aCkpO1xuICAgICAgZXhwZWN0KHRzbGludC5ydWxlc1snaW1wb3J0LWJsYWNrbGlzdCddKS50b0VxdWFsKFsnZWxzZSddKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIFwicnhqc1wiIGZyb20gdGhlIFwiaW1wb3J0LWJsYWNrbGlzdFwiIHJ1bGUgKGxhc3QpJywgKCkgPT4ge1xuICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgdHNsaW50Q29uZmlnLnJ1bGVzWydpbXBvcnQtYmxhY2tsaXN0J10gPSBbJ3NvbWUnLCAncnhqcyddO1xuICAgICAgdHJlZS5jcmVhdGUodHNsaW50UGF0aCwgSlNPTi5zdHJpbmdpZnkodHNsaW50Q29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgdHNsaW50ID0gSlNPTi5wYXJzZSh0cmVlLnJlYWRDb250ZW50KHRzbGludFBhdGgpKTtcbiAgICAgIGV4cGVjdCh0c2xpbnQucnVsZXNbJ2ltcG9ydC1ibGFja2xpc3QnXSkudG9FcXVhbChbJ3NvbWUnXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHdvcmsgaWYgXCJyeGpzXCIgaXMgbm90IGluIHRoZSBcImltcG9ydC1ibGFja2xpc3RcIiBydWxlJywgKCkgPT4ge1xuICAgICAgdHJlZS5jcmVhdGUob2xkQ29uZmlnUGF0aCwgSlNPTi5zdHJpbmdpZnkoYmFzZUNvbmZpZywgbnVsbCwgMikpO1xuICAgICAgdHNsaW50Q29uZmlnLnJ1bGVzWydpbXBvcnQtYmxhY2tsaXN0J10gPSBbXTtcbiAgICAgIHRyZWUuY3JlYXRlKHRzbGludFBhdGgsIEpTT04uc3RyaW5naWZ5KHRzbGludENvbmZpZywgbnVsbCwgMikpO1xuICAgICAgdHJlZSA9IHNjaGVtYXRpY1J1bm5lci5ydW5TY2hlbWF0aWMoJ21pZ3JhdGlvbi0wMScsIGRlZmF1bHRPcHRpb25zLCB0cmVlKTtcbiAgICAgIGNvbnN0IHRzbGludCA9IEpTT04ucGFyc2UodHJlZS5yZWFkQ29udGVudCh0c2xpbnRQYXRoKSk7XG4gICAgICBjb25zdCBibGFja2xpc3QgPSB0c2xpbnQucnVsZXNbJ2ltcG9ydC1ibGFja2xpc3QnXTtcbiAgICAgIGV4cGVjdChibGFja2xpc3QpLnRvRXF1YWwoW10pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2VydmVyL3VuaXZlcnNhbCBhcHBzJywgKCkgPT4ge1xuICAgIGxldCBzZXJ2ZXJBcHA7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBzZXJ2ZXJBcHAgPSB7XG4gICAgICAgIHBsYXRmb3JtOiAnc2VydmVyJyxcbiAgICAgICAgcm9vdDogJ3NyYycsXG4gICAgICAgIG91dERpcjogJ2Rpc3Qvc2VydmVyJyxcbiAgICAgICAgYXNzZXRzOiBbXG4gICAgICAgICAgJ2Fzc2V0cycsXG4gICAgICAgICAgJ2Zhdmljb24uaWNvJyxcbiAgICAgICAgXSxcbiAgICAgICAgaW5kZXg6ICdpbmRleC5odG1sJyxcbiAgICAgICAgbWFpbjogJ21haW4uc2VydmVyLnRzJyxcbiAgICAgICAgdGVzdDogJ3Rlc3QudHMnLFxuICAgICAgICB0c2NvbmZpZzogJ3RzY29uZmlnLnNlcnZlci5qc29uJyxcbiAgICAgICAgdGVzdFRzY29uZmlnOiAndHNjb25maWcuc3BlYy5qc29uJyxcbiAgICAgICAgcHJlZml4OiAnYXBwJyxcbiAgICAgICAgc3R5bGVzOiBbXG4gICAgICAgICAgJ3N0eWxlcy5jc3MnLFxuICAgICAgICBdLFxuICAgICAgICBzY3JpcHRzOiBbXSxcbiAgICAgICAgZW52aXJvbm1lbnRTb3VyY2U6ICdlbnZpcm9ubWVudHMvZW52aXJvbm1lbnQudHMnLFxuICAgICAgICBlbnZpcm9ubWVudHM6IHtcbiAgICAgICAgICBkZXY6ICdlbnZpcm9ubWVudHMvZW52aXJvbm1lbnQudHMnLFxuICAgICAgICAgIHByb2Q6ICdlbnZpcm9ubWVudHMvZW52aXJvbm1lbnQucHJvZC50cycsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgYmFzZUNvbmZpZy5hcHBzLnB1c2goc2VydmVyQXBwKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbm90IGNyZWF0ZSBhIHNlcGFyYXRlIGFwcCBmb3Igc2VydmVyIGFwcHMnLCAoKSA9PiB7XG4gICAgICB0cmVlLmNyZWF0ZShvbGRDb25maWdQYXRoLCBKU09OLnN0cmluZ2lmeShiYXNlQ29uZmlnLCBudWxsLCAyKSk7XG4gICAgICB0cmVlID0gc2NoZW1hdGljUnVubmVyLnJ1blNjaGVtYXRpYygnbWlncmF0aW9uLTAxJywgZGVmYXVsdE9wdGlvbnMsIHRyZWUpO1xuICAgICAgY29uc3QgY29uZmlnID0gZ2V0Q29uZmlnKHRyZWUpO1xuICAgICAgY29uc3QgYXBwQ291bnQgPSBPYmplY3Qua2V5cyhjb25maWcucHJvamVjdHMpLmxlbmd0aDtcbiAgICAgIGV4cGVjdChhcHBDb3VudCkudG9FcXVhbCgyKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIGEgc2VydmVyIHRhcmdldCcsICgpID0+IHtcbiAgICAgIHRyZWUuY3JlYXRlKG9sZENvbmZpZ1BhdGgsIEpTT04uc3RyaW5naWZ5KGJhc2VDb25maWcsIG51bGwsIDIpKTtcbiAgICAgIHRyZWUgPSBzY2hlbWF0aWNSdW5uZXIucnVuU2NoZW1hdGljKCdtaWdyYXRpb24tMDEnLCBkZWZhdWx0T3B0aW9ucywgdHJlZSk7XG4gICAgICBjb25zdCBjb25maWcgPSBnZXRDb25maWcodHJlZSk7XG4gICAgICBjb25zdCB0YXJnZXQgPSBjb25maWcucHJvamVjdHMuZm9vLmFyY2hpdGVjdC5zZXJ2ZXI7XG4gICAgICBleHBlY3QodGFyZ2V0KS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KHRhcmdldC5idWlsZGVyKS50b0VxdWFsKCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcjpzZXJ2ZXInKTtcbiAgICAgIGV4cGVjdCh0YXJnZXQub3B0aW9ucy5vdXRwdXRQYXRoKS50b0VxdWFsKCdkaXN0L3NlcnZlcicpO1xuICAgICAgZXhwZWN0KHRhcmdldC5vcHRpb25zLm1haW4pLnRvRXF1YWwoJ21haW4uc2VydmVyLnRzJyk7XG4gICAgICBleHBlY3QodGFyZ2V0Lm9wdGlvbnMudHNDb25maWcpLnRvRXF1YWwoJ3RzY29uZmlnLnNlcnZlci5qc29uJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=