import { inject } from '$lib/core/di';
import type { PlaylistOverview } from '$lib/core/services/playlist/playlist.types';
import { StatefulService } from '$lib/core/services/stateful-service.svelte';
import { InnertubeState } from '$lib/core/state/innertube/innertube.ts';
import type { YTNode } from 'youtubei.js/dist/src/parser/helpers';

export class PlaylistService extends StatefulService<PlaylistOverview> {
    private innertube = inject(InnertubeState).innertube;

    async read(): Promise<PlaylistOverview[]> {
        const result = await this.innertube.getPlaylists();

        const playlistNodes: YTNode[] = result.page
            .contents!.item()
            .key('content')
            .node()
            .key('content')
            .node()
            .key('items')
            .array();

        return playlistNodes.map((item) => {
            const payload = item.key('endpoint').object().payload;

            return {
                id: payload.contentId,
                title: payload.title.simpleText,
            };
        });
    }
}
