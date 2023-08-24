import Button from '@components/Button'
import Page from '@components/Page'
import './AdminLocation.scss'
import { Company, Location } from '@types'
import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { MdModeEditOutline } from 'react-icons/md'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ModalContext } from '@context/ModalProvider'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { formatText } from '@utils/formatText.util'

interface IContext {
  company: Company
  getCompany: () => void
}

const AdminLocation = () => {
  const params = useParams()
  const { company, getCompany } = useOutletContext<IContext>()
  const axiosPrivate = useAxiosPrivate()
  const { showModal } = useContext(ModalContext)

  const findLocation = (): Location => {
    const location = _.find(
      company.locations,
      (location) => location._id === params.locationId
    ) as Location

    return location
  }

  const [location, setLocation] = useState<Location>(findLocation())

  useEffect(() => {
    const location = _.find(
      company.locations,
      (location) => location._id === params.locationId
    ) as Location

    setLocation(location)
  }, [params])

  const locationActivation = async (location: Location) => {
    try {
      await axiosPrivate.post(
        `/locations/${location.active ? 'deactivate' : 'reactivate'}/${
          location._id
        }`
      )
      await getCompany()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div id="admin-location" className="details-panel">
      <div className="details-header">
        <h3>{location.name}</h3>
      </div>

      {location && (
        <div key={location._id} className="location">
          <div className="flex-table location-details">
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
        <Button
          key="add-location"
          size="sm"
          onClick={() =>
            showModal({
              name: 'EDIT_LOCATION',
              data: { location, onSuccess: getCompany },
            })
          }
        >
          <MdModeEditOutline size={16} />
          Edit Location
        </Button>

        <Button
          key="activate-location"
          size="sm"
          disabled={!company.active}
          style="muted"
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
        </Button>
      </div>
      {!location && <div className="not-found">Location not found</div>}
    </div>
  )
}

export default AdminLocation
