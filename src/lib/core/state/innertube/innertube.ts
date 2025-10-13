import {
    PUBLIC_AUTH_ACCESS_TOKEN,
    PUBLIC_AUTH_REFRESH_TOKEN,
    PUBLIC_FIREBASE_CLIENT_ID,
    PUBLIC_FIREBASE_CLIENT_SECRET,
} from '$env/static/public';
import type { AsyncInitializable } from '$lib/core/di/init';
import Innertube, { ClientType } from 'youtubei.js';

export class InnertubeState implements AsyncInitializable {
    innertube!: Innertube;

    async init(): Promise<unknown> {
        return Innertube.create({ client_type: ClientType.TV, fetch: this.fetch }).then((innertube) => {
            this.innertube = innertube;

            return innertube.session.signIn({
                access_token: PUBLIC_AUTH_ACCESS_TOKEN,
                client: {
                    client_id: PUBLIC_FIREBASE_CLIENT_ID,
                    client_secret: PUBLIC_FIREBASE_CLIENT_SECRET,
                },
                expiry_date: new Date(Date.now() + 3600 * 1000).toISOString(),
                refresh_token: PUBLIC_AUTH_REFRESH_TOKEN,
            });
        });
    }

    private fetch(input: RequestInfo | URL, init?: RequestInit) {
        const url = typeof input === 'string' ? new URL(input) : input instanceof URL ? input : new URL(input.url);

        // Transform the url for use with our proxy.
        url.searchParams.set('__host', url.host);
        url.host = 'localhost:8000';
        url.protocol = 'http';

        const headers = init?.headers
            ? new Headers(init.headers)
            : input instanceof Request
              ? input.headers
              : new Headers();

        // Now serialize the headers.
        url.searchParams.set('__headers', JSON.stringify([...headers]));

        // Copy over the request.
        const request = new Request(url, input instanceof Request ? input : undefined);

        headers.delete('user-agent');

        return fetch(
            request,
            init
                ? {
                      ...init,
                      headers,
                  }
                : {
                      headers,
                  },
        );
    }
}
