import { prisma } from '@/lib/prisma'
import styles from './page.module.css'
import { redirect } from 'next/navigation'
import ImageModal from './ImageModal'
import QRCodeGenerator from './QRCodeGenerator'

// This is a server component
export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Simple password check via query param for MVP
    // In production, use NextAuth.js or similar
    const { password } = await searchParams
    const isAuthenticated = password === 'admin123' // Hardcoded for demo

    if (!isAuthenticated) {
        return (
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <h1 className={styles.title}>Admin Access</h1>
                    <form>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            className={styles.input}
                        />
                        <button type="submit" className={styles.button}>Login</button>
                    </form>
                </div>
            </div>
        )
    }

    // Filters
    const clubFilter = (await searchParams).club as string | undefined
    const statusFilter = (await searchParams).status as string | undefined

    const where: any = {}
    if (clubFilter) where.clubId = clubFilter
    if (statusFilter) where.status = statusFilter

    const reviews = await prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    })

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : '0.0'

    const suggestionCount = reviews.filter(r => r.type === 'suggestion').length
    const complaintCount = reviews.filter(r => r.type === 'complaint').length

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <div className={styles.filters}>
                        <QRCodeGenerator />
                        <form className={styles.filterForm}>
                            <input type="hidden" name="password" value={password} />
                            <select name="club" defaultValue={clubFilter} className={styles.filterSelect}>
                                <option value="">All Clubs</option>
                                <option value="LEVEL">LEVEL</option>
                                <option value="SPACE">SPACE</option>
                                <option value="PINGWIN">PINGWIN</option>
                            </select>
                            <select name="status" defaultValue={statusFilter} className={styles.filterSelect}>
                                <option value="">All Statuses</option>
                                <option value="NEW">New</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <button type="submit" className={styles.filterButton}>Filter</button>
                        </form>
                    </div>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{reviews.length}</div>
                        <div className={styles.statLabel}>Total Reviews</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{averageRating}</div>
                        <div className={styles.statLabel}>Average Rating</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{suggestionCount}</div>
                        <div className={styles.statLabel}>Suggestions</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{complaintCount}</div>
                        <div className={styles.statLabel}>Complaints</div>
                    </div>
                </div>
            </header>

            <div className={styles.grid}>
                {reviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.headerLeft}>
                                <div className={styles.clubInfo}>
                                    <span className={styles.clubId}>Club: {review.clubId}</span>
                                    {review.location && (
                                        <span className={styles.locationBadge}>📍 {review.location}</span>
                                    )}
                                </div>
                                <div className={styles.badges}>
                                    <span className={`${styles.typeBadge} ${styles[review.type]}`}>
                                        {review.type === 'suggestion' ? '💡 Suggestion' : '⚠️ Complaint'}
                                    </span>
                                    <span className={`${styles.statusBadge} ${styles[review.status.toLowerCase()]}`}>
                                        {review.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.rating}>
                                {'★'.repeat(review.rating)}
                                <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - review.rating)}</span>
                            </div>
                        </div>

                        {review.category && (
                            <div className={styles.categoryTag}>
                                🏷️ {review.category}
                            </div>
                        )}

                        <p className={styles.comment}>{review.comment}</p>

                        {review.photoUrl && (
                            <div className={styles.photoContainer}>
                                <ImageModal imageUrl={review.photoUrl} />
                            </div>
                        )}

                        {review.contact && (
                            <div className={styles.contactInfo}>
                                📞 {review.contact}
                            </div>
                        )}

                        <div className={styles.date}>
                            {new Date(review.createdAt).toLocaleDateString()} {new Date(review.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
