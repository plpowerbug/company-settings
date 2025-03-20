"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { getCompanySettings, updateCompanySettings } from "@/lib/settings-actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Define the schema for company profile
const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  logo: z.string().optional(),
  industry: z.string().optional(),
  foundedYear: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  companySize: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
})

// Define the schema for notification settings
const notificationSchema = z.object({
  enableNotifications: z.boolean().default(false),
  emailDigestFrequency: z.enum(["never", "daily", "weekly", "monthly"]).default("weekly"),
  notifyOnUserSignup: z.boolean().default(true),
  notifyOnPaymentReceived: z.boolean().default(true),
  notifyOnSystemUpdates: z.boolean().default(true),
  notifyOnSecurityAlerts: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
})

// Define the schema for security settings
const securitySchema = z.object({
  enableTwoFactorAuth: z.boolean().default(false),
  passwordExpiryDays: z.number().min(0).max(365).default(90),
  sessionTimeoutMinutes: z.number().min(5).max(1440).default(60),
  ipRestriction: z.boolean().default(false),
  allowedIpAddresses: z.string().optional(),
  failedLoginAttempts: z.number().min(1).max(10).default(5),
  securityLevel: z.enum(["low", "medium", "high"]).default("medium"),
})

// Define the schema for data settings
const dataSchema = z.object({
  enableDataSharing: z.boolean().default(false),
  enableAnalytics: z.boolean().default(true),
  enableAutoBackup: z.boolean().default(false),
  dataRetentionPeriod: z.enum(["30days", "90days", "1year", "2years", "forever"]).default("1year"),
  backupFrequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  backupTime: z.string().optional(),
  encryptData: z.boolean().default(true),
  anonymizeUserData: z.boolean().default(false),
})

// Define the schema for integration settings
const integrationSchema = z.object({
  enableSlackIntegration: z.boolean().default(false),
  slackWebhookUrl: z.string().url().optional().or(z.literal("")),
  enableGoogleAnalytics: z.boolean().default(false),
  googleAnalyticsId: z.string().optional(),
  enableZapier: z.boolean().default(false),
  enableCRM: z.boolean().default(false),
  crmProvider: z.enum(["none", "salesforce", "hubspot", "zoho", "other"]).default("none"),
  crmApiKey: z.string().optional(),
  enableSocialLogin: z.boolean().default(false),
  enabledSocialProviders: z.object({
    google: z.boolean().default(false),
    facebook: z.boolean().default(false),
    twitter: z.boolean().default(false),
    github: z.boolean().default(false),
  }),
})

// Define the schema for display settings
const displaySchema = z.object({
  defaultTheme: z.enum(["light", "dark", "system"]).default("system"),
  enableCustomBranding: z.boolean().default(false),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  timeFormat: z.enum(["12hour", "24hour"]).default("12hour"),
  defaultLanguage: z.enum(["en", "es", "fr", "de", "ja", "zh"]).default("en"),
  defaultTimezone: z.string().default("UTC"),
  showWelcomeMessage: z.boolean().default(true),
  compactMode: z.boolean().default(false),
})

// Combine all schemas into one
const formSchema = z.object({
  profile: profileSchema,
  notifications: notificationSchema,
  security: securitySchema,
  data: dataSchema,
  integrations: integrationSchema,
  display: displaySchema,
})

