// Define the types of notification channels as operations
export type OperationType =
  | "notification.email"
  | "notification.whatsapp"
  | "notification.sms"
  | "notification.slack"
  | "webhook.trigger"
  | "log.activity"
  | "analytics.track"
  | "automation.workflow"

// Define the types of events as actions
export type ActionType =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "payment.received"
  | "payment.refunded"
  | "document.created"
  | "document.shared"
  | "login.success"
  | "login.failed"
  | "data.export"
  | "data.import"
  | "custom.event"
  | "application.created"
  | "application.submitted"
  | "commission.bill.created"

// Define the structure for an action configuration
export interface ActionConfig {
  type: ActionType
  enabled: boolean
  name: string
  description: string
  config: Record<string, any>
}

// Define the structure for an operation configuration
export interface OperationConfig {
  type: OperationType
  name: string
  description: string
  enabled: boolean
  actions: ActionConfig[]
  config: Record<string, any> // Add config property to OperationConfig
}

// Default configurations for actions (events)
export const defaultActionConfigs: Record<ActionType, Omit<ActionConfig, "enabled">> = {
  "user.created": {
    type: "user.created",
    name: "User Created",
    description: "When a new user is created in the system",
    config: {
      includeUserDetails: true,
      notifyAdmin: true,
      welcomeNewUser: true,
      template: "user-created",
      subject: "New User Created",
    },
  },
  "user.updated": {
    type: "user.updated",
    name: "User Updated",
    description: "When a user profile is updated",
    config: {
      includeUserDetails: true,
      notifyAdmin: true,
      highlightChanges: true,
      template: "user-updated",
      subject: "User Profile Updated",
    },
  },
  "user.deleted": {
    type: "user.deleted",
    name: "User Deleted",
    description: "When a user is deleted from the system",
    config: {
      includeUserDetails: true,
      notifyAdmin: true,
      requestFeedback: true,
      template: "user-deleted",
      subject: "User Account Deleted",
    },
  },
  "payment.received": {
    type: "payment.received",
    name: "Payment Received",
    description: "When a payment is successfully processed",
    config: {
      includePaymentDetails: true,
      sendReceipt: true,
      template: "payment-received",
      subject: "Payment Received",
    },
  },
  "payment.refunded": {
    type: "payment.refunded",
    name: "Payment Refunded",
    description: "When a payment is refunded",
    config: {
      includeRefundDetails: true,
      sendRefundConfirmation: true,
      template: "payment-refunded",
      subject: "Payment Refunded",
    },
  },
  "document.created": {
    type: "document.created",
    name: "Document Created",
    description: "When a new document is created",
    config: {
      includeDocumentDetails: true,
      template: "document-created",
      subject: "New Document Created",
    },
  },
  "document.shared": {
    type: "document.shared",
    name: "Document Shared",
    description: "When a document is shared with others",
    config: {
      includeDocumentDetails: true,
      includeShareDetails: true,
      template: "document-shared",
      subject: "Document Shared With You",
    },
  },
  "login.success": {
    type: "login.success",
    name: "Successful Login",
    description: "When a user successfully logs in",
    config: {
      includeDeviceInfo: true,
      includeLocationInfo: true,
      template: "login-success",
      subject: "New Login to Your Account",
    },
  },
  "login.failed": {
    type: "login.failed",
    name: "Failed Login Attempt",
    description: "When a login attempt fails",
    config: {
      includeAttemptDetails: true,
      includeLocationInfo: true,
      template: "login-failed",
      subject: "Failed Login Attempt",
    },
  },
  "data.export": {
    type: "data.export",
    name: "Data Exported",
    description: "When data is exported from the system",
    config: {
      includeExportDetails: true,
      template: "data-export",
      subject: "Data Export Complete",
    },
  },
  "data.import": {
    type: "data.import",
    name: "Data Imported",
    description: "When data is imported into the system",
    config: {
      includeImportDetails: true,
      template: "data-import",
      subject: "Data Import Complete",
    },
  },
  "custom.event": {
    type: "custom.event",
    name: "Custom Event",
    description: "A custom event defined by the user",
    config: {
      customMessage: "",
      template: "custom",
      subject: "Custom Notification",
    },
  },
  "application.created": {
    type: "application.created",
    name: "Application Created",
    description: "When a new application is created in the system",
    config: {
      includeApplicationDetails: true,
      notifyAdmin: true,
      notifyApplicant: true,
      template: "application-created",
      subject: "New Application Created",
    },
  },
  "application.submitted": {
    type: "application.submitted",
    name: "Application Submitted",
    description: "When an application is submitted for review",
    config: {
      includeApplicationDetails: true,
      notifyAdmin: true,
      notifyApplicant: true,
      sendConfirmation: true,
      template: "application-submitted",
      subject: "Application Submitted Successfully",
    },
  },
  "commission.bill.created": {
    type: "commission.bill.created",
    name: "Commission Bill Created",
    description: "When a new commission bill is generated",
    config: {
      includeBillDetails: true,
      includeCommissionBreakdown: true,
      notifyAgent: true,
      notifyFinance: true,
      template: "commission-bill-created",
      subject: "New Commission Bill Generated",
    },
  },
}

