export interface AsyncInitializable {
    init(): Promise<unknown>;
}

export function isAsyncInitializable(object: unknown): object is AsyncInitializable {
    return typeof object === 'object' && object !== null && 'init' in object && typeof object.init === 'function';
}
