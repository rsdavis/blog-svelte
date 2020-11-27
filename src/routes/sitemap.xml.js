
import articles from '../process/processArticles.js'

const sitemap =
`
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<url>
<loc>https://rdavis.io/</loc>
<lastmod>2020-11-26T00:00:00+00:00</lastmod>
<priority>1.00</priority>
</url>
<url>
<loc>https://rdavis.io/articles/combo_context_with_stores/</loc>
<lastmod>2020-11-15T00:00:00+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/svelte_collapsible_card_component/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/aws_static_site_hosting/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/dealing-with-the-visual-viewport/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/blog_svelte_rewrite/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/fingerprinting/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/pagerank/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/introducing_datagin/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/configuring_spark/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/streamlit_review/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
<url>
<loc>https://rdavis.io/articles/bivariate_pie_chart/</loc>
<lastmod>2020-07-06T19:13:54+00:00</lastmod>
<priority>0.80</priority>
</url>
</urlset>
`

export function get(req, res, next) {

    res.writeHead(200, { 'Content-Type': 'application/xml' })
    res.end(sitemap)

}
