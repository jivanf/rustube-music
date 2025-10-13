<script lang="ts">
    import AppSidebar from '$lib/components/sidebar/app-sidebar.svelte';
    import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';

    const { children } = $props();
</script>

<SidebarProvider>
    <AppSidebar variant="inset" />

    <SidebarInset>
        <div class="flex flex-1 flex-col">
            <div class="@container/main flex flex-1 flex-col gap-2">
                <div class="flex flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
                    {@render children()}
                </div>
            </div>
        </div>
    </SidebarInset>
</SidebarProvider>
