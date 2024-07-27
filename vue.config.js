const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:'',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.geojson$/,
          loader: 'json-loader'
        },
        {
          test: /\.csv$/,
          loader: 'csv-loader',
          options: {
            dynamicTyping: true,
            header: true,
            skipEmptyLines: true
          }
        }
      ],
    }
  }
})
