<script>

    import { stores } from "@sapper/app"

    import Nav from '../components/Nav.svelte'
    import Footer from '../components/Footer.svelte'
    import GoogleAnalytics from '../components/GoogleAnalytics.svelte'

    let ga_measurment_id = "UA-90643542-5"  // your analytics id
    const env = process.env.NODE_ENV

</script>

<svelte:head>
    <title>Ryan Davis</title>
</svelte:head>

{ #if env === 'production' }
    <GoogleAnalytics {stores} id={ga_measurment_id}/>
{ /if }

<header>
    <div class='container'>
        <Nav />
    </div>
</header>

<main>
    <div class='container content'>
        <slot></slot>
    </div>
</main>

<footer>
    <div class='container'>
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

    .container {
        max-width: 900px;
        padding: 0 30px 0 30px;
        margin: 0 auto;
    }

    .content {
        margin-top: 40px;
        margin-bottom: 80px;
    }

</style>