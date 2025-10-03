import { invoke } from '@tauri-apps/api/core';
import { type Auth, GoogleAuthProvider, signInWithCredential, signOut, type User } from 'firebase/auth';
import { inject } from '$lib/core/di';
import { Firebase } from '$lib/core/firebase/firebase';
import { StatefulServiceSvelte } from '$lib/core/state/stateful-service.svelte';
import type { Tokens } from './auth.types';

export const user = $state<User | null>(null);

export class AuthService extends StatefulServiceSvelte<User> {
    user = $derived(this.items?.[0]);

    private readonly auth: Auth;

    constructor() {
        super();

        this.auth = inject(Firebase).auth;
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
