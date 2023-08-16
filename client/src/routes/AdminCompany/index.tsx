import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './AdminCompany.scss'
import { Company } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import Button from '@components/Button'
import { BiSolidLocationPlus } from 'react-icons/bi'
import { GrEdit } from 'react-icons/gr'

const AdminCompany = () => {
  const params = useParams()
  const axiosPrivate = useAxiosPrivate()
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCompany()
  }, [])

  const getCompany = async () => {
    try {
      const response = await axiosPrivate(`/companies/${params.id}`)
      setCompany(response.data)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  return (
    <Page id="admin-company" title="Company" isLoading={isLoading} back={true}>
      {company && (
        <>
          <Button size="sm" id="edit-company">
            <GrEdit size={16} />
            Edit
          </Button>

          <div className="company">
            <div>
              <div className="company-name">{company.name}</div>
              <div className="company-account-id">
                <strong>Account ID:</strong> {company.accountId}
              </div>
            </div>
            <div>
              <div className="company-updated-at">
                <strong>Last updated:</strong>{' '}
                {dayjs(company.updatedAt).format('MMMM D, YYYY h:mm A')}
              </div>
              <div className="company-id">{company._id}</div>
            </div>
          </div>

          <hr />

          <div className="company-locations-header">
            <h3>Locations</h3>
            <Button size="sm">
              <BiSolidLocationPlus size={16} />
              New
            </Button>
          </div>

          <div className="company-locations">
            {_.map(company.locations, (location) => {
              return (
                <div key={location._id} className="location">
                  <div className="location-name">{location.name}</div>

                  <div className="location-address">
                    <div className="location-address-1">
                      {location.address1}
                    </div>
                    <div className="location-address-2">
                      {location.address2}
                    </div>
                    <div className="location-city-state-zip">
                      {location.city}, {location.state} {location.postalCode}
                    </div>
                  </div>

                  <div className="location-phone">{location.phone}</div>
                </div>
              )
            })}
          </div>

          <hr />
        </>
      )}

      {!company && <div className="not-found">Company not found</div>}
    </Page>
  )
}

export default AdminCompany
