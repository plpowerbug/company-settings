import { PrismaClient } from '@prisma/client'
import { 
  generateDefaultOperations, 
  type OperationConfig,
  type ActionConfig 
} from '../lib/operations-config'

const prisma = new PrismaClient()

async function main() {
  // Create a default company
  const company = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
      description: 'Leading provider of innovative solutions',
      industry: 'technology',
      foundedYear: '2010',
      website: 'https://example.com',
      companySize: '11-50',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      settings: {
        create: {
          // Default settings
          enableNotifications: false,
          emailDigestFrequency: 'weekly',
          notifyOnUserSignup: true,
          notifyOnPaymentReceived: true,
          notifyOnSystemUpdates: true,
          notifyOnSecurityAlerts: true,
          marketingEmails: false,
        }
      }
    }
  })

  console.log(`Created company with ID: ${company.id}`)

  // Generate default operations
  const defaultOperations = generateDefaultOperations()
  
  // Create operations with their actions
  for (const operation of defaultOperations) {
    const { actions, ...operationData } = operation
    
    // Ensure unique action types by using a Map to deduplicate
    const uniqueActions = new Map<string, ActionConfig>()
    
    // Only keep the last action of each type
    actions.forEach(action => {
      uniqueActions.set(action.type, action)
    })
    
    // Convert back to array
    const uniqueActionsArray = Array.from(uniqueActions.values())
    
    await prisma.operation.create({
      data: {
        ...operationData,
        companyId: company.id,
        actions: {
          create: uniqueActionsArray.map(action => ({
            type: action.type,
            name: action.name,
            description: action.description,
            enabled: action.enabled,
            config: action.config
          }))
        }
      }
    })
    
    console.log(`Created operation: ${operationData.name} with ${uniqueActionsArray.length} actions`)
  }

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })