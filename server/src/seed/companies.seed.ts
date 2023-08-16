import ROLES from '../config/roles'
import Company from '../models/company.model'
import User from '../models/user.model'

class CompaniesSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding companies collection')

    const admin = await User.exists({
      email: 'tsneville+admin@gmail.com',
      role: ROLES.ADMIN,
    })

    const companies = [
      {
        name: 'Alpha Dental',
        accountId: '0000000000',
        createdBy: admin._id,
      },
      {
        name: 'Beta Dental',
        accountId: '0000000001',
        createdBy: admin._id,
      },
      {
        name: 'Kappa Dental',
        accountId: '0000000002',
        createdBy: admin._id,
      },
      {
        name: 'Delta Dental',
        accountId: '0000000003',
        createdBy: admin._id,
      },
      {
        name: 'Zeta Dental',
        accountId: '0000000004',
        createdBy: admin._id,
        deleted: true,
      },
    ]

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
