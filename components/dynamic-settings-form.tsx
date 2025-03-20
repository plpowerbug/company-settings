"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { Loader2, Upload } from "lucide-react"

import {
  type SettingsSchema,
  type TabConfig,
  type SectionConfig,
  type FieldConfig,
  createZodSchema,
  getDefaultValues,
} from "@/lib/settings-schema"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface DynamicSettingsFormProps {
  schema: SettingsSchema
  initialData?: any
  onSubmit: (values: any) => Promise<void>
}

export function DynamicSettingsForm({ schema, initialData, onSubmit }: DynamicSettingsFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(schema.tabs[0]?.id || "")
  const [filePreviews, setFilePreviews] = useState<Record<string, string | null>>({})
  const [fileInputValue, setFileInputValue] = useState<Record<string, string | null>>({})

  // Collect all fields from all sections in all tabs
  const allFields: FieldConfig[] = schema.tabs.flatMap((tab) => tab.sections.flatMap((section) => section.fields))

  // Create a Zod schema from all fields
  const formSchema = createZodSchema(allFields)

  // Get default values from all fields
  const defaultValues = getDefaultValues(allFields)

  // Merge default values with initial data if provided
  const mergedValues = initialData ? { ...defaultValues, ...initialData } : defaultValues

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mergedValues,
  })

  // Handle form submission
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await onSubmit(values)
      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get icon component by name
  const getIconByName = (iconName?: string): LucideIcon | null => {
    if (!iconName) return null
    return (LucideIcons as any)[iconName] || null
  }

  // Check if a field should be visible based on its dependencies
  const isFieldVisible = (field: FieldConfig): boolean => {
    if (!field.dependsOn) return true

    const dependencyValue = form.watch(field.dependsOn.field)
    const targetValue = field.dependsOn.value
    const operator = field.dependsOn.operator || "equals"

    switch (operator) {
      case "equals":
        return dependencyValue === targetValue
      case "notEquals":
        return dependencyValue !== targetValue
      case "contains":
        return Array.isArray(dependencyValue) && dependencyValue.includes(targetValue)
      case "greaterThan":
        return dependencyValue > targetValue
      case "lessThan":
        return dependencyValue < targetValue
      default:
        return true
    }
  }

  // Render a field based on its type
  const renderField = (field: FieldConfig) => {
    if (!isFieldVisible(field)) return null

    switch (field.type) {
      case "text":
      case "email":
      case "password":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input type={field.type} placeholder={field.placeholder} {...formField} disabled={field.disabled} />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "textarea":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    className="resize-none"
                    {...formField}
                    disabled={field.disabled}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "number":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={(field as any).min}
                    max={(field as any).max}
                    step={(field as any).step || 1}
                    {...formField}
                    onChange={(e) => formField.onChange(Number(e.target.value))}
                    disabled={field.disabled}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "select":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value} disabled={field.disabled}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(field as any).options.map((option: any) => (
                      <SelectItem
                        key={option.value.toString()}
                        value={option.value.toString()}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "multiselect":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div>
                    {(field as any).options.map((option: any) => (
                      <div key={option.value.toString()} className="flex items-center space-x-2 my-2">
                        <Checkbox
                          id={`${field.id}-${option.value}`}
                          checked={formField.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const currentValues = formField.value || []
                            const newValues = checked
                              ? [...currentValues, option.value]
                              : currentValues.filter((value: any) => value !== option.value)
                            formField.onChange(newValues)
                          }}
                          disabled={field.disabled || option.disabled}
                        />
                        <label
                          htmlFor={`${field.id}-${option.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "checkbox":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <FormControl>
                  <Checkbox checked={formField.value} onCheckedChange={formField.onChange} disabled={field.disabled} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                  {field.description && <FormDescription>{field.description}</FormDescription>}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "switch":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{field.label}</FormLabel>
                  {field.description && <FormDescription>{field.description}</FormDescription>}
                </div>
                <FormControl>
                  <Switch checked={formField.value} onCheckedChange={formField.onChange} disabled={field.disabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "radio":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="flex flex-col space-y-1"
                    disabled={field.disabled}
                  >
                    {(field as any).options.map((option: any) => (
                      <FormItem key={option.value.toString()} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={option.value.toString()} disabled={option.disabled} />
                        </FormControl>
                        <FormLabel className="font-normal">{option.label}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "color":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input type="color" className="w-12 h-8 p-1" {...formField} disabled={field.disabled} />
                    <Input
                      type="text"
                      value={formField.value}
                      onChange={(e) => formField.onChange(e.target.value)}
                      className="flex-1"
                      disabled={field.disabled}
                    />
                  </div>
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "date":
      case "time":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input type={field.type} {...formField} disabled={field.disabled} />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "file":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => {
              const fieldId = field.id

              // Initialize preview from form value
              useEffect(() => {
                if (formField.value && typeof formField.value === "string" && formField.value.length > 0) {
                  setFilePreviews((prev) => ({ ...prev, [fieldId]: formField.value }))
                }
              }, [formField.value, fieldId])

              const preview = filePreviews[fieldId]

              const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0]
                if (!file) return

                // Check file size if maxSize is specified
                if ((field as any).maxSize && file.size > (field as any).maxSize) {
                  toast({
                    title: "File too large",
                    description: `Maximum file size is ${((field as any).maxSize / (1024 * 1024)).toFixed(2)}MB`,
                    variant: "destructive",
                  })
                  return
                }

                // In a real app, you would upload the file to a storage service
                // and get back a URL. For this demo, we'll use a data URL.
                const reader = new FileReader()
                reader.onload = (event) => {
                  const dataUrl = event.target?.result as string
                  setFilePreviews((prev) => ({ ...prev, [fieldId]: dataUrl }))
                  formField.onChange(dataUrl)
                  setFileInputValue((prev) => ({ ...prev, [fieldId]: dataUrl }))
                }
                reader.readAsDataURL(file)
              }

              return (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-start gap-4">
                      {preview ? (
                        <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                          <Image
                            src={preview || "/placeholder.svg"}
                            alt="File preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed">
                          <span className="text-sm text-muted-foreground">No file</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept={(field as any).accept}
                          onChange={handleFileChange}
                          className="hidden"
                          id={`file-upload-${field.id}`}
                          disabled={field.disabled}
                        />
                        <Button type="button" variant="outline" size="sm" asChild disabled={field.disabled}>
                          <label htmlFor={`file-upload-${field.id}`} className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                          </label>
                        </Button>
                        {preview && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFilePreviews((prev) => ({ ...prev, [fieldId]: null }))
                              formField.onChange("")
                              setFileInputValue((prev) => ({ ...prev, [fieldId]: null }))
                            }}
                            disabled={field.disabled}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  {field.description && <FormDescription>{field.description}</FormDescription>}
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )

      case "slider":
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Slider
                      min={(field as any).min}
                      max={(field as any).max}
                      step={(field as any).step || 1}
                      value={[formField.value]}
                      onValueChange={(values) => formField.onChange(values[0])}
                      disabled={field.disabled}
                    />
                    {(field as any).marks && (
                      <div className="flex justify-between">
                        {(field as any).marks.map((mark: any) => (
                          <span key={mark.value} className="text-xs text-muted-foreground">
                            {mark.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return null
    }
  }

  // Render a section
  const renderSection = (section: SectionConfig) => {
    // Filter out fields that should be hidden
    const visibleFields = section.fields.filter((field) => !field.hidden)

    return (
      <Card key={section.id} className="mb-6">
        <CardHeader>
          <CardTitle>{section.title}</CardTitle>
          {section.description && <CardDescription>{section.description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-6">
          {visibleFields.map((field) => (
            <div key={field.id}>{renderField(field)}</div>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Render a tab
  const renderTab = (tab: TabConfig) => {
    return (
      <TabsContent key={tab.id} value={tab.id} className="space-y-6">
        {tab.sections.map((section) => renderSection(section))}
      </TabsContent>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mb-4">
            {schema.tabs.map((tab) => {
              const Icon = tab.icon ? getIconByName(tab.icon) : null
              return (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {tab.title}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {schema.tabs.map((tab) => renderTab(tab))}
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}

