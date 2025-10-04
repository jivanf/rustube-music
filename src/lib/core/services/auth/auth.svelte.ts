import type { Tokens } from '$lib/core/services/auth/auth.types';
import { invoke } from '@tauri-apps/api/core';
import { type Auth, GoogleAuthProvider, signInWithCredential, signOut, type User } from 'firebase/auth';
import { inject } from '$lib/core/di';
import { FirebaseState } from '$lib/core/state/firebase/firebase';
import { StatefulService } from '$lib/core/services/stateful-service.svelte.js';

export class AuthService extends StatefulService<User> {
    user = $derived(this.items?.[0] ?? null);

    private readonly auth: Auth;

    constructor() {
        super();

        this.auth = inject(FirebaseState).auth;
    }

    async signIn(): Promise<User> {
        // Get tokens from Tauri
        const tokens = await invoke<Tokens>('sign_in');

        // Create credential and sign in
        const credential = GoogleAuthProvider.credential(tokens.id_token, tokens.access_token);
        const result = await signInWithCredential(this.auth, credential);

        this.setItems([result.user]);

        return result.user;
    }

    async signOut(): Promise<void> {
        await signOut(this.auth);

        this.setItems([]);
    }
}
