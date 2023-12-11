import { ProjectInterface } from '@/common.types'
import Categories from '@/components/Categories'
import ProjectCard from '@/components/ProjectCard'
import { fetchAllProjects } from '@/lib/actions'

type ProjectSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[]
    pageInfo: {
      hasPreviousPage: boolean
      hasNextPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

type SearchParams = {
  category?: string | null
  endcursor?: string | null
}

const Home = async ({
  searchParams: { category, endcursor },
}: {
  searchParams: SearchParams
}) => {
  const data = (await fetchAllProjects(category)) as ProjectSearch

  const projects = data?.projectSearch?.edges || []

  if (projects.length === 0) {
    return (
      <section className='flexStart flex-col paddings'>
        <Categories />
        <p className='no-result-text text-center'>
          No projects found, go create some first.
        </p>
      </section>
    )
  }

  return (
    <section className='flexStart flex-col paddings mb-16'>
      <Categories />
      <section className='projects-grid'>
        {projects.map(({ node }: { node: ProjectInterface }) => (
          <ProjectCard
            key={`${node?.id}`}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy.name}
            avatarUrl={node?.createdBy.avatarUrl}
            userId={node?.createdBy.id}
          />
        ))}
      </section>
      LoadMore
    </section>
  )
}

export default Home
