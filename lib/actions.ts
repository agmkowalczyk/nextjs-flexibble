import { ProjectForm, SessionInterface, UserProfile } from '@/common.types'
import {
  createProjectMutation,
  createUserMutation,
  deleteProjectMutation,
  getProjectByIdQuery,
  getProjectsOfUserQuery,
  getUserByIdQuery,
  getUserQuery,
  projectsQuery,
  updateProjectMutation,
} from '@/graphql'
import { GraphQLClient } from 'graphql-request'

const isProduction = process.env.NODE_ENV === 'production'
const apiUrl = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ''
  : 'http://127.0.0.1:4000/graphql'
const apiKey = isProduction
  ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ''
  : 'letmein'
const serverUrl = isProduction
  ? process.env.NEXT_PUBLIC_SERVER_URL
  : 'http://localhost:3000'

const client = new GraphQLClient(apiUrl)

const makeGraphQLRequest = async (query: string, variables = {}) => {
  try {
    const response: any = await client.request(query, variables)
    return response?.mongoDB
  } catch (err) {
    throw err
  }
}

export const getUser = (email: string) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getUserQuery, { email })
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
  client.setHeader('x-api-key', apiKey)

  const variables = {
    input: {
      name,
      email,
      avatarUrl,
    },
  }

  return makeGraphQLRequest(createUserMutation, variables)
}

const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: 'POST',
      body: JSON.stringify({
        path: imagePath,
      }),
    })
    return response.json()
  } catch (err) {
    throw err
  }
}

export const createNewProject = async (
  form: ProjectForm,
  id: string,
  name: string,
  email: string,
  avatarUrl: string,
  token: string
) => {
  const imageUrl = await uploadImage(form.image)

  if (imageUrl.url) {
    client.setHeader('Authorization', `Bearer ${token}`)

    const variables = {
      input: {
        ...form,
        image: imageUrl.url,
        createdBy: {
          id,
          name,
          email,
          avatarUrl,
        },
      },
    }

    return makeGraphQLRequest(createProjectMutation, variables)
  }
}

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`)
    return response.json()
  } catch (err) {
    throw err
  }
}

export const fetchAllProjects = async (
  category?: string | null,
  endCursor?: string | null
) => {
  let filter: any = { category: { eq: category } }
  if (!category) {
    filter = {}
  }

  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(projectsQuery, { filter, endCursor })
}

export const getProjectDetails = (id: string) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getProjectByIdQuery, { id })
}

export const getUserProjects = (id: string, last?: number) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getProjectsOfUserQuery, { id, last })
}

export const getUserById = (id: string) => {
  client.setHeader('x-api-key', apiKey)
  return makeGraphQLRequest(getUserByIdQuery, { id })
}

export const deleteProject = (id: string, token: string) => {
  client.setHeader('Authorization', `Bearer ${token}`)
  return makeGraphQLRequest(deleteProjectMutation, { id })
}

function isBase64DataURL(value: string) {
  const base64Regex = /^data:image\/[a-z]+;base64,/
  return base64Regex.test(value)
}

export const updateProject = async (
  form: ProjectForm,
  projectId: string,
  token: string
) => {
  let updatedForm = { ...form }

  const isUploadingNewImage = isBase64DataURL(form.image)

  if (isUploadingNewImage) {
    const imageUrl = await uploadImage(form.image)

    if (imageUrl.url) {
      updatedForm = { ...updatedForm, image: imageUrl.url }
    }
  }

  client.setHeader('Authorization', `Bearer ${token}`)

  const variables = {
    id: projectId,
    input: Object.entries(updatedForm).reduce(
      (obj = {}, [key, value]) => ({ ...obj, [key]: { set: value } }),
      {}
    ),
  }

  return makeGraphQLRequest(updateProjectMutation, variables)
}
