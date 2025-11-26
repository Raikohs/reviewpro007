import { Suspense } from 'react'
import FeedbackForm from './FeedbackForm'

export default async function ClubPage({
    params,
}: {
    params: Promise<{ clubId: string }>
}) {
    const { clubId } = await params

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FeedbackForm clubId={clubId} />
        </Suspense>
    )
}
