import { graph, auth, config, connector } from '@grafbase/sdk'
const g = graph.Standalone()

const mongo = connector.MongoDB('MongoDB', {
  url: g.env('MONGO_ATLAS_URL'),
  apiKey: g.env('MONGO_API_KEY'),
  dataSource: g.env('MONGO_DATASOURCE'),
  database: g.env('MONGO_DATABASE'),
})

const user = g.type('UserType', {
  id: g.id(),
  name: g.string().optional(),
  email: g.string(),
  avatarUrl: g.url(),
  description: g.string().optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(),
})

mongo
  .model('User', {
    name: g.string().length({ min: 2, max: 100 }),
    email: g.string().unique(),
    avatarUrl: g.url(),
    description: g.string().length({ min: 2, max: 1000 }).optional(),
    githubUrl: g.url().optional(),
    linkedinUrl: g.url().optional(),
  })
  .collection('users')
  .auth((rules: any) => {
    rules.public().read()
  })

mongo
  .model('Project', {
    title: g.string().length({ min: 3 }),
    description: g.string(),
    image: g.url(),
    liveSiteUrl: g.url(),
    githubUrl: g.url(),
    category: g.string(),
    createdBy: g.ref(user),
  })
  .collection('projects')
  .auth((rules: any) => {
    rules.public().read()
    rules.private().create().delete().update()
  })

g.datasource(mongo)

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET'),
})

export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => {
      rules.private()
    },
  },
})
