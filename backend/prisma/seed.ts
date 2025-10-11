import { prisma } from '../src/db'
import providers from './data/providers.json'
import services from './data/services.json'
import categories from './data/categories.json'

async function main() {
  await prisma.provider.createMany({ data: providers, skipDuplicates: true })
  await prisma.service.createMany({ data: services, skipDuplicates: true })
  await prisma.category.createMany({ data: categories, skipDuplicates: true })
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error(e); process.exit(1) })
