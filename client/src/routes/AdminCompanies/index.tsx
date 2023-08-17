import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { Company } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MdNavigateNext } from 'react-icons/md'

const AdminCompanies = () => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCompanies()
  }, [])

  const getCompanies = async () => {
    try {
      const response = await axiosPrivate('/companies')
      setCompanies(response.data)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  return (
    <Page id="admin-companies" title="Companies" isLoading={isLoading}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Account ID</th>
            <th>Location(s)</th>
            <th>Is active?</th>
          </tr>
        </thead>
        <tbody>
          {_.map(companies, (company) => {
            return (
              <tr
                key={company._id}
                className="row"
                onClick={() => navigate(`/admin/companies/${company._id}`)}
              >
                <td>{company.name}</td>
                <td>{company.accountId}</td>
                <td>{company.locations.length}</td>
                <td>{company.active.toString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Page>
  )
}

export default AdminCompanies
