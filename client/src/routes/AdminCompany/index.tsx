import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './AdminCompany.scss'
import { Company } from '@types'
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

const AdminCompany = () => {
  const params = useParams()
  const { showModal, hideModal } = useContext(ModalContext)
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
          style="danger"
          size="sm"
          id="edit-company"
          key="delete"
          disabled={company?.deleted}
          onClick={() =>
            showModal({
              name: 'CONFIRMATION',
              data: { obj: company },
            })
          }
        >
          <AiFillDelete size={16} />
          Delete Company
        </Button>,
      ]}
    >
      {company && (
        <>
          <div className="company">
            <div className="company-status">
              {company?.deleted ? (
                <IoIosCloseCircle size={16} color="#dc2626" />
              ) : (
                <HiCheckCircle size={16} color="#16a34a" />
              )}
              <span>
                <strong>Status:</strong>{' '}
                {company?.deleted ? 'Deleted' : 'Active'}
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
            <Button size="sm">
              <BiSolidLocationPlus size={16} />
              New Location
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
                  <div className="location-actions">
                    <a
                      onClick={() =>
                        showModal({
                          name: 'CONFIRMATION',
                          data: { some: 'shit' },
                        })
                      }
                    >
                      Edit
                    </a>
                    <span>|</span>
                    <a className="danger" onClick={hideModal}>
                      Delete
                    </a>
                  </div>
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
