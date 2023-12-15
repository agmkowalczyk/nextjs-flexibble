export const getUserQuery = `
  query GetUser($email: String!) {
    mongoDB {
      user(by: { email: $email }) {
        id
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
      }
    }
  }
`

export const getUserByIdQuery = `
  query GetUser($id: ID!) {
    mongoDB {
      user(by: { id: $id }) {
        id
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
      }
    }
  }
`

export const createUserMutation = `
	mutation CreateUser($input: UserCreateInput!) {
    mongoDB {
      userCreate(input: $input) {
        insertedId
      }
    }
	}
`

export const createProjectMutation = `
	mutation CreateProject($input: ProjectCreateInput!) {
    mongoDB {
      projectCreate(input: $input) {
        insertedId
      }
    }
	}
`

export const projectsQuery = `
  query getProjects($filter: ProjectCollection, $endCursor: String) {
    mongoDB {
      projectCollection(first: 8, after: $endCursor, filter: $filter) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            title
            githubUrl
            description
            liveSiteUrl
            id
            image
            category
            createdBy {
              id
              email
              name
              avatarUrl
            }
          }
          cursor
        }
      }
    }
  }
`

export const getProjectByIdQuery = `
  query GetProjectById($id: ID!) {
    mongoDB {
      project(by: { id: $id }) {
        id
        title
        description
        image
        liveSiteUrl
        githubUrl
        category
        createdBy {
          id
          name
          email
          avatarUrl
        }
      }
    }
  }
`
export const getProjectsOfUserQuery = `
  query getUserProjects($id: ID!, $last: Int = 4) {
    mongoDB {
      projectCollection(last: $last, filter: { createdBy: { id: { eq: $id } } }) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            title
            image
          }
        }
      }
    }
  }
`

export const deleteProjectMutation = `
  mutation DeleteProject($id: ID!) {
    mongoDB {
      projectDelete(by: { id: $id }) {
        deletedCount
      }
    }
  }
`

export const updateProjectMutation = `
	mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) {
    mongoDB {
      projectUpdate(by: { id: $id }, input: $input) {
        modifiedCount
      }
    }
	}
`
