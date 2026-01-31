
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- DIAGNOSING USERS ---')
  
  // 1. List all users to see what's actually there
  const allUsers = await prisma.user.findMany()
  console.table(allUsers.map(u => ({ id: u.id, email: `"${u.email}"`, role: u.role })))
  
  // 2. Find the admin user (usually ID 2 per screenshot)
  const adminUser = allUsers.find(u => u.role === 'ADMIN' || u.id === 2)
  
  if (adminUser) {
    console.log(`\n✅ Found Admin User: ID=${adminUser.id}, Email='${adminUser.email}'`)
    
    // 3. Force Reset Password
    const newPassword = 'developer'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: hashedPassword }
    })
    
    console.log(`✅ Password for '${adminUser.email}' has been reset to: '${newPassword}'`)
  } else {
    console.error(`❌ Could not find an admin user with ID 2 or role ADMIN.`)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
