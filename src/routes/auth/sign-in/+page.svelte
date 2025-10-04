<script lang="ts">
    import LoginForm from '$lib/components/login-form.svelte';
    import { AuthService } from '$lib/core/services/auth/auth.svelte.js';
    import { inject } from '$lib/core/di';

    const authService = inject(AuthService);

    export function signIn(): void {
        authService.signIn();
    }
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
    <LoginForm onlogin={signIn} />
</div>
