
const fs = require('fs')
const unified = require('unified')
const markdown = require('remark-parse')
const frontmatter = require('remark-frontmatter')
const remark2rehype = require('remark-rehype')
const html = require('rehype-stringify')
const parseFrontmatter = require('remark-parse-yaml')
const visit = require('unist-util-visit');


// custom plugin to copy markdown frontmatter into processed content
// https://tinyurl.com/y97ex8bf
const copyFrontmatter = function (ast, file) {
    visit(ast, 'yaml', item=> {
        file.data.frontmatter = item.data.parsedValue
    })
}

const processArticles = function (articlesPath) {

    // create the markdown processor
    const processor = unified()
        .use(markdown)
        .use(frontmatter)
        .use(parseFrontmatter)
        .use(() => copyFrontmatter)
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
        console.log(vfile)
        const html = vfile.contents

        return { name, slug, path, html }

    })

    // sort by date

    return articles

}


module.exports = processArticles('./articles')