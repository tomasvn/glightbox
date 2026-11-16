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
                        rel: 'preload',
                        as: 'font',
                        href: '/glightbox/fonts/lobster-regular-optimized.woff2',
                        type: 'font/woff2',
                        crossorigin: ''
                    }
                },
                {
                    tag: 'link',
                    attrs: {
                        rel: 'stylesheet',
                        href: '/glightbox/fonts/lobster.css'
                    }
                },
                {
                    tag: 'link',
                    attrs: {
                        rel: 'stylesheet',
                        href: '/glightbox/dist/css/glightbox.css'
                    }
                }
            ],
            customCss: ['./src/styles/custom.css'],
            components: {
                Hero: './src/components/Hero.astro',
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
                    items: [{ label: 'Introduction', link: '/' }, { slug: 'getting-started', label: 'Install' }, 'features', { slug: 'examples', label: 'Live demo' }]
                },
                {
                    label: 'Guides',
                    items: [{ slug: 'guides', label: 'Overview' }, 'options', 'styling', 'video-player', 'api']
                },
                {
                    label: 'Resources',
                    items: [
                        'license',
                        'changelog',
                        {
                            label: 'Contributing',
                            link: 'https://github.com/tomasvn/glightbox/blob/master/CONTRIBUTING.md'
                        }
                    ]
                }
            ]
        })
    ]
});
