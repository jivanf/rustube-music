<script lang="ts">
import type { ComponentProps } from 'svelte';
import { AppSidebarContent } from '$lib/components/sidebar/content';
import { AppSidebarFooter } from '$lib/components/sidebar/footer';
import { AppSidebarHeader } from '$lib/components/sidebar/header';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '$lib/components/ui/sidebar';

const { ...restProps }: ComponentProps<typeof Sidebar> = $props();
</script>

<Sidebar {...restProps}>
    <SidebarHeader>
        <AppSidebarHeader />
    </SidebarHeader>

    <SidebarContent>
        <AppSidebarContent />
    </SidebarContent>

    <SidebarFooter>
        <AppSidebarFooter />
    </SidebarFooter>
</Sidebar>