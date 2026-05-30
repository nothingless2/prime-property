import { notFound } from 'next/navigation'
import { getProperty } from '@/app/actions/property'
import EditPropertyClient from './EditPropertyClient'

export const dynamic = 'force-dynamic'

export default async function EditPropertyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const property = await getProperty(params.id)
  
  if (!property) {
    notFound()
  }

  return <EditPropertyClient initialData={property} />
}
