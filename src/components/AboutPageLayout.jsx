import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AboutPageLayout = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        const isAboutPage = location.pathname === '/about';

        // Toggle body class
        document.body.classList.toggle('about-page-open', isAboutPage);

        // Elements to hide
        const elementsToHide = [
            '.sidebar', 'aside',           // Sidebar
            '.header', 'header',          // Main header
            '.admin-bar', '.admin-header', // Admin header (target your specific white bar)
            '.search-bar', '[role="search"]' // Search bar
        ];

        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (isAboutPage) {
                    el.dataset.originalDisplay = el.style.display;
                    el.style.display = 'none';
                } else if (el.dataset.originalDisplay) {
                    el.style.display = el.dataset.originalDisplay;
                }
            });
        });

        return () => {
            document.body.classList.remove('about-page-open');
            // Restore all hidden elements
            elementsToHide.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.dataset.originalDisplay) {
                        el.style.display = el.dataset.originalDisplay;
                    }
                });
            });
        };
    }, [location]);

    return <>{children}</>;
};

export default AboutPageLayout;