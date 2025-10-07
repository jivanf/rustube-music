import type { InjectionToken } from '$lib/core/di/injection-token';
import type { Type } from '$lib/utils/types';

export type ClassProvider<TProvider> = Type<TProvider>;

export function isClassProvider<TProvider>(provider: Provider<TProvider>): provider is ClassProvider<TProvider> {
    return typeof provider === 'function';
}

export type ValueProvider<TProvider> = {
    provide: Type<TProvider> | InjectionToken<TProvider>;
    useValue: TProvider;
};

export function isValueProvider<TProvider>(provider: Provider<TProvider>): provider is ValueProvider<TProvider> {
    return typeof provider === 'object' && 'provide' in provider && 'useValue' in provider;
}

export type Provider<TProvider> = ClassProvider<TProvider> | ValueProvider<TProvider>;
