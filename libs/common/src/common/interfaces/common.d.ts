export interface IClientDynamicModule {
    module: any;
    inject?: any[];
    exports: any[];
}
export interface IServiceConfig {
    service: string;
    client: string;
}