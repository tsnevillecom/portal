import Button from '@components/Button'
import './AdminLocations.scss'
import { Company } from '@types'
import _ from 'lodash'
import React, { useContext } from 'react'
import {
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { ModalContext } from '@context/ModalProvider'
import { classNames } from '@utils/classNames.util'

interface IContext {
  company: Company
  getCompany: () => void
}

const AdminLocations = () => {
  const params = useParams()
  const { company, getCompany } = useOutletContext<IContext>()
  const { showModal } = useContext(ModalContext)
  const navigate = useNavigate()

  return (
    <div id="admin-locations">
      <div className="details">
        <div className="details-list">
          <div className="details-header">
            <h3>Locations</h3>
            <Button
              key="add-location"
              size="sm"
              disabled={!company.active}
              onClick={() =>
                showModal({
                  name: 'NEW_LOCATION',
                  data: { companyId: company._id, onSuccess: getCompany },
                })
              }
            >
              <FaPlus size={16} />
              New
            </Button>
          </div>

          <div className="details-list-body">
            <div className="card-list">
              {_.map(company.locations, (location) => {
                const cx = {
                  card: true,
                  active: location._id === params.locationId,
                }

                const cardClasses = classNames(cx)

                return (
                  <div
                    className={cardClasses}
                    key={location._id}
                    onClick={() =>
                      navigate(
                        `/admin/companies/${company._id}/locations/${location._id}`,
                        { replace: true }
                      )
                    }
                  >
                    <div className="card-cell">
                      <div>
                        <strong>{location.name}</strong>
                      </div>
                      <div className="card-sub-cell">{location.phone}</div>
                    </div>
                    <div className="card-cell location-status">
                      {location.active ? 'Active' : 'Deactivated'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Outlet context={{ company, getCompany }} />

        {!params.locationId && (
          <div className="details-panel empty">
            <div className="not-found">Select a location</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLocations
