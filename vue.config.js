const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },

  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Calculadora de Distância CEP'
    }
  }
})