"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    title: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    price: {
        type: mongoose_1.SchemaTypes.Number
    },
    order: {
        type: mongoose_1.SchemaTypes.String,
        ref: 'Order'
    }
});
exports.default = schema;
//# sourceMappingURL=product.js.map