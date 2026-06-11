<?php
/**
 * Richard Gott / Sounding Board blog tools toolbar.
 *
 * Snippet type: PHP
 * Recommended setting in Code Snippets/WPCode: run on site front-end only.
 *
 * What it does:
 * - Outputs an "All Posts" link, category links, and a search form above the
 *   generated posts grid.
 * - Uses the existing .rg-blog-tools CSS in "WP Additional CSS.css".
 * - Appears on the blog start page, category archives, date/tag archives, and
 *   search results.
 *
 * If your snippet plugin says not to include the opening PHP tag, remove the
 * first line of this file before pasting.
 */

if (! function_exists('rg_blog_tools_should_render')) {
    function rg_blog_tools_should_render($query = null) {
        if (is_admin() || is_feed() || is_singular()) {
            return false;
        }

        if ($query instanceof WP_Query && ! $query->is_main_query()) {
            return false;
        }

        return is_home() || is_archive() || is_search();
    }
}

if (! function_exists('rg_output_blog_tools_toolbar')) {
    function rg_output_blog_tools_toolbar($extra_class = '') {
        $home_url = home_url('/');
        $categories = get_categories(array(
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC',
        ));
        $class_names = trim('rg-blog-tools ' . $extra_class);
        ?>
        <nav class="<?php echo esc_attr($class_names); ?>" aria-label="Blog tools">
            <ul class="rg-blog-tools-categories">
                <li class="<?php echo is_home() && ! is_search() ? 'current-cat' : ''; ?>">
                    <a href="<?php echo esc_url($home_url); ?>">All Posts</a>
                </li>

                <?php foreach ($categories as $category) : ?>
                    <li class="<?php echo is_category($category->term_id) ? 'current-cat' : ''; ?>">
                        <a href="<?php echo esc_url(get_category_link($category->term_id)); ?>">
                            <?php echo esc_html($category->name); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>

            <form role="search" method="get" class="search-form rg-blog-tools-search" action="<?php echo esc_url($home_url); ?>">
                <label>
                    <span class="screen-reader-text">Search posts</span>
                    <input
                        type="search"
                        class="search-field"
                        placeholder="Search posts..."
                        value="<?php echo esc_attr(get_search_query()); ?>"
                        name="s"
                    />
                </label>
                <button type="submit" class="search-submit">Search</button>
            </form>
        </nav>
        <?php
    }
}

if (! function_exists('rg_render_blog_tools_toolbar')) {
    function rg_render_blog_tools_toolbar($query = null) {
        global $rg_blog_tools_rendered;

        if (! empty($rg_blog_tools_rendered) || ! rg_blog_tools_should_render($query)) {
            return;
        }

        $rg_blog_tools_rendered = true;
        rg_output_blog_tools_toolbar();
    }
}

/*
 * Kadence archive hooks. These work without Kadence Elements/Pro because they
 * are normal theme action hooks.
 */
add_action('kadence_before_archive_loop', 'rg_render_blog_tools_toolbar', 20);
add_action('kadence_before_archive_content', 'rg_render_blog_tools_toolbar', 20);

/*
 * Fallback for the blog start page if the archive hooks do not fire there.
 * It outputs the toolbar in the footer, then moves it above Kadence's generated
 * posts grid. This avoids loop_start, which made the toolbar behave like a post
 * card inside the grid.
 */
if (! function_exists('rg_render_blog_tools_footer_fallback')) {
    function rg_render_blog_tools_footer_fallback() {
        global $rg_blog_tools_rendered;

        if (! empty($rg_blog_tools_rendered) || ! rg_blog_tools_should_render()) {
            return;
        }

        $rg_blog_tools_rendered = true;
        ?>
        <div id="rgBlogToolsFallback" hidden>
            <?php rg_output_blog_tools_toolbar('rg-blog-tools-fallback'); ?>
        </div>

        <script>
            (function () {
                var wrapper = document.getElementById('rgBlogToolsFallback');

                if (!wrapper) {
                    return;
                }

                var toolbar = wrapper.querySelector('.rg-blog-tools');
                var target = document.querySelector('#archive-container, .post-archive, .kadence-posts.grid-cols');
                var intro = document.querySelector('.rg-wp-blog-intro');

                if (!toolbar) {
                    wrapper.remove();
                    return;
                }

                if (target && target.parentNode) {
                    target.parentNode.insertBefore(toolbar, target);
                } else if (intro && intro.parentNode) {
                    intro.insertAdjacentElement('afterend', toolbar);
                } else {
                    document.body.insertBefore(toolbar, document.body.firstChild);
                }

                toolbar.classList.remove('rg-blog-tools-fallback');
                wrapper.remove();
            })();
        </script>
        <?php
    }
}

add_action('wp_footer', 'rg_render_blog_tools_footer_fallback', 20);
