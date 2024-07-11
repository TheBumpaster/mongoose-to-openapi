import { Schema } from "mongoose";
declare const schema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    title: string;
    order?: string | null | undefined;
    price?: number | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    title: string;
    order?: string | null | undefined;
    price?: number | null | undefined;
}>> & import("mongoose").FlatRecord<{
    title: string;
    order?: string | null | undefined;
    price?: number | null | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export default schema;
//# sourceMappingURL=product.d.ts.map