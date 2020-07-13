import {
    Rule,
    SchematicContext,
    Tree,
    url,
    apply,
    template,
    mergeWith,
    chain,
    SchematicsException
} from "@angular-devkit/schematics";
import {
    addPackageJsonDependency,
    NodeDependency,
    NodeDependencyType
} from "@schematics/angular/utility/dependencies";
import { ICodeFormatting } from "./schema";
import {
    strings,
    JsonAstObject,
    parseJsonAst,
    JsonParseMode
} from "@angular-devkit/core";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import { devDependencies } from "./dependencies";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function addDevDependencies(): Rule {
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

export function codeFormatting(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) =>
        chain([modifyTsconfig(), addDevDependencies(), editorconfig(_options)])(
            tree,
            _context
        );
}

export function editorconfig(_options: ICodeFormatting): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        if (tree) {
        }
        const sourceTemplates = url("./files");
        const sourceParametrizedTemplates = apply(sourceTemplates, [
            template({
                ..._options,
                ...strings
            })
        ]);

        return mergeWith(sourceParametrizedTemplates);
    };
}

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

function modifyTsconfig(): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        if (!tree.exists("/tsconfig.json")) {
            throw new SchematicsException(
                "File tsconfig.json does not exsist!"
            );
        }

        let tsconfigBuffer = readTsConfig(tree, "/tsconfig.json");
        // console.log("file Buffer:", tsconfigBuffer);
        if (tsconfigBuffer != null) {
            tsconfigBuffer.properties.forEach(prop => {
                console.log("Tsconfig property:", prop);
            });
            // tree.overwrite("/tsconfig.json", tsconfigBuffer);
        }
        return tree;
    };
}

function readTsConfig(host: Tree, path: string): JsonAstObject {
    const buffer = host.read(path);
    if (!buffer) {
        throw new SchematicsException(`Could not read ${path}.`);
    }

    const config = parseJsonAst(buffer.toString(), JsonParseMode.Loose);
    if (config.kind !== "object") {
        throw new SchematicsException(
            `Invalid ${path}. Was expecting an object.`
        );
    }

    return config;
}
