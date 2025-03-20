import { type NextRequest, NextResponse } from "next/server"
import { getCompanySettings, updateCompanySettings } from "@/lib/settings-actions"

// GET handler to fetch company settings
export async function GET() {
  try {
    const settings = await getCompanySettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("API error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch company settings" }, { status: 500 })
  }
}

// POST handler to update company settings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // In a real app, you would validate the request body here
    const result = await updateCompanySettings(data)
  // Print the POST data
  console.log("Received POST data:", data);
    return NextResponse.json(result)
  } catch (error) {
    console.error("API error updating settings:", error)
    return NextResponse.json({ error: "Failed to update company settings" }, { status: 500 })
  }
}

