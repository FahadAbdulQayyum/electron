module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  // Add React JSX support
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-react']
      }
    }
  },
  // Add support for audio files (MP3, WAV)
  {
    test: /\.(mp3|wav)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/sounds/',
        },
      },
    ],
  },
  // Put your webpack loader rules in this array.  This is where you would put
  // your ts-loader configuration for instance:
  /**
   * Typescript Example:
   *
   * {
   *   test: /\.tsx?$/,
   *   exclude: /(node_modules|.webpack)/,
   *   loaders: [{
   *     loader: 'ts-loader',
   *     options: {
   *       transpileOnly: true
   *     }
   *   }]
   * }
   */
];









// module.exports = [
//   // Add support for native node modules
//   {
//     // We're specifying native_modules in the test because the asset relocator loader generates a
//     // "fake" .node file which is really a cjs file.
//     test: /native_modules[/\\].+\.node$/,
//     use: 'node-loader',
//   },
//   {
//     test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
//     parser: { amd: false },
//     use: {
//       loader: '@vercel/webpack-asset-relocator-loader',
//       options: {
//         outputAssetBase: 'native_modules',
//       },
//     },
//   },
//   // Add React JSX support
//   {
//     test: /\.jsx?$/,
//     exclude: /node_modules/,
//     use: {
//       loader: 'babel-loader',
//       options: {
//         presets: ['@babel/preset-react']
//       }
//     }
//   },
//   // Put your webpack loader rules in this array.  This is where you would put
//   // your ts-loader configuration for instance:
//   /**
//    * Typescript Example:
//    *
//    * {
//    *   test: /\.tsx?$/,
//    *   exclude: /(node_modules|.webpack)/,
//    *   loaders: [{
//    *     loader: 'ts-loader',
//    *     options: {
//    *       transpileOnly: true
//    *     }
//    *   }]
//    * }
//    */
// ];








// // module.exports = [
// //   // Add support for native node modules
// //   {
// //     // We're specifying native_modules in the test because the asset relocator loader generates a
// //     // "fake" .node file which is really a cjs file.
// //     test: /native_modules[/\\].+\.node$/,
// //     use: 'node-loader',
// //   },
// //   {
// //     test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
// //     parser: { amd: false },
// //     use: {
// //       loader: '@vercel/webpack-asset-relocator-loader',
// //       options: {
// //         outputAssetBase: 'native_modules',
// //       },
// //     },
// //   },
// //   // Put your webpack loader rules in this array.  This is where you would put
// //   // your ts-loader configuration for instance:
// //   /**
// //    * Typescript Example:
// //    *
// //    * {
// //    *   test: /\.tsx?$/,
// //    *   exclude: /(node_modules|.webpack)/,
// //    *   loaders: [{
// //    *     loader: 'ts-loader',
// //    *     options: {
// //    *       transpileOnly: true
// //    *     }
// //    *   }]
// //    * }
// //    */
// // ];
