---
date: '2020-06-22'
tagline: Much more enjoyable than Gatsby
---

# Rewriting this blog in SvelteJS

Just over a year ago, I created this blog using Gatsby/React.
It was not a great developer experience and the blog was never exactly what I wanted.
Your blog/portfolio site should be one place where you have total creative freedom and can build exactly what you want.
So, I decided to rebuild it using a new-ish frontend framework called Svelte.

## SvelteJS

SvelteJS is relatively new to the scene of front-end frameworks.
It was created in 2018 and has a small (but very active) community.
This is mostly due to the "front-end fatigue" that developers are experiencing following the wave of Angular, React, and Vue.
However, Svelte has recently been picking up steam, and the community is growing rapidly.
This growth can be explained by Svelte's innovative approach to component-based frameworks that offers more than just cosmetic and quality-of-life improvements over its predecessors.
To be precise, Svelte drops the Virtual DOM for an entirely different compiler-based approach.
Svelte components are compiled at build time down to native Javascript DOM operations that are optimized for your site.
With this approach, SvelteJS sites are significantly lighter and faster than similar sites built with React and Vue.
I strongly believe that this is the path forward for frontend frameworks.

While Gatsby is a great static-site generator for React developers, the GraphQL queries and node management are awkward and overkill for a small blog like this.
Gatsby does a *lot* for you right out of the box, but as soon as you begin customizing the pipeline, it just gets in the way.
The plug-in system is powerful but difficult to navigate and not worth the trouble for a small site.
Of course, the payoff for all this complexity is that Gatsby will scale well to large sites, but its unnecessary for my purposes.

## How I built this

Sapper is the recommended server-side rendering and static site generator for Svelte applications.
Sapper is to Svelte, as Next is to React, and Nuxt is to Vue.
Sapper has an `export` feature built in to enable static site generation.
It also uses a file-based routing system that is simple and intuitive so I could start generating pages quickly.
Of course, Sapper does not have all of the plugins and capabilities of Gatsby, but this is not a problem for a simple blog.
I set up a custom article processing pipeline using UnifiedJS that converts markdown files into HTML.
The code below shows each step in the process.
Additional processors are used to add functionality such as code highlighting and math typesetting.

```javascript
// create the markdown processor
const processor = unified()
    .use(markdown)
    .use(frontmatter)
    .use(parseFrontmatter)
    .use(() => copyFrontmatter)
    .use(copyTitle)
    .use(math)
    .use(remark2rehype, { allowDangerousHtml : true })
    .use(raw)
    .use(katex)
    .use(codeHighlight)
    .use(html)
```

After processing all of the files, I inject links into the homepage for each article.
Sapper's export feature crawls these links to figure out which pages need to be generated.
I should note that although Sapper can do static site generation, it was originally designed for server-side rendering.
This means that the export feature does not have incremental builds and other capabilities that would be expected for large-scale static sites.

The site is hosted using AWS. I use S3 to serve the site, Certificate Manager for https, Route53 for domain name registration, and Cloudfront for content delivery.
Front-end design is not a strength of mine, so I took inspiration from the minimal aesthetic of the official Svelte blog.
For the most part I defaulted to the same design used there and customized a few aspects for my own purposes.

## Whats next

Right now I am happy with the site functioning as a simple blog.
At some point, I would like to add another page with all of my projects.
This small project was a great way to test out Svelte/Sapper and I will continue to use these tools for development.
I expect that Sapper will function as the recommended static-site generator only until a better tool comes along that is designed specifically for that purpose.
Until then, it works great for small blogging sites.

## Related sites

* [The Svelte Dev Site](https://svelte.dev/)
* [The Sapper Dev Site](https://sapper.svelte.dev/)
* [UnifiedJS](https://unifiedjs.com/)
* [Svelte Community](https://sveltesociety.dev/)
* [Sapper Starter Template](https://github.com/sveltejs/sapper-template)