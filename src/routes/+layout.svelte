<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import { AuthService } from '$lib/core/auth/auth.svelte';
    import { provide } from '$lib/core/di/di';
    import { Firebase } from '$lib/core/firebase/firebase.js';

    provide([
        Firebase,

        // `AuthService` must be provided after Firebase because it uses Firebase auth
        AuthService,
    ]);

    const { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
