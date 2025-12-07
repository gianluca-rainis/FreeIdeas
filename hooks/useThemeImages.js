import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Centralized theme management and theme-aware asset helpers
export function useThemeImages() {
    const router = useRouter();
    const [themeIsLight, setThemeIsLight] = useState(true);

    // Read preferred theme and subscribe to system changes
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const savedTheme = localStorage.getItem('themeIsLight');

        if (savedTheme !== null) {
            setThemeIsLight(savedTheme === 'true');
        }
        else {
            const mq = window.matchMedia('(prefers-color-scheme: light)');
            setThemeIsLight(mq.matches);
        }

        function handleChange(e) {
            setThemeIsLight(e.matches);
            localStorage.setItem('themeIsLight', e.matches.toString());
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Apply theme to document and swap UI assets
    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        document.documentElement.setAttribute('data-theme', themeIsLight ? 'light' : 'dark');

        updateThemeElements(themeIsLight);
    }, [themeIsLight]);

    // Re-apply theme-dependent assets after client-side navigation
    useEffect(() => {
        updateThemeElements(themeIsLight);
    }, [router.pathname, themeIsLight]);

    function toggleTheme() {
        setThemeIsLight((prev) => {
            const next = !prev;

            if (typeof window !== 'undefined') {
                localStorage.setItem('themeIsLight', next.toString());
            }
            
            updateThemeElements(next);

            return next;
        });
    }

    // Update static assets across the page
    function updateThemeElements(isLight) {
        if (typeof document === 'undefined') {
            return;
        }

        try {
            function swapSrc(selector, lightSrc, darkSrc) {
                const el = document.querySelector(selector);

                if (el) {
                    el.src = isLight ? lightSrc : darkSrc;
                }
            }

            document.querySelectorAll('.toggle-light-dark-theme').forEach((btn) => {
                btn.src = isLight ? '/images/sun-dark.svg' : '/images/sun-light.svg';
            });

            swapSrc('#githubLogo', './images/github.svg', './images/github-white.svg');

            const logos = [
                document.getElementById('pcNavBarGhost')?.querySelector('#navLogo'),
                document.getElementById('mobileNavBarGhost')?.querySelector('#navLogo'),
                document.getElementById('footerLogo'),
            ].filter(Boolean);

            if (window.location.pathname.includes('/about')) {
                const aboutLogo = document.querySelector('.footerpage')?.querySelector('.logo');

                if (aboutLogo) {
                    logos.push(aboutLogo);
                }
            }

            if (window.location.pathname.includes('/contacts')) {
                const contactsLogo = document.querySelector('.footerpage')?.querySelector('.logo');

                if (contactsLogo) {
                    logos.push(contactsLogo);
                }
            }

            if (window.location.pathname.includes('/index') || window.location.pathname === '/') {
                const indexLogo = document.getElementById('indexMain')?.querySelector('.logo');

                if (indexLogo) {
                    logos.push(indexLogo);
                }
            }

            logos.forEach((logo) => {
                if (logo) {
                    logo.src = `./images/FreeIdeas${isLight ? '' : '_Pro'}.svg`;
                }
            });

            swapSrc('#mobileNavBarGhost #menuMobile', './images/menu.svg', './images/menu_Pro.svg');

            const userImage = document.getElementById('userImage');

            if (userImage && userImage.src.includes('/images/user')) {
                userImage.src = `./images/user${isLight ? '' : '_Pro'}.svg`;
            }

            swapSrc('#notificationBackImage', './images/back.svg', './images/back_Pro.svg');

            document.querySelectorAll('.notificationsImg').forEach((element) => {
                const isActive = element.src.includes('/images/notifications_active');
                element.src = `/images/notifications${isActive ? '_active' : ''}${isLight ? '' : '_Pro'}.svg`;
            });

            if (window.location.href.includes('/publishAnIdea')) {
                swapSrc('#addAdditionalInfo', './images/add.svg', './images/add_Pro.svg');
                swapSrc('#addLog', './images/add.svg', './images/add_Pro.svg');
                swapSrc('#cancelNewIdea', './images/delete.svg', './images/delete_Pro.svg');
            }

            if (window.location.href.includes('/accountVoid')) {
                const publishedAccount = document.getElementById('publishedAccount');
                const savedAccount = document.getElementById('savedAccount');

                if (publishedAccount?.children.item(0)) {
                    publishedAccount.children.item(0).src = `./images/publish${isLight ? '' : '_Pro'}.svg`;
                }

                if (savedAccount?.children.item(0)) {
                    savedAccount.children.item(0).src = `./images/saved${isLight ? '' : '_Pro'}.svg`;
                }
            }

            if (window.location.href.includes('/ideaVoid')) {
                swapSrc('#modifyOldIdea', './images/modify.svg', './images/modify_Pro.svg');
            }
        } catch (error) {
            console.error('Error updating theme elements:', error);
        }
    }

    // Asset helpers
    function getImagePath(imageName, useThemeVariant = true) {
        if (useThemeVariant) {
            return `/images/${imageName}${themeIsLight ? '' : '_Pro'}.svg`;
        }

        return `/images/${imageName}`;
    }

    function getUserImageSrc(userImage, isAdmin = false) {
        if (isAdmin) {
            return '/images/FreeIdeas_ReservedArea.svg';
        }

        return userImage || getImagePath('user');
    }

    function getLogoSrc() {
        return getImagePath('FreeIdeas');
    }

    function getGithubLogoSrc() {
        return themeIsLight ? '/images/github.svg' : '/images/github-white.svg';
    }

    function getMobileMenuSrc() {
        return getImagePath('menu');
    }

    function getThemeToggleSrc() {
        return themeIsLight ? '/images/sun-dark.svg' : '/images/sun-light.svg';
    }

    function getBackButtonSrc() {
        return getImagePath('back');
    }

    function getPageSpecificImages() {
        const currentPath = router.pathname;
        const images = {};

        if (currentPath.includes('/publishAnIdea')) {
            images.addAdditionalInfo = getImagePath('add');
            images.addLog = getImagePath('add');
            images.cancelNewIdea = getImagePath('delete');
        }

        if (currentPath.includes('/accountVoid')) {
            images.publishedAccount = getImagePath('publish');
            images.savedAccount = getImagePath('saved');
        }

        if (currentPath.includes('/ideaVoid')) {
            images.modifyOldIdea = getImagePath('modify');
        }

        return images;
    }

    return {
        // state
        themeIsLight,
        toggleTheme,

        // asset helpers
        getImagePath,
        getUserImageSrc,
        getLogoSrc,
        getGithubLogoSrc,
        getMobileMenuSrc,
        getThemeToggleSrc,
        getBackButtonSrc,
        getPageSpecificImages,
    };
}