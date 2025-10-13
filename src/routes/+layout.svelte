<script lang="ts">
    import '../app.css';
    import { untrack } from 'svelte';
    import favicon from '$lib/assets/favicon.svg';
    import { inject } from '$lib/core/di';
    import { AuthService } from '$lib/core/services/auth/auth.svelte';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { navigating, page } from '$app/state';

    const { children } = $props();

    const authService = inject(AuthService);

    $effect(() => {
        const pageId = untrack(() => page.route.id)!;

        const from = navigating.from?.route?.id ?? null;
        const to = navigating.to?.route?.id ?? null;

        if (pageId === '/' && from === null && to === null) {
            goto(resolve(authService.authenticated ? '/auth/sign-in' : '/home'));
        }

        if (from !== null && to !== null && from === to) {
            return;
        }

        if (authService.authenticated && pageId.startsWith('/(public)') && !to?.startsWith('/(protected)')) {
            goto(resolve('/home'));

            return;
        }

        if (!authService.authenticated && pageId.startsWith('/(protected)') && !to?.startsWith('/(public)')) {
            goto(resolve('/auth/sign-in'));

            return;
        }
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
