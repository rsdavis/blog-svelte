

export function get(req, res, next) {

    const articles = [
        {
            slug: 'a',
            title: 'a',
            tagline: 'a'
        },
        {
            slug: 'b',
            title: 'b',
            tagline: 'b'
        }
    ]

    const payload = JSON.stringify(articles)

    console.log('GET ARTICLE')
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(payload)

}
