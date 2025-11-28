import { Suspense } from 'react'
import FeedbackForm from './FeedbackForm'

export default async function ClubPage({
    params,
    searchParams,
}: {
    params: Promise<{ clubId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { clubId } = await params
    const { location } = await searchParams
    const initialLocation = typeof location === 'string' ? location : undefined

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FeedbackForm clubId={clubId} initialLocation={initialLocation} />
        </Suspense>
    )
}
