import { Schema } from "mongoose";
declare const schema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    number: string;
    products: string[];
    total?: number | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    number: string;
    products: string[];
    total?: number | null | undefined;
}>> & import("mongoose").FlatRecord<{
    number: string;
    products: string[];
    total?: number | null | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export default schema;
//# sourceMappingURL=order.d.ts.map