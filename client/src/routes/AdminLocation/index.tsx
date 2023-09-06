import Button from '@components/Button'
import './AdminLocation.scss'
import { Location } from '@types'
import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MdModeEditOutline } from 'react-icons/md'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ModalContext } from '@context/ModalProvider'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { formatText } from '@utils/formatText.util'
import { IoIosCloseCircle } from 'react-icons/io'
import { HiCheckCircle } from 'react-icons/hi'
import dayjs from 'dayjs'
import Page from '@components/Page'
import { CompanyContext } from '@context/CompanyProvider'

const AdminLocation = () => {
  const params = useParams()
  const axiosPrivate = useAxiosPrivate()
  const { showModal } = useContext(ModalContext)
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState<Location | null>(null)
  const { company, getCompany } = useContext(CompanyContext)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    if (!isLoading) setIsLoading(true)

    try {
      if (!company && params.companyId) await getCompany(params.companyId)
      const response = await axiosPrivate(`/locations/${params.locationId}`)
      setLocation(response.data)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  const locationActivation = async (location: Location) => {
    try {
      const response = await axiosPrivate.post(
        `/locations/${location.active ? 'deactivate' : 'reactivate'}/${
          location._id
        }`
      )
      await setLocation(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  if (!location) return null

  return (
    <Page
      id="admin-location"
      title={location.name}
      isLoading={isLoading}
      actions={[
        <Button
          key="activate-location"
          size="sm"
          style="secondary"
          disabled={!company?.active}
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
          {location?.active ? (
            <AiOutlineEyeInvisible size={16} />
          ) : (
            <AiOutlineEye size={16} />
          )}

          {location?.active ? 'Deactivate' : 'Reactivate'}
        </Button>,
        <Button
          key="edit-location"
          size="sm"
          disabled={!location.active || !company?.active}
          onClick={() =>
            showModal({
              name: 'EDIT_LOCATION',
              data: { location, onSuccess: setLocation },
            })
          }
        >
          <MdModeEditOutline size={16} />
          Edit
        </Button>,
      ]}
    >
      {location && (
        <div key={location._id} className="location">
          <div className="flex-table location-details">
            <div className="flex-row">
              <div className="flex-cell">
                <strong>Status:</strong>
              </div>
              <div className="flex-cell">
                <div className="location-status">
                  {location.active ? 'Active' : 'Deactivated'}

                  {location?.active ? (
                    <HiCheckCircle size={20} color="#16a34a" />
                  ) : (
                    <IoIosCloseCircle size={20} color="#dc2626" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex-row">
              <div className="flex-cell">
                <strong>Tax ID:</strong>
              </div>
              <div className="flex-cell">{location.taxId}</div>
            </div>
            <div className="flex-row">
              <div className="flex-cell">
                <strong>Address:</strong>
              </div>
              <div className="flex-cell">
                <div>
                  <div className="location-address-1">{location.address1}</div>
                  <div className="location-address-2">{location.address2}</div>
                  <div className="location-city-state-zip">
                    {location.city}, {location.state} {location.postalCode}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-row">
              <div className="flex-cell">
                <strong>Phone:</strong>
              </div>
              <div className="flex-cell">{location.phone}</div>
            </div>
          </div>

          {!!location.description && (
            <>
              <div className="location-description-label">
                <strong>Description</strong>
              </div>
              <div
                className="location-description"
                dangerouslySetInnerHTML={{
                  __html: formatText(location.description),
                }}
              />
            </>
          )}
        </div>
      )}

      <div className="details-footer">
        <div className="location-updated">
          <strong>Last updated:</strong>{' '}
          {dayjs(location.updatedAt).format('MMMM D, YYYY h:mm A')}
        </div>
      </div>

      {!location && <div className="not-found">Location not found</div>}
    </Page>
  )
}

export default AdminLocation
