import { container } from '$lib/core/di/container';
import { isClassProvider, isValueProvider, type Provider } from '$lib/core/di/di.types';
import type { InjectionToken } from '$lib/core/di/injection-token';
import type { Type } from '$lib/utils/types';
import { isAsyncInitializable } from './init';

export async function provide(providers: Provider<unknown>[]): Promise<void> {
    for (const provider of providers) {
        let provide;
        let value;

        if (isValueProvider(provider)) {
            provide = provider.provide;
            value = provider.useValue;
        } else if (isClassProvider(provider)) {
            provide = provider;
            value = new provider();
        } else {
            provide = provider.provide;
            value = provider.useFactory();
        }

        if (isAsyncInitializable(value)) {
            await value.init();
        }

        container.set(provide, value)
    }
}

export function inject<TType extends Type>(type: TType): InstanceType<TType>;
export function inject<TValue>(token: InjectionToken<TValue>): TValue;
export function inject<TType extends Type, TValue>(type: TType | InjectionToken<TValue>): InstanceType<TType> | TValue {
    return container.get(type) as InstanceType<TType> | TValue;
}
