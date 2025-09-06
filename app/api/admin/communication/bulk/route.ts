import { type NextRequest, NextResponse } from "next/server"
import { createBulkCampaign, getBulkCampaigns, type BulkCampaign } from "@/lib/services/communication-service"

export async function POST(request: NextRequest) {
  try {
    const campaignData = await request.json()
    
    // Validate required fields
    if (!campaignData.name || !campaignData.templateId) {
      return NextResponse.json({
        success: false,
        message: "Campaign name and template are required"
      }, { status: 400 })
    }
    
    // Create and execute campaign
    const campaign = await createBulkCampaign({
      ...campaignData,
      createdBy: "admin" // In real app, get from auth context
    })
    
    return NextResponse.json({
      success: true,
      data: campaign,
      message: `Campaign "${campaign.name}" ${campaign.status === "completed" ? "completed" : "created"}`
    })
  } catch (error) {
    console.error("Bulk campaign error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to create campaign"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as BulkCampaign['status'] | null
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined
    
    const campaigns = await getBulkCampaigns(status || undefined, limit)
    
    return NextResponse.json({
      success: true,
      data: campaigns,
      total: campaigns.length
    })
  } catch (error) {
    console.error("Get campaigns error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to get campaigns"
    }, { status: 500 })
  }
}