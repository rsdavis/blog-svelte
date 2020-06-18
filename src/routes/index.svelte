

<script>
    let articles = [
        {
            title: "Write less code",
            text: "The most important metric you're not paying attention to",
            slug: 'write-less-code'
        },
        {
            title: "Svelte for new developers",
            text: 'Never used Node.js or the command line? No problem',
            slug: 'svelte-for-new-developers'
        },
        {
            title: "Svelte on The Chnagelog",
            text: "Listen to the interview here",
            slug: 'svelte-on-the-changelog'
        },
        {
            title: "Virtual DOM is pure overhead",
            text: "Let's retire the virtual DOM is fast myth once and for all",
            slug: 'virtual-dom-is-pure-overhead'
        }
    ]
</script>

<svelte:head>
    <title>Ryan Davis Blog</title>
</svelte:head>

<div>

    { #each articles as article }
        <article>
            <a href='blog/{article.slug}'>
                <h2>{ article.title }</h2>
                <p>{ article.text }</p>
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
        font-weight: 300;
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