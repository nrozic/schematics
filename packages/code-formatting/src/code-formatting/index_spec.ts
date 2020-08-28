// import { Tree } from "@angular-devkit/schematics";
import {
    SchematicTestRunner,
    UnitTestTree
} from '@angular-devkit/schematics/testing';
// import * as path from "path";
import { ICodeFormatting } from './schema';

// const collectionPath = path.join(__dirname, "../collection.json");

describe('code-formatting', () => {
    const schematicRunner = new SchematicTestRunner(
        '@schematics/angular',
        require.resolve('../collection.json')
    );

    console.log('probavamo');

    const workspaceOptions: ICodeFormatting = {
        indentSize: 4,
        indentStyle: 'space'
    };

    let workspaceTree: UnitTestTree;
    beforeEach(async () => {
        workspaceTree = await schematicRunner
            .runSchematicAsync('code-formatting', workspaceOptions)
            .toPromise();
    });

    it('adds .editorconfig to project', async () => {
        const options = { ...workspaceOptions };

        const tree = await schematicRunner
            .runSchematicAsync('code-formatting', options, workspaceTree)
            .toPromise();

        console.log(tree.files);
        expect(tree.files).toEqual(jasmine.arrayContaining(['/.editorconfig']));
    });
});
