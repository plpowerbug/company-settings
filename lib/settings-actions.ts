"use server"

import { revalidatePath } from "next/cache"
import fs from "fs/promises"
import path from "path"
import type { OperationConfig } from "./operations-config"

// In a real application, this would be a database call
// For this example, we'll use a JSON file to simulate persistence
const DATA_FILE = path.join(process.cwd(), "data", "company-settings.json")

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true })
  } catch (error) {
    console.error("Failed to create data directory:", error)
  }
}

// Get company settings
export async function getCompanySettings() {
  try {
    await ensureDataDir()

    try {
      const data = await fs.readFile(DATA_FILE, "utf8")
      return JSON.parse(data)
    } catch (error) {
      // If file doesn't exist or can't be parsed, return default settings
      return {
        profile: {
          name: "Acme Corporation",
          description: "Leading provider of innovative solutions",
          logo: "",
          industry: "technology",
          foundedYear: "2010",
          website: "https://example.com",
          companySize: "11-50",
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
      }
    }
  } catch (error) {
    console.error("Error getting company settings:", error)
    throw new Error("Failed to get company settings")
  }
}

// Update company settings
export async function updateCompanySettings(settings: any) {
  try {
    await ensureDataDir()

    // In a real app, you would validate the settings here
    await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2))

    // Revalidate the settings page to reflect the changes
    revalidatePath("/settings")

    return { success: true }
  } catch (error) {
    console.error("Error updating company settings:", error)
    throw new Error("Failed to update company settings")
  }
}

export async function updateOperationConfig(index: number, operation: OperationConfig) {
  try {
    const settings = await getCompanySettings()
    if (!settings.operations) {
      throw new Error("Operations not found in settings")
    }

    settings.operations[index] = operation
    await updateCompanySettings(settings)
    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error updating operation config:", error)
    throw new Error("Failed to update operation config")
  }
}

export async function addActionToOperation(operationIndex: number, action: any) {
  try {
    const settings = await getCompanySettings()
    if (!settings.operations) {
      throw new Error("Operations not found in settings")
    }

    settings.operations[operationIndex].actions.push(action)
    await updateCompanySettings(settings)
    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error adding action to operation:", error)
    throw new Error("Failed to add action to operation")
  }
}

export async function removeActionFromOperation(operationIndex: number, actionIndex: number) {
  try {
    const settings = await getCompanySettings()
    if (!settings.operations) {
      throw new Error("Operations not found in settings")
    }

    settings.operations[operationIndex].actions.splice(actionIndex, 1)
    await updateCompanySettings(settings)
    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error removing action from operation:", error)
    throw new Error("Failed to remove action from operation")
  }
}

