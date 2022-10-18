import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getProjects,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import * as path from 'path';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

interface NormalizedSchema extends UpdateScopeSchemaGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

export default async function (
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {
  // get the scopes
  const projects = getProjects(tree);
  const scopes = getScopes(projects);
  console.log(scopes);

  // update the schema definitions
  updateSchemaInterface(tree, scopes);

  // update the schema.json
  updateJson(tree, 'libs/internal-plugin/src/generators/util-lib/schema.json', (schemaJson) => {
    schemaJson.properties.directory['x-prompt'].items = scopes.map(scope => {
      return {
        "value": scope,
        "label": scope
      };
    })
    return schemaJson;
  });

  // format files
  await formatFiles(tree);
}


function normalizeOptions(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

function getScopes(projectMap: Map<string, ProjectConfiguration>) {
  const projects: any[] = Array.from(projectMap.values());
  const allScopes: string[] = projects
    .map((project) =>
      project.tags
        // take only those that point to scope
        .filter((tag: string) => tag.startsWith('scope:'))
    )
    // flatten the array
    .reduce((acc, tags) => [...acc, ...tags], [])
    // remove prefix `scope:`
    .map((scope: string) => scope.slice(6));
  // remove duplicates
  return Array.from(new Set(allScopes));
}

function updateSchemaInterface(tree: Tree, scopes: string[]) {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const interfaceDefinitionFilePath =
    'libs/internal-plugin/src/generators/util-lib/schema.d.ts';
  const newContent = `export interface UtilLibGeneratorSchema {
    name: string;
    directory: ${joinScopes};
    tags: string;
  }`;
  tree.write(interfaceDefinitionFilePath, newContent);
}

