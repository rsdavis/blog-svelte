
<script>

    import ProjectCard from '../components/ProjectCard.svelte'

</script>

<ul class='projects'>

    <li>

        <ProjectCard
            src='cfguru.png'
            href='https://codeforces.guru'
            title='CodeForces.guru'
            description='Analytics dashboard for Codeforces competitions'
        />

    </li>

    <li>

        <ProjectCard
            src='DG_img.png'
            href='https://datagin.io'
            title='DataGin.io'
            description='A pseudo-random mock dataset generator'
        />

    </li>

    <li>

        <ProjectCard
            src='LL_img.png'
            href='https://dashboard.leetcode.observer'
            title='Leetcode Observer'
            description='Interactive dashboard of Leetcode contest rankings'
        />

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
        grid-gap: 1em;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        grid-auto-rows: 300px;
    }

</style>