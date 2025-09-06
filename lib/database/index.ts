// Database layer exports
export { db, createDatabaseConnection } from "./connection"
import { UserRepository } from "./repositories/user-repository"
import { PaymentRepository } from "./repositories/payment-repository"
import { ScoreRepository } from "./repositories/score-repository"

// Repository instances
export const userRepository = new UserRepository()
export const paymentRepository = new PaymentRepository()
export const scoreRepository = new ScoreRepository()
