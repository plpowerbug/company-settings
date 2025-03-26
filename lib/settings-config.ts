import type { SettingsSchema, FieldOption } from "./settings-schema"

// Define common options
const languageOptions: FieldOption[] = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Japanese", value: "ja" },
  { label: "Chinese", value: "zh" },
]

const timezoneOptions: FieldOption[] = [
  { label: "UTC", value: "UTC" },
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "Central Time (CT)", value: "America/Chicago" },
  { label: "Mountain Time (MT)", value: "America/Denver" },
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "London (GMT)", value: "Europe/London" },
  { label: "Paris (CET)", value: "Europe/Paris" },
  { label: "Tokyo (JST)", value: "Asia/Tokyo" },
]

const themeOptions: FieldOption[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
]

const dateFormatOptions: FieldOption[] = [
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
]

const timeFormatOptions: FieldOption[] = [
  { label: "12-hour (AM/PM)", value: "12hour" },
  { label: "24-hour", value: "24hour" },
]

const industryOptions: FieldOption[] = [
  { label: "Technology", value: "technology" },
  { label: "Finance", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Retail", value: "retail" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Other", value: "other" },
]

const companySizeOptions: FieldOption[] = [
  { label: "1-10 employees", value: "1-10" },
  { label: "11-50 employees", value: "11-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201-500 employees", value: "201-500" },
  { label: "501-1000 employees", value: "501-1000" },
  { label: "1001+ employees", value: "1001+" },
]

const securityLevelOptions: FieldOption[] = [
  { label: "Low - Basic security measures", value: "low" },
  { label: "Medium - Standard security (recommended)", value: "medium" },
  { label: "High - Maximum security with additional verification", value: "high" },
]

const dataRetentionOptions: FieldOption[] = [
  { label: "30 Days", value: "30days" },
  { label: "90 Days", value: "90days" },
  { label: "1 Year", value: "1year" },
  { label: "2 Years", value: "2years" },
  { label: "Forever", value: "forever" },
]

const backupFrequencyOptions: FieldOption[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
]

