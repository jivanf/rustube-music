import { provide } from '$lib/core/di';
import { AuthService } from '$lib/core/services/auth/auth.svelte';
import { FirebaseState } from '$lib/core/state/firebase';
import type { ClientInit } from '@sveltejs/kit';

export const init: ClientInit = async () => {
    provide([
        FirebaseState,

        // `AuthService` must be provided after Firebase because it uses Firebase auth
        AuthService,
    ]);
}