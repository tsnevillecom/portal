import Button from '@components/Button'
import './AdminLocations.scss'
import { Company } from '@types'
import _ from 'lodash'
import React, { useContext } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { ModalContext } from '@context/ModalProvider'
import { axiosPrivate } from '@api/axios'
import { motion } from 'framer-motion'

const container = {
  show: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
}

const listItem = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 10,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
    },
  },
}

interface IContext {
  company: Company
  setCompany: (company: Company) => void
}

const AdminLocations = () => {
  const params = useParams()
  const { company, setCompany } = useOutletContext<IContext>()
  const { showModal } = useContext(ModalContext)
  const navigate = useNavigate()

  const activateAll = async () => {
    try {
      const response = await axiosPrivate.patch(
        `/locations/reactivate/${params.companyId}`
      )
      setCompany(response.data)
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
                data: { company, onSuccess: setCompany },
              })
            }
          >
            <FaPlus size={16} />
            New
          </Button>
        </div>
      </div>

      <div className="card-list-scroller">
        <motion.div
          className="card-list"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {_.map(company.locations, (location) => {
            return (
              <motion.div
                layout
                variants={listItem}
                className="card"
                key={location._id}
                onClick={() =>
                  navigate(
                    `/admin/companies/${company._id}/locations/${location._id}`,
                    { state: { company } }
                  )
                }
              >
                <motion.div layout className="card-cell">
                  <div>
                    <strong>{location.name}</strong>
                  </div>
                  <div className="card-sub-cell">{location.phone}</div>
                </motion.div>
                <motion.div layout className="card-cell location-status">
                  {location.active ? 'Active' : 'Deactivated'}
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminLocations
