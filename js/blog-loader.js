// Simple blog post loader for static sites
class BlogLoader {
    constructor() {
        this.posts = [];
        this.loadPosts();
    }

    async loadPosts() {
        // This is a simple implementation - you'll need to manually add posts here
        // or use a build process to generate this from markdown files
        this.posts = [
            {
                title: "Welcome to My New Blog",
                date: "2024-01-01",
                category: "field-notes",
                excerpt: "This is a sample blog post to demonstrate the new CMS system. You can edit this through the admin interface!",
                readingTime: "2 min read",
                image: "",
                slug: "welcome-to-my-new-blog"
            }
            // Add more posts here as you create them
        ];
        
        this.renderPosts();
    }

    renderPosts() {
        const blogContainer = document.getElementById('blogPosts');
        if (!blogContainer) return;

        blogContainer.innerHTML = '';

        this.posts.forEach(post => {
            const postElement = this.createPostElement(post);
            blogContainer.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'blog-post';
        article.setAttribute('data-category', post.category);

        const imageUrl = post.image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

        article.innerHTML = `
            <div class="blog-post-image" style="background-image: url('${imageUrl}')"></div>
            <div class="blog-post-content">
                <div class="blog-post-meta">
                    <div class="author-avatar">RG</div>
                    <div class="post-meta-text">
                        <div>Richard Gott</div>
                        <div>${this.formatDate(post.date)} • ${post.readingTime}</div>
                    </div>
                    <div class="post-category">${this.formatCategory(post.category)}</div>
                </div>
                <h2>${post.title}</h2>
                <div class="blog-post-excerpt">
                    ${post.excerpt}
                </div>
                <div class="blog-post-footer">
                    <div class="post-engagement">
                        <div class="post-views">👁 0 views</div>
                        <div class="post-comments">💬 0 comments</div>
                    </div>
                    <div class="post-like">❤️</div>
                </div>
            </div>
        `;

        return article;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    formatCategory(category) {
        const categoryMap = {
            'toolkit': 'Toolkit',
            'collaborations': 'Collaborations',
            'field-notes': 'Field Notes'
        };
        return categoryMap[category] || category;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BlogLoader();
});