import Button from '@components/Button'
import Page from '@components/Page'
import { Company } from '@types'
import _ from 'lodash'
import React, { useContext } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { ModalContext } from '@context/ModalProvider'

interface IContext {
  company: Company
  getCompany: () => void
}

const AdminLocations = () => {
  const { company, getCompany } = useOutletContext<IContext>()
  const { showModal } = useContext(ModalContext)
  const navigate = useNavigate()

  return (
    <Page
      id="company-locations"
      title="Locations"
      actions={[
        <Button
          key="add-location"
          size="sm"
          onClick={() =>
            showModal({
              name: 'NEW_LOCATION',
              data: { companyId: company._id, onSuccess: getCompany },
            })
          }
        >
          <FaPlus size={16} />
          New Location
        </Button>,
      ]}
    >
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Tax ID</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {_.map(company.locations, (location) => {
            return (
              <tr
                key={location._id}
                onClick={() =>
                  navigate(
                    `/admin/companies/${company._id}/locations/${location._id}`
                  )
                }
              >
                <td>{location.name}</td>
                <td>{location.taxId}</td>
                <td>{location.phone}</td>
                <td>{location.active ? 'Active' : 'Deactivated'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Page>
  )
}

export default AdminLocations
