import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "../../utils/test-utils"
import { LoginForm } from "@/components/auth/login-form"

// Mock the auth service
vi.mock("@/lib/auth/auth-service", () => ({
  authService: {
    login: vi.fn(),
  },
}))

describe("LoginForm", () => {
  it("should render login form fields", () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/national id/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("should show validation errors for empty fields", async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/national id is required/i)).toBeInTheDocument()
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
    })
  })

  it("should call login service on form submission", async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true, user: {} })
    vi.mocked(require("@/lib/auth/auth-service").authService.login).mockImplementation(mockLogin)

    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/national id/i), {
      target: { value: "12345678" },
    })
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "+254712345678" },
    })

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("12345678", "+254712345678")
    })
  })
})
