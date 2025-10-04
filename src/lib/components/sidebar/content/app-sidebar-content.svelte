<script lang="ts">
import { ListMusicIcon } from '@lucide/svelte';
import type { SidebarItem } from '$lib/components/sidebar/app-sidebar.types';
import {
    Menu,
    MenuButton,
    MenuItem,
} from '$lib/components/ui/sidebar';

const items: SidebarItem[] = [
    {
        title: 'Playlists',
        route: '/playlists',
        icon: ListMusicIcon,
    },
];
</script>

<Menu>
    {#each items as item (item.title)}
        <MenuItem>
            <MenuButton>
                {#snippet child({ props })}
                    <a {...props} href={item.route} >
                        <item.icon />

                        <span>{item.title}</span>
                    </a>
                {/snippet}
            </MenuButton>
        </MenuItem>
    {/each}
</Menu>
