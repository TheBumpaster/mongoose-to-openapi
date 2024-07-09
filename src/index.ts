import {resolve, extname, basename} from 'path'
import { sync } from 'glob';
import { Schema } from "mongoose";
import { ComponentsObject, SchemaObject, SchemaObjectType, OpenAPIObject, PathItemObject, OperationObject, InfoObject, PathsObject, PathObject } from 'openapi3-ts/oas31';

export interface OpenAPIFactoryConfig {
	info: InfoObject
	schemaPattern: string;
}

export class OpenAPIFactory {
	schemaPattern: string
	openAPI: OpenAPIObject = {
		openapi: '3.1.0',
		info: { title: "OpenAPIFactory", version: "1.0.0" },
		paths: {},
		components: {
			schemas: {}
		}
	};

	constructor(info: InfoObject, schemaPattern: string) {
		this.openAPI.info = info;
		this.schemaPattern = schemaPattern
	}


	public init = () => {
		const schemas = this.loadSchemas(this.schemaPattern);
		this.openAPI.components!.schemas = this.generateOpenAPIComponents(schemas).schemas;

		return this;
	};

	public addRoute = (path: string, method: keyof PathItemObject, operation: OperationObject) => {

		if (!this.openAPI.paths) {
			this.openAPI.paths = {}
		}

		if (!this.openAPI.paths[path]) {
			this.openAPI.paths[path] = {};
		}

		this.openAPI.paths[path][method] = operation;
	};

	public addRoutes = (...routes: PathObject[]) => {
		routes.forEach(route => {
			Object.keys(route).forEach(path => {
				if (!this.openAPI.paths) {
					this.openAPI.paths = {};
				}

				if (!this.openAPI.paths[path]) {
					this.openAPI.paths[path] = {};
				}

				Object.keys(route[path]).forEach(method => {
					this.openAPI.paths![path][method as keyof PathItemObject] = route[path][method as keyof PathItemObject] as OperationObject;
				});
			});
		});
	};

	public getOpenAPI = () => this.openAPI;

	private mongooseTypeToOpenAPIType = (type: string): SchemaObjectType => {
		const _type = type.toLocaleLowerCase()
	
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
	
	private convertSchema = (mongooseSchema: Schema): SchemaObject => {
		const paths = mongooseSchema.paths;
		const openAPISchema: SchemaObject = { type: 'object', properties: {}, required: [] };
		
		Object.keys(paths).forEach((path) => {
			const schemaType = paths[path].instance;
			const isRequired = mongooseSchema.requiredPaths().includes(path);
	
			if (schemaType === "Array") {
				let arrayItems: SchemaObject | SchemaObject[] | undefined = undefined
				const arrayType = paths[path].options.type[0];
	
				if (arrayType instanceof Schema) {
					arrayItems = this.convertSchema(arrayType)
				} else if (arrayType.type instanceof Schema) {
					arrayItems = this.convertSchema(arrayType.type)
				}
				openAPISchema.properties![path] = {
					type: 'array',
					items: arrayItems
				};
			} else if (schemaType === 'Embedded') {
	
				openAPISchema.properties![path] = this.convertSchema(paths[path].schema);
			} else {
					openAPISchema.properties![path] = {
						type: this.mongooseTypeToOpenAPIType(schemaType)
					};
			}
	
			if (isRequired) {
				openAPISchema.required!.push(path);
			}
		});
	
		return openAPISchema;
	
	};
	
	private loadSchemas = (pattern: string): Record<string, Schema> => {
		const schemas: Record<string, Schema> = {};
	
		sync(pattern).forEach((file) => {
			try {
				const schemaModule = require(resolve(file));
				const schemaName = basename(file, extname(file));
				schemas[schemaName] = schemaModule.default;
			} catch (error) {
				console.error(`Failed to load schema from file: ${file}`, error);
			}
		});
	
		return schemas;
	};
	
	private generateOpenAPIComponents = (schemas: Record<string, Schema>): ComponentsObject => {
		const components: ComponentsObject = { schemas: {} };
	
		Object.keys(schemas).forEach(schemaName => {
			components.schemas![schemaName] = this.convertSchema(schemas[schemaName]);
		});
	
		return components;
	};

}

const createOpenAPIFactory = ({ info, schemaPattern }: OpenAPIFactoryConfig) => {
	const factory = new OpenAPIFactory(info, schemaPattern)

	return {
		getOpenAPI: factory.getOpenAPI,
		addRoute: factory.addRoute,
		addRoutes: factory.addRoutes,
		init: factory.init
	}
};


export default createOpenAPIFactory