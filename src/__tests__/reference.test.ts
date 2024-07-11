import { SchemaObject } from 'openapi3-ts/oas31';
import createOpenAPIFactory from '../index'; // Adjust the import path as necessary

// Mock necessary parts
jest.mock('glob', () => ({
	sync: jest.fn()
}));

jest.mock('path', () => ({
    ...jest.requireActual('path'),
    resolve: jest.fn().mockImplementation((path) => path),
    basename: jest.fn().mockImplementation((path) => path.split('/').pop().split('.')[0]),
    extname: jest.fn().mockImplementation((path) => '.js')
}));

describe('OpenAPIFactory', () => {
    const mockInfo = { title: 'Test API', version: '1.0.0' };
    const schemaOrder = './__tests__/schemas/order.ts';
	const schemaProduct = './__tests__/schemas/product.ts';

    describe('Order Schema', () => {
		beforeAll(() => {
			const glob = require('glob');
			glob.sync.mockImplementation(() => ['./__tests__/schemas/order.ts'])
		});

        it('should initialize and load schemas correctly', () => {
            const factory = createOpenAPIFactory({ info: mockInfo, schemaPattern: schemaOrder });
            factory.init();
            const openAPI = factory.getOpenAPI();

			expect(openAPI.components?.schemas?.order).toBeDefined();
			expect(openAPI.components?.schemas?.order).toEqual({
				type: "object",
				properties: {
					number: { type: 'string' },
					products: { type: 'array', items: { '$ref': '#/components/schemas/Product' } },
					total: { type: 'number' },
					_id: { type: 'string' }
				},
				required: ["number"]
			})


        });
		
    });

	describe("Product Schema", () => {
		beforeAll(() => {
			const glob = require('glob');
			glob.sync.mockImplementation(() => ['./__tests__/schemas/product.ts'])
		});
		it('should initialize and load schemas correctly', () => {
            const factory = createOpenAPIFactory({ info: mockInfo, schemaPattern: schemaProduct });
            factory.init();
            const openAPI = factory.getOpenAPI();

			expect(openAPI.components?.schemas?.product).toBeDefined();
			expect(openAPI.components?.schemas?.product).toEqual({
				type: "object",
				properties: {
					title: { type: 'string' },
					price: { type: 'number' },
					order: { '$ref': '#/components/schemas/Order' },
					_id: { type: 'string' }
				},
				required: ["title"]
			})
        });
	})
 
});
