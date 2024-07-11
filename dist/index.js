"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAPIFactory = void 0;
const path_1 = require("path");
const glob_1 = require("glob");
const mongoose_1 = require("mongoose");
class OpenAPIFactory {
    constructor(info, schemaPattern, schemaNameCallback) {
        this.openAPI = {
            openapi: '3.1.0',
            info: { title: "OpenAPIFactory", version: "1.0.0" },
            paths: {},
            components: {
                schemas: {}
            }
        };
        this.schemas = {};
        this.init = () => {
            const schemas = this.loadSchemas(this.schemaPattern);
            this.openAPI.components.schemas = this.generateOpenAPIComponents(schemas).schemas;
            return this;
        };
        this.addRoute = (path, method, operation) => {
            if (!this.openAPI.paths) {
                this.openAPI.paths = {};
            }
            if (!this.openAPI.paths[path]) {
                this.openAPI.paths[path] = {};
            }
            this.openAPI.paths[path][method] = operation;
        };
        this.addRoutes = (...routes) => {
            routes.forEach(route => {
                Object.keys(route).forEach(path => {
                    if (!this.openAPI.paths) {
                        this.openAPI.paths = {};
                    }
                    if (!this.openAPI.paths[path]) {
                        this.openAPI.paths[path] = {};
                    }
                    Object.keys(route[path]).forEach(method => {
                        this.openAPI.paths[path][method] = route[path][method];
                    });
                });
            });
        };
        this.getOpenAPI = () => this.openAPI;
        this.mongooseTypeToOpenAPIType = (type) => {
            const _type = type.toLocaleLowerCase();
            switch (_type) {
                case 'string':
                    return 'string';
                case 'number':
                    return 'number';
                case 'boolean':
                    return 'boolean';
                case 'date':
                    return 'string';
                case 'array':
                    return 'array';
                case 'buffer':
                    return 'string';
                case 'objectid':
                    return 'string';
                case 'mixed':
                    return 'object';
                case 'decimal128':
                    return 'string';
                default:
                    return 'object';
            }
        };
        this.convertSchema = (mongooseSchema) => {
            const paths = mongooseSchema.paths;
            const openAPISchema = { type: 'object', properties: {}, required: [] };
            Object.keys(paths).forEach((path) => {
                const schemaPath = paths[path];
                const schemaType = schemaPath.instance;
                const isRequired = mongooseSchema.requiredPaths().includes(path);
                const ref = schemaPath.options.ref;
                if (schemaType === "Array") {
                    const arrayType = schemaPath.options.type[0];
                    let arrayItems = undefined;
                    const arrayRef = schemaPath.options.type[0].ref;
                    if (arrayRef) {
                        arrayItems = { $ref: `#/components/schemas/${arrayRef}` };
                    }
                    else {
                        if (arrayType instanceof mongoose_1.Schema) {
                            arrayItems = this.convertSchema(arrayType);
                        }
                        else if (arrayType.type instanceof mongoose_1.Schema) {
                            arrayItems = this.convertSchema(arrayType.type);
                        }
                    }
                    openAPISchema.properties[path] = {
                        type: 'array',
                        items: arrayItems
                    };
                }
                else if (ref) {
                    // Handle direct references to other schemas
                    openAPISchema.properties[path] = { $ref: `#/components/schemas/${ref}` };
                }
                else {
                    openAPISchema.properties[path] = {
                        type: this.mongooseTypeToOpenAPIType(schemaType)
                    };
                }
                if (isRequired) {
                    openAPISchema.required.push(path);
                }
            });
            return openAPISchema;
        };
        this.loadSchemas = (pattern) => {
            (0, glob_1.sync)(pattern).forEach((file) => {
                try {
                    const schemaModule = require((0, path_1.resolve)(file));
                    const schemaName = this.schemaNameCallback ? this.schemaNameCallback(file) : (0, path_1.basename)(file, (0, path_1.extname)(file));
                    this.schemas[schemaName] = schemaModule.default;
                }
                catch (error) {
                    console.error(`Failed to load schema from file: ${file}`, error);
                }
            });
            return this.schemas;
        };
        this.generateOpenAPIComponents = (schemas) => {
            const components = { schemas: {} };
            Object.keys(schemas).forEach(schemaName => {
                components.schemas[schemaName] = this.convertSchema(schemas[schemaName]);
            });
            return components;
        };
        this.openAPI.info = info;
        this.schemaPattern = schemaPattern;
        if (schemaNameCallback) {
            this.schemaNameCallback = schemaNameCallback;
        }
    }
}
exports.OpenAPIFactory = OpenAPIFactory;
const createOpenAPIFactory = ({ info, schemaPattern, schemaNameCallback }) => {
    const factory = new OpenAPIFactory(info, schemaPattern, schemaNameCallback);
    return {
        getOpenAPI: factory.getOpenAPI,
        addRoute: factory.addRoute,
        addRoutes: factory.addRoutes,
        init: factory.init
    };
};
exports.default = createOpenAPIFactory;
//# sourceMappingURL=index.js.map