import { OpenAPIObject, PathItemObject, OperationObject, InfoObject, PathObject } from 'openapi3-ts/oas31';
export interface OpenAPIFactoryConfig {
    info: InfoObject;
    schemaPattern: string;
}
export declare class OpenAPIFactory {
    schemaPattern: string;
    openAPI: OpenAPIObject;
    constructor(info: InfoObject, schemaPattern: string);
    init: () => this;
    addRoute: (path: string, method: keyof PathItemObject, operation: OperationObject) => void;
    addRoutes: (...routes: PathObject[]) => void;
    getOpenAPI: () => OpenAPIObject;
    private mongooseTypeToOpenAPIType;
    private convertSchema;
    private loadSchemas;
    private generateOpenAPIComponents;
}
declare const createOpenAPIFactory: ({ info, schemaPattern }: OpenAPIFactoryConfig) => {
    getOpenAPI: () => OpenAPIObject;
    addRoute: (path: string, method: keyof PathItemObject, operation: OperationObject) => void;
    addRoutes: (...routes: PathObject[]) => void;
    init: () => OpenAPIFactory;
};
export default createOpenAPIFactory;
//# sourceMappingURL=index.d.ts.map