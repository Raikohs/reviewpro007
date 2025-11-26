'use client'

import { useState } from 'react'
import styles from './ImageModal.module.css'

export default function ImageModal({ imageUrl }: { imageUrl: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className={styles.thumbnail} onClick={() => setIsOpen(true)}>
                <img src={imageUrl} alt="Feedback attachment" />
                <div className={styles.overlay}>
                    <span>🔍 Click to view</span>
                </div>
            </div>

            {isOpen && (
                <div className={styles.modal} onClick={() => setIsOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                            ✕
                        </button>
                        <img src={imageUrl} alt="Feedback attachment full size" />
                    </div>
                </div>
            )}
        </>
    )
}
