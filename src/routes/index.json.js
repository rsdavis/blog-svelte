
import articles from '../process/processArticles.js'

export function get(req, res, next) {

    const payload = JSON.stringify(articles)

    console.log('GET ARTICLE')
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(payload)

}
