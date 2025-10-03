import type { ServiceState } from '$lib/core/state/stateful-service.types';

export abstract class StatefulServiceSvelte<TModel> {
    private state = $state<ServiceState<TModel>>({
        items: undefined,
    });

    items = $derived(this.state.items);

    protected setItems(items: TModel[]) {
        this.state.items = items;
    }
}
