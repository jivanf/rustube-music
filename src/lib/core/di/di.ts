import { container } from '$lib/core/di/container';
import {
    isClassProvider,
    isFactoryProvider,
    isValueProvider,
    type Provider,
    type Provision,
} from '$lib/core/di/di.types';
import type { InjectionToken } from '$lib/core/di/injection-token';
import type { Type } from '$lib/utils/types';
import { isAsyncInitializable } from './init';

export async function provide(providers: Provider<unknown>[]): Promise<void> {
    for (const provider of providers) {
        const provision = getProvision(provider);

        const dependency = container.get(provision);

        if (dependency !== undefined) {
            continue;
        }

        const value = getValue(provider);

        if (isAsyncInitializable(value)) {
            await value.init();
        }

        container.set(provision, value);
    }
}

export function inject<TType extends Type>(type: TType): InstanceType<TType>;
export function inject<TValue>(token: InjectionToken<TValue>): TValue;
export function inject<TType extends Type, TValue>(type: TType | InjectionToken<TValue>): InstanceType<TType> | TValue {
    return container.get(type) as InstanceType<TType> | TValue;
}

function getProvision(provider: Provider<unknown>): Provision<unknown> {
    return isValueProvider(provider) || isFactoryProvider(provider) ? provider.provide : provider;
}

function getValue(provider: Provider<unknown>): unknown {
    if (isValueProvider(provider)) {
        return provider.useValue;
    } else if (isClassProvider(provider)) {
        return new provider();
    } else {
        return provider.useFactory();
    }
}
