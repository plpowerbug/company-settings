"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CompanySettingsPage() {
  // This is a preview component to show the UI without actual functionality
  const defaultLogo = "/achieva.png"; // Ensure this file exists in the "public" folder
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultLogo);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
            <p className="text-muted-foreground">Manage your company profile and configuration settings</p>
          </div>

          {/* Company Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>Update your company information and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex flex-col items-start gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                    <Image
                      src={logoPreview}
                      alt="Company logo"
                      width={96} // 24 * 4 (Tailwind units)
                      height={96}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      id="logo-upload"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="logo-upload">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a square logo in PNG or JPG format, ideally 512x512px.
                </p>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" placeholder="Acme Inc." defaultValue="Achieva AI" />
                <p className="text-sm text-muted-foreground">This is your company's official name.</p>
              </div>

              {/* Company Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your company..."
                  className="resize-none"
                  defaultValue="Leading provider of innovative solutions"
                />
                <p className="text-sm text-muted-foreground">A brief description of your company and what you do.</p>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Settings</CardTitle>
              <CardDescription>Customize how your company account works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications about account activity.</p>
                </div>
                <Switch />
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin users.</p>
                </div>
                <Switch />
              </div>

              {/* Data Sharing */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Allow sharing anonymized data with partners.</p>
                </div>
                <Switch />
              </div>

              {/* Usage Analytics */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">Collect anonymous usage data to improve our service.</p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Automatic Backups */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Enable daily automatic backups of your data.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

