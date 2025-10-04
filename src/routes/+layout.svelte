<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import { provide } from '$lib/core/di/di';
    import { AuthService } from '$lib/core/services/auth/auth.svelte';
    import { FirebaseState } from '$lib/core/state/firebase/firebase.js';

    provide([
        FirebaseState,

        // `AuthService` must be provided after Firebase because it uses Firebase auth
        AuthService,
    ]);

    const { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
