import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://tomasvn.github.io',
    base: '/glightbox',
    integrations: [
        starlight({
            title: 'GLightbox',
            description: 'Documentation for the lightweight, responsive GLightbox library.',
            head: [
                {
                    tag: 'link',
                    attrs: {
                        rel: 'stylesheet',
                        href: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap'
                    }
                }
            ],
            customCss: ['./src/styles/custom.css'],
            components: {
                SocialIcons: './src/components/HeaderLinks.astro'
            },
            editLink: {
                baseUrl: 'https://github.com/tomasvn/glightbox/edit/master/packages/docs/'
            },
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/tomasvn/glightbox'
                }
            ],
            sidebar: [
                {
                    label: 'Overview',
                    items: [{ label: 'Introduction', link: '/' }, { slug: 'getting-started', label: 'Install' }, 'features', 'examples', { label: 'Live demo', link: '/demo.html' }]
                },
                {
                    label: 'Guides',
                    items: [{ slug: 'guides', label: 'Overview' }, 'options', 'styling', 'video-player', 'api']
                },
                {
                    label: 'Resources',
                    items: ['license', 'changelog', { label: 'Contributing', link: 'https://github.com/tomasvn/glightbox/blob/master/CONTRIBUTING.md' }]
                }
            ]
        })
    ]
});
