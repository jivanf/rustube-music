import { invoke } from '@tauri-apps/api/core';
import { type Auth, GoogleAuthProvider, signInWithCredential, signOut, type User } from 'firebase/auth';
import { inject } from '$lib/core/di';
import { TOKEN_PROVIDER, type TokenProvider } from '$lib/core/services/auth/providers/provider';
import { StatefulService } from '$lib/core/services/stateful-service.svelte.js';
import { FirebaseState } from '$lib/core/state/firebase/firebase';
import type { Tokens } from '$lib/core/services/auth/auth.types';

export class AuthService extends StatefulService<User> {
    user = $derived(this.items?.[0] ?? null);

    authenticated = $derived(this.user !== null);

    private readonly auth: Auth;
    private readonly tokenProvider: TokenProvider;

    constructor() {
        super();

        this.auth = inject(FirebaseState).auth;
        this.tokenProvider = inject(TOKEN_PROVIDER);

        void this.init();
    }

    /**
     * Get the OAuth tokens from the Tauri store and sign in with them if they're available.
     */
    async init(): Promise<User | null> {
        const tokens = await this.tokenProvider.getTokens();

        return tokens !== null ? this.signInWithTokens(tokens) : null;
    }

    async signIn(): Promise<User> {
        const tokens = await this.tokenProvider.signIn();

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
