import { z } from "zod"

// Define types for field configurations
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "password"
  | "select"
  | "multiselect"
  | "checkbox"
  | "switch"
  | "radio"
  | "color"
  | "date"
  | "time"
  | "file"
  | "slider"

// Define validation types
export type ValidationType = "required" | "min" | "max" | "minLength" | "maxLength" | "email" | "url" | "pattern"

// Define option type for select fields
export interface FieldOption {
  label: string
  value: string | number | boolean
  description?: string
  disabled?: boolean
}

// Define base field configuration
export interface BaseFieldConfig {
  id: string
  type: FieldType
  label: string
  description?: string
  placeholder?: string
  defaultValue?: any
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  validation?: Record<ValidationType, any>
  dependsOn?: {
    field: string
    value: any
    operator?: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan"
  }
}

// Define specific field configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "textarea" | "email" | "password"
  maxLength?: number
  minLength?: number
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number"
  min?: number
  max?: number
  step?: number
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select" | "multiselect" | "radio"
  options: FieldOption[]
  isMulti?: boolean
}

export interface BooleanFieldConfig extends BaseFieldConfig {
  type: "checkbox" | "switch"
}

export interface ColorFieldConfig extends BaseFieldConfig {
  type: "color"
  presetColors?: string[]
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file"
  accept?: string
  maxSize?: number // in bytes
}

export interface SliderFieldConfig extends BaseFieldConfig {
  type: "slider"
  min: number
  max: number
  step?: number
  marks?: { value: number; label: string }[]
}

// Union type for all field configurations
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | BooleanFieldConfig
  | ColorFieldConfig
  | FileFieldConfig
  | SliderFieldConfig

// Define section configuration
export interface SectionConfig {
  id: string
  title: string
  description?: string
  icon?: string
  fields: FieldConfig[]
}

// Define tab configuration
export interface TabConfig {
  id: string
  title: string
  description?: string
  icon?: string
  sections: SectionConfig[]
}

// Define settings schema
export interface SettingsSchema {
  id: string
  title: string
  description?: string
  sections: SectionConfig[]
}

// Helper function to create a Zod schema from field config
export function createZodSchema(fields: FieldConfig[]): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {}

  fields.forEach((field) => {
    let schema: z.ZodTypeAny

    switch (field.type) {
      case "text":
      case "textarea":
        schema = z.string()
        if (field.required) schema = schema.min(1, { message: `${field.label} is required` })
        if ((field as TextFieldConfig).minLength) {
          schema = schema.min((field as TextFieldConfig).minLength!, {
            message: `${field.label} must be at least ${(field as TextFieldConfig).minLength} characters`,
          })
        }
        if ((field as TextFieldConfig).maxLength) {
          schema = schema.max((field as TextFieldConfig).maxLength!, {
            message: `${field.label} must be at most ${(field as TextFieldConfig).maxLength} characters`,
          })
        }
        break

      case "email":
        schema = z.string().email({ message: `Please enter a valid email address` })
        if (field.required) schema = schema.min(1, { message: `${field.label} is required` })
        break

      case "password":
        schema = z.string()
        if (field.required) schema = schema.min(1, { message: `${field.label} is required` })
        break

      case "number":
        schema = z.number()
        if ((field as NumberFieldConfig).min !== undefined) {
          schema = schema.min((field as NumberFieldConfig).min!, {
            message: `${field.label} must be at least ${(field as NumberFieldConfig).min}`,
          })
        }
        if ((field as NumberFieldConfig).max !== undefined) {
          schema = schema.max((field as NumberFieldConfig).max!, {
            message: `${field.label} must be at most ${(field as NumberFieldConfig).max}`,
          })
        }
        break

      case "select":
      case "radio":
        const options = (field as SelectFieldConfig).options.map((opt) => opt.value.toString())
        schema = z.enum(options as [string, ...string[]])
        break

      case "multiselect":
        schema = z.array(z.string())
        break

      case "checkbox":
      case "switch":
        schema = z.boolean()
        break

      case "color":
        schema = z.string()
        break

      case "date":
      case "time":
        schema = z.string()
        break

      case "file":
        schema = z.string().optional()
        break

      case "slider":
        schema = z.number()
        if ((field as SliderFieldConfig).min !== undefined) {
          schema = schema.min((field as SliderFieldConfig).min, {
            message: `${field.label} must be at least ${(field as SliderFieldConfig).min}`,
          })
        }
        if ((field as SliderFieldConfig).max !== undefined) {
          schema = schema.max((field as SliderFieldConfig).max, {
            message: `${field.label} must be at most ${(field as SliderFieldConfig).max}`,
          })
        }
        break

      default:
        schema = z.any()
    }

    // Make optional if not required
    if (!field.required && field.type !== "checkbox" && field.type !== "switch") {
      schema = schema.optional()
    }

    shape[field.id] = schema
  })

  return z.object(shape)
}

// Helper function to get default values from field configs
export function getDefaultValues(fields: FieldConfig[]): Record<string, any> {
  const defaultValues: Record<string, any> = {}

  fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaultValues[field.id] = field.defaultValue
    } else {
      // Set appropriate default values based on field type
      switch (field.type) {
        case "text":
        case "textarea":
        case "email":
        case "password":
        case "color":
        case "date":
        case "time":
          defaultValues[field.id] = ""
          break

        case "number":
        case "slider":
          defaultValues[field.id] = 0
          break

        case "select":
        case "radio":
          const options = (field as SelectFieldConfig).options
          defaultValues[field.id] = options.length > 0 ? options[0].value : ""
          break

        case "multiselect":
          defaultValues[field.id] = []
          break

        case "checkbox":
        case "switch":
          defaultValues[field.id] = false
          break

        case "file":
          defaultValues[field.id] = null
          break
      }
    }
  })

  return defaultValues
}

