import { ProjectSearch, ProjectInterface } from '@/common.types'
import Categories from '@/components/Categories'
import LoadMore from '@/components/LoadMore'
import ProjectCard from '@/components/ProjectCard'
import { fetchAllProjects } from '@/lib/actions'

type SearchParams = {
  category?: string | null
  endcursor?: string | null
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

const Home = async ({
  searchParams: { category, endcursor },
}: {
  searchParams: SearchParams
}) => {
  const data = (await fetchAllProjects(category, endcursor)) as {
    projectCollection: ProjectSearch
  }

  const projects = data?.projectCollection?.edges || []

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

  const pagination = data?.projectCollection?.pageInfo

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
            name={node?.createdBy?.name}
            avatarUrl={node?.createdBy?.avatarUrl}
            userId={node?.createdBy?.id}
          />
        ))}
      </section>
      <LoadMore
        startCursor={pagination.startCursor}
        endCursor={pagination.endCursor}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
      />
    </section>
  )
}

export default Home