export function CompanySettingsForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<z.infer<typeof formSchema> | null>(null)

  // Fetch initial data
  useState(async () => {
    try {
      const data = await getCompanySettings()
      setInitialData(data)
      if (data.profile?.logo) {
        setLogoPreview(data.profile.logo)
      }
    } catch (error) {
      console.error("Failed to fetch company settings:", error)
      toast({
        title: "Error",
        description: "Failed to load company settings",
        variant: "destructive",
      })
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      profile: {
        name: "Acme Corporation",
        description: "",
        logo: "",
        industry: "",
        foundedYear: "",
        website: "",
        companySize: "",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
      },
      notifications: {
        enableNotifications: false,
        emailDigestFrequency: "weekly",
        notifyOnUserSignup: true,
        notifyOnPaymentReceived: true,
        notifyOnSystemUpdates: true,
        notifyOnSecurityAlerts: true,
        marketingEmails: false,
      },
      security: {
        enableTwoFactorAuth: false,
        passwordExpiryDays: 90,
        sessionTimeoutMinutes: 60,
        ipRestriction: false,
        allowedIpAddresses: "",
        failedLoginAttempts: 5,
        securityLevel: "medium",
      },
      data: {
        enableDataSharing: false,
        enableAnalytics: true,
        enableAutoBackup: false,
        dataRetentionPeriod: "1year",
        backupFrequency: "daily",
        backupTime: "00:00",
        encryptData: true,
        anonymizeUserData: false,
      },
      integrations: {
        enableSlackIntegration: false,
        slackWebhookUrl: "",
        enableGoogleAnalytics: false,
        googleAnalyticsId: "",
        enableZapier: false,
        enableCRM: false,
        crmProvider: "none",
        crmApiKey: "",
        enableSocialLogin: false,
        enabledSocialProviders: {
          google: false,
          facebook: false,
          twitter: false,
          github: false,
        },
      },
      display: {
        defaultTheme: "system",
        enableCustomBranding: false,
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12hour",
        defaultLanguage: "en",
        defaultTimezone: "UTC",
        showWelcomeMessage: true,
        compactMode: false,
      },
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await updateCompanySettings(values)
      toast({
        title: "Settings updated",
        description: "Your company settings have been updated successfully.",
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to update settings:", error)
      toast({
        title: "Error",
        description: "Failed to update company settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload the file to a storage service
    // and get back a URL. For this demo, we'll use a data URL.
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setLogoPreview(dataUrl)
      form.setValue("profile.logo", dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Update your company information and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="profile.logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Logo</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-start gap-4">
                          {logoPreview ? (
                            <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                              <Image
                                src={logoPreview || "/placeholder.svg"}
                                alt="Company logo"
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-md border border-dashed">
                              <span className="text-sm text-muted-foreground">No logo</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              id="logo-upload"
                            />
                            <Button type="button" variant="outline" size="sm" asChild>
                              <label htmlFor="logo-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Logo
                              </label>
                            </Button>
                            {logoPreview && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setLogoPreview(null)
                                  form.setValue("profile.logo", "")
                                }}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>Upload a square logo in PNG or JPG format, ideally 512x512px.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="profile.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormDescription>This is your company's official name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profile.industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the industry your company operates in.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profile.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormDescription>Your company's website URL.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profile.companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                            <SelectItem value="1001+">1001+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>The approximate number of employees.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profile.foundedYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founded Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2010" {...field} />
                        </FormControl>
                        <FormDescription>The year your company was founded.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="profile.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about your company..." className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>A brief description of your company and what you do.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Brand Colors</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="profile.primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input type="color" {...field} className="w-12 h-8 p-1" />
                              <Input
                                type="text"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>Your brand's primary color (hex code).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profile.secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input type="color" {...field} className="w-12 h-8 p-1" />
                              <Input
                                type="text"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>Your brand's secondary color (hex code).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="notifications.enableNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Notifications</FormLabel>
                        <FormDescription>Enable or disable all email notifications.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notifications.emailDigestFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Digest Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How often you want to receive email digests.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notifications.notifyOnUserSignup"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>User Signup Notifications</FormLabel>
                            <FormDescription>Receive notifications when new users sign up.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notifications.notifyOnPaymentReceived"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Payment Notifications</FormLabel>
                            <FormDescription>Receive notifications when payments are processed.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notifications.notifyOnSystemUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>System Update Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications about system updates and maintenance.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notifications.notifyOnSecurityAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Security Alert Notifications</FormLabel>
                            <FormDescription>Receive notifications about security-related events.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="notifications.marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Marketing Emails</FormLabel>
                        <FormDescription>Receive promotional emails and product updates.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security options for your company account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="security.securityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="low" />
                            </FormControl>
                            <FormLabel className="font-normal">Low - Basic security measures</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="medium" />
                            </FormControl>
                            <FormLabel className="font-normal">Medium - Standard security (recommended)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="high" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              High - Maximum security with additional verification
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>Select the security level for your account.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="security.enableTwoFactorAuth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                        <FormDescription>Require 2FA for all admin users.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="security.passwordExpiryDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Expiry (Days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={365}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Number of days before passwords expire (0 = never).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="security.sessionTimeoutMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (Minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={5}
                            max={1440}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Inactive session timeout (5-1440 minutes).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="security.failedLoginAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Failed Login Attempts</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={10}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Maximum failed login attempts before account lockout (1-10).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="security.ipRestriction"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">IP Restriction</FormLabel>
                        <FormDescription>Restrict access to specific IP addresses.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="security.allowedIpAddresses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowed IP Addresses</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter IP addresses, one per line"
                          className="resize-none"
                          disabled={!form.watch("security.ipRestriction")}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter allowed IP addresses, one per line (e.g., 192.168.1.1).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Configure data handling, retention, and backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="data.enableAnalytics"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Usage Analytics</FormLabel>
                        <FormDescription>Collect anonymous usage data to improve our service.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data.enableDataSharing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Data Sharing</FormLabel>
                        <FormDescription>Allow sharing anonymized data with partners.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data.anonymizeUserData"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Anonymize User Data</FormLabel>
                        <FormDescription>Remove personally identifiable information from analytics.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data.dataRetentionPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Retention Period</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select retention period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30days">30 Days</SelectItem>
                          <SelectItem value="90days">90 Days</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="2years">2 Years</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>How long to keep user data before automatic deletion.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data.encryptData"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Encrypt Data</FormLabel>
                        <FormDescription>Enable encryption for sensitive data.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data.enableAutoBackup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Automatic Backups</FormLabel>
                        <FormDescription>Enable automatic backups of your data.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="data.backupFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Backup Frequency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!form.watch("data.enableAutoBackup")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select backup frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How often to perform automatic backups.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data.backupTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Backup Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} disabled={!form.watch("data.enableAutoBackup")} />
                        </FormControl>
                        <FormDescription>Time of day to perform backups (24-hour format).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect your account with third-party services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="slack">
                    <AccordionTrigger>Slack Integration</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <FormField
                          control={form.control}
                          name="integrations.enableSlackIntegration"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable Slack Integration</FormLabel>
                                <FormDescription>Send notifications to your Slack workspace.</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="integrations.slackWebhookUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Slack Webhook URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://hooks.slack.com/services/..."
                                  {...field}
                                  disabled={!form.watch("integrations.enableSlackIntegration")}
                                />
                              </FormControl>
                              <FormDescription>The webhook URL for your Slack workspace.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="analytics">
                    <AccordionTrigger>Google Analytics</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <FormField
                          control={form.control}
                          name="integrations.enableGoogleAnalytics"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable Google Analytics</FormLabel>
                                <FormDescription>Track website traffic with Google Analytics.</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="integrations.googleAnalyticsId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Google Analytics ID</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                                  {...field}
                                  disabled={!form.watch("integrations.enableGoogleAnalytics")}
                                />
                              </FormControl>
                              <FormDescription>Your Google Analytics tracking ID.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="crm">
                    <AccordionTrigger>CRM Integration</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <FormField
                          control={form.control}
                          name="integrations.enableCRM"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable CRM Integration</FormLabel>
                                <FormDescription>Connect with your CRM system.</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="integrations.crmProvider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CRM Provider</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!form.watch("integrations.enableCRM")}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select CRM provider" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">None</SelectItem>
                                  <SelectItem value="salesforce">Salesforce</SelectItem>
                                  <SelectItem value="hubspot">HubSpot</SelectItem>
                                  <SelectItem value="zoho">Zoho</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Select your CRM provider.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="integrations.crmApiKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CRM API Key</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter your API key"
                                  {...field}
                                  disabled={
                                    !form.watch("integrations.enableCRM") ||
                                    form.watch("integrations.crmProvider") === "none"
                                  }
                                />
                              </FormControl>
                              <FormDescription>API key for your CRM integration.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="social">
                    <AccordionTrigger>Social Login</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <FormField
                          control={form.control}
                          name="integrations.enableSocialLogin"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable Social Login</FormLabel>
                                <FormDescription>Allow users to sign in with social accounts.</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Enabled Providers</h3>
                          <div className="space-y-2">
                            <FormField
                              control={form.control}
                              name="integrations.enabledSocialProviders.google"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.watch("integrations.enableSocialLogin")}
                                    />
                                  </FormControl>
                                  <FormLabel>Google</FormLabel>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="integrations.enabledSocialProviders.facebook"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.watch("integrations.enableSocialLogin")}
                                    />
                                  </FormControl>
                                  <FormLabel>Facebook</FormLabel>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="integrations.enabledSocialProviders.twitter"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.watch("integrations.enableSocialLogin")}
                                    />
                                  </FormControl>
                                  <FormLabel>Twitter</FormLabel>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="integrations.enabledSocialProviders.github"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      disabled={!form.watch("integrations.enableSocialLogin")}
                                    />
                                  </FormControl>
                                  <FormLabel>GitHub</FormLabel>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="zapier">
                    <AccordionTrigger>Zapier</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <FormField
                          control={form.control}
                          name="integrations.enableZapier"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable Zapier Integration</FormLabel>
                                <FormDescription>Connect with thousands of apps through Zapier.</FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Customize the appearance and behavior of your interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="display.defaultTheme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Theme</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the default theme for your interface.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display.enableCustomBranding"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Custom Branding</FormLabel>
                        <FormDescription>Apply your company's branding to the interface.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="display.dateFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select date format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose how dates are displayed.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display.timeFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="12hour">12-hour (AM/PM)</SelectItem>
                            <SelectItem value="24hour">24-hour</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose how times are displayed.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display.defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the default language.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display.defaultTimezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the default timezone.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="display.showWelcomeMessage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Welcome Message</FormLabel>
                        <FormDescription>Show welcome message for new users.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display.compactMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Compact Mode</FormLabel>
                        <FormDescription>Use a more compact UI with less whitespace.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save All Settings
          </Button>
        </div>
      </form>
    </Form>
  )
}

