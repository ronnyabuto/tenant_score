import { type NextRequest, NextResponse } from "next/server"
import { getCommunicationTemplates, createCommunicationTemplate, type CommunicationTemplate } from "@/lib/services/communication-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as CommunicationTemplate['type'] | null
    
    const templates = await getCommunicationTemplates(type || undefined)
    
    return NextResponse.json({
      success: true,
      data: templates,
      total: templates.length
    })
  } catch (error) {
    console.error("Get templates error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get templates"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json()
    
    // Validate required fields
    if (!templateData.name || !templateData.message || !templateData.type) {
      return NextResponse.json({
        success: false,
        message: "Name, message, and type are required"
      }, { status: 400 })
    }
    
    // Extract variables from message ({{variable}} format)
    const variables = (templateData.message.match(/\{\{(\w+)\}\}/g) || [])
      .map((match: string) => match.replace(/[{}]/g, ''))
    
    const newTemplate = await createCommunicationTemplate({
      ...templateData,
      variables,
      isActive: true
    })
    
    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: "Template created successfully"
    })
  } catch (error) {
    console.error("Create template error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to create template"
    }, { status: 500 })
  }
}