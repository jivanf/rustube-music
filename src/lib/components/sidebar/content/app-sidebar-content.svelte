<script lang="ts">
    import type { SidebarItem } from '$lib/components/sidebar/app-sidebar.types';
    import { Menu, MenuButton, MenuItem } from '$lib/components/ui/sidebar';
    import { inject } from '$lib/core/di';
    import { PlaylistService } from '$lib/core/services/playlist';

    const playlistService = inject(PlaylistService);

    let items = $state<SidebarItem[]>([]);

    playlistService.read().then((playlists) => {
        items = playlists.map((playlist) => ({
            title: playlist.title,
            route: '#',
        }));
    });
</script>

<Menu>
    {#each items as item (item.title)}
        <MenuItem>
            <MenuButton>
                {#snippet child({ props })}
                    <a {...props} href={item.route}>
                        {#if item.icon !== undefined}
                            <item.icon />
                        {/if}

                        <span>{item.title}</span>
                    </a>
                {/snippet}
            </MenuButton>
        </MenuItem>
    {/each}
</Menu>
