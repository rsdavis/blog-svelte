
<script>

    export let src = ''
    export let href = ''
    export let title = ''
    export let description = ''

</script>

<a class="card" { href }>
    <img { src } alt={ description } />
    <div class='info'>
        <h2>{ title }</h2>
        <p>{ description }</p>
    </div>
</a>

<style>

    .card {
        display: block;
        height: 100%;
        width: 100%;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        -webkit-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.5);
        -moz-box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.5);
        box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.5);
        transition: 0.1s;
    }


    .card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgb(255,255,255);
        background: linear-gradient(rgba(255,255,255,0) 0%, rgba(255,255,255,0) 60%, rgba(30,30,30,1) 100%);

    }

    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    .info {
        position: absolute;
        left: 0;
        bottom: 0;
        padding-left: 1em;
        padding-bottom: 1em;
        color: white;
    }

    h2 {
        font-weight: 500;
    }

    p {
        text-transform: uppercase;
        font-size: 12px;
    }

</style>