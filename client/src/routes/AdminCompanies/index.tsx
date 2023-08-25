import Button from '@components/Button'
import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { Company } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'

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
    <Page
      id="admin-companies"
      title="Companies"
      isLoading={isLoading}
      actions={[
        <Button size="sm" id="new-company" key="new-company">
          <FaPlus size={16} />
          New Company
        </Button>,
      ]}
    >
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Account ID</th>
              <th>Type</th>
              <th># Location(s)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {_.map(companies, (company) => {
              return (
                <tr
                  key={company._id}
                  onClick={() => navigate(`/admin/companies/${company._id}`)}
                >
                  <td>{company.name}</td>
                  <td>{company.accountId}</td>
                  <td>{company.type}</td>
                  <td>{company.locations.length}</td>
                  <td>{company.active ? 'Active' : 'Deactivated'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Page>
  )
}

export default AdminCompanies
