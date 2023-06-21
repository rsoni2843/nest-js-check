export declare class ConfigurationCreateArgs {
    dom_query: string;
    stock_dom_query: string;
    stock_pattern: string;
    base_url: string;
    jsRendering: boolean;
}
export declare class ConfigurationUpdateArgs {
    dom_query?: string;
    base_url?: string;
    jsRendering: boolean;
    stock_dom_query: string;
    stock_pattern: string;
    is_active: boolean;
}
