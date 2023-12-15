import { getUserProjects } from '@/lib/actions'
import { ProjectInterface, ProjectSearch } from '@/common.types'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  userId: string
  projectId: string
}

const RelatedProjects = async ({ userId, projectId }: Props) => {
  const result = (await getUserProjects(userId)) as {
    projectCollection?: ProjectSearch
  }

  const filteredProjects = result?.projectCollection?.edges?.filter(
    ({ node }: { node: ProjectInterface }) => node?.id !== projectId
  )

  if (filteredProjects?.length === 0) return null

  return (
    <section className='flex flex-col mt-32 w-full'>
      <div className='flexBetween'>
        <p className='text-base font-bold'>More</p>
        <Link
          href={`/profile/${userId}`}
          className='text-primary-purple text-base'
        >
          View All
        </Link>
      </div>

      <div className='related_projects-grid'>
        {filteredProjects?.map(({ node }: { node: ProjectInterface }) => (
          <div
            className='flexCenter related_project-card drop-shadow-card'
            key={node?.id}
          >
            <Link
              href={`/project/${node?.id}`}
              className='flexCenter group relative w-full h-full'
            >
              <Image
                src={node?.image}
                width={414}
                height={314}
                className='w-full h-full object-cover rounded-2xl'
                alt='project image'
              />

              <div className='hidden group-hover:flex related_project-card_title'>
                <p className='w-full'>{node?.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RelatedProjects
