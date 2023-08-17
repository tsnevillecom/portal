import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './AdminCompany.scss'
import { Company, Location } from '@types'
import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import Button from '@components/Button'
import { BiSolidLocationPlus } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'
import { MdModeEditOutline } from 'react-icons/md'
import { IoIosCloseCircle } from 'react-icons/io'
import { HiCheckCircle } from 'react-icons/hi'
import { ModalContext } from '@context/ModalProvider'
import { formatText } from '@utils/formatText.util'

const AdminCompany = () => {
  const params = useParams()
  const { showModal } = useContext(ModalContext)
  const axiosPrivate = useAxiosPrivate()
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCompany()
  }, [])

  const getCompany = async () => {
    if (!isLoading) setIsLoading(true)

    try {
      const response = await axiosPrivate(`/companies/${params.id}`)
      setCompany(response.data)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  const companyActivation = async () => {
    setIsLoading(true)

    try {
      await axiosPrivate.post(
        `/companies/${company?.active ? 'deactivate' : 'reactivate'}/${
          params.id
        }`
      )
      await getCompany()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const locationActivation = async (location: Location) => {
    try {
      await axiosPrivate.post(
        `/locations/${location?.active ? 'deactivate' : 'reactivate'}/${
          location._id
        }`
      )
      await getCompany()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Page
      id="admin-company"
      title={company?.name}
      isLoading={isLoading}
      showBack={true}
      actions={[
        <Button size="sm" id="edit-company" key="edit">
          <MdModeEditOutline size={16} />
          Edit Company
        </Button>,
        <Button
          style={company?.active ? 'danger' : 'success'}
          size="sm"
          id="edit-company"
          key="delete"
          onClick={() =>
            showModal({
              name: company?.active
                ? 'CONFIRM_DEACTIVATE'
                : 'CONFIRM_REACTIVATE',
              data: { obj: company, onConfirm: companyActivation },
            })
          }
        >
          <AiFillDelete size={16} />
          {company?.active ? 'Deactivate' : 'Reactivate'}
        </Button>,
      ]}
    >
      {company && (
        <>
          <div className="company">
            <div className="company-status">
              {company?.active ? (
                <HiCheckCircle size={20} color="#16a34a" />
              ) : (
                <IoIosCloseCircle size={20} color="#dc2626" />
              )}
              <span>
                <strong>Status:</strong>{' '}
                {company?.active ? 'Active' : 'Deactivated'}
              </span>
            </div>
            <div className="company-account-id">
              <span>
                <strong>Account ID:</strong> {company.accountId}
              </span>
            </div>
            <div className="company-updated-at">
              <span>
                {' '}
                <strong>Last updated:</strong>{' '}
                {dayjs(company.updatedAt).format('MMMM D, YYYY h:mm A')}
              </span>
            </div>
          </div>

          <hr />

          <div className="company-locations-header">
            <h3>Locations</h3>
            <Button
              size="sm"
              onClick={() =>
                showModal({
                  name: 'NEW_LOCATION',
                  data: { companyId: company._id, onSuccess: getCompany },
                })
              }
            >
              <BiSolidLocationPlus size={16} />
              New Location
            </Button>
          </div>

          <div className="company-locations">
            {_.map(company.locations, (location) => {
              const enabledActivation =
                location.active &&
                _.filter(company.locations, (loc) => {
                  return !!loc.active
                }).length > 1

              return (
                <div key={location._id} className="location">
                  <div className="location-name">{location.name}</div>

                  <div className="location-tax-id">
                    <strong>Tax ID:</strong> {location.taxId}
                  </div>

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

                  {location.description && (
                    <div
                      className="location-description"
                      dangerouslySetInnerHTML={{
                        __html: formatText(location.description),
                      }}
                    />
                  )}

                  <div className="location-actions">
                    <a
                      onClick={() =>
                        showModal({
                          name: 'EDIT_LOCATION',
                          data: { location, onSuccess: getCompany },
                        })
                      }
                    >
                      Edit
                    </a>
                    <span>|</span>
                    <a
                      className={
                        location.active
                          ? enabledActivation
                            ? 'danger'
                            : 'disabled'
                          : 'success'
                      }
                      onClick={() =>
                        showModal({
                          name: location?.active
                            ? 'CONFIRM_DEACTIVATE'
                            : 'CONFIRM_REACTIVATE',
                          data: {
                            obj: location,
                            onConfirm: () => locationActivation(location),
                          },
                        })
                      }
                    >
                      {location?.active ? 'Deactivate' : 'Reactivate'}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {!company && <div className="not-found">Company not found</div>}
    </Page>
  )
}

export default AdminCompany
