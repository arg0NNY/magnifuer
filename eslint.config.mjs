import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import standard from '@vue/eslint-config-standard'

export default defineConfigWithVueTs(
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  standard,
  {
    ignores: [
      'dist',
      'example'
    ]
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
)
