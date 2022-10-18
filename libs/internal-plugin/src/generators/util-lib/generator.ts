import { Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

import { UtilLibGeneratorSchema } from './schema';

const UTIL_TYPE = 'type:util';

export default async function (tree: Tree, schema: UtilLibGeneratorSchema) {
  schema.name = `util-${schema.name}`;
  schema.tags = `${UTIL_TYPE},scope:${schema.directory}`;
  console.log(`Generating new lib ${schema.name}`);
  await libraryGenerator(tree, schema);

}
