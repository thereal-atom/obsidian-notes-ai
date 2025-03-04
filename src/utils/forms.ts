import type { z } from "zod";

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

    return schema.safeParse(data);
};