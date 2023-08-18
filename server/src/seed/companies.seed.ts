import ROLES from '../config/roles'
import Company from '../models/company.model'
import User from '../models/user.model'
import { faker } from '@faker-js/faker'

class CompaniesSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding companies collection')

    const admin = await User.exists({
      email: 'tsneville+admin@gmail.com',
      role: ROLES.ADMIN,
    })

    const companies = []

    for (let i = 0; i < 8; i++) {
      const city = faker.location.city()

      const company = {
        name: faker.company.name(),
        accountId: `${faker.finance.accountNumber(
          2
        )}-${faker.finance.accountNumber(8)}`,
        type: Math.random() < 0.5 ? 'DSO' : 'PRIVATE',
        phone: faker.phone.number(),
        address1: faker.location.streetAddress(),
        address2:
          Math.random() < 0.5 ? `Suite ${faker.location.buildingNumber()}` : '',
        city: city,
        state: faker.location.state({ abbreviated: true }),
        postalCode: faker.location.zipCode('#####'),
        createdBy: admin._id,
        active: Math.random() < 0.5,
      }

      companies.push(company)
    }

    for (const company of companies) {
      const foundCompany = await Company.exists({
        accountId: company.accountId,
      })

      if (foundCompany) {
        console.log(`${company.name} exists`)
        continue
      }

      await new Company(company).save()
      console.log(`${company.name} created`)
    }
  }
}

export default CompaniesSeed
