
<script>

</script>

<ul class='projects'>

    <li class='project'>
        <a href='https://leetcodeleaderboard.com'>
            <img src="LL_img.png" alt="Leetcode Leaderboard"/>
        </a>
    </li>

    <li class='project'>
        <a href="https://datagin.io">
            <img src="DG_img.png" alt="DataGin"/>
        </a>
    </li>

</ul>

<style>

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .projects {
        display: grid;
        grid-gap: 2em;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .project {
        opacity: 0.8;
    }

    .project:hover {
        opacity: 1;
    }

    img {
        width: 100%;
        height: 100%;
    }

</style>