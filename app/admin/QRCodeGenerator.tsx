'use client'

import { useState } from 'react'
import styles from './page.module.css'

const CLUB_LOCATIONS: Record<string, string[]> = {
    'LEVEL': ['ASTANA', 'SARAISHYK', 'ZAHZAGANSK'],
    'SPACE': ['MAMETOVA', 'TRK'],
    'PINGWIN': [] // Single location
}

export default function QRCodeGenerator() {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    const getLink = (club: string, location?: string) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        if (location) {
            return `${baseUrl}/${club}?location=${location}`
        }
        return `${baseUrl}/${club}`
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(text)
        setTimeout(() => setCopied(null), 2000)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={styles.qrButton}
            >
                🔗 Get QR Links
            </button>
        )
    }

    return (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>QR Code Links</h2>
                    <button onClick={() => setIsOpen(false)} className={styles.closeButton}>✕</button>
                </div>

                <div className={styles.linksList}>
                    {Object.entries(CLUB_LOCATIONS).map(([club, locations]) => (
                        <div key={club} className={styles.clubSection}>
                            <h3 className={styles.clubTitle}>{club}</h3>

                            {locations.length > 0 ? (
                                locations.map(location => {
                                    const link = getLink(club, location)
                                    return (
                                        <div key={location} className={styles.linkRow}>
                                            <span className={styles.locationName}>{location}</span>
                                            <div className={styles.linkActions}>
                                                <input readOnly value={link} className={styles.linkInput} />
                                                <button
                                                    onClick={() => copyToClipboard(link)}
                                                    className={styles.copyButton}
                                                >
                                                    {copied === link ? 'Copied!' : 'Copy'}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className={styles.linkRow}>
                                    <span className={styles.locationName}>Main</span>
                                    <div className={styles.linkActions}>
                                        <input readOnly value={getLink(club)} className={styles.linkInput} />
                                        <button
                                            onClick={() => copyToClipboard(getLink(club))}
                                            className={styles.copyButton}
                                        >
                                            {copied === getLink(club) ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
