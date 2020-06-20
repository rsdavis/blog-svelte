
<script>
    import Fa from 'svelte-fa'
    import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
</script>

<div class='container'>
    <a href='https://github.com/ryanscdavis'>
        <Fa icon={faGithub} size='2x'/>
    </a>
    <a href='https://www.linkedin.com/in/ryanscdavis/'>
        <Fa icon={faLinkedin} size='2x'/>
    </a>
</div>

<style>
    .container {
        height: 80px;
        display: flex;
        color: var(--gray-dark);
        align-items: center;
    }

    .container a {
        margin-right: 30px;
    }

    .container a:hover {
        color: var(--flash);
    }
</style>