"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCompanySettings, updateCompanySettings } from "@/lib/settings-actions"
import { DynamicSettingsForm } from "@/components/dynamic-settings-form"
import { companySettingsSchema, personalSettingsSchema } from "@/lib/settings-config"
import { OperationsSettings } from "@/components/operations-settings"
import { generateDefaultOperations } from "@/lib/operations-config"

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [operations, setOperations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getCompanySettings()
        setSettings(data)

        // Initialize operations if they don't exist
        if (!data.operations) {
          const defaultOps = generateDefaultOperations()
          data.operations = defaultOps
          await updateCompanySettings(data)
          setOperations(defaultOps)
        } else {
          setOperations(data.operations)
        }

        setLoading(false)
      } catch (error) {
        console.error("Failed to load settings:", error)
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleUpdateSettings = async (values) => {
    try {
      await updateCompanySettings(values)
      setSettings(values)
      return { success: true }
    } catch (error) {
      console.error("Failed to update settings:", error)
      return { success: false }
    }
  }

  const handleUpdateUserSettings = async (values) => {
    // In a real app, this would update the user's settings in the database
    console.log("Updating user settings:", values)
    // For demo purposes, we'll just wait a bit
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: true }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application settings</p>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="company">Company Settings</TabsTrigger>
            <TabsTrigger value="personal">Personal Settings</TabsTrigger>
            <TabsTrigger value="operations">Operations Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-6">
            {loading || !settings ? (
              <SettingsFormSkeleton />
            ) : (
              <DynamicSettingsForm
                schema={companySettingsSchema}
                initialData={settings}
                onSubmit={handleUpdateSettings}
              />
            )}
          </TabsContent>

          <TabsContent value="personal" className="mt-6">
            {loading ? (
              <SettingsFormSkeleton />
            ) : (
              <DynamicSettingsForm
                schema={personalSettingsSchema}
                initialData={{
                  preferences: {
                    theme: "dark",
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
                }}
                onSubmit={handleUpdateUserSettings}
              />
            )}
          </TabsContent>

          <TabsContent value="operations" className="mt-6">
            {loading ? (
              <SettingsFormSkeleton />
            ) : (
              <OperationsSettings operations={operations} onUpdate={() => window.location.reload()} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
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

