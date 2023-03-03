export interface IClientDynamicModule {
    module: any;
    inject: [];
    exports: [];
}
export interface IServiceConfig {
    service: string;
    client: string;
}