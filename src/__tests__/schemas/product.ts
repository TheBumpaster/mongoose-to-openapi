import { Schema, SchemaTypes } from "mongoose";

const schema = new Schema({
	title: {
		type: SchemaTypes.String,
		required: true,
	},
	price: {
		type: SchemaTypes.Number
	},
	order: {
		type: SchemaTypes.String,
		ref: 'Order'
	}
})

export default schema