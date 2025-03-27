// app/api/users/[id]/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId }
    })
    
    if (!userSettings) {
      return NextResponse.json(
        { error: 'User settings not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(userSettings)
  } catch (error) {
    console.error('Failed to fetch user settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const data = await request.json()
    
    const userSettings = await prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data
      }
    })
    
    return NextResponse.json(userSettings)
  } catch (error) {
    console.error('Failed to update user settings:', error)
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    )
  }
}