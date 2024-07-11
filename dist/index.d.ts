import { OpenAPIObject, PathItemObject, OperationObject, InfoObject, PathObject } from 'openapi3-ts/oas31';
export interface OpenAPIFactoryConfig {
    info: InfoObject;
    schemaPattern: string;
    schemaNameCallback?: (filePath: string) => string;
}
export declare class OpenAPIFactory {
    openAPI: OpenAPIObject;
    private schemas;
    private schemaPattern;
    private schemaNameCallback;
    constructor(info: InfoObject, schemaPattern: string, schemaNameCallback?: OpenAPIFactoryConfig["schemaNameCallback"]);
    init: () => this;
    addRoute: (path: string, method: keyof PathItemObject, operation: OperationObject) => void;
    addRoutes: (...routes: PathObject[]) => void;
    getOpenAPI: () => OpenAPIObject;
    private mongooseTypeToOpenAPIType;
    private convertSchema;
    private loadSchemas;
    private generateOpenAPIComponents;
}
declare const createOpenAPIFactory: ({ info, schemaPattern, schemaNameCallback }: OpenAPIFactoryConfig) => {
    getOpenAPI: () => OpenAPIObject;
    addRoute: (path: string, method: keyof PathItemObject, operation: OperationObject) => void;
    addRoutes: (...routes: PathObject[]) => void;
    init: () => OpenAPIFactory;
};
export default createOpenAPIFactory;
//# sourceMappingURL=index.d.ts.map