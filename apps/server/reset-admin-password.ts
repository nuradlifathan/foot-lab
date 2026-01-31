
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'footlab@dev.com' 
  const newPassword = 'developer'
  
  console.log(`Resetting password for ${email}...`)
  
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })
    console.log(`✅ Success! User ${user.name} password reset to: '${newPassword}'`)
  } catch (err) {
    console.error(`❌ Failed: User with email ${email} not found.`)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
