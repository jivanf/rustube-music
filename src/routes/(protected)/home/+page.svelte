<script lang="ts">
    import { parseFullName } from 'parse-full-name';
    import { inject } from '$lib/core/di';
    import { UserState } from '$lib/core/state/user';

    const user = inject(UserState).user;

    const firstName = $derived(parseFullName(user.displayName, 'first'))
</script>

<h1>Welcome {firstName}!</h1>
