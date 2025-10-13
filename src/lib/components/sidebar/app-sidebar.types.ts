import { type Icon } from '@lucide/svelte';

export type SidebarItem = {
    title: string;
    route: string;
    icon?: typeof Icon;
};
