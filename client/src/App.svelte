<script>
    import router from 'page';
    import Home from './pages/Home.svelte';

    let page;
    let params;
    let currentRoute;

    router('/', (ctx) => {
        page = Home;
        currentRoute = ctx.pathname;
    });


    router.start();
</script>

<main>
    <link rel="stylesheet" href=
            "node_modules/@fortawesome/fontawesome-free/css/all.min.css">

    <svelte:component this={page} {params} />
</main>
