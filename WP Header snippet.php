<?php
/**
 * Richard Gott / Sounding Board header snippet.
 *
 * Snippet type: PHP
 * Recommended setting in Code Snippets/WPCode: run on site front-end only.
 *
 * The is_admin() guard prevents this markup from loading in the WordPress
 * dashboard if the snippet is accidentally configured to run everywhere.
 */

add_action('wp_body_open', 'rg_render_sounding_board_header', 5);

function rg_render_sounding_board_header() {
    if (is_admin()) {
        return;
    }

    $static_site_url = 'https://richardgott.co.uk';
    ?>
    <header class="rg-wp-site-header" role="banner">
        <div class="rg-wp-header-content">
            <p class="rg-wp-site-title">Richard Gott | Sound recordist | Wales</p>

            <div class="rg-wp-contact-header">
                <span class="rg-wp-location-phone">
                    Cardiff and West Wales
                    <a href="tel:+447813064680" class="rg-wp-phone-link">+44 7813 064680</a>
                </span>

                <div class="rg-wp-social-icons" aria-label="Social links">
                    <a href="https://wa.me/447813064680" target="_blank" rel="noopener" class="rg-wp-social-icon rg-wp-whatsapp" aria-label="WhatsApp">
                        <img src="<?php echo esc_url($static_site_url . '/assets/images/whatsapp.svg'); ?>" alt="" />
                    </a>
                    <a href="https://www.instagram.com/richardgott/" target="_blank" rel="noopener" class="rg-wp-social-icon rg-wp-instagram" aria-label="Instagram">
                        <img src="<?php echo esc_url($static_site_url . '/assets/images/instagram.svg'); ?>" alt="" />
                    </a>
                    <a href="https://www.linkedin.com/in/soundrecordistuk/" target="_blank" rel="noopener" class="rg-wp-social-icon rg-wp-linkedin" aria-label="LinkedIn">
                        <img src="<?php echo esc_url($static_site_url . '/assets/images/linkedin.svg'); ?>" alt="" />
                    </a>
                </div>
            </div>
        </div>

        <nav class="rg-wp-main-nav" aria-label="Main menu">
            <button class="rg-wp-mobile-menu-toggle" type="button" aria-label="Toggle menu" aria-controls="rgWpNavLinks" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul class="rg-wp-nav-links" id="rgWpNavLinks">
                <li><a href="<?php echo esc_url($static_site_url . '/index.html'); ?>">Home</a></li>
                <li><a href="<?php echo esc_url($static_site_url . '/work-history.html'); ?>">Past Work</a></li>
                <li><a href="<?php echo esc_url($static_site_url . '/testimonials.html'); ?>">Testimonials</a></li>
                <li><a href="<?php echo esc_url($static_site_url . '/kit.html'); ?>">Kit</a></li>
                <li><a href="<?php echo esc_url(home_url('/')); ?>" class="rg-wp-active" aria-current="page">Blog</a></li>
            </ul>
        </nav>
    </header>

    <section class="rg-wp-blog-intro" aria-labelledby="rgWpBlogIntroTitle">
        <h1 class="rg-wp-blog-intro-title" id="rgWpBlogIntroTitle">
            <span class="rg-wp-green-text">SOUNDING</span>
            <span class="rg-wp-white-text">BOARD</span>
        </h1>
        <p class="rg-wp-blog-intro-description">
            Sounding Board (in active development at May 2025) is a space where I explore ideas and observations from my world of sound. Whether it's reflections from the field, thoughts on gear, or sonic moments that inspire, you'll find posts here that expand on my work and passion for location audio, field recording and listening to the world. I welcome and invite discussion on any of these posts.
        </p>
    </section>

    <script>
        (function () {
            var header = document.querySelector('.rg-wp-site-header');

            if (!header) {
                return;
            }

            var toggle = header.querySelector('.rg-wp-mobile-menu-toggle');
            var navLinks = header.querySelector('#rgWpNavLinks');

            if (!toggle || !navLinks) {
                return;
            }

            function closeMenu() {
                navLinks.classList.remove('rg-wp-mobile-active');
                toggle.classList.remove('rg-wp-is-active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }

            toggle.addEventListener('click', function () {
                var isOpen = navLinks.classList.toggle('rg-wp-mobile-active');
                toggle.classList.toggle('rg-wp-is-active', isOpen);
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });

            navLinks.addEventListener('click', function (event) {
                if (event.target.closest('a')) {
                    closeMenu();
                }
            });

            document.addEventListener('click', function (event) {
                if (!header.contains(event.target) && navLinks.classList.contains('rg-wp-mobile-active')) {
                    closeMenu();
                }
            });

            window.addEventListener('resize', function () {
                if (window.innerWidth > 768) {
                    closeMenu();
                }
            });
        })();
    </script>
    <?php
}
