import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to the settings page
  redirect("/settings")
}


