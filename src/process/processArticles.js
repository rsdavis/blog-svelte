
import fs from 'fs'
import unified from 'unified'
import markdown from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import parseFrontmatter from 'remark-parse-yaml'
import remark2rehype from 'remark-rehype'
import html from 'rehype-stringify'
import visit from 'unist-util-visit'
import is from 'unist-util-is'


// custom plugin to copy markdown frontmatter into processed content
// https://tinyurl.com/y97ex8bf
const copyFrontmatter = function (ast, file) {
    visit(ast, 'yaml', item=> {
        file.data.frontmatter = item.data.parsedValue
    })
}


function copyTitle () {

    function transformer (tree, file) {

        visit(tree, 'heading', node => {
            if (is(node, { depth: 1 })) {
                node.children.forEach(child => {
                    if (is(child, 'text')) {
                        file.data.title = child.value
                    }
                })
            }
        })
    }

    return transformer

}

const processArticles = function (articlesPath) {


    // create the markdown processor
    const processor = unified()
        .use(markdown)
        .use(frontmatter)
        .use(parseFrontmatter)
        .use(() => copyFrontmatter)
        .use(copyTitle)
        .use(remark2rehype)
        .use(html)

    // get list of articles
    let articles = fs
        .readdirSync(articlesPath)
        .filter(path => path.length && path[0] !== '.')

    // process the articles
    articles = articles.map(article => {

        const name = article
        const slug = article
        const path = articlesPath + '/' + name + '/article.md'
        const contents = String(fs.readFileSync(path))
        const vfile = processor.processSync(contents)

        const html = vfile.contents
        const date = vfile.data.frontmatter.date
        const title = vfile.data.title
        const tagline = vfile.data.frontmatter.tagline

        return { name, slug, path, date, title, html, tagline }

    })


    return articles

}


export default processArticles('./articles')