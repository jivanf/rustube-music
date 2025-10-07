import type { Tokens } from '$lib/core/services/auth/auth.types';
import type { TokenProvider } from '$lib/core/services/auth/providers/provider';
import { invoke } from '@tauri-apps/api/core';

export class TauriTokenProvider implements TokenProvider {
    async getTokens(): Promise<Tokens | null> {
        return invoke<Tokens | null>('get_tokens');
    }

    async signIn(): Promise<Tokens> {
        return invoke<Tokens>('sign_in');
    }
}