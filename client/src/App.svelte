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
    <svelte:component this={page} {params} />
</main>