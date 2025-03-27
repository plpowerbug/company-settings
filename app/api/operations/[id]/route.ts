import { type NextRequest, NextResponse } from "next/server"
import { updateOperation, toggleOperationStatus, updateOperationConfig } from "@/lib/operations-db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const operationId = Number.parseInt(params.id)
    const data = await request.json()

    // Handle different update types
    if (data.updateType === "toggle") {
      const operation = await toggleOperationStatus(operationId, data.enabled)
      return NextResponse.json(operation)
    } else if (data.updateType === "config") {
      const operation = await updateOperationConfig(operationId, data.config)
      return NextResponse.json(operation)
    } else {
      const operation = await updateOperation(operationId, data)
      return NextResponse.json(operation)
    }
  } catch (error) {
    console.error("Failed to update operation:", error)
    return NextResponse.json({ error: "Failed to update operation" }, { status: 500 })
  }
}