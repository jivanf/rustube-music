import { invoke } from '@tauri-apps/api/core';
import { type Auth, GoogleAuthProvider, signInWithCredential, signOut, type User } from 'firebase/auth';
import { inject } from '$lib/core/di';
import { StatefulService } from '$lib/core/services/stateful-service.svelte.js';
import { FirebaseState } from '$lib/core/state/firebase/firebase';
import type { Tokens } from '$lib/core/services/auth/auth.types';

export class AuthService extends StatefulService<User> {
    user = $derived(this.items?.[0] ?? null);

    private readonly auth: Auth;

    constructor() {
        super();

        this.auth = inject(FirebaseState).auth;

        void this.init();
    }

    /**
     * Get the OAuth tokens from the Tauri store and sign in with them if they're available.
     */
    async init(): Promise<unknown> {
        const tokens = await invoke<Tokens | null>('get_tokens');

        return tokens !== null ? this.signInWithTokens(tokens) : null;
    }

    async signIn(): Promise<User> {
        const tokens = await invoke<Tokens>('sign_in');

        return this.signInWithTokens(tokens);
    }

    async signOut(): Promise<void> {
        await signOut(this.auth);

        this.setItems([]);
    }

    private async signInWithTokens(tokens: Tokens): Promise<User> {
        const credential = GoogleAuthProvider.credential(tokens.id_token, tokens.access_token);

        return signInWithCredential(this.auth, credential).then((result) => {
            this.setItems([result.user]);

            return result.user;
        });
    }
}
