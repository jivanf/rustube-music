import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
    goto(resolve('/auth/sign-in'));
};
