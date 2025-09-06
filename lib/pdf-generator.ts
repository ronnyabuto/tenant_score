import jsPDF from "jspdf"

export interface CertificateData {
  tenantName: string
  tenantScoreId: string
  currentScore: number
  scoreCategory: string
  totalPayments: number
  onTimePayments: number
  totalRentPaid: number
  generatedDate: string
  validUntil: string
}

export function generateTenantScoreCertificate(data: CertificateData): jsPDF {
  const doc = new jsPDF()

  // Set up colors
  const primaryColor = [34, 197, 94] // Green-500
  const secondaryColor = [75, 85, 99] // Gray-600
  const accentColor = [16, 185, 129] // Emerald-500

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, "F")

  // Logo and title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("TenantScore", 20, 25)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("Official Tenant Credit Certificate", 20, 32)

  // Certificate body
  doc.setTextColor(...secondaryColor)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("TENANT CREDIT CERTIFICATE", 105, 60, { align: "center" })

  // Tenant information
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("This certifies that:", 20, 80)

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text(data.tenantName, 20, 95)

  doc.setFontSize(10)
  doc.setTextColor(...secondaryColor)
  doc.text(`TenantScore ID: ${data.tenantScoreId}`, 20, 105)

  // Score section
  doc.setFillColor(248, 250, 252) // Gray-50
  doc.rect(15, 120, 180, 60, "F")
  doc.setDrawColor(...primaryColor)
  doc.rect(15, 120, 180, 60, "S")

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("CURRENT TENANTSCORE", 25, 135)

  doc.setFontSize(36)
  doc.setFont("helvetica", "bold")
  doc.text(data.currentScore.toString(), 25, 155)

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(data.scoreCategory, 25, 165)

  // Payment statistics
  doc.setFontSize(10)
  doc.setTextColor(...secondaryColor)
  doc.text("Payment Statistics:", 110, 135)
  doc.text(`Total Payments: ${data.totalPayments}`, 110, 145)
  doc.text(`On-time Payments: ${data.onTimePayments}`, 110, 155)
  doc.text(`Payment Rate: ${Math.round((data.onTimePayments / data.totalPayments) * 100)}%`, 110, 165)
  doc.text(`Total Rent Paid: KES ${data.totalRentPaid.toLocaleString()}`, 110, 175)

  // Verification section
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("VERIFICATION", 20, 200)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(...secondaryColor)
  doc.text("This certificate is issued based on verified payment records and tenant history.", 20, 210)
  doc.text("The information contained herein is accurate as of the generation date below.", 20, 220)

  // Footer
  doc.setFillColor(...primaryColor)
  doc.rect(0, 250, 210, 47, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text(`Generated: ${data.generatedDate}`, 20, 265)
  doc.text(`Valid Until: ${data.validUntil}`, 20, 275)
  doc.text("TenantScore Kenya - Building Trust in Rental Markets", 20, 285)

  // QR code placeholder (you can add actual QR code generation later)
  doc.setDrawColor(255, 255, 255)
  doc.rect(160, 255, 30, 30, "S")
  doc.setFontSize(8)
  doc.text("QR Code", 170, 272, { align: "center" })
  doc.text("Verification", 170, 280, { align: "center" })

  return doc
}

export function downloadCertificatePDF(data: CertificateData): void {
  const doc = generateTenantScoreCertificate(data)
  doc.save(`tenantscore-certificate-${data.tenantScoreId}.pdf`)
}
