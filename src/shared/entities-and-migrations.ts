import { ConnectionOptions } from 'typeorm';

export type EntitiesAndMigrationsOpts = Pick<
  ConnectionOptions,
  'entities' | 'migrations' | 'subscribers'
>;

const importAllFunctions = (
  requireContext: __WebpackModuleApi.RequireContext,
) =>
  requireContext
    .keys()
    .sort()
    .map((filename) => {
      const required = requireContext(filename);
      return Object.keys(required).reduce((result, exportedKey) => {
        const exported = required[exportedKey];
        if (typeof exported === 'function') {
          return result.concat(exported);
        }
        return result;
      }, [] as any);
    })
    .flat();

export let entitiesAndMigrations: any;
console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
if (process.env.NODE_ENV === 'production') {
  entitiesAndMigrations = {
    entities: ['dist/**/**.entity.js'],
    subscribers: ['dist/**/**.subscriber.js'],
  };
} else {
  const entitiesViaWebpack: NonNullable<EntitiesAndMigrationsOpts['entities']> =
    importAllFunctions(require.context('../../src', true, /\.entity\.ts$/));

  const migrationsViaWebpack: NonNullable<
    EntitiesAndMigrationsOpts['migrations']
  > = importAllFunctions(
    require.context('../../src', true, /\.migration\.ts$/),
  );

  const subscribersViaWebpack: NonNullable<
    EntitiesAndMigrationsOpts['subscribers']
  > = importAllFunctions(
    require.context('../../src', true, /\.subscriber\.ts$/),
  );

  entitiesAndMigrations = {
    entities: entitiesViaWebpack,
    migrations: migrationsViaWebpack,
    subscribers: subscribersViaWebpack,
  };
}
