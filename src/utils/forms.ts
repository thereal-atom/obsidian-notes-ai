import type { z } from "zod";

// export const validateFormData = <SchemaT extends z.AnyZodObject>(
//     schema: SchemaT,
//     formData: FormData,
// ): {
//     success: true;
//     data: SchemaT["_output"];
//     error: null;
// } | {
//     success: false;
//     data: null;
//     error: z.ZodError<SchemaT["_output"]>;
// } => {
//     const data = Object.fromEntries(formData);

//     return schema.safeParse(data);
// };
export const validateFormData = <SchemaT extends z.AnyZodObject>(
    schema: SchemaT,
    formData: FormData,
): {
    success: true;
    data: SchemaT["_output"];
    error: null;
} | {
    success: false;
    data: null;
    error: z.ZodError<SchemaT["_output"]>;
} => {
    const data = Object.fromEntries(formData);

    const result = schema.safeParse(data);

    if (result.success) {
        return {
            success: true,
            data: result.data,
            error: null,
        };
    } else {
        return {
            success: false,
            data: null,
            error: result.error,
        };
    };
};