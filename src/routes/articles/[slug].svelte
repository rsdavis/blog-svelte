<script context="module">
    export async function preload({ params, query }) {

        // the `slug` parameter is available because
        // this file is called [slug].svelte

        return this.fetch(`articles/${params.slug}.json`)
            .then(r => r.json())
            .then(article => ({ article }))
            .catch(console.error)

    }
</script>

<script>
  export let article;
</script>

<svelte:head>
  <title>title</title>
</svelte:head>

<article class='markdown'>

    <h1>{ article.title }</h1>
    <p class='tagline'>{ article.tagline }</p>
    <date>{ article.date }</date>
    {@html article.html}
</article>


<style>

    .markdown {
        color: var(--gray-dark);
        font-weight: 300;
        letter-spacing: normal;
    }

    .markdown :global(h1) {
        margin-top: 50px;
        font-size: 40px;
        text-size-adjust: 100%;
    }

    .markdown :global(h2) {
        font-size: 28px;
        margin-top: 40px;
    }

    .markdown :global(h3) {
        font-size: 24px;
        margin-top: 30px;
    }

    .markdown :global(p) {
        font-size: 18px;
        line-height: 1.7;
        margin-top: 20px;
    }

    p.tagline {
        padding: 0;
        margin: 0;
        color: var(--gray-light);
    }

    date {
        color: var(--gray-light);
    }

    .markdown :global(a) {
        color: var(--flash);
    }

    .markdown :global(blockquote) {
        margin: 20px 0 0 0;
        padding: 20px;
        border-left: 5px solid rgb(200,200,200);
        background-color: rgb(245,245,245);
    }

    .markdown :global(blockquote) :global(p) {
        margin: 0;
    }

    .markdown :global(.katex-display) {
        margin: 40px 0;
    }

    .markdown :global(.katex) {
        font-size: 20px;
    }

    .markdown :global(.hljs) {
        background-color: rgb(245,245,245);
        padding: 20px;
    }

    .markdown :global(img) {
        margin: 0 auto;
    }

    .markdown :global(iframe) {
        margin: 20px auto;
    }
</style>