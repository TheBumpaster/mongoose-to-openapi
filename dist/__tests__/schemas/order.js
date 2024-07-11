"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    number: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    products: [{
            type: mongoose_1.SchemaTypes.String,
            ref: "Product"
        }],
    total: {
        type: mongoose_1.SchemaTypes.Number
    },
});
exports.default = schema;
//# sourceMappingURL=order.js.map