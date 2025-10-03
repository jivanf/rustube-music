import { isClassProvider, type Provider } from '$lib/core/di/di.types';
import type { Type } from '$lib/utils/types';
import { getContext, setContext } from 'svelte';

export function provide(providers: Provider<unknown>[]): void {
    for (const provider of providers) {
        let provide;
        let value;

        if (isClassProvider(provider)) {
            provide = provider;
            value = new provider();
        } else {
            provide = provider.provide;
            value = provider.useValue;
        }

        setContext(provide, value);
    }
}

export function inject<TType extends Type>(type: TType): InstanceType<TType> {
    return getContext<InstanceType<TType>>(type);
}
