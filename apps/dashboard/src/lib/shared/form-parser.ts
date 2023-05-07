import { z } from "zod";

type FormDataValue = FormDataEntryValue | FormDataEntryValue[] | null;

export function preprocessFormData<Schema extends z.ZodTypeAny>(
  formData: FormData,
  schema: Schema,
) {
  const shape = getShape(schema);
  return mapObj(shape, ([name, propertySchema]) =>
    transformFormDataValue(
      getFormValue(formData, String(name), propertySchema),
      propertySchema,
    ),
  );
}

function getShape<Schema extends z.ZodTypeAny>(schema: Schema) {
  // find actual shape definition
  let shape = schema;
  while (shape instanceof z.ZodObject || shape instanceof z.ZodEffects) {
    shape =
      shape instanceof z.ZodObject
        ? shape.shape
        : shape instanceof z.ZodEffects
        ? shape._def.schema
        : null;
    if (shape === null) {
      throw new Error(`Could not find shape`);
    }
  }
  return shape;
}

function getFormValue(
  formData: FormData,
  name: string,
  schema: z.ZodTypeAny,
): FormDataValue {
  if (schema instanceof z.ZodEffects) {
    return getFormValue(formData, name, schema.innerType());
  } else if (schema instanceof z.ZodOptional) {
    return getFormValue(formData, name, schema.unwrap());
  } else if (schema instanceof z.ZodDefault) {
    return getFormValue(formData, name, schema.removeDefault());
  } else if (schema instanceof z.ZodArray) {
    return formData.getAll(name);
  } else {
    return formData.get(name);
  }
}

function transformFormDataValue(
  value: FormDataValue,
  propertySchema: z.ZodTypeAny,
): unknown {
  if (propertySchema instanceof z.ZodEffects) {
    return transformFormDataValue(value, propertySchema.innerType());
  } else if (propertySchema instanceof z.ZodOptional) {
    return transformFormDataValue(value, propertySchema.unwrap());
  } else if (propertySchema instanceof z.ZodDefault) {
    return transformFormDataValue(value, propertySchema.removeDefault());
  } else if (propertySchema instanceof z.ZodArray) {
    if (!value || !Array.isArray(value)) {
      throw new Error("Expected array");
    }
    return value.map((v) => transformFormDataValue(v, propertySchema.element));
  } else if (propertySchema instanceof z.ZodObject) {
    throw new Error("Support object types");
  } else if (propertySchema instanceof z.ZodBoolean) {
    return Boolean(value);
  } else if (propertySchema instanceof z.ZodNumber) {
    return Number(value);
  } else {
    return value;
  }
}

function mapObj<Key extends string, Value, MappedValue>(
  obj: Record<Key, Value>,
  cb: (entry: [Key, Value]) => MappedValue,
): Record<Key, MappedValue> {
  return Object.entries(obj).reduce((acc, entry) => {
    acc[entry[0] as Key] = cb(entry as [Key, Value]);
    return acc;
  }, {} as Record<Key, MappedValue>);
}
