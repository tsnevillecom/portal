import Button from '@components/Button'
import Page from '@components/Page'
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
  const [location] = useState<Location>(
    _.find(
      company.locations,
      (location) => location._id === params.locationId
    ) as Location
  )

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
    <Page
      id="company-location"
      title={location?.name}
      actions={[
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
        </Button>,
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
        </Button>,
      ]}
    >
      {location && (
        <div key={location._id} className="location">
          <div className="location-details">
            <div className="location-tax-id">
              <strong>Tax ID:</strong>
              {location.taxId}
            </div>

            <div className="location-address">
              <strong>Address:</strong>
              <div>
                <div className="location-address-1">{location.address1}</div>
                <div className="location-address-2">{location.address2}</div>
                <div className="location-city-state-zip">
                  {location.city}, {location.state} {location.postalCode}
                </div>
              </div>
            </div>

            <div className="location-phone">
              <strong>Phone:</strong>
              {location.phone}
            </div>
          </div>

          {!!location.description && (
            <>
              <div className="location-description-label">
                <strong>Description</strong>
              </div>
              <div className="location-description">
                {formatText(location.description)}
              </div>
            </>
          )}
        </div>
      )}

      {!location && <div className="not-found">Location not found</div>}
    </Page>
  )
}

export default AdminLocation
