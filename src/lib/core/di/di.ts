import { container } from '$lib/core/di/container';
import { isClassProvider, type Provider } from '$lib/core/di/di.types';
import type { Type } from '$lib/utils/types';

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

        container.set(provide, value);
    }
}

export function inject<TType extends Type>(type: TType): InstanceType<TType> {
    return container.get(type) as InstanceType<TType>;
}
