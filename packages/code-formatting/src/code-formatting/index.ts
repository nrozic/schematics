import {
    Rule,
    SchematicContext,
    Tree,
    url,
    apply,
    template,
    mergeWith,
    chain,
    SchematicsException,
    forEach,
    FileEntry
} from '@angular-devkit/schematics';
// import { appendValueInAstArray } from "@schematics/angular/utility/json-utils";
import {
    addPackageJsonDependency,
    NodeDependency,
    NodeDependencyType
} from '@schematics/angular/utility/dependencies';
import { ICodeFormatting } from './schema';
import {
    strings
    // JsonAstObject,
    // parseJsonAst,
    // JsonParseMode
} from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { devDependencies, Husky } from './variables';

/**
 * This method will invoke all Rules that are part of this schematic...
 *
 * @param _options Input options
 */
export function codeFormatting(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) =>
        chain([
            addHusky(),
            modifyTsconfig(),
            addDependencies(),
            editorconfig(_options)
        ])(tree, _context);
}

/**
 * This method will add preconfigured husky hooks to package.json.
 */
export function addHusky(): Rule {
    const filePath = '/package.json';

    return (tree: Tree, _context: SchematicContext) => {
        if (!tree.exists('/package.json')) {
            throw new SchematicsException('File package.json does not exsist!');
        }
        const file = tree.read(filePath);
        const json = JSON.parse(file!.toString());

        json.husky = Husky;

        console.log('JSON FILE:', json);
        tree.overwrite('/package.json', JSON.stringify(json));
        return tree;
    };
}

/**
 * It will add dev dependencies required for code formatting to package.json and install them for you.
 */
function addDependencies(): Rule {
    return (host: Tree, _context: SchematicContext) => {
        for (let pkg in devDependencies) {
            const nodeDependency: NodeDependency = _nodeDevDependencyFactory(
                pkg,
                devDependencies[pkg]
            );

            addPackageJsonDependency(host, nodeDependency);
        }

        // console.log("host:", host, "kontekst:", _context);

        _context.addTask(new NodePackageInstallTask());
    };
}

/**
 * It will generate initial .editorconfig file based on user input params.
 *
 * @param _options Input params
 */
export function editorconfig(_options: ICodeFormatting): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        if (tree) {
        }
        const sourceTemplates = url('./files');
        const sourceParametrizedTemplates = apply(sourceTemplates, [
            template({
                ..._options,
                ...strings
            }),
            forEach((fileEntry: FileEntry) => {
                // Just by adding this is allows the file to be overwritten if it already exists
                if (tree.exists(fileEntry.path))
                    tree.overwrite('/.editorconfig', fileEntry.content);
                return fileEntry;
            })
        ]);

        return mergeWith(sourceParametrizedTemplates);
    };
}

/**
 * Helper function used to generate dev dependencies.
 *
 * @param packageName   Name of the package
 * @param version target package version
 */
function _nodeDevDependencyFactory(
    packageName: string,
    version: string
): NodeDependency {
    return {
        type: NodeDependencyType.Dev,
        name: packageName,
        version: version,
        overwrite: true
    };
}

// function _nodeDependencyFactory(
//     packageName: string,
//     version: string
// ): NodeDependency {
//     return {
//         type: NodeDependencyType.Default,
//         name: packageName,
//         version: version,
//         overwrite: true
//     };
// }

function modifyTsconfig(): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        // const path = '/tsconfig.json'
        if (!tree.exists('/tsconfig.json')) {
            throw new SchematicsException(
                'File tsconfig.json does not exsist!'
            );
        }

        const tsconfigpath = `/tsconfig.json`;
        const file = tree.read(tsconfigpath);
        let json = JSON.parse(file!.toString());
        json = json;
        // console.log('JSON FILE:', json.compilerOptions);
        return tree;
    };
}

// function readFile(host: Tree, path: string): JsonAstObject {
//     const buffer = host.read(path);
//     if (!buffer) {
//         throw new SchematicsException(`Could not read ${path}.`);
//     }

//     const config = parseJsonAst(buffer.toString(), JsonParseMode.Loose);
//     if (config.kind !== 'object') {
//         throw new SchematicsException(
//             `Invalid ${path}. Was expecting an object.`
//         );
//     }

//     return config;
// }
