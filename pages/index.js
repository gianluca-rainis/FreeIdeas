import styles from '@/styles/Home.module.css'
import '@/styles/HomePage.module.css';
import '@/styles/ResponsivePages.module.css';
import '@/styles/ThemeAndBase.module.css';
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Head from '@/components/Head'
import { useAppContext } from '@/contexts/CommonContext'
import { apiCall } from '@/utils/apiConfig'

// Server-side rendering
export async function getStaticProps() {
    const ideasEmpty = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Idea ${i + 1}`,
        author: `Author ${i + 1}`,
        image: null
    }));
    
    return {
        props: {
            ideasEmpty: ideasEmpty,
            pageTitle: ""
        }
    }
}

function formatImage(rawImage) {
    if (!rawImage) {
        return null;
    }

    if (typeof rawImage === 'string') {
        return rawImage;
    }

    if (rawImage?.data && Array.isArray(rawImage.data) && typeof window !== 'undefined') {
        try {
            let binary = '';
            const bytes = rawImage.data;
            const chunkSize = 0x8000;

            for (let i = 0; i < bytes.length; i += chunkSize) {
                const chunk = bytes.slice(i, i + chunkSize);
                binary += String.fromCharCode(...chunk);
            }

            return `data:image/png;base64,${window.btoa(binary)}`;
        } catch (error) {
            console.error('Unable to parse image buffer:', error);
            return null;
        }
    }

    return null;
}

function FeaturedIdeasCarousel({ allIdeas, images }) {
    const router = useRouter();
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [galleryAutoScroll, setGalleryAutoScroll] = useState(true);
    const [visibleSets, setVisibleSets] = useState(2);
    const galleryRef = useRef(null);
    const galleryScrollTimeoutRef = useRef(null);
    const lastSetAddTimeRef = useRef(0);
    const singleSetHeightRef = useRef(0);

    useEffect(() => {
        if (!isAutoPlay || !allIdeas || allIdeas.length < 2) {
            return;
        }

        const interval = setInterval(() => {
            setCarouselIndex(prev => (prev + 2 >= allIdeas.length ? 0 : prev + 2));
        }, 6000);

        return () => clearInterval(interval);
    }, [isAutoPlay, allIdeas]);

    useEffect(() => {
        if (!galleryAutoScroll || !galleryRef.current) {
            return;
        }

        const scrollInterval = setInterval(() => {
            if (galleryRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = galleryRef.current;
                const idealSingleSetHeight = (scrollHeight - clientHeight) / 2;
                singleSetHeightRef.current = idealSingleSetHeight;
                
                galleryRef.current.scrollTop += 1;
                
                // When approaching bottom, add a new set (max 3 total)
                const now = Date.now();

                if (scrollTop + clientHeight >= scrollHeight - 300 && now - lastSetAddTimeRef.current > 500) {
                    lastSetAddTimeRef.current = now;
                    setVisibleSets(prev => (prev < 3 ? prev + 1 : 3));
                }
                
                // When at top and have more than 2 sets, remove oldest
                if (scrollTop < 100 && visibleSets > 2) {
                    const newScroll = Math.max(0, scrollTop + idealSingleSetHeight);

                    setVisibleSets(prev => Math.max(2, prev - 1));
                    setTimeout(() => {
                        if (galleryRef.current) {
                            galleryRef.current.scrollTop = newScroll;
                        }
                    }, 0);
                }
            }
        }, 35);

        return () => clearInterval(scrollInterval);
    }, [galleryAutoScroll, visibleSets]);

    if (!allIdeas || allIdeas.length === 0) {
        return null;
    }

    const idea1 = allIdeas[carouselIndex] || null;
    const idea2 = allIdeas[carouselIndex + 1] || null;

    function handleGalleryClick(index) {
        setCarouselIndex(index);
        setIsAutoPlay(false);
    }

    function handleAutoResume() {
        setIsAutoPlay(true);
    }

    function handleGalleryScroll() {
        // User is scrolling manually - pause auto-scroll
        /* setGalleryAutoScroll(false);
        
        // Clear any existing timeout
        if (galleryScrollTimeoutRef.current) {
            clearTimeout(galleryScrollTimeoutRef.current);
        }
        
        // Resume auto-scroll after 3 seconds of inactivity
        galleryScrollTimeoutRef.current = setTimeout(() => {
            setGalleryAutoScroll(true);
        }, 3000); */
    }

    return (
        <div className={styles.carouselContainer}>
            {/* Featured Pair */}
            <div className={styles.featuredCarouselGrid}>
                {idea1 && (
                    <Link
                        href={`/idea/${idea1.id || 0}`}
                        className={styles.carouselCard}
                        onMouseEnter={() => router.prefetch(`/idea/${idea1.id || 0}`)}
                    >
                        <img src={images[idea1.id] || '/images/FreeIdeas.svg'} alt="Featured idea" className={styles.carouselImage} />
                        <div className={styles.carouselContent}>
                            <p className={styles.carouselKicker}>Latest published</p>
                            <h3 className={styles.carouselTitle}>{idea1.title || 'Untitled'}</h3>
                            <p className={styles.carouselAuthor}>by {idea1.author || 'Unknown'}</p>
                        </div>
                    </Link>
                )}
                {idea2 && (
                    <Link
                        href={`/idea/${idea2.id || 0}`}
                        className={styles.carouselCard}
                        onMouseEnter={() => router.prefetch(`/idea/${idea2.id || 0}`)}
                    >
                        <img src={images[idea2.id] || '/images/FreeIdeas.svg'} alt="Featured idea" className={styles.carouselImage} />
                        <div className={styles.carouselContent}>
                            <p className={styles.carouselKicker}>Latest published</p>
                            <h3 className={styles.carouselTitle}>{idea2.title || 'Untitled'}</h3>
                            <p className={styles.carouselAuthor}>by {idea2.author || 'Unknown'}</p>
                        </div>
                    </Link>
                )}
            </div>

            {/* Gallery/Selector List - Dynamic infinite scroll */}
            <div 
                className={styles.carouselGallery}
                ref={galleryRef}
                onScroll={handleGalleryScroll}
            >
                {/* Render multiple cycles dynamically */}
                {Array.from({ length: visibleSets }).map((_, setIndex) => (
                    allIdeas.map((idea, index) => {
                        const isActive = index >= carouselIndex && index < carouselIndex + 2;

                        return (
                            <button
                                key={`carousel-thumb-${setIndex}-${index}`}
                                className={`${styles.carouselThumb} ${isActive ? styles.carouselThumbActive : ''}`}
                                onClick={() => handleGalleryClick(index)}
                                onMouseEnter={handleAutoResume}
                                title={idea.title}
                            >
                                <img src={images[idea.id] || '/images/FreeIdeas.svg'} alt={idea.title || 'Idea'} />
                                <span className={styles.carouselThumbLabel}>{idea.title || 'Untitled'}</span>
                            </button>
                        );
                    })
                ))}
            </div>
        </div>
    );
}

function FeaturedIdea({ idea, imageSrc, randomIdeaId }) {
    const router = useRouter();

    if (!idea) {
        return null;
    }

    const finalId = idea.id || randomIdeaId || 0;

    return (
        <Link
            href={`/idea/${finalId}`}
            className={styles.featuredIdea}
            onMouseEnter={() => router.prefetch(`/idea/${finalId}`)}
        >
            <img src={imageSrc || '/images/FreeIdeas.svg'} alt="Featured idea" className={styles.featuredImage} />
            <div className={styles.featuredContent}>
                <p className={styles.kicker}>Latest published idea</p>
                <h3 className={styles.featuredTitle}>{idea.title || 'Untitled idea'}</h3>
                <p className={styles.featuredAuthor}>by {idea.author || 'Unknown author'}</p>
                <p className={styles.featuredText}>Open the full concept, read details, and decide if this is your next collaboration.</p>
            </div>
        </Link>
    )
}

function LatestIdeasRail({ ideas, images }) {
    const router = useRouter();

    if (!Array.isArray(ideas)) {
        return null;
    }

    return (
        <ul className={styles.latestRail}>
            {ideas.map((idea, index) => (
                <li key={`latest-idea-${index}`}>
                    <Link
                        href={`/idea/${idea.id || 0}`}
                        className={styles.railItem}
                        onMouseEnter={() => router.prefetch(`/idea/${idea.id || 0}`)}
                    >
                        <img src={images[idea.id] || '/images/FreeIdeas.svg'} alt="Latest idea" className={styles.railImage} />
                        <div>
                            <p className={styles.railTitle}>{idea.title || 'Untitled idea'}</p>
                            <p className={styles.railAuthor}>by {idea.author || 'Unknown author'}</p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
}

function Banner({ message = '', show = false }) {
    if (!show || !message) {
        return null;
    }

    return (
        <div className={styles.banner} role="status" aria-live="polite">
            {message}
        </div>
    )
}

function ColoredSlogan() {
    return (
        <h1 className={styles.sloganTitle}>
            A place where ideas can be free.
        </h1>
    )
}

const MANIFESTO_QUOTES = [
    'Ideas are what move the world forward.',
    'Ideas deserve freedom. Not judgment. Not silence.',
    'Creativity grows when it is shared.',
    'No filters. No gatekeepers. Just ideas.',
    'You do not need permission to create.',
    'Every idea is a seed. Sharing is planting.',
    'Some ideas are quiet. They still deserve to be heard.',
    'Do not wait for perfect. Publish what is real.',
    'Originality starts with the courage to share.',
    'Your imagination deserves a place to breathe.'
];

const WHY_FREEIDEAS_SLOGANS = [
    'A living space for ideas that want to grow.',
    'Publish freely, discover boldly.',
    'Where every idea gets an equal stage.',
    'No gatekeeping. No gatechecked ideas.',
    'Your rough draft is someone\'s breakthrough.',
    'Ideas don\'t need permission here.',
    'Build a community around what you create.',
    'From spark to spotlight in one place.',
    'Finish your ideas together, not alone.',
    'Creativity thrives when it is free.',
    'A place where unfinished ideas matter.',
    'Share what you\'re thinking, not what\'s perfect.',
    'Ideas grow faster when they\'re seen.',
    'Your next big move starts as a thought here.',
    'Publish first, perfect later.',
    'Where ideas find the people who need them.',
    'Freedom to create, space to share.',
    'Every voice deserves to be heard.',
    'Ideas are precious. Make them visible.',
    'Collaborate on concepts before they\'re finished.',
    'Build something real from what lives in your head.',
    'A platform that celebrates your unpolished genius.',
    'Swap ideas. Fuel each other. Create together.'
];

export default function HomePage({ ideasEmpty, pageTitle }) {
    const { randomIdeaId, bannerMessage, showBanner, themeIsLight } = useAppContext();
    const hasBanner = Boolean(showBanner && bannerMessage);
    const [selectedSlogan, setSelectedSlogan] = useState('');
    const [images, setImages] = useState({});
    const [ideas, setIdeas] = useState(ideasEmpty);

    useEffect(() => {
        setSelectedSlogan(WHY_FREEIDEAS_SLOGANS[Math.floor(Math.random() * WHY_FREEIDEAS_SLOGANS.length)]);
    }, []);

    useEffect(() => {
        async function loadIdeas() {
            try {
                const data = await apiCall(`/api/getLastIdeas`);

                if (data.success) {
                    const sourceList = data.data || [];

                    let loadedIdeas = sourceList.map(idea => ({
                        id: idea.id,
                        title: idea.title,
                        author: idea.username,
                        image: null
                    }));

                    if (loadedIdeas.length < 12) {
                        const fill = [];

                        for (let i = loadedIdeas.length; i < 12; i++) {
                            const base = loadedIdeas[i % (loadedIdeas.length || 1)] || { 
                                id: i + 1, 
                                title: `Idea ${i + 1}`, 
                                author: `Author ${i + 1}`, 
                                image: null 
                            };

                            fill.push({ ...base, id: base.id ?? i + 1 });
                        }

                        loadedIdeas = loadedIdeas.concat(fill);
                    }
                    
                    setIdeas(loadedIdeas);

                    const imageMap = {};

                    sourceList.forEach(idea => {
                        if (idea.ideaimage) {
                            const formatted = formatImage(idea.ideaimage);

                            if (formatted) {
                                imageMap[idea.id] = formatted;
                            }
                        }
                    });

                    setImages(imageMap);
                }
            } catch (error) {
                console.error('Failed to fetch ideas:', error);

                const fallbackIdeas = Array.from({ length: 12 }, (_, i) => ({
                    id: i + 1,
                    title: `Idea ${i + 1}`,
                    author: `Author ${i + 1}`,
                    image: null
                }));

                setIdeas(fallbackIdeas);
            }
        }

        loadIdeas();
    }, []);

    const latestIdeas = ideas.slice(0, 8);

    return (
        <>
            <Head pageTitle={pageTitle} />
            <Nav randomId={randomIdeaId} />

            <main className={`${styles.home} ${themeIsLight ? styles.light : styles.dark}`}>
                {hasBanner && <Banner message={bannerMessage} show={showBanner} />}

                <section className={styles.heroSection}>
                    <div className={styles.heroCopy}>
                        <p className={styles.heroEyebrow}>An open idea library</p>
                        <h1>
                            Give every idea
                            <span> room to become real.</span>
                        </h1>
                        <p className={styles.heroText}>
                            Publish what you are imagining, discover what others are building, and turn unfinished thoughts into shared possibilities.
                        </p>
                        <div className={styles.heroActions}>
                            <Link href="/publishAnIdea" className={styles.primaryAction} prefetch>
                                Publish an idea
                            </Link>
                            <Link href="/searchAnIdea" className={styles.secondaryAction} prefetch>
                                Browse the library
                            </Link>
                        </div>
                    </div>

                    <div className={styles.heroStatement}>
                        <span className={styles.statementIndex}>01</span>
                        <p>A place where<br />ideas can be free.</p>
                        <Link href={`/idea/${randomIdeaId || 0}`} prefetch>
                            Explore a random idea
                        </Link>
                    </div>
                </section>

                <section className={styles.ideasSection}>
                    <div className={styles.sectionHeading}>
                        <p>Recently published</p>
                        <h2>Fresh thinking from the community.</h2>
                        <Link href="/searchAnIdea" prefetch>View all ideas</Link>
                    </div>

                    <div className={styles.ideaGrid}>
                        {latestIdeas.map((idea, index) => (
                            <Link
                                href={`/idea/${idea.id || 0}`}
                                className={`${styles.ideaCard} ${index === 0 ? styles.featuredCard : ''}`}
                                key={`home-idea-${idea.id}-${index}`}
                            >
                                <div className={styles.ideaImageWrap}>
                                    <img
                                        src={images[idea.id] || '/images/FreeIdeas.svg'}
                                        alt=""
                                        className={styles.ideaImage}
                                    />
                                    <span>{String(index + 1).padStart(2, '0')}</span>
                                </div>
                                <div className={styles.ideaCardCopy}>
                                    <p>Latest idea</p>
                                    <h3>{idea.title || 'Untitled idea'}</h3>
                                    <span>by {idea.author || 'Unknown author'}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className={styles.principlesSection}>
                    <div className={styles.principlesHeading}>
                        <p>Why FreeIdeas</p>
                        <h2>A simpler way to share, discover and develop ideas.</h2>
                    </div>

                    <div className={styles.principlesList}>
                        <article>
                            <span>01</span>
                            <h3>Open by default</h3>
                            <p>Every idea deserves an equal place in the public conversation.</p>
                        </article>
                        <article>
                            <span>02</span>
                            <h3>Built for feedback</h3>
                            <p>Comments and discussions help rough concepts become useful ones.</p>
                        </article>
                        <article>
                            <span>03</span>
                            <h3>Made to be shared</h3>
                            <p>Choose a license and let the community explore your work.</p>
                        </article>
                    </div>
                </section>

                <section className={styles.closingSection}>
                    <p>One thought can be the beginning of something shared.</p>
                    <Link href="/publishAnIdea" className={styles.primaryAction} prefetch>
                        Start publishing
                    </Link>
                </section>
            </main>

            <Footer />
        </>
    )
}
