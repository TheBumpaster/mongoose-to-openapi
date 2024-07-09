import { Schema } from "mongoose";
declare const schema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    name: string;
    age?: number | null | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    age?: number | null | undefined;
}>> & import("mongoose").FlatRecord<{
    name: string;
    age?: number | null | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export default schema;
//# sourceMappingURL=user.d.ts.map