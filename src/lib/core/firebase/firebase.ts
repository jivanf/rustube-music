import { type FirebaseApp, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_APP_ID, PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';

export class Firebase {
    private readonly app: FirebaseApp;

    public readonly auth: Auth;

    constructor() {
        this.app = initializeApp({
            projectId: PUBLIC_FIREBASE_PROJECT_ID,
            appId: PUBLIC_FIREBASE_APP_ID,
            apiKey: PUBLIC_FIREBASE_API_KEY,
        });

        this.auth = getAuth(this.app);
    }
}
