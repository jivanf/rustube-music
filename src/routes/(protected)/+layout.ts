import { provide } from '$lib/core/di';
import { PlaylistService } from '$lib/core/services/playlist';
import { InnertubeState } from '$lib/core/state/innertube/innertube';
import { UserState } from '$lib/core/state/user';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    return provide([UserState, InnertubeState, PlaylistService]);
}