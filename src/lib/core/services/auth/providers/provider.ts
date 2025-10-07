import { InjectionToken } from '$lib/core/di/injection-token';
import type { Tokens } from '$lib/core/services/auth/auth.types';

export interface TokenProvider {
    getTokens(): Promise<Tokens | null>;

    signIn(): Promise<Tokens>;
}

export const TOKEN_PROVIDER = new InjectionToken<TokenProvider>();