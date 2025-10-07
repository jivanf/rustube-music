import { PUBLIC_AUTH_ACCESS_TOKEN, PUBLIC_AUTH_ID_TOKEN } from '$env/static/public';
import type { Tokens } from '$lib/core/services/auth/auth.types';
import type { TokenProvider } from '$lib/core/services/auth/providers/provider';

export class LocalTokenProvider implements TokenProvider {
    private tokens: Tokens = {
        access_token: PUBLIC_AUTH_ACCESS_TOKEN,
        id_token: PUBLIC_AUTH_ID_TOKEN,
    }

    async getTokens(): Promise<Tokens | null> {
        return this.tokens;
    }

    async signIn(): Promise<Tokens> {
        return this.tokens;
    }
}