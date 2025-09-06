// SMS and USSD interface utilities for TenantScore
export interface USSDSession {
  sessionId: string
  phoneNumber: string
  currentMenu: string
  userData?: any
  step: number
}

export interface SMSCommand {
  command: string
  phoneNumber: string
  message: string
}

export class USSDMenuHandler {
  private sessions: Map<string, USSDSession> = new Map()

  async handleUSSDRequest(phoneNumber: string, text: string, sessionId: string): Promise<string> {
    let session = this.sessions.get(sessionId)

    if (!session) {
      // New session - show main menu
      session = {
        sessionId,
        phoneNumber,
        currentMenu: "main",
        step: 0,
      }
      this.sessions.set(sessionId, session)
      return this.getMainMenu()
    }

    // Handle user input based on current menu
    return this.processMenuInput(session, text)
  }

  private getMainMenu(): string {
    return `CON Welcome to TenantScore
1. Check My Score
2. Payment History
3. Landlord Lookup
4. Register Account
5. Help & Support
0. Exit`
  }

  private async processMenuInput(session: USSDSession, input: string): Promise<string> {
    const choice = input.trim()

    switch (session.currentMenu) {
      case "main":
        return this.handleMainMenuChoice(session, choice)
      case "check_score":
        return this.handleCheckScore(session, choice)
      case "payment_history":
        return this.handlePaymentHistory(session, choice)
      case "landlord_lookup":
        return this.handleLandlordLookup(session, choice)
      case "register":
        return this.handleRegistration(session, choice)
      default:
        return "END Invalid session. Please try again."
    }
  }

  private async handleMainMenuChoice(session: USSDSession, choice: string): Promise<string> {
    switch (choice) {
      case "1":
        session.currentMenu = "check_score"
        session.step = 1
        return `CON Enter your TenantScore ID or National ID:`

      case "2":
        session.currentMenu = "payment_history"
        session.step = 1
        return `CON Enter your TenantScore ID:`

      case "3":
        session.currentMenu = "landlord_lookup"
        session.step = 1
        return `CON Landlord Tenant Lookup
Enter tenant's TenantScore ID or phone number:`

      case "4":
        session.currentMenu = "register"
        session.step = 1
        return `CON Account Registration
Enter your full name:`

      case "5":
        return `END TenantScore Help:
- Dial *384*7826# for menu
- SMS SCORE to 40404
- Call 0700123456 for support
- Visit tenantscore.co.ke`

      case "0":
        this.sessions.delete(session.sessionId)
        return "END Thank you for using TenantScore!"

      default:
        return `CON Invalid choice. Please try again.
${this.getMainMenu()}`
    }
  }

  private async handleCheckScore(session: USSDSession, input: string): Promise<string> {
    if (session.step === 1) {
      const identifier = input.trim()

      if (!identifier) {
        return "END Please provide a valid ID."
      }

      // Mock score lookup - replace with actual API call
      const scoreData = await this.lookupTenantScore(identifier)

      if (!scoreData) {
        return "END Tenant not found. Please check your ID and try again."
      }

      this.sessions.delete(session.sessionId)
      return `END TenantScore Report
Name: ${scoreData.name}
Score: ${scoreData.score}/1000
Rating: ${scoreData.rating}
Last Updated: ${scoreData.lastUpdated}

For detailed report, visit tenantscore.co.ke`
    }

    return "END Invalid input."
  }

  private async handlePaymentHistory(session: USSDSession, input: string): Promise<string> {
    if (session.step === 1) {
      const tenantId = input.trim()

      // Mock payment history lookup
      const payments = await this.getPaymentHistory(tenantId)

      if (!payments || payments.length === 0) {
        return "END No payment history found."
      }

      const recentPayments = payments.slice(0, 3)
      let response = "END Recent Payments:\n"

      recentPayments.forEach((payment, index) => {
        response += `${index + 1}. KES ${payment.amount.toLocaleString()}\n`
        response += `   ${payment.date} ${payment.status}\n`
      })

      response += "\nFor full history, visit tenantscore.co.ke"

      this.sessions.delete(session.sessionId)
      return response
    }

    return "END Invalid input."
  }

  private async handleLandlordLookup(session: USSDSession, input: string): Promise<string> {
    if (session.step === 1) {
      const identifier = input.trim()

      // Mock tenant lookup for landlords
      const tenantData = await this.lookupTenantForLandlord(identifier)

      if (!tenantData) {
        return "END Tenant not found or not verified."
      }

      this.sessions.delete(session.sessionId)
      return `END Tenant Verification
Name: ${tenantData.name}
Score: ${tenantData.score}/1000
Rating: ${tenantData.rating}
Verified: ${tenantData.isVerified ? "Yes" : "No"}
Payment Rate: ${tenantData.paymentRate}%

This lookup has been logged.`
    }

    return "END Invalid input."
  }

