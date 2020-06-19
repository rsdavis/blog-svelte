
import articles from '../../process/processArticles.js'

export function get(req, res, next) {

    const { slug } = req.params

    const article = articles.find(item => item.slug === slug)

    const payload = JSON.stringify(article)

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(payload)

}
