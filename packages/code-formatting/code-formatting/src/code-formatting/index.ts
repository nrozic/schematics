import {
    Rule,
    SchematicContext,
    Tree,
    url,
    apply,
    template,
    mergeWith,
} from "@angular-devkit/schematics";
import { ICodeFormatting } from "./schema";
import { strings } from "@angular-devkit/core";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function codeFormatting(_options: ICodeFormatting): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        console.log(tree);
        const sourceTemplates = url("./files");
        const sourceParametrizedTemplates = apply(sourceTemplates, [
            template({
                ..._options,
                ...strings,
            }),
        ]);

        return mergeWith(sourceParametrizedTemplates);
    };
}
