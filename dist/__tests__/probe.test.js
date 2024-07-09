"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index")); // Adjust the import path as necessary
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
    const schemaPattern = './__tests__/schemas/user.ts';
    beforeAll(() => {
        const glob = require('glob');
        glob.sync.mockImplementation(() => ['./__tests__/schemas/user.ts']);
    });
    describe('Initialization and Schema Loading', () => {
        it('should initialize and load schemas correctly', () => {
            const factory = (0, index_1.default)({ info: mockInfo, schemaPattern });
            factory.init();
            const openAPI = factory.getOpenAPI();
            expect(openAPI.components?.schemas?.user).toBeDefined();
            expect(openAPI.components?.schemas?.user).toEqual({
                properties: {
                    _id: {
                        type: "string"
                    },
                    age: {
                        type: "number"
                    },
                    name: {
                        type: "string"
                    }
                },
                required: ["name"],
                type: "object"
            });
        });
    });
    describe('Route Handling', () => {
        it('should add a single route correctly', () => {
            const factory = (0, index_1.default)({ info: mockInfo, schemaPattern });
            factory.init();
            factory.addRoute('/users', 'get', { summary: 'Get all users' });
            const openAPI = factory.getOpenAPI();
            expect(openAPI.paths).toBeDefined();
            expect(openAPI.paths['/users'].get).toBeDefined();
            expect(openAPI.paths['/users'].get?.summary).toBe('Get all users');
        });
        it('should handle multiple routes addition', () => {
            const factory = (0, index_1.default)({ info: mockInfo, schemaPattern });
            factory.init();
            factory.addRoutes({
                '/users': {
                    get: { summary: 'Get all users' },
                    post: { summary: 'Create a user' }
                }
            });
            const openAPI = factory.getOpenAPI();
            expect(openAPI.paths['/users'].get?.summary).toBe('Get all users');
            expect(openAPI.paths['/users'].post?.summary).toBe('Create a user');
        });
    });
});
//# sourceMappingURL=probe.test.js.map