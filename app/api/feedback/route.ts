import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

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

        // DEBUG: Check env vars on server
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        // Use Service Role Key if available (bypasses RLS), otherwise fallback to Anon Key
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const keyToUse = serviceRoleKey || key

        console.log('Server Env Check:', {
            hasUrl: !!url,
            hasAnonKey: !!key,
            hasServiceKey: !!serviceRoleKey,
            usingServiceKey: !!serviceRoleKey,
            keyLength: keyToUse?.length
        })

        // Initialize Supabase client directly
        const { createClient } = require('@supabase/supabase-js')
        const supabase = createClient(url, keyToUse, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        })

        let photoUrl: string | null = null

        // Handle photo upload if present
        if (photo) {
            const bytes = await photo.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Generate unique filename
            const timestamp = Date.now()
            const filename = `${clubId}-${timestamp}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase
                .storage
                .from('uploads')
                .upload(filename, buffer, {
                    contentType: photo.type,
                    upsert: false
                })

            if (uploadError) {
                console.error('Supabase upload error:', uploadError)
                throw new Error('Failed to upload photo')
            }

            // Get public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('uploads')
                .getPublicUrl(filename)

            photoUrl = publicUrl
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
