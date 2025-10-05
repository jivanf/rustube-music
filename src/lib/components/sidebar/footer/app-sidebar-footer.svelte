<script lang="ts">
    import { EllipsisVertical } from '@lucide/svelte';
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
    } from '$lib/components/ui/dropdown-menu';
    import { Menu, MenuItem, SidebarMenuButton } from '$lib/components/ui/sidebar';
    import { inject } from '$lib/core/di';
    import { AuthService } from '$lib/core/services/auth/auth.svelte';
    import { UserState } from '$lib/core/state/user/user.svelte';
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';

    const authService = inject(AuthService);
    const userState = inject(UserState);

    const user = userState.user;

    function signOut(): void {
        authService.signOut().then(() => goto(resolve('/auth/sign-in')));
    }
</script>

<Menu>
    <MenuItem>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {#snippet child({ props })}
                    <SidebarMenuButton {...props}>
                        {user.uid}
                        <EllipsisVertical class="ml-auto" />
                    </SidebarMenuButton>
                {/snippet}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right">
                <DropdownMenuItem onselect={signOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </MenuItem>
</Menu>