  private async handleRegistration(session: USSDSession, input: string): Promise<string> {
    switch (session.step) {
      case 1:
        session.userData = { fullName: input.trim() }
        session.step = 2
        return "CON Enter your National ID number:"

      case 2:
        session.userData.nationalId = input.trim()
        session.step = 3
        return `CON Select account type:
1. Tenant
2. Landlord`

      case 3:
        const userType = input === "1" ? "tenant" : input === "2" ? "landlord" : null
        if (!userType) {
          return "CON Invalid choice. Select:1. Tenant2. Landlord"
        }

        session.userData.userType = userType

        // Mock registration process
        const registrationResult = await this.registerUser(session.userData, session.phoneNumber)

        this.sessions.delete(session.sessionId)

        if (registrationResult.success) {
          return `END Registration Successful!
Your TenantScore ID: ${registrationResult.tenantScoreId}

Complete verification at tenantscore.co.ke or visit our office.

Welcome to TenantScore!`
        } else {
          return `END Registration failed: ${registrationResult.error}
Please try again or visit our office.`
        }

      default:
        return "END Registration error. Please try again."
    }
  }

  // Mock API methods - replace with actual implementations
  private async lookupTenantScore(identifier: string) {
    return {
      name: "John D.",
      score: 750,
      rating: "Good",
      lastUpdated: "Dec 2024",
    }
  }

  private async getPaymentHistory(tenantId: string) {
    return [
      { amount: 45000, date: "Nov 2024", status: "On Time" },
      { amount: 45000, date: "Oct 2024", status: "2 days late" },
      { amount: 45000, date: "Sep 2024", status: "On Time" },
    ]
  }

  private async lookupTenantForLandlord(identifier: string) {
    return {
      name: "John D.",
      score: 750,
      rating: "Good",
      isVerified: true,
      paymentRate: 85,
    }
  }

  private async registerUser(userData: any, phoneNumber: string) {
    return {
      success: true,
      tenantScoreId: "TS" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    }
  }
}

export class SMSCommandHandler {
  async handleSMSCommand(phoneNumber: string, message: string): Promise<string> {
    const command = message.trim().toUpperCase()
    const parts = command.split(" ")
    const action = parts[0]

    switch (action) {
      case "SCORE":
        return this.handleScoreCommand(phoneNumber, parts)
      case "BALANCE":
        return this.handleBalanceCommand(phoneNumber, parts)
      case "HISTORY":
        return this.handleHistoryCommand(phoneNumber, parts)
      case "REGISTER":
        return this.handleRegisterCommand(phoneNumber, parts)
      case "HELP":
        return this.getHelpMessage()
      default:
        return this.getHelpMessage()
    }
  }

  private async handleScoreCommand(phoneNumber: string, parts: string[]): Promise<string> {
    if (parts.length < 2) {
      return `To check score, SMS: SCORE [TenantScore ID]
Example: SCORE TS12345678`
    }

    const tenantId = parts[1]
    // Mock score lookup
    const scoreData = await this.lookupScore(tenantId)

    if (!scoreData) {
      return "Tenant not found. Check your TenantScore ID and try again."
    }

    return `TenantScore Report
Name: ${scoreData.name}
Score: ${scoreData.score}/1000 (${scoreData.rating})
Last Payment: ${scoreData.lastPayment}
For details: tenantscore.co.ke`
  }

  private async handleBalanceCommand(phoneNumber: string, parts: string[]): Promise<string> {
    // Mock balance check for current user
    return `Account Balance:
Current Score: 750/1000
Payments This Year: 10
On-time Rate: 90%
Next Review: Jan 2025`
  }

  private async handleHistoryCommand(phoneNumber: string, parts: string[]): Promise<string> {
    return `Recent Payments:
Nov 2024: KES 45,000 (On Time)
Oct 2024: KES 45,000 (2 days late)
Sep 2024: KES 45,000 (On Time)
For full history: tenantscore.co.ke`
  }

  private async handleRegisterCommand(phoneNumber: string, parts: string[]): Promise<string> {
    return `To register for TenantScore:
1. Dial *384*7826# and select option 4
2. Visit tenantscore.co.ke
3. Call 0700123456

Registration requires National ID verification.`
  }

  private getHelpMessage(): string {
    return `TenantScore SMS Commands:
SCORE [ID] - Check tenant score
BALANCE - Your account summary
HISTORY - Recent payments
REGISTER - Registration info
HELP - This message

Dial *384*7826# for full menu`
  }

  private async lookupScore(tenantId: string) {
    // Mock implementation
    return {
      name: "John D.",
      score: 750,
      rating: "Good",
      lastPayment: "Nov 2024",
    }
  }
}

// SMS notification service
export class SMSNotificationService {
  async sendScoreUpdate(phoneNumber: string, oldScore: number, newScore: number): Promise<void> {
    const message = `TenantScore Update: Your score changed from ${oldScore} to ${newScore}. ${
      newScore > oldScore ? "Great job!" : "Keep up good payment habits."
    } Check details at tenantscore.co.ke`

    await this.sendSMS(phoneNumber, message)
  }

  async sendPaymentConfirmation(phoneNumber: string, amount: number, landlord: string): Promise<void> {
    const message = `Payment Confirmed: KES ${amount.toLocaleString()} received from ${landlord}. Your TenantScore will be updated within 24 hours.`

    await this.sendSMS(phoneNumber, message)
  }

  async sendVerificationComplete(phoneNumber: string, tenantScoreId: string): Promise<void> {
    const message = `TenantScore Verification Complete! Your TenantScore ID: ${tenantScoreId}. Start building your rental reputation today.`

    await this.sendSMS(phoneNumber, message)
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<void> {
    // In production, integrate with SMS provider (Africa's Talking, Twilio, etc.)
    console.log(`SMS to ${phoneNumber}: ${message}`)

    // Mock SMS sending delay
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}
