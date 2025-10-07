import type { InjectionToken } from '$lib/core/di/injection-token';
import type { Type } from '$lib/utils/types';
import { SvelteMap } from 'svelte/reactivity';

export const container = new SvelteMap<Type<unknown> | InjectionToken<unknown>, InstanceType<Type<unknown>>>();