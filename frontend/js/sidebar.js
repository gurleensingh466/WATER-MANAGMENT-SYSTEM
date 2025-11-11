document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.querySelector('.sidebar');
    
    // Show sidebar by default on desktop
    if (window.innerWidth > 768) {
        sidebar.classList.add('active');
    }

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Submenu toggle functionality
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const submenu = toggle.nextElementSibling;
            const chevron = toggle.querySelector('.fa-chevron-right');
            
            // Close other open submenus except the clicked one
            submenuToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    const otherSubmenu = otherToggle.nextElementSibling;
                    const otherChevron = otherToggle.querySelector('.fa-chevron-right');
                    otherSubmenu.classList.remove('active');
                    otherChevron.style.transform = 'rotate(0)';
                }
            });

            submenu.classList.toggle('active');
            chevron.style.transform = submenu.classList.contains('active') 
                ? 'rotate(90deg)' 
                : 'rotate(0)';
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});