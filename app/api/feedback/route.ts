import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const clubId = formData.get('clubId') as string
        const location = formData.get('location') as string | null
        const type = formData.get('type') as string
        const category = formData.get('category') as string | null
        const rating = formData.get('rating') as string
        const comment = formData.get('comment') as string
        const contact = formData.get('contact') as string | null
        const photo = formData.get('photo') as File | null

        if (!clubId || !rating || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        let photoUrl: string | null = null

        // Handle photo upload if present
        if (photo) {
            const bytes = await photo.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Generate unique filename
            const timestamp = Date.now()
            const filename = `${clubId}-${timestamp}-${photo.name}`
            const filepath = join(process.cwd(), 'public', 'uploads', filename)

            // Save file
            await writeFile(filepath, buffer)
            photoUrl = `/uploads/${filename}`
        }

        const review = await prisma.review.create({
            data: {
                clubId,
                location: location || undefined,
                type,
                category: category || undefined,
                rating: Number(rating),
                comment: comment || '',
                contact: contact || undefined,
                photoUrl,
            },
        })

        return NextResponse.json(review)
    } catch (error) {
        console.error('Error creating review:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
