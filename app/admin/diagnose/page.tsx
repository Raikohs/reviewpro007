'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DiagnosePage() {
    const [config, setConfig] = useState<any>(null)

    useEffect(() => {
        // Check what values are actually being used
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        setConfig({
            url: url,
            keyPrefix: key ? key.substring(0, 10) + '...' : 'undefined',
            isPlaceholderUrl: url?.includes('placeholder'),
            isPlaceholderKey: key?.includes('placeholder'),
        })
    }, [])

    if (!config) return <div>Loading diagnostics...</div>

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Supabase Configuration Diagnosis</h1>

            <div style={{
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                background: config.isPlaceholderUrl || config.isPlaceholderKey ? '#ffebee' : '#e8f5e9'
            }}>
                <h2>Status: {config.isPlaceholderUrl || config.isPlaceholderKey ? '❌ ERROR' : '✅ OK'}</h2>

                <p><strong>Supabase URL:</strong> {config.url}</p>
                <p><strong>Key Prefix:</strong> {config.keyPrefix}</p>

                {config.isPlaceholderUrl && (
                    <p style={{ color: 'red' }}>⚠️ URL is using placeholder! Environment variable not detected.</p>
                )}

                {config.isPlaceholderKey && (
                    <p style={{ color: 'red' }}>⚠️ Key is using placeholder! Environment variable not detected.</p>
                )}
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>How to fix:</h3>
                <ol>
                    <li>Go to Vercel Dashboard &rarr; Settings &rarr; Environment Variables</li>
                    <li>Ensure <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set correctly</li>
                    <li><strong>IMPORTANT:</strong> Go to Deployments and click <strong>Redeploy</strong></li>
                </ol>
            </div>
        </div>
    )
}
