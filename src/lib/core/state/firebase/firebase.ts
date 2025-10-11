import { type FirebaseApp, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';
import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';

export class FirebaseState {
    private readonly app: FirebaseApp;

    public readonly auth: Auth;

    constructor() {
        this.app = initializeApp({
            projectId: PUBLIC_FIREBASE_PROJECT_ID,
            apiKey: PUBLIC_FIREBASE_API_KEY,
        });

        this.auth = getAuth(this.app);
    }
}
