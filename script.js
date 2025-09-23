// Replace the content of your script.js (or the relevant block) with this:

document.addEventListener('DOMContentLoaded', function() {
    // Get references to the elements
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon'); // Now targets the <i> tag
    const darkModeText = document.getElementById('darkModeText'); // Target the text span
    const body = document.body;

    // --- Function to set the theme ---
    // Applies the theme, updates icon, updates labels, and saves preference
    function setTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
            darkModeToggle.setAttribute('aria-label', 'Switch to Light Mode');
            darkModeText.textContent = 'Switch to Light Mode';
            localStorage.setItem('darkMode', 'true'); // Save as string 'true'
        } else {
            body.classList.remove('dark-mode');
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
            darkModeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
            darkModeText.textContent = 'Switch to Dark Mode';
            localStorage.setItem('darkMode', 'false'); // Save as string 'false'
        }
    }

    // --- Check for saved preference on page load ---
    const savedDarkMode = localStorage.getItem('darkMode');

    // Determine initial theme: use saved preference if available, otherwise default to light
    // (or you could check system preference here if desired)
    const initialThemeIsDark = savedDarkMode === 'true';
    setTheme(initialThemeIsDark); // Apply the initial theme

    // --- Add event listener to the toggle button ---
    darkModeToggle.addEventListener('click', () => {
        // Determine the new theme based on the current state
        const wantsDark = !body.classList.contains('dark-mode');
        setTheme(wantsDark);
    });

    // --- Experience timeline expand/collapse ---
    const timelineLinks = document.querySelectorAll('.timeline-content a.timeline-link-overlay');

    timelineLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const timelineContent = link.closest('.timeline-content');
            if (!timelineContent) return;

            const descriptionContainer = timelineContent.querySelector('.timeline-description');
            if (!descriptionContainer) return;

            const isExpanded = timelineContent.classList.contains('is-expanded');

            if (isExpanded) {
                // Collapse
                descriptionContainer.innerHTML = timelineContent.dataset.originalDescription;
                timelineContent.classList.remove('is-expanded');
                delete timelineContent.dataset.originalDescription;
            } else {
                // Expand
                const targetId = link.getAttribute('href').substring(1);
                const detailElement = document.getElementById(targetId);

                if (detailElement) {
                    const detailList = detailElement.querySelector('ul');
                    if (detailList) {
                        timelineContent.dataset.originalDescription = descriptionContainer.innerHTML;
                        descriptionContainer.innerHTML = detailList.outerHTML;
                        timelineContent.classList.add('is-expanded');
                    }
                }
            }
        });
    });
    // --- Scrollspy for navigation highlighting ---
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.site-header nav ul li a');

    const onScroll = () => {
        const scrollY = window.scrollY + 200; // Use an offset to activate a bit earlier
        let currentSectionId = "";

        // Find the ID of the last section whose top is above the scroll position
        sections.forEach(section => {
            if (scrollY >= section.offsetTop) {
                currentSectionId = section.id;
            }
        });

        // If we're scrolled to the very top, no section will be matched.
        // In that case, default to the first nav link's target.
        if (currentSectionId === "" && navLinks.length > 0) {
            currentSectionId = navLinks[0].getAttribute('href').substring(1);
        }

        // Now, update the active class on the corresponding nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // Set the correct link on initial page load
});