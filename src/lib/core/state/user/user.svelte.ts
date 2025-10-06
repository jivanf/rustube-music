import { inject } from '$lib/core/di';
import { AuthService } from '$lib/core/services/auth/auth.svelte';
import type { User } from 'firebase/auth';

/**
 * Stores the authenticated user.
 *
 * This state cannot be provided without an authenticated session.
 */
export class UserState {
    user: User;

    constructor() {
        const authService = inject(AuthService);
        console.debug(authService);

        this.user = $derived(authService.user!);
    }
}