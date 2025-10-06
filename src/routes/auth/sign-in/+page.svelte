<script lang="ts">
    import LoginForm from '$lib/components/login-form.svelte';
    import { inject } from '$lib/core/di';
    import { AuthService } from '$lib/core/services/auth/auth.svelte.js';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    const authService = inject(AuthService);

    export function signIn(): void {
        authService.signIn().then(() => goto(resolve('/playlists')));
    }
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
    <LoginForm onlogin={signIn} />
</div>
