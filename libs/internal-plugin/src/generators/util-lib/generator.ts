import { Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

import { UtilLibGeneratorSchema } from './schema';

export default async function (tree: Tree, schema: UtilLibGeneratorSchema) {
  schema.name = `util-${schema.name}`;
  schema.tags = `type:utils,scope:${schema.directory}`;
  console.log(`Generating new lib ${schema.name}`);
  await libraryGenerator(tree, schema);

}
