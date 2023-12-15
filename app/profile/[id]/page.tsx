import { getUserById, getUserProjects } from '@/lib/actions'
import ProfilePage from '@/components/ProfilePage'
import { ProjectSearch, UserProfile } from '@/common.types'

type Props = {
  params: {
    id: string
  }
}

const UserProfile = async ({ params }: Props) => {
  const resultProjects = (await getUserProjects(params.id, 100)) as {
    projectCollection: ProjectSearch
  }
  const resultUser = (await getUserById(params.id)) as {
    user: UserProfile
  }

  if (!resultUser?.user)
    return <p className='no-result-text'>Failed to fetch user info</p>

  return (
    <ProfilePage
      user={resultUser?.user}
      projects={resultProjects?.projectCollection}
    />
  )
}

export default UserProfile
