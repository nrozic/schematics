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
  FileEntry,
} from '@angular-devkit/schematics';
// import { appendValueInAstArray } from "@schematics/angular/utility/json-utils";
import {
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { ICodeFormatting } from './schema';
import {
  strings,
  // JsonAstObject,
  // parseJsonAst,
  // JsonParseMode
} from '@angular-devkit/core';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { devDependencies, Husky, paths } from './variables';
import stripJsonComments = require('strip-json-comments');

/**
 * This method will invoke all Rules that are part of this schematic...
 *
 * @param _options Input options
 */
export function codeFormatting(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) =>
    chain([
      addDependencies(),
      addHusky(),
      addPathsToTsconfig(),
      editTslint(),
      writeFile(_options, '/.editorconfig'),
      writeFile(_options, '/.prettierignore'),
      writeFile(_options, '/.prettierrc.json'),
      writeFile(_options, '.stylelintrc.json'),
    ])(tree, _context);
}

/**
 * This method will add preconfigured husky hooks to package.json.
 */
export function addHusky(): Rule {
  const filePath = '/package.json';

  return (tree: Tree, _context: SchematicContext) => {
    if (!tree.exists(filePath)) {
      throw new SchematicsException('File package.json does not exsist!');
    }
    const file = tree.read(filePath);
    const json = JSON.parse(file!.toString());

    json.husky = Husky;

    console.log(`${filePath} generated!`, json);
    tree.overwrite(filePath, JSON.stringify(json));
    return tree;
  };
}

/**
 * It will add dev dependencies required for code formatting to package.json and install them for you.
 */
function addDependencies(): Rule {
  return (host: Tree, _context: SchematicContext) => {
    for (let pkg in devDependencies) {
      const nodeDependency: NodeDependency = _nodeDependencyFactory(
        pkg,
        devDependencies[pkg]
      );
      addPackageJsonDependency(host, nodeDependency);
    }

    _context.addTask(new NodePackageInstallTask());
  };
}

/**
 * It will generate file
 *
 * @param _options Input params
 */
export function writeFile(_options: ICodeFormatting, filePath: string): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (!tree) {
      throw new SchematicsException(`File ${filePath} does not exsist!`);
    }

    const sourceTemplates = url('./files');
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ..._options,
        ...strings,
      }),
      forEach((fileEntry: FileEntry) => {
        // Just by adding this is allows the file to be overwritten if it already exists
        if (tree.exists(fileEntry.path)) return null;
        return fileEntry;
      }),
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
function _nodeDependencyFactory(
  packageName: string,
  version: string
): NodeDependency {
  return {
    type: NodeDependencyType.Dev,
    name: packageName,
    version: version,
    overwrite: true,
  };
}

/**
 * Method will generate basic set of path aliases for the angular application.
 * This is useful to be able to avoid using relative imports in the project
 */
function addPathsToTsconfig(): Rule {
  const filePath = '/tsconfig.json';

  return (tree: Tree, _context: SchematicContext) => {
    if (!tree.exists(filePath)) {
      throw new SchematicsException('File tsconfig.json does not exsist!');
    }
    const file = tree.read(filePath);
    const json = JSON.parse(stripJsonComments(file!.toString()));

    json.compilerOptions.paths = paths;
    const buffer = Buffer.from(JSON.stringify(json));
    tree.overwrite(filePath, buffer);
    return tree;
  };
}

function editTslint(): Rule {
  const filePath = '/tslint.json';

  return (tree: Tree, _context: SchematicContext) => {
    if (!tree.exists(filePath)) {
      throw new SchematicsException('File tslint.json does not exsist!');
    }
    const file = tree.read(filePath);
    const json = JSON.parse(stripJsonComments(file!.toString()));

    json.rules['variable-name'].options.push('allow-snake-case');
    const buffer = Buffer.from(JSON.stringify(json));
    tree.overwrite(filePath, buffer);
    return tree;
  };
}
