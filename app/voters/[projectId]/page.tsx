import { ProjectDetailClient } from './project-detail-client'

export default async function ProjectDetailPage(props: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await props.params
  return <ProjectDetailClient projectId={projectId} />
}