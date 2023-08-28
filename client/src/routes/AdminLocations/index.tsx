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
import { axiosPrivate } from '@api/axios'

interface IContext {
  company: Company
  getCompany: () => void
}

const AdminLocations = () => {
  const params = useParams()
  const { company, getCompany } = useOutletContext<IContext>()
  const { showModal } = useContext(ModalContext)
  const navigate = useNavigate()

  const activateAll = async () => {
    try {
      const response = await axiosPrivate.patch(
        `/locations/reactivate/${params.companyId}`
      )
      console.log(response)

      getCompany()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div id="admin-locations">
      <div className="section-header">
        <h3>Locations</h3>
        <div className="actions">
          <Button
            key="activate-all"
            size="sm"
            style="secondary"
            disabled={
              !company.active ||
              !_.some(company.locations, (location) => !location.active)
            }
            onClick={activateAll}
          >
            Activate All
          </Button>

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
      </div>

      <div className="card-list-scroller">
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
  )
}

export default AdminLocations
