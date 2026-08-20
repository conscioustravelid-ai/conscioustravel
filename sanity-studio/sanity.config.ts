import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {PublishNowAction} from './actions/publishNowAction'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '7k96ai2c'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'ConsciousTravel Content Studio',
  projectId,
  dataset,
  plugins: [structureTool({structure}), visionTool()],
  document: {
    actions: (previousActions, context) => context.schemaType === 'post'
      ? previousActions.map((action) => action.action === 'publish' ? PublishNowAction : action)
      : previousActions,
  },
  schema: {types: schemaTypes},
})
