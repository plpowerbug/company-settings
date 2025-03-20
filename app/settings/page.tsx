"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCompanySettings } from "@/lib/settings-actions"
import { DynamicSettingsForm } from "@/components/dynamic-settings-form"
import { companySettingsSchema, personalSettingsSchema } from "@/lib/settings-config"
import { updateCompanySettings } from "@/lib/settings-actions"

export default function SettingsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application settings</p>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="company">Company Settings</TabsTrigger>
            <TabsTrigger value="personal">Personal Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-6">
            <Suspense fallback={<SettingsFormSkeleton />}>
              <CompanySettingsTab />
            </Suspense>
          </TabsContent>

          <TabsContent value="personal" className="mt-6">
            <Suspense fallback={<SettingsFormSkeleton />}>
              <PersonalSettingsTab />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Update the CompanySettingsTab function to properly handle the form submission
async function CompanySettingsTab() {
  const settings = await getCompanySettings()

  const updateSettings = async (values: any) => {
    "use server"
    // Ensure we're properly saving the settings
    await updateCompanySettings(values)
    return { success: true }
  }

  return <DynamicSettingsForm schema={companySettingsSchema} initialData={settings} onSubmit={updateSettings} />
}

// Update the PersonalSettingsTab function to properly handle the form submission
async function PersonalSettingsTab() {
  // In a real app, this would fetch the user's personal settings
  const userSettings = {
    preferences: {
      theme: "system",
      fontSize: "medium",
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12hour",
      firstDayOfWeek: "sunday",
      notifications: {
        enabled: true,
        email: true,
        browser: true,
        mobile: false,
        mentions: true,
        comments: true,
        updates: false,
        marketing: false,
        quietHoursEnabled: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
      },
      accessibility: {
        screenReader: false,
        keyboardNavigation: true,
        contrastMode: "normal",
        animationSpeed: 100,
      },
    },
  }

  const updateUserSettings = async (values: any) => {
    "use server"
    // In a real app, this would update the user's settings in the database
    console.log("Updating user settings:", values)
    // For demo purposes, we'll just wait a bit
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  }

  return (
    <DynamicSettingsForm schema={personalSettingsSchema} initialData={userSettings} onSubmit={updateUserSettings} />
  )
}

function SettingsFormSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-20 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-28" />
    </div>
  )
}