const emailDigestOptions: FieldOption[] = [
  { label: "Never", value: "never" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
]

const crmProviderOptions: FieldOption[] = [
  { label: "None", value: "none" },
  { label: "Salesforce", value: "salesforce" },
  { label: "HubSpot", value: "hubspot" },
  { label: "Zoho", value: "zoho" },
  { label: "Other", value: "other" },
]

// Define company settings schema
export const companySettingsSchema: SettingsSchema = {
  id: "company-settings",
  title: "Company Settings",
  description: "Manage your company profile and configuration settings",
  sections: [
    {
      id: "company-info",
      title: "Company Information",
      description: "Basic information about your company",
      fields: [
        {
          id: "profile.name",
          type: "text",
          label: "Company Name",
          description: "This is your company's official name.",
          placeholder: "Achieva.",
          defaultValue: "achieva Corporation",
          required: true,
          validation: {
            minLength: 2,
          },
        },
        {
          id: "profile.description",
          type: "textarea",
          label: "Company Description",
          description: "A brief description of your company and what you do.",
          placeholder: "Tell us about your company...",
          defaultValue: "Leading provider of innovative solutions",
        },
        {
          id: "profile.logo",
          type: "file",
          label: "Company Logo",
          description: "Upload a square logo in PNG or JPG format, ideally 512x512px.",
          accept: "image/*",
          maxSize: 5 * 1024 * 1024, // 5MB
        },
      ],
    },
    {
      id: "company-details",
      title: "Company Details",
      fields: [
        {
          id: "profile.industry",
          type: "select",
          label: "Industry",
          description: "Select the industry your company operates in.",
          options: industryOptions,
          defaultValue: "technology",
        },
        {
          id: "profile.foundedYear",
          type: "text",
          label: "Founded Year",
          description: "The year your company was founded.",
          placeholder: "2010",
          defaultValue: "2010",
        },
        {
          id: "profile.website",
          type: "text",
          label: "Website",
          description: "Your company's website URL.",
          placeholder: "https://example.com",
          defaultValue: "https://example.com",
          validation: {
            pattern: "^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$",
          },
        },
        {
          id: "profile.companySize",
          type: "select",
          label: "Company Size",
          description: "The approximate number of employees.",
          options: companySizeOptions,
          defaultValue: "11-50",
        },
      ],
    },
    {
      id: "brand-colors",
      title: "Brand Colors",
      fields: [
        {
          id: "profile.primaryColor",
          type: "color",
          label: "Primary Color",
          description: "Your brand's primary color (hex code).",
          defaultValue: "#000000",
        },
        {
          id: "profile.secondaryColor",
          type: "color",
          label: "Secondary Color",
          description: "Your brand's secondary color (hex code).",
          defaultValue: "#ffffff",
        },
      ],
    },
    {
      id: "notification-settings",
      title: "Notification Settings",
      description: "Configure how and when you receive notifications",
      fields: [
        {
          id: "notifications.enableNotifications",
          type: "switch",
          label: "Email Notifications",
          description: "Enable or disable all email notifications.",
          defaultValue: false,
        },
        {
          id: "notifications.emailDigestFrequency",
          type: "select",
          label: "Email Digest Frequency",
          description: "How often you want to receive email digests.",
          options: emailDigestOptions,
          defaultValue: "weekly",
          dependsOn: {
            field: "notifications.enableNotifications",
            value: true,
          },
        },
      ],
    },
    {
      id: "notification-types",
      title: "Notification Types",
      description: "Select which types of notifications you want to receive",
      fields: [
        {
          id: "notifications.notifyOnUserSignup",
          type: "checkbox",
          label: "User Signup Notifications",
          description: "Receive notifications when new users sign up.",
          defaultValue: true,
          dependsOn: {
            field: "notifications.enableNotifications",
            value: true,
          },
        },
        {
          id: "notifications.notifyOnPaymentReceived",
          type: "checkbox",
          label: "Payment Notifications",
          description: "Receive notifications when payments are processed.",
          defaultValue: true,
          dependsOn: {
            field: "notifications.enableNotifications",
            value: true,
          },
        },
        {
          id: "notifications.notifyOnSystemUpdates",
          type: "checkbox",
          label: "System Update Notifications",
          description: "Receive notifications about system updates and maintenance.",
          defaultValue: true,
          dependsOn: {
            field: "notifications.enableNotifications",
            value: true,
          },
        },
        {
          id: "notifications.notifyOnSecurityAlerts",
          type: "checkbox",
          label: "Security Alert Notifications",
          description: "Receive notifications about security-related events.",
          defaultValue: true,
          dependsOn: {
            field: "notifications.enableNotifications",
            value: true,
          },
        },
        {
          id: "notifications.marketingEmails",
          type: "switch",
          label: "Marketing Emails",
          description: "Receive promotional emails and product updates.",
          defaultValue: false,
        },
      ],
    },
    {
      id: "display-settings",
      title: "Display Settings",
      description: "Customize the appearance and behavior of your interface",
      fields: [
        {
          id: "display.defaultTheme",
          type: "select",
          label: "Default Theme",
          description: "Choose the default theme for your interface.",
          options: themeOptions,
          defaultValue: "system",
        },
        {
          id: "display.enableCustomBranding",
          type: "switch",
          label: "Custom Branding",
          description: "Apply your company's branding to the interface.",
          defaultValue: false,
        },
        {
          id: "display.dateFormat",
          type: "select",
          label: "Date Format",
          description: "Choose how dates are displayed.",
          options: dateFormatOptions,
          defaultValue: "MM/DD/YYYY",
        },
        {
          id: "display.timeFormat",
          type: "select",
          label: "Time Format",
          description: "Choose how times are displayed.",
          options: timeFormatOptions,
          defaultValue: "12hour",
        },
        {
          id: "display.defaultLanguage",
          type: "select",
          label: "Default Language",
          description: "Choose the default language.",
          options: languageOptions,
          defaultValue: "en",
        },
        {
          id: "display.defaultTimezone",
          type: "select",
          label: "Default Timezone",
          description: "Choose the default timezone.",
          options: timezoneOptions,
          defaultValue: "UTC",
        },
        {
          id: "display.showWelcomeMessage",
          type: "switch",
          label: "Welcome Message",
          description: "Show welcome message for new users.",
          defaultValue: true,
        },
        {
          id: "display.compactMode",
          type: "switch",
          label: "Compact Mode",
          description: "Use a more compact UI with less whitespace.",
          defaultValue: false,
        },
      ],
    },
  ],
}


// Define personal settings schema
export const personalSettingsSchema: SettingsSchema = {
  id: "personal-settings",
  title: "Personal Settings",
  description: "Manage your personal preferences and account settings",

  sections: [
    {
      id: "appearance",
      title: "Appearance",
      description: "Customize how the application looks",
      fields: [
        {
          id: "preferences.theme",
          type: "select",
          label: "Theme",
          description: "Choose your preferred theme.",
          options: themeOptions,
          defaultValue: "system",
        },
        {
          id: "preferences.fontSize",
          type: "select",
          label: "Font Size",
          description: "Adjust the text size throughout the application.",
          options: [
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
          ],
          defaultValue: "medium",
        },
        {
          id: "preferences.highContrast",
          type: "switch",
          label: "High Contrast Mode",
          description: "Increase contrast for better visibility.",
          defaultValue: false,
        },
        {
          id: "preferences.reducedMotion",
          type: "switch",
          label: "Reduced Motion",
          description: "Minimize animations throughout the interface.",
          defaultValue: false,
        },
      ],
    },
    {
      id: "localization",
      title: "Localization",
      description: "Set your language and regional preferences",
      fields: [
        {
          id: "preferences.language",
          type: "select",
          label: "Language",
          description: "Choose your preferred language.",
          options: languageOptions,
          defaultValue: "en",
        },
        {
          id: "preferences.timezone",
          type: "select",
          label: "Timezone",
          description: "Set your local timezone.",
          options: timezoneOptions,
          defaultValue: "UTC",
        },
        {
          id: "preferences.dateFormat",
          type: "select",
          label: "Date Format",
          description: "Choose how dates are displayed to you.",
          options: dateFormatOptions,
          defaultValue: "MM/DD/YYYY",
        },
        {
          id: "preferences.timeFormat",
          type: "select",
          label: "Time Format",
          description: "Choose how times are displayed to you.",
          options: timeFormatOptions,
          defaultValue: "12hour",
        },
        {
          id: "preferences.firstDayOfWeek",
          type: "select",
          label: "First Day of Week",
          description: "Choose which day should be considered the first day of the week.",
          options: [
            { label: "Sunday", value: "sunday" },
            { label: "Monday", value: "monday" },
          ],
          defaultValue: "sunday",
        },
      ],
    },
    {
      id: "notification-preferences",
      title: "Notification Preferences",
      description: "Control how and when you receive notifications",
      fields: [
        {
          id: "preferences.notifications.enabled",
          type: "switch",
          label: "Enable Notifications",
          description: "Receive notifications about important events.",
          defaultValue: true,
        },
        {
          id: "preferences.notifications.email",
          type: "switch",
          label: "Email Notifications",
          description: "Receive notifications via email.",
          defaultValue: true,
          dependsOn: {
            field: "preferences.notifications.enabled",
            value: true,
          },
        },
        {
          id: "preferences.notifications.browser",
          type: "switch",
          label: "Browser Notifications",
          description: "Receive notifications in your browser.",
          defaultValue: true,
          dependsOn: {
            field: "preferences.notifications.enabled",
            value: true,
          },
        },
        {
          id: "preferences.notifications.mobile",
          type: "switch",
          label: "Mobile Notifications",
          description: "Receive notifications on your mobile device.",
          defaultValue: true,
          dependsOn: {
            field: "preferences.notifications.enabled",
            value: true,
          },
        },
      ],
    },
    {
      id: "notification-types",
      title: "Notification Types",
      description: "Choose which types of notifications you want to receive",
      fields: [
        {
          id: "preferences.notifications.mentions",
          type: "switch",
          label: "Mentions",
          description: "Notify when someone mentions you.",
          defaultValue: true,
          dependsOn: {
            field: "preferences.notifications.enabled",
            value: true,
          },
        },
        {
          id: "preferences.notifications.comments",
          type: "switch",
          label: "Comments",
          description: "Notify when someone comments on your content.",
          defaultValue: true,
          dependsOn: {
            field: "preferences.notifications.enabled",
            value: true,
          },
        },
        {
          id: "preferences.notifications.updates",
          type: "switch",
          label: "System Updates",
          description: "Notify about system updates and maintenance.",
          defaultValue: false,
          dependsOn: {
            field: "preferences.notifications.enabled",
            value: true,
          },
        },
        {
          id: "preferences.notifications.marketing",
          type: "switch",
          label: "Marketing",
          description: "Receive promotional content and newsletters.",
          defaultValue: false,
          dependsOn: {
            field: "preferences.notifications.enabled",
            value: true,
          },
        },
      ],
    },
    {
      id: "quiet-hours",
      title: "Quiet Hours",
      description: "Set times when you don't want to be disturbed",
      fields: [
        {
          id: "preferences.notifications.quietHoursEnabled",
          type: "switch",
          label: "Enable Quiet Hours",
          description: "Pause notifications during specified hours.",
          defaultValue: false,
          dependsOn: {
            field: "preferences.notifications.enabled",
            value: true,
          },
        },
        {
          id: "preferences.notifications.quietHoursStart",
          type: "time",
          label: "Start Time",
          description: "When quiet hours should begin.",
          defaultValue: "22:00",
          dependsOn: {
            field: "preferences.notifications.quietHoursEnabled",
            value: true,
          },
        },
        {
          id: "preferences.notifications.quietHoursEnd",
          type: "time",
          label: "End Time",
          description: "When quiet hours should end.",
          defaultValue: "07:00",
          dependsOn: {
            field: "preferences.notifications.quietHoursEnabled",
            value: true,
          },
        },
      ],
    }, 
  ],
}

