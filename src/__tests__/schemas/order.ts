import { Schema, SchemaTypes } from "mongoose";

const schema = new Schema({
	number: {
		type: SchemaTypes.String,
		required: true,
	},
	products: [{
		type: SchemaTypes.String,
		ref: "Product"
	}],
	total: {
		type: SchemaTypes.Number
	},
})

export default schema