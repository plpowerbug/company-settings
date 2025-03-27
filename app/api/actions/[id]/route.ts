import { type NextRequest, NextResponse } from "next/server"
import { toggleActionStatus, updateActionConfig, removeAction } from "@/lib/operations-db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actionId = Number.parseInt(params.id)
    const data = await request.json()

    // Handle different update types
    if (data.updateType === "toggle") {
      const action = await toggleActionStatus(actionId, data.enabled)
      return NextResponse.json(action)
    } else if (data.updateType === "config") {
      const action = await updateActionConfig(actionId, data.config)
      return NextResponse.json(action)
    }

    return NextResponse.json({ error: "Invalid update type" }, { status: 400 })
  } catch (error) {
    console.error("Failed to update action:", error)
    return NextResponse.json({ error: "Failed to update action" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const actionId = Number.parseInt(params.id)

    await removeAction(actionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete action:", error)
    return NextResponse.json({ error: "Failed to delete action" }, { status: 500 })
  }
}
