import bcrypt from "bcrypt"

if (!process.env.BCRYPT_SALT_ROUNDS) {
  console.error("BCRYPT_SALT_ROUNDS does not exist as a environment variable")
  process.exit(1)
}

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) ?? 12

export default class BcryptHelper {
  static hashPassword = async (plaintext: string) => {
    return await bcrypt.hash(plaintext, SALT_ROUNDS)
  }

  static verifyPassword = async (plaintext: string, hashedPassword: string) => {
    return await bcrypt.compare(plaintext, hashedPassword)
  }


}
