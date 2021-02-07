<script>

    import { stores } from '@sapper/app'

    const { page } = stores()

    const path = $page.path

</script>

<nav>
    <h1><a href='/'>Ryan Davis</a></h1>
    <a class:active={$page.path === '/'} href='/' class='link'>Articles</a>
    <a class:active={$page.path === '/projects'} href='/projects' class='link'>Projects</a>
</nav>

<style>
    nav {
        height: 80px;
        display: flex;
        align-items: center;
    }

    h1 {
        margin: 0;
        flex-grow: 1;
        font-weight: 500;
        color: var(--gray-dark);
    }

    .link {
        margin-left: 1em;
        font-size: 18px;
        color: var(--gray-dark);
    }

    .link:hover {
        color: var(--flash);
    }

    .active {
        text-decoration: underline;
    }
</style>