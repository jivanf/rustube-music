#!/usr/bin/env -S pnpx deno run --allow-net --allow-read --allow-write --allow-run

/**
 * Google OAuth sign-in script that mimics the Tauri implementation.
 * Saves tokens to .env file instead of Tauri store.
 * TypeScript/Deno version of the original Python script.
 */

interface OAuthTokens {
    access_token: string;
    id_token: string;
    refresh_token?: string;
}

class OAuthHandler {
    private authorizationCode: string | null = null;
    private abortController = new AbortController();

    async startServer(): Promise<number> {
        const listener = Deno.listen({ port: 0 });
        const port = (listener.addr as Deno.NetAddr).port;
        listener.close();

        // Start HTTP server on the found port
        Deno.serve(
            {
                port,
                signal: this.abortController.signal,
                onError: () => new Response('Internal Server Error', { status: 500 }),
            },
            this.handleRequest.bind(this),
        );

        console.log(`✓ Local server started on port ${port}`);
        return port;
    }

    private async handleRequest(req: Request): Promise<Response> {
        const url = new URL(req.url);
        const code = url.searchParams.get('code');

        if (code) {
            this.authorizationCode = code;
            return new Response(
                '<html><body><h1>Authentication successful!</h1><p>You can close this window.</p></body></html>',
                { status: 200, headers: { 'Content-Type': 'text/html' } },
            );
        } else {
            return new Response('Authorization failed', { status: 422 });
        }
    }

    async waitForAuthCode(): Promise<string> {
        while (this.authorizationCode === null) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        const code = this.authorizationCode;
        this.authorizationCode = null;
        return code;
    }

    async stopServer(): Promise<void> {
        this.abortController.abort();
    }
}

function getEnvPath(): string {
    return `${Deno.cwd()}/.env`;
}

async function loadEnvVars(): Promise<{ clientId: string; clientSecret: string; refreshToken: string }> {
    const envPath = getEnvPath();

    try {
        const envContent = await Deno.readTextFile(envPath);
        const env: Record<string, string> = {};

        for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    env[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
                }
            }
        }

        const clientId = env.FIREBASE_CLIENT_ID;
        const clientSecret = env.FIREBASE_CLIENT_SECRET;
        const refreshToken = env.PUBLIC_AUTH_REFRESH_TOKEN || '';

        if (!clientId || !clientSecret) {
            throw new Error('FIREBASE_CLIENT_ID and FIREBASE_CLIENT_SECRET must be set in .env file');
        }

        return { clientId, clientSecret, refreshToken };
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            throw new Error(`.env file not found at ${envPath}`);
        }
        throw error;
    }
}

async function updateEnvTokens(accessToken: string, idToken: string, refreshToken?: string): Promise<void> {
    const envPath = getEnvPath();

    try {
        let envContent = await Deno.readTextFile(envPath);

        const updates = [
            ['PUBLIC_AUTH_ACCESS_TOKEN', accessToken],
            ['PUBLIC_AUTH_ID_TOKEN', idToken],
        ];

        if (refreshToken) {
            updates.push(['PUBLIC_AUTH_REFRESH_TOKEN', refreshToken]);
        }

        for (const [key, value] of updates) {
            const regex = new RegExp(`^${key}=.*$`, 'm');
            if (regex.test(envContent)) {
                envContent = envContent.replace(regex, `${key}=${value}`);
            } else {
                envContent += `\n${key}=${value}`;
            }
        }

        await Deno.writeTextFile(envPath, envContent);
        console.log(`✓ Tokens saved to ${envPath}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to update .env file: ${errorMessage}`);
    }
}

async function refreshTokensFromRefreshToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string,
): Promise<OAuthTokens> {
    console.log('Using refresh token to get new tokens...');

    const tokenUrl = 'https://accounts.google.com/o/oauth2/token';
    const data = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    });

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const tokens = (await response.json()) as OAuthTokens;

        if (!tokens.access_token || !tokens.id_token) {
            throw new Error('Response missing required tokens');
        }

        await updateEnvTokens(tokens.access_token, tokens.id_token);

        console.log('✓ Tokens refreshed successfully!');
        return tokens;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`✗ Failed to refresh tokens: ${errorMessage}`);
        throw error;
    }
}

async function signInWithOAuth(clientId: string, clientSecret: string): Promise<OAuthTokens> {
    console.log('Starting OAuth sign-in flow...');

    const handler = new OAuthHandler();
    const port = await handler.startServer();
    const redirectUri = `http://localhost:${port}`;

    const authParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'openid profile https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;

    console.log('Opening browser for authentication...');

    try {
        if (Deno.build.os === 'linux') {
            await new Deno.Command('xdg-open', { args: [authUrl] }).output();
        } else if (Deno.build.os === 'darwin') {
            await new Deno.Command('open', { args: [authUrl] }).output();
        } else if (Deno.build.os === 'windows') {
            await new Deno.Command('cmd', { args: ['/c', 'start', authUrl] }).output();
        } else {
            console.log(`Please open this URL in your browser: ${authUrl}`);
        }
    } catch {
        console.log(`Please open this URL in your browser: ${authUrl}`);
    }

    console.log('Waiting for authorization code...');
    const code = await handler.waitForAuthCode();
    await handler.stopServer();

    if (!code) {
        throw new Error('Failed to receive authorization code');
    }

    console.log('✓ Authorization code received');

    console.log('Exchanging code for tokens...');
    const tokenUrl = 'https://accounts.google.com/o/oauth2/token';
    const data = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
    });

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const tokens = (await response.json()) as OAuthTokens;

        if (!tokens.access_token || !tokens.id_token) {
            throw new Error('Response missing required tokens');
        }

        await updateEnvTokens(tokens.access_token, tokens.id_token, tokens.refresh_token);

        console.log('✓ Sign-in successful!');
        return tokens;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`✗ Failed to exchange code for tokens: ${errorMessage}`);
        throw error;
    }
}

async function main(): Promise<void> {
    try {
        const { clientId, clientSecret, refreshToken } = await loadEnvVars();

        if (refreshToken) {
            console.log('Refresh token found in .env file');
            try {
                await refreshTokensFromRefreshToken(clientId, clientSecret, refreshToken);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`\n✗ Refresh failed: ${errorMessage}`);
                console.log('Falling back to full sign-in flow...\n');
                await signInWithOAuth(clientId, clientSecret);
            }
        } else {
            console.log('No refresh token found, starting sign-in flow');
            await signInWithOAuth(clientId, clientSecret);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`\n✗ Error: ${errorMessage}`);
        Deno.exit(1);
    }
}

if (import.meta.main) {
    await main();
}
