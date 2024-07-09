# mongoose-to-openapi

A TypeScript library for generating OpenAPI Schema Component Definitions from Mongoose Schemas.

## Installation

```bash
npm install mongoose-to-openapi
```

## Usage

### Initializing the OpenAPI Factory

```typescript
import createOpenAPIFactory from 'mongoose-to-openapi';

const openAPIFactory = createOpenAPIFactory({
	info: {
		title: 'My API',
		version: '1.0.0'
	},
	schemaPattern: './src/models/**/*.ts',
});

openAPIFactory.init();
```

### Adding Routes

#### Adding a Single Route

```typescript
openAPIFactory.addRoute('/users', 'get', {
	summary: 'Get all users',
	responses: {
		'200': {
			description: 'A list of users',
			content: {
				'application/json': {
					schema: {
						type: 'array',
						items: { $ref: '#/components/schemas/User' }
					}
				}
			}
		}
	}
});
```

#### Adding Multiple Routes

```typescript
openAPIFactory.addRoutes({
	'/users': {
		get: {
			summary: 'Get all users',
			responses: {
				'200': {
					description: 'A list of users',
					content: {
						'application/json': {
							schema: {
								type: 'array',
								items: { $ref: '#/components/schemas/User' }
							}
						}
					}
				}
			}
		}
	},
	'/users/{id}': {
		get: {
			summary: 'Get a user by ID',
			parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: {
						type: 'string'
					}
				}
			],
			responses: {
				'200': {
					description: 'A user object',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/User' }
						}
					}
				}
			}
		}
	}
});
```

### Exporting the OpenAPI Object

```typescript
const openAPI = openAPIFactory.getOpenAPI();
console.log(JSON.stringify(openAPI, null, 2));
```

## Configuration Options

- `info`: Information about the API (title, version, etc.).
- `schemaPattern`: A glob pattern to locate Mongoose schema files.

## License

[MIT](LICENSE)
