var path = require( 'path' );
var BundleTracker = require('webpack-bundle-tracker')
    module.exports = {
        mode: 'development',
      entry: ['babel-polyfill', './frontend/index.js'],
      plugins: [
        new BundleTracker({filename: 'resume_builder/webpack-stats.json'}),
      ],
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: ["/node_modules/", "/resume-builder/"],
            use: {
              loader: "babel-loader"
            }
          }
        ]
      },
      output: {
        path: path.resolve(__dirname, './assets/bundles/'),
        filename: 'index.js',
        publicPath: "http://localhost:3000/assets/bundles/",
      }
    };

