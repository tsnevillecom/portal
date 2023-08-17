import ROLES from '../config/roles'
import Company from '../models/company.model'
import Location from '../models/location.model'
import User from '../models/user.model'
import { faker } from '@faker-js/faker'

class LocationsSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding locations collection')

    const admin = await User.exists({
      email: 'tsneville+admin@gmail.com',
      role: ROLES.ADMIN,
    })

    const companies = await Company.find({
      accountId: {
        $in: [
          '0000000000',
          '0000000001',
          '0000000002',
          '0000000003',
          '0000000004',
        ],
      },
    })

    for (const company of companies) {
      const x = Math.floor(Math.random() * 4 + 1)

      for (let i = 0; i < x; i++) {
        const city = faker.location.city()

        const location = {
          name: `${company.name} - ${city}`,
          companyId: company._id,
          taxId: `${faker.finance.accountNumber(
            2
          )}-${faker.finance.accountNumber(8)}`,
          phone: faker.phone.number(),
          address1: faker.location.streetAddress(),
          address2: `Suite ${faker.location.buildingNumber()}`,
          city: city,
          state: faker.location.state({ abbreviated: true }),
          postalCode: faker.location.zipCode(),
          countryCode: 'US',
          description: faker.lorem.paragraph({ min: 0, max: 5 }),
          createdBy: admin._id,
          active: true,
        }

        const newLocation = await new Location(location).save()
        company.locations.push(newLocation._id)
        console.log(`${location.name} created`)
      }

      await company.save()
    }
  }
}

export default LocationsSeed
