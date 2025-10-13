import type { InjectionToken } from '$lib/core/di/injection-token';
import type { Type } from '$lib/utils/types';

export type Provision<TProvider> = Type<TProvider> | InjectionToken<TProvider>;

export type ValueProvider<TProvider> = {
    provide: Provision<TProvider>;
    useValue: TProvider;
};

export function isValueProvider<TProvider>(provider: Provider<TProvider>): provider is ValueProvider<TProvider> {
    return typeof provider === 'object' && 'provide' in provider && 'useValue' in provider;
}

export type ClassProvider<TProvider> = Type<TProvider>;

export function isClassProvider<TProvider>(provider: Provider<TProvider>): provider is ClassProvider<TProvider> {
    return typeof provider === 'function';
}

export type FactoryProvider<TProvider> = {
    provide: Provision<TProvider>;
    useFactory: () => TProvider;
};

export function isFactoryProvider<TProvider>(provider: Provider<TProvider>): provider is FactoryProvider<TProvider> {
    return typeof provider === 'object' && 'provide' in provider && 'useFactory' in provider;
}

export type Provider<TProvider> = ValueProvider<TProvider> | ClassProvider<TProvider> | FactoryProvider<TProvider>;
