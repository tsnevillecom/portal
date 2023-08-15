import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { Company } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

const AdminCompanies = () => {
  const axiosPrivate = useAxiosPrivate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [locations, setLocations] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCompanies()
  }, [])

  const getCompanies = async () => {
    try {
      const response = await axiosPrivate('/company')
      setCompanies(response.data)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  const getLocations = async (id: string) => {
    try {
      const response = await axiosPrivate(`/company/${id}/locations`)
      setLocations(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Page id="admin-companies" title="Companies" isLoading={isLoading}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Account ID</th>
            <th>Location(s)</th>
            <th>Is deleted?</th>
          </tr>
        </thead>
        <tbody>
          {_.map(companies, (company) => {
            return (
              <tr
                key={company._id}
                className="row"
                onClick={() => getLocations(company._id)}
              >
                <td>{company.name}</td>
                <td>{company.accountId}</td>
                <td>{company.locations.length}</td>
                <td>{company.deleted.toString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Page>
  )
}

export default AdminCompanies
