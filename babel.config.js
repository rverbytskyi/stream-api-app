module.exports = {
  plugins: [
    'transform-inline-environment-variables',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-unicode-property-regex',
    [
      'module-resolver',
      {
        alias: {
          api: './src/api',
          containers: './src/containers',
          hooks: './src/hooks',
          modules: './modules',
          routes: './src/routes',
          src: './src',
          state: './src/state',
          typings: './src/typings',
          utils: './src/utils',
        },
        root: ['./'],
      },
    ],
  ],
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-typescript',
  ],
};
