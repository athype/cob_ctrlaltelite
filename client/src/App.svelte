<script>
    import router from 'page';
    import Home from './pages/Home.svelte';
    import DummySubjects from "./pages/DummySubjects.svelte";

    let page;
    let params;
    let currentRoute;

    router('/home', (ctx) => {
        page = Home;
        currentRoute = ctx.pathname;
    });
    router('/', (ctx) => {
        page = DummySubjects;
        currentRoute = ctx.pathname;
    });

    router.start();
</script>

<main>
    <svelte:component this={page} {params} />
</main>