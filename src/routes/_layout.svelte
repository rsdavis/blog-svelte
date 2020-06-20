<script>
    import Nav from '../components/Nav.svelte'
    import Footer from '../components/Footer.svelte'
    export const segment = null
</script>

<svelte:head>
    <title>Ryan Davis</title>
</svelte:head>

<header>
    <div class='content'>
        <Nav/>
    </div>
</header>

<main>
    <div class='content'>
        <slot></slot>
    </div>
</main>

<footer>
    <div class='content'>
        <Footer/>
    </div>
</footer>

<style>

    header {
        border-bottom: 1px solid rgb(210,210,210);
    }

    footer {
        border-top: 1px solid rgb(210,210,210);
    }

    .content {
        max-width: 900px;
        padding: 0 30px 0 30px;
        margin: 0 auto;
    }

    main > .content {
        margin-bottom: 80px;
    }

</style>