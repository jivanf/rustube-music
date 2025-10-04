import type { ServiceState } from '$lib/core/services/stateful-service.types';

export abstract class StatefulService<TModel> {
    private state = $state<ServiceState<TModel>>({
        items: undefined,
    });

    items = $derived(this.state.items);

    protected setItems(items: TModel[]) {
        this.state.items = items;
    }
}
