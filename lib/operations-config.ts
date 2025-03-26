// Define the types of operations that can be customized
export type OperationType =
  | "user.create"
  | "user.update"
  | "user.delete"
  | "payment.received"
  | "payment.refunded"
  | "document.created"
  | "document.shared"
  | "login.success"
  | "login.failed"
  | "data.export"
  | "data.import"

// Define the types of actions that can be taken for operations
export type ActionType =
  | "notification.email"
  | "notification.slack"
  | "notification.sms"
  | "webhook.trigger"
  | "log.activity"
  | "analytics.track"
  | "automation.workflow"
  | "notification.whatsapp"

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
}

// Default configurations for actions
export const defaultActionConfigs: Record<ActionType, Omit<ActionConfig, "enabled">> = {
  "notification.email": {
    type: "notification.email",
    name: "Email Notification",
    description: "Send an email notification",
    config: {
      template: "default",
      recipients: [],
      ccRecipients: [],
      subject: "",
      includeDetails: true,
    },
  },
  "notification.slack": {
    type: "notification.slack",
    name: "Slack Notification",
    description: "Send a notification to Slack",
    config: {
      channel: "general",
      message: "",
      mentionUsers: [],
      includeDetails: true,
    },
  },
  "notification.sms": {
    type: "notification.sms",
    name: "SMS Notification",
    description: "Send an SMS notification",
    config: {
      template: "default",
      recipients: [],
      includeDetails: false,
    },
  },
  "webhook.trigger": {
    type: "webhook.trigger",
    name: "Trigger Webhook",
    description: "Send data to an external webhook",
    config: {
      url: "",
      method: "POST",
      headers: {},
      includeFullPayload: true,
    },
  },
  "log.activity": {
    type: "log.activity",
    name: "Log Activity",
    description: "Record this activity in the system logs",
    config: {
      level: "info",
      includeDetails: true,
      retention: "90days",
    },
  },
  "analytics.track": {
    type: "analytics.track",
    name: "Track Analytics Event",
    description: "Record this event for analytics",
    config: {
      eventName: "",
      properties: {},
      includeUserData: true,
    },
  },
  "automation.workflow": {
    type: "automation.workflow",
    name: "Trigger Workflow",
    description: "Start an automated workflow",
    config: {
      workflowId: "",
      inputData: {},
      runAsynchronously: true,
    },
  },
  "notification.whatsapp": {
    type: "notification.whatsapp",
    name: "WhatsApp Notification",
    description: "Send a notification via WhatsApp",
    config: {
      "template": "default",              // Optional: template name for the message
      "recipients": [],                   // List of phone numbers (in international format)
      "message": "",                      // Message body (plain text or template variables)
      "includeDetails": false             // Whether to include detailed payload or metadata
    }
  },
}

// Default configurations for operations
export const defaultOperationConfigs: Record<OperationType, Omit<OperationConfig, "actions">> = {
  "user.create": {
    type: "user.create",
    name: "User Created",
    description: "When a new user is created in the system",
    enabled: true,
  },
  "user.update": {
    type: "user.update",
    name: "User Updated",
    description: "When a user profile is updated",
    enabled: true,
  },
  "user.delete": {
    type: "user.delete",
    name: "User Deleted",
    description: "When a user is deleted from the system",
    enabled: true,
  },
  "payment.received": {
    type: "payment.received",
    name: "Payment Received",
    description: "When a payment is successfully processed",
    enabled: true,
  },
  "payment.refunded": {
    type: "payment.refunded",
    name: "Payment Refunded",
    description: "When a payment is refunded",
    enabled: true,
  },
  "document.created": {
    type: "document.created",
    name: "Document Created",
    description: "When a new document is created",
    enabled: true,
  },
  "document.shared": {
    type: "document.shared",
    name: "Document Shared",
    description: "When a document is shared with others",
    enabled: true,
  },
  "login.success": {
    type: "login.success",
    name: "Successful Login",
    description: "When a user successfully logs in",
    enabled: true,
  },
  "login.failed": {
    type: "login.failed",
    name: "Failed Login Attempt",
    description: "When a login attempt fails",
    enabled: true,
  },
  "data.export": {
    type: "data.export",
    name: "Data Exported",
    description: "When data is exported from the system",
    enabled: true,
  },
  "data.import": {
    type: "data.import",
    name: "Data Imported",
    description: "When data is imported into the system",
    enabled: true,
  },
}

// Generate default operations with default actions
export function generateDefaultOperations(): OperationConfig[] {
  return Object.values(defaultOperationConfigs).map((operation) => {
    // Assign default actions based on operation type
    const defaultActions: ActionConfig[] = []

    // Common actions for all operations
    defaultActions.push({
      ...defaultActionConfigs["log.activity"],
      enabled: true,
    })

    // Operation-specific default actions
    switch (operation.type) {
      case "user.create":
      case "user.update":
      case "user.delete":
        defaultActions.push({
          ...defaultActionConfigs["notification.email"],
          enabled: operation.type === "user.create",
        })
        defaultActions.push({
          ...defaultActionConfigs["analytics.track"],
          enabled: true,
        })
        break

      case "payment.received":
      case "payment.refunded":
        defaultActions.push({
          ...defaultActionConfigs["notification.email"],
          enabled: true,
        })
        defaultActions.push({
          ...defaultActionConfigs["notification.slack"],
          enabled: true,
        })
        defaultActions.push({
          ...defaultActionConfigs["webhook.trigger"],
          enabled: false,
        })
        break

      case "document.created":
      case "document.shared":
        defaultActions.push({
          ...defaultActionConfigs["notification.email"],
          enabled: operation.type === "document.shared",
        })
        break

      case "login.failed":
        defaultActions.push({
          ...defaultActionConfigs["notification.email"],
          enabled: true,
        })
        defaultActions.push({
          ...defaultActionConfigs["notification.slack"],
          enabled: true,
        })
        break

      case "data.export":
      case "data.import":
        defaultActions.push({
          ...defaultActionConfigs["notification.email"],
          enabled: true,
        })
        defaultActions.push({
          ...defaultActionConfigs["webhook.trigger"],
          enabled: false,
        })
        break
    }

    return {
      ...operation,
      actions: defaultActions,
    }
  })
}

// Helper function to get action config by type
export function getActionConfigByType(type: ActionType): Omit<ActionConfig, "enabled"> {
  return defaultActionConfigs[type]
}

