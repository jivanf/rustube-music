import { inject, provide } from '$lib/core/di';
import { AuthService } from '$lib/core/services/auth/auth.svelte';
import { LocalTokenProvider } from '$lib/core/services/auth/providers/local';
import { TOKEN_PROVIDER } from '$lib/core/services/auth/providers/provider';
import { TauriTokenProvider } from '$lib/core/services/auth/providers/tauri';
import { FirebaseState } from '$lib/core/state/firebase';
import type { ClientInit } from '@sveltejs/kit';

export const init: ClientInit = async () => {
    await provide([
        /*
         * Firebase
         */
        FirebaseState,

        /*
         * Auth
         */
        {
            provide: TOKEN_PROVIDER,
            useFactory: () => '__TAURI__' in window ? new TauriTokenProvider() : new LocalTokenProvider(),
        },
        AuthService,
    ]);
}