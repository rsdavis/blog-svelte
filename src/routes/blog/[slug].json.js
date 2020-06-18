
const unified = require('unified')
const markdown = require('remark-parse')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')

import posts from './_posts.js';


const processPosts = function () {

    const processor = unified()
        .use(markdown)
        .use(remark2rehype)
        .use(html)

    const lookup = posts.reduce((acc, post) => {

        const vfile = processor.processSync(post.markdown)
        acc[post.slug] = JSON.stringify(vfile.contents)
        return acc

    }, {})

    return lookup

}

const lookup = processPosts()

export function get(req, res, next) {

    // the `slug` parameter is available because
    // this file is called [slug].json.js
    const { slug } = req.params;

    console.log({ slug })

	if (slug in lookup) {
        console.log(lookup[slug])
        res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(lookup[slug]);
	} else {

        res.writeHead(404, { 'Content-Type': 'application/json' });

		res.end(JSON.stringify({
			message: `Not found`
		}));
	}
}
