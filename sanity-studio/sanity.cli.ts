import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '7k96ai2c'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineCliConfig({
  api: {projectId, dataset},
  studioHost: 'conscioustravel-content',
  deployment: {
    appId: 'aprqy54nnhkrar4txr2e1uay',
  },
})
