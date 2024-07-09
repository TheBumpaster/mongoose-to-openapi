import { Schema, SchemaTypes } from "mongoose";

const schema = new Schema({
	name: {
		type: SchemaTypes.String,
		required: true,
	},
	age: {
		type: SchemaTypes.Number
	}
})

export default schema