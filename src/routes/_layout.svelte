<script>
    import Nav from '../components/Nav.svelte'
    export const segment = null
</script>


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


<style>

    header {
        border-bottom: 1px solid rgb(210,210,210);
    }

    .content {
        max-width: 900px;
        padding: 0 30px 0 30px;
        margin: 0 auto;
    }

</style>