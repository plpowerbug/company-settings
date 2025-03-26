"use client"

import { useState } from "react"
import * as z from "zod"
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, Settings } from "lucide-react"

import {
  type ActionType,
  type OperationConfig,
  type ActionConfig,
  getActionConfigByType,
  defaultActionConfigs,
} from "@/lib/operations-config"
import { updateOperationConfig, addActionToOperation, removeActionFromOperation } from "@/lib/settings-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Schema for operation configuration
const operationSchema = z.object({
  type: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  enabled: z.boolean(),
})

// Schema for action configuration
const actionSchema = z.object({
  type: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  enabled: z.boolean(),
  config: z.record(z.any()),
})

interface OperationsSettingsProps {
  operations: OperationConfig[]
  onUpdate: () => void
}

export function OperationsSettings({ operations, onUpdate }: OperationsSettingsProps) {
  const { toast } = useToast()
  const [expandedOperation, setExpandedOperation] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [addActionDialogOpen, setAddActionDialogOpen] = useState(false)
  const [selectedOperationIndex, setSelectedOperationIndex] = useState<number | null>(null)
  const [selectedActionType, setSelectedActionType] = useState<ActionType | null>(null)

  // Toggle operation expansion
  const toggleOperation = (index: number) => {
    setExpandedOperation(expandedOperation === index ? null : index)
  }

  // Handle operation toggle
  const handleOperationToggle = async (index: number, enabled: boolean) => {
    try {
      setIsLoading(true)
      const updatedOperation = { ...operations[index], enabled }
      await updateOperationConfig(index, updatedOperation)
      onUpdate()
      toast({
        title: "Operation updated",
        description: `${updatedOperation.name} has been ${enabled ? "enabled" : "disabled"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update operation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle action toggle
  const handleActionToggle = async (operationIndex: number, actionIndex: number, enabled: boolean) => {
    try {
      setIsLoading(true)
      const operation = { ...operations[operationIndex] }
      operation.actions[actionIndex].enabled = enabled
      await updateOperationConfig(operationIndex, operation)
      onUpdate()
      toast({
        title: "Action updated",
        description: `${operation.actions[actionIndex].name} has been ${enabled ? "enabled" : "disabled"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update action",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle action removal
  const handleRemoveAction = async (operationIndex: number, actionIndex: number) => {
    try {
      setIsLoading(true)
      await removeActionFromOperation(operationIndex, actionIndex)
      onUpdate()
      toast({
        title: "Action removed",
        description: "The action has been removed from this operation.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove action",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Open add action dialog
  const openAddActionDialog = (operationIndex: number) => {
    setSelectedOperationIndex(operationIndex)
    setSelectedActionType(null)
    setAddActionDialogOpen(true)
  }

  // Handle adding a new action
  const handleAddAction = async () => {
    if (selectedOperationIndex === null || !selectedActionType) return

    try {
      setIsLoading(true)
      const actionConfig = getActionConfigByType(selectedActionType)
      const newAction: ActionConfig = {
        ...actionConfig,
        enabled: true,
      }

      await addActionToOperation(selectedOperationIndex, newAction)
      onUpdate()
      setAddActionDialogOpen(false)
      toast({
        title: "Action added",
        description: `${newAction.name} has been added to the operation.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add action",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Render action configuration form based on action type
  const renderActionConfigForm = (action: ActionConfig, operationIndex: number, actionIndex: number) => {
    const updateActionConfig = async (key: string, value: any) => {
      try {
        const operation = { ...operations[operationIndex] }
        operation.actions[actionIndex].config[key] = value
        await updateOperationConfig(operationIndex, operation)
        onUpdate()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update action configuration",
          variant: "destructive",
        })
      }
    }

    switch (action.type) {
      case "notification.email":
        return (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Template</label>
                <Select
                  defaultValue={action.config.template || "default"}
                  onValueChange={(value) => updateActionConfig("template", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="branded">Branded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Subject</label>
                <Input
                  placeholder="Email subject"
                  defaultValue={action.config.subject || ""}
                  onChange={(e) => updateActionConfig("subject", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipients (comma separated)</label>
              <Input
                placeholder="email@example.com, another@example.com"
                defaultValue={Array.isArray(action.config.recipients) ? action.config.recipients.join(", ") : ""}
                onChange={(e) =>
                  updateActionConfig(
                    "recipients",
                    e.target.value.split(",").map((email) => email.trim()),
                  )
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`include-details-${operationIndex}-${actionIndex}`}
                checked={action.config.includeDetails}
                onCheckedChange={(checked) => updateActionConfig("includeDetails", checked)}
              />
              <label
                htmlFor={`include-details-${operationIndex}-${actionIndex}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include operation details in email
              </label>
            </div>
          </div>
        )

      case "notification.slack":
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Slack Channel</label>
              <Input
                placeholder="#general"
                defaultValue={action.config.channel || ""}
                onChange={(e) => updateActionConfig("channel", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Message to send to Slack"
                defaultValue={action.config.message || ""}
                onChange={(e) => updateActionConfig("message", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mention Users (comma separated)</label>
              <Input
                placeholder="@user1, @user2"
                defaultValue={Array.isArray(action.config.mentionUsers) ? action.config.mentionUsers.join(", ") : ""}
                onChange={(e) =>
                  updateActionConfig(
                    "mentionUsers",
                    e.target.value.split(",").map((user) => user.trim()),
                  )
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`include-details-${operationIndex}-${actionIndex}`}
                checked={action.config.includeDetails}
                onCheckedChange={(checked) => updateActionConfig("includeDetails", checked)}
              />
              <label
                htmlFor={`include-details-${operationIndex}-${actionIndex}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include operation details in message
              </label>
            </div>
          </div>
        )

      case "webhook.trigger":
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook URL</label>
              <Input
                placeholder="https://example.com/webhook"
                defaultValue={action.config.url || ""}
                onChange={(e) => updateActionConfig("url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">HTTP Method</label>
              <Select
                defaultValue={action.config.method || "POST"}
                onValueChange={(value) => updateActionConfig("method", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`include-payload-${operationIndex}-${actionIndex}`}
                checked={action.config.includeFullPayload}
                onCheckedChange={(checked) => updateActionConfig("includeFullPayload", checked)}
              />
              <label
                htmlFor={`include-payload-${operationIndex}-${actionIndex}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include full operation payload
              </label>
            </div>
          </div>
        )

      case "log.activity":
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Log Level</label>
              <Select
                defaultValue={action.config.level || "info"}
                onValueChange={(value) => updateActionConfig("level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Retention Period</label>
              <Select
                defaultValue={action.config.retention || "90days"}
                onValueChange={(value) => updateActionConfig("retention", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select retention period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`include-details-${operationIndex}-${actionIndex}`}
                checked={action.config.includeDetails}
                onCheckedChange={(checked) => updateActionConfig("includeDetails", checked)}
              />
              <label
                htmlFor={`include-details-${operationIndex}-${actionIndex}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include detailed information in logs
              </label>
            </div>
          </div>
        )

      case "analytics.track":
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Name</label>
              <Input
                placeholder="event_name"
                defaultValue={action.config.eventName || ""}
                onChange={(e) => updateActionConfig("eventName", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`include-user-data-${operationIndex}-${actionIndex}`}
                checked={action.config.includeUserData}
                onCheckedChange={(checked) => updateActionConfig("includeUserData", checked)}
              />
              <label
                htmlFor={`include-user-data-${operationIndex}-${actionIndex}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include user data in analytics event
              </label>
            </div>
          </div>
        )

      case "automation.workflow":
        return (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workflow ID</label>
              <Input
                placeholder="workflow_123"
                defaultValue={action.config.workflowId || ""}
                onChange={(e) => updateActionConfig("workflowId", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`run-async-${operationIndex}-${actionIndex}`}
                checked={action.config.runAsynchronously}
                onCheckedChange={(checked) => updateActionConfig("runAsynchronously", checked)}
              />
              <label
                htmlFor={`run-async-${operationIndex}-${actionIndex}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Run workflow asynchronously
              </label>
            </div>
          </div>
        )
        case "notification.whatsapp":
          return (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Template</label>
                <Select
                  defaultValue={action.config.template || "default"}
                  onValueChange={(value) => updateActionConfig("template", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="branded">Branded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients (comma separated)</label>
                <Input
                  placeholder="+1234567890, +0987654321"
                  defaultValue={Array.isArray(action.config.recipients) ? action.config.recipients.join(", ") : ""}
                  onChange={(e) =>
                    updateActionConfig(
                      "recipients",
                      e.target.value.split(",").map((phone) => phone.trim()),
                    )
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`include-details-${operationIndex}-${actionIndex}`}
                  checked={action.config.includeDetails}
                  onCheckedChange={(checked) => updateActionConfig("includeDetails", checked)}
                />
                <label
                  htmlFor={`include-details-${operationIndex}-${actionIndex}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include operation details in message
                </label>
              </div>
            </div>
          )
      default:
        return (
          <div className="p-4 border rounded-md bg-muted mt-4">
            <p className="text-sm text-muted-foreground">
              No additional configuration options available for this action type.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Operation Settings</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Manage Operations
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure how your system responds to different operations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className="text-muted-foreground">
        Customize what happens when specific operations occur in your system. Enable or disable operations and configure
        actions for each.
      </p>

      <div className="space-y-4">
        {operations.map((operation, operationIndex) => (
          <Card key={operationIndex} className={expandedOperation === operationIndex ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-xl">{operation.name}</CardTitle>
                  {operation.enabled ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-500 hover:bg-gray-50 border-gray-200">
                      Disabled
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={operation.enabled}
                    onCheckedChange={(checked) => handleOperationToggle(operationIndex, checked)}
                    disabled={isLoading}
                  />
                  <Button variant="ghost" size="sm" onClick={() => toggleOperation(operationIndex)}>
                    {expandedOperation === operationIndex ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
              <CardDescription>{operation.description}</CardDescription>
            </CardHeader>

            {expandedOperation === operationIndex && (
              <>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Actions</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure what happens when this operation occurs.
                      </p>

                      {operation.actions.length > 0 ? (
                        <div className="space-y-4">
                          {operation.actions.map((action, actionIndex) => (
                            <div key={actionIndex} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">{action.name}</h4>
                                  <p className="text-sm text-muted-foreground">{action.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={action.enabled}
                                    onCheckedChange={(checked) =>
                                      handleActionToggle(operationIndex, actionIndex, checked)
                                    }
                                    disabled={isLoading}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveAction(operationIndex, actionIndex)}
                                    disabled={isLoading}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>

                              {action.enabled && renderActionConfigForm(action, operationIndex, actionIndex)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border rounded-md p-6 flex flex-col items-center justify-center text-center">
                          <p className="text-muted-foreground mb-4">No actions configured for this operation.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => openAddActionDialog(operationIndex)} disabled={isLoading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Add Action Dialog */}
      <Dialog open={addActionDialogOpen} onOpenChange={setAddActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Action</DialogTitle>
            <DialogDescription>Select an action to perform when this operation occurs.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select onValueChange={(value) => setSelectedActionType(value as ActionType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notification.email">Email Notification</SelectItem>
                  <SelectItem value="notification.slack">Slack Notification</SelectItem>
                  <SelectItem value="notification.sms">SMS Notification</SelectItem>
                  <SelectItem value="notification.whatsapp">WhatsApp Notification</SelectItem>
                  <SelectItem value="webhook.trigger">Trigger Webhook</SelectItem>
                  <SelectItem value="log.activity">Log Activity</SelectItem>
                  <SelectItem value="analytics.track">Track Analytics Event</SelectItem>
                  <SelectItem value="automation.workflow">Trigger Workflow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedActionType && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium">{defaultActionConfigs[selectedActionType].name}</h4>
                <p className="text-sm text-muted-foreground">{defaultActionConfigs[selectedActionType].description}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAction} disabled={!selectedActionType || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

