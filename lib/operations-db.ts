import prisma from "./prisma"
import {
  type OperationType,
  type OperationConfig,
  type ActionConfig,
  defaultOperationConfigs,
  defaultActionConfigs,
  channelConfigTemplates,
} from "./operations-config"

// Get all operations for a company
export async function getCompanyOperations(companyId: number) {
  const operations = await prisma.operation.findMany({
    where: { companyId },
    include: { actions: true },
    orderBy: { id: "asc" }
  })

  return operations.map((operation) => ({
    ...operation,
    config: operation.config as Record<string, any>,
    actions: operation.actions.map((action) => ({
      ...action,
      config: action.config as Record<string, any>,
    })),
  }))
}

// Initialize default operations for a company
export async function initializeCompanyOperations(companyId: number) {
  // Generate default operations
  const defaultOperations = Object.values(defaultOperationConfigs).map((operation) => {
    // Get default actions for this operation type
    const defaultActions = getDefaultActionsForOperation(operation.type as OperationType)

    return {
      type: operation.type,
      name: operation.name,
      description: operation.description,
      enabled: operation.enabled,
      config: channelConfigTemplates[operation.type as OperationType],
      companyId,
      actions: {
        create: defaultActions.map((action) => ({
          type: action.type,
          name: action.name,
          description: action.description,
          enabled: action.enabled,
          config: action.config,
        })),
      },
    }
  })

  // Create operations with nested actions in a transaction
  await prisma.$transaction(
    defaultOperations.map((operation) =>
      prisma.operation.create({
        data: operation,
        include: { actions: true },
      }),
    ),
  )

  return await getCompanyOperations(companyId)
}

// Helper function to get default actions for an operation type
function getDefaultActionsForOperation(operationType: OperationType): ActionConfig[] {
  const defaultActions: ActionConfig[] = []

  // Common actions for all operations
  defaultActions.push({
    ...defaultActionConfigs["user.created"],
    enabled: operationType === "notification.email",
  })

  defaultActions.push({
    ...defaultActionConfigs["user.updated"],
    enabled: operationType === "notification.email",
  })

  defaultActions.push({
    ...defaultActionConfigs["user.deleted"],
    enabled: operationType === "notification.email",
  })

  // Add payment actions to email and SMS
  if (operationType === "notification.email" || operationType === "notification.sms") {
    defaultActions.push({
      ...defaultActionConfigs["payment.received"],
      enabled: true,
    })

    defaultActions.push({
      ...defaultActionConfigs["payment.refunded"],
      enabled: true,
    })
  }

  // Add security alerts to all notification channels
  if (operationType.startsWith("notification.")) {
    defaultActions.push({
      ...defaultActionConfigs["login.failed"],
      enabled: operationType === "notification.email",
    })
  }

  // Add document sharing to email and WhatsApp
  if (operationType === "notification.email" || operationType === "notification.whatsapp") {
    defaultActions.push({
      ...defaultActionConfigs["document.shared"],
      enabled: operationType === "notification.email",
    })
  }

  // Add all events to logging
  if (operationType === "log.activity") {
    defaultActions.push({
      ...defaultActionConfigs["user.created"],
      enabled: true,
    })
    defaultActions.push({
      ...defaultActionConfigs["user.updated"],
      enabled: true,
    })
    defaultActions.push({
      ...defaultActionConfigs["user.deleted"],
      enabled: true,
    })
    defaultActions.push({
      ...defaultActionConfigs["payment.received"],
      enabled: true,
    })
    defaultActions.push({
      ...defaultActionConfigs["payment.refunded"],
      enabled: true,
    })
    defaultActions.push({
      ...defaultActionConfigs["login.success"],
      enabled: true,
    })
    defaultActions.push({
      ...defaultActionConfigs["login.failed"],
      enabled: true,
    })
  }

  // Add custom event to all operations
  defaultActions.push({
    ...defaultActionConfigs["custom.event"],
    enabled: false,
  })

  return defaultActions
}

// Update an operation
export async function updateOperation(operationId: number, data: Partial<OperationConfig>) {
  const { actions, ...operationData } = data

  return await prisma.operation.update({
    where: { id: operationId },
    data: operationData,
    include: { actions: true },
  })
}

// Toggle operation enabled status
export async function toggleOperationStatus(operationId: number, enabled: boolean) {
  return await prisma.operation.update({
    where: { id: operationId },
    data: { enabled },
    include: { actions: true },
  })
}

// Update operation config
export async function updateOperationConfig(operationId: number, config: Record<string, any>) {
  return await prisma.operation.update({
    where: { id: operationId },
    data: { config },
    include: { actions: true },
  })
}

// Toggle action enabled status
export async function toggleActionStatus(actionId: number, enabled: boolean) {
  return await prisma.action.update({
    where: { id: actionId },
    data: { enabled },
  })
}

// Update action config
export async function updateActionConfig(actionId: number, config: Record<string, any>) {
  return await prisma.action.update({
    where: { id: actionId },
    data: { config },
  })
}

// Add a new action to an operation
export async function addActionToOperation(operationId: number, actionData: Omit<ActionConfig, "id">) {
  return await prisma.action.create({
    data: {
      type: actionData.type,
      name: actionData.name,
      description: actionData.description,
      enabled: actionData.enabled,
      config: actionData.config,
      operationId,
    },
  })
}

// Remove an action from an operation
export async function removeAction(actionId: number) {
  return await prisma.action.delete({
    where: { id: actionId },
  })
}

