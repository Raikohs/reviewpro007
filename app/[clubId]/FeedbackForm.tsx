'use client'

import { useState } from 'react'
import styles from '../page.module.css'

// Location configuration for each club
const CLUB_LOCATIONS: Record<string, string[]> = {
    'LEVEL': ['ASTANA', 'SARAISHYK', 'ZAHZAGANSK'],
    'SPACE': ['MAMETOVA', 'TRK'],
    'PINGWIN': [] // Single location, no selector needed
}

export default function FeedbackForm({ clubId, initialLocation }: { clubId: string, initialLocation?: string }) {
    const locations = CLUB_LOCATIONS[clubId] || []

    // Validate initialLocation against available locations for this club
    const validInitialLocation = initialLocation && locations.includes(initialLocation) ? initialLocation : undefined

    const [location, setLocation] = useState(validInitialLocation || locations[0] || '')
    const [type, setType] = useState<'suggestion' | 'complaint'>('suggestion')
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [contact, setContact] = useState('')
    const [photo, setPhoto] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhoto(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) return

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append('clubId', clubId)
            if (location) {
                formData.append('location', location)
            }
            formData.append('type', type)
            if (category) {
                formData.append('category', category)
            }
            formData.append('rating', rating.toString())
            formData.append('comment', comment)
            if (contact) {
                formData.append('contact', contact)
            }
            if (photo) {
                formData.append('photo', photo)
            }

            const res = await fetch('/api/feedback', {
                method: 'POST',
                body: formData,
            })

            if (res.ok) {
                setIsSubmitted(true)
            }
        } catch (error) {
            console.error('Error submitting feedback:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <main className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.success}>
                        <span className={styles.successIcon}>🎉</span>
                        <h1 className={styles.title}>Спасибо!</h1>
                        <p className={styles.subtitle}>
                            Ваше {type === 'suggestion' ? 'предложение' : 'обращение'} для {clubId} отправлено.
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    const categories = [
        { id: 'computers', label: '🖥️ Компьютеры/Девайсы' },
        { id: 'service', label: '👤 Обслуживание' },
        { id: 'food', label: '🍔 Еда/Напитки' },
        { id: 'cleanliness', label: '🧹 Чистота' },
        { id: 'other', label: '📝 Другое' }
    ]

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{clubId}</h1>
                <p className={styles.subtitle}>Оставьте отзыв о клубе</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Location Display/Selector */}
                    {locations.length > 0 && (
                        <div className={styles.locationSelector}>
                            {validInitialLocation ? (
                                <div className={styles.staticLocation}>
                                    📍 Локация: <strong>{validInitialLocation}</strong>
                                </div>
                            ) : (
                                <>
                                    <label className={styles.locationLabel}>Выберите точку:</label>
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className={styles.locationSelect}
                                    >
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                    )}

                    {/* Feedback Type Selector */}
                    <div className={styles.typeSelector}>
                        <button
                            type="button"
                            className={`${styles.typeButton} ${type === 'suggestion' ? styles.typeActive : ''}`}
                            onClick={() => setType('suggestion')}
                        >
                            💡 Предложение
                        </button>
                        <button
                            type="button"
                            className={`${styles.typeButton} ${type === 'complaint' ? styles.typeActive : ''}`}
                            onClick={() => setType('complaint')}
                        >
                            ⚠️ Жалоба
                        </button>
                    </div>

                    {/* Category Selector */}
                    <div className={styles.categoryContainer}>
                        <label className={styles.label}>Категория:</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="" disabled>Выберите категорию</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Star Rating */}
                    <div className={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`${styles.star} ${(hoverRating || rating) >= star ? styles.active : ''}`}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    {/* Comment Textarea */}
                    <textarea
                        className={styles.textarea}
                        placeholder={
                            type === 'suggestion'
                                ? 'Расскажите, что можно улучшить...'
                                : 'Опишите проблему...'
                        }
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {/* Contact Input */}
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Контакты (необязательно):</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Телефон или Instagram"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    </div>

                    {/* Photo Upload */}
                    <div className={styles.photoUpload}>
                        <label htmlFor="photo" className={styles.photoLabel}>
                            📷 Прикрепить фото {photoPreview && '✓'}
                        </label>
                        <input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className={styles.photoInput}
                        />
                        {photoPreview && (
                            <div className={styles.photoPreview}>
                                <img src={photoPreview} alt="Preview" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhoto(null)
                                        setPhotoPreview(null)
                                    }}
                                    className={styles.removePhoto}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={rating === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                    </button>
                </form>
            </div>
        </main>
    )
}
