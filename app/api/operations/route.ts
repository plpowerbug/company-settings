import { NextResponse } from "next/server"
import { getCompanyOperations, initializeCompanyOperations } from "@/lib/operations-db"

// Default company ID for demo purposes
// In a real app, this would come from authentication
const DEFAULT_COMPANY_ID = 1

export async function GET() {
  try {
    // Get operations for the company
    let operations = await getCompanyOperations(DEFAULT_COMPANY_ID)

    // If no operations exist, initialize with defaults
    if (operations.length === 0) {
      operations = await initializeCompanyOperations(DEFAULT_COMPANY_ID)
    }

    return NextResponse.json(operations)
  } catch (error) {
    console.error("Failed to fetch operations:", error)
    return NextResponse.json({ error: "Failed to fetch operations" }, { status: 500 })
  }
}
