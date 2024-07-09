"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
    },
    age: {
        type: mongoose_1.SchemaTypes.Number
    }
});
exports.default = schema;
//# sourceMappingURL=user.js.map