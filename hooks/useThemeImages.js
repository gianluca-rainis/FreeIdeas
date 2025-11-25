import { useAppContext } from '../contexts/CommonContext';
import { useRouter } from 'next/router';

export function useThemeImages() {
    const { themeIsLight, getImagePath, getUserImageSrc } = useAppContext();
    const router = useRouter();

    // Get logo source based on current route and theme
    function getLogoSrc() {
        return getImagePath('FreeIdeas');
    };

    // Get GitHub logo source
    function getGithubLogoSrc() {
        return themeIsLight ? '/images/github.svg' : '/images/github-white.svg';
    };

    // Get menu icon for mobile
    function getMobileMenuSrc() {
        return getImagePath('menu');
    };

    // Get theme toggle button source
    function getThemeToggleSrc() {
        return themeIsLight ? '/images/sun-dark.svg' : '/images/sun-light.svg';
    };

    // Get back button source
    function getBackButtonSrc() {
        return getImagePath('back');
    };

    // Get page-specific images
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
    };

    return {
        themeIsLight,
        getLogoSrc,
        getGithubLogoSrc,
        getMobileMenuSrc,
        getThemeToggleSrc,
        getBackButtonSrc,
        getPageSpecificImages,
        getUserImageSrc,
        getImagePath
    };
}