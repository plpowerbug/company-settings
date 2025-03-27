import axios from "axios"
import type { ActionConfig } from "./operations-config"

// Base API URL
const API_URL = "/api"

// Get all operations
export async function fetchOperations() {
  const response = await axios.get(`${API_URL}/operations`)
  return response.data
}

// Toggle operation status
export async function toggleOperation(operationId: number, enabled: boolean) {
  const response = await axios.patch(`${API_URL}/operations/${operationId}`, {
    updateType: "toggle",
    enabled,
  })
  return response.data
}

// Update operation config
export async function updateOperationConfig(operationId: number, config: Record<string, any>) {
  const response = await axios.patch(`${API_URL}/operations/${operationId}`, {
    updateType: "config",
    config,
  })
  return response.data
}

// Toggle action status
export async function toggleAction(actionId: number, enabled: boolean) {
  const response = await axios.patch(`${API_URL}/actions/${actionId}`, {
    updateType: "toggle",
    enabled,
  })
  return response.data
}

// Update action config
export async function updateActionConfig(actionId: number, config: Record<string, any>) {
  const response = await axios.patch(`${API_URL}/actions/${actionId}`, {
    updateType: "config",
    config,
  })
  return response.data
}

// Add action to operation
export async function addAction(operationId: number, action: Omit<ActionConfig, "id">) {
  const response = await axios.post(`${API_URL}/actions`, {
    operationId,
    action,
  })
  return response.data
}

// Remove action
export async function removeAction(actionId: number) {
  const response = await axios.delete(`${API_URL}/actions/${actionId}`)
  return response.data
}