// Default configurations for operations (notification channels)
export const defaultOperationConfigs: Record<OperationType, Omit<OperationConfig, "actions" | "config">> = {
  "notification.email": {
    type: "notification.email",
    name: "Email Notifications",
    description: "Send notifications via email",
    enabled: true,
  },
  "notification.whatsapp": {
    type: "notification.whatsapp",
    name: "WhatsApp Notifications",
    description: "Send notifications via WhatsApp",
    enabled: false,
  },
  "notification.sms": {
    type: "notification.sms",
    name: "SMS Notifications",
    description: "Send notifications via SMS",
    enabled: false,
  },
  "notification.slack": {
    type: "notification.slack",
    name: "Slack Notifications",
    description: "Send notifications to Slack channels",
    enabled: false,
  },
  "webhook.trigger": {
    type: "webhook.trigger",
    name: "Webhook Triggers",
    description: "Send data to external webhooks",
    enabled: false,
  },
  "log.activity": {
    type: "log.activity",
    name: "Activity Logging",
    description: "Log activities in the system",
    enabled: true,
  },
  "analytics.track": {
    type: "analytics.track",
    name: "Analytics Tracking",
    description: "Track events for analytics",
    enabled: true,
  },
  "automation.workflow": {
    type: "automation.workflow",
    name: "Workflow Automation",
    description: "Trigger automated workflows",
    enabled: false,
  },
}

// Channel-specific configuration templates
export const channelConfigTemplates: Record<OperationType, Record<string, any>> = {
  "notification.email": {
    recipients: [],
    ccRecipients: [],
    bccRecipients: [],
    fromName: "System Notifications",
    replyTo: "",
    attachments: false,
  },
  "notification.whatsapp": {
    phoneNumbers: [],
    includeMedia: false,
    priority: "normal",
  },
  "notification.sms": {
    phoneNumbers: [],
    senderId: "System",
    priority: "normal",
  },
  "notification.slack": {
    channel: "general",
    mentionUsers: [],
    useThreads: true,
    includeAttachments: true,
  },
  "webhook.trigger": {
    url: "",
    method: "POST",
    headers: {},
    includeFullPayload: true,
    retryOnFailure: true,
  },
  "log.activity": {
    level: "info",
    includeDetails: true,
    retention: "90days",
    alertOnError: false,
  },
  "analytics.track": {
    eventPrefix: "",
    includeUserData: true,
    anonymizeIp: false,
    customDimensions: {},
  },
  "automation.workflow": {
    workflowId: "",
    inputData: {},
    runAsynchronously: true,
    priority: "normal",
  },
}

// Generate default operations with default actions
// Generate default operations with default actions
export function generateDefaultOperations(): OperationConfig[] {
  return Object.values(defaultOperationConfigs).map((operation) => {
    // Create a Map to ensure unique action types
    const actionMap = new Map<ActionType, ActionConfig>()
    
    // Common actions for all operations
    actionMap.set("user.created", {
      ...defaultActionConfigs["user.created"],
      enabled: operation.type === "notification.email",
    })

    actionMap.set("user.updated", {
      ...defaultActionConfigs["user.updated"],
      enabled: operation.type === "notification.email",
    })

    actionMap.set("user.deleted", {
      ...defaultActionConfigs["user.deleted"],
      enabled: operation.type === "notification.email",
    })

    // Add payment actions to email and SMS
    if (operation.type === "notification.email" || operation.type === "notification.sms") {
      actionMap.set("payment.received", {
        ...defaultActionConfigs["payment.received"],
        enabled: true,
      })

      actionMap.set("payment.refunded", {
        ...defaultActionConfigs["payment.refunded"],
        enabled: true,
      })
    }

    // Add security alerts to all notification channels
    if (operation.type.startsWith("notification.")) {
      actionMap.set("login.failed", {
        ...defaultActionConfigs["login.failed"],
        enabled: operation.type === "notification.email",
      })
    }

    // Add document sharing to email and WhatsApp
    if (operation.type === "notification.email" || operation.type === "notification.whatsapp") {
      actionMap.set("document.shared", {
        ...defaultActionConfigs["document.shared"],
        enabled: operation.type === "notification.email",
      })
    }

    // Add all events to logging
    if (operation.type === "log.activity") {
      // These are already added above, so they'll just be overwritten with new values
      actionMap.set("user.created", {
        ...defaultActionConfigs["user.created"],
        enabled: true,
      })
      actionMap.set("user.updated", {
        ...defaultActionConfigs["user.updated"],
        enabled: true,
      })
      actionMap.set("user.deleted", {
        ...defaultActionConfigs["user.deleted"],
        enabled: true,
      })
      actionMap.set("payment.received", {
        ...defaultActionConfigs["payment.received"],
        enabled: true,
      })
      actionMap.set("payment.refunded", {
        ...defaultActionConfigs["payment.refunded"],
        enabled: true,
      })
      actionMap.set("login.success", {
        ...defaultActionConfigs["login.success"],
        enabled: true,
      })
      actionMap.set("login.failed", {
        ...defaultActionConfigs["login.failed"],
        enabled: true,
      })
    }

    // Add custom event to all operations
    actionMap.set("custom.event", {
      ...defaultActionConfigs["custom.event"],
      enabled: false,
    })

    // Convert Map to array
    const uniqueActions = Array.from(actionMap.values())

    // Add channel-specific configuration
    const operationWithConfig: OperationConfig = {
      ...operation,
      config: channelConfigTemplates[operation.type as OperationType],
      actions: uniqueActions,
    } as OperationConfig

    return operationWithConfig
  })
}

// Helper function to get action config by type
export function getActionConfigByType(type: ActionType): Omit<ActionConfig, "enabled"> {
  return defaultActionConfigs[type]
}

// Helper function to create a new action with default configuration
export function createAction(type: ActionType, enabled = true): ActionConfig {
  const baseConfig = { ...defaultActionConfigs[type] }

  return {
    ...baseConfig,
    enabled,
  }
}

// Define the structure for an email notification configuration


