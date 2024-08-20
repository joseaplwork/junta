const { composePlugins, withNx } = require('@nx/webpack');
const webpack = require('webpack');

module.exports = composePlugins(
  withNx({
    target: 'node'
  }),
  config => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const lazyImports = [
            '@nestjs/microservices',
            '@nestjs/platform-express',
            'cache-manager',
            'class-validator',
            'class-transformer',
            'fastify-swagger',
            'graphql',
            'graphql-toolkit',
            'grpc',
            'hbs',
            'ioredis',
            'mqtt',
            'mysql',
            'mysql2',
            'oracledb',
            'pg-native',
            'redis',
            'sqlite3',
            'typeorm-aurora-data-api-driver',
            'react-native-sqlite-storage',
            'mssql'
            // etc...
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
          return false;
        }
      })
    );
    return config;
  }
);
