import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        // Angular
        provideRouter(routes),
        provideExperimentalZonelessChangeDetection(),
        provideAnimations(),

        // Taiga UI
        NG_EVENT_PLUGINS,
    ],
};
