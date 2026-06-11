<?php
/**
 * Richard Gott / Sounding Board blog tools toolbar.
 *
 * Snippet type: PHP
 * Recommended setting in Code Snippets/WPCode: run on site front-end only.
 *
 * What it does:
 * - Outputs an "All Posts" link, category links, and a search form.
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

if (! function_exists('rg_render_blog_tools_toolbar')) {
    function rg_render_blog_tools_toolbar($query = null) {
        static $rendered = false;

        if ($rendered || ! rg_blog_tools_should_render($query)) {
            return;
        }

        $rendered = true;
        $home_url = home_url('/');
        $categories = get_categories(array(
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC',
        ));
        ?>
        <nav class="rg-blog-tools" aria-label="Blog tools">
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

/*
 * Kadence archive hooks. These work without Kadence Elements/Pro because they
 * are normal theme action hooks.
 */
add_action('kadence_before_archive_loop', 'rg_render_blog_tools_toolbar', 20);
add_action('kadence_before_archive_content', 'rg_render_blog_tools_toolbar', 20);

/*
 * Generic WordPress fallback. If the Kadence hook does not fire, this places
 * the toolbar as the first full-width item in the generated posts grid.
 */
add_action('loop_start', 'rg_render_blog_tools_toolbar', 1);
