import type { Type } from '$lib/utils/types';
import { SvelteMap } from 'svelte/reactivity';

export const container = new SvelteMap<Type<unknown>, InstanceType<Type<unknown>>>();