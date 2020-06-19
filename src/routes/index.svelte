

<script context="module">

    export function preload({ params, query }) {

        console.log('fetch articles')
        return this.fetch('index.json')
            .then(r => r.json())
            .then(articles => ({ articles }))

    }

</script>

<script>
    export let articles
</script>

<svelte:head>
    <title>Ryan Davis Blog</title>
</svelte:head>

<div>

    { #each articles as a }
        <article>
            <a href={'/articles/'+a.slug}>
                <h2>{ a.title }</h2>
                <p>{ a.tagline }</p>
            </a>
        </article>
    { /each }

</div>


<style>

    article {
        margin-top: 40px;
        transition: 0.2s;
    }

    h2 {
        font-size: 26px;
        font-family: 'Overpass', sans-serif;
        color: var(--gray-dark);
        line-height: 32px;
        letter-spacing: normal;
        text-size-adjust: 100%;
    }

    p {
        margin-top: 5px;
        font-size: 16px;
        color: var(--gray-light);
    }

    article:hover {
        transform: translate(-10px, 0);
    }

    a:hover h2 {
        color: var(--flash);
    }

</style>