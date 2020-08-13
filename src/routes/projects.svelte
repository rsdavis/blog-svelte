
<script>

</script>

<ul class='projects'>

    <li class='project'>p1</li>
    <li class='project'>p2</li>

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
    }

    .project {
        border: 1px solid black;
    }

</style>