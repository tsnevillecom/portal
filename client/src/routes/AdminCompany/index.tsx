import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './AdminCompany.scss'
import { Company } from '@types'
import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import Button from '@components/Button'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { MdModeEditOutline } from 'react-icons/md'
import { IoIosCloseCircle } from 'react-icons/io'
import { HiCheckCircle } from 'react-icons/hi'
import { ModalContext } from '@context/ModalProvider'
import CONSTANTS from '@constants/index'
import { useResponsive } from '@farfetch/react-context-responsive'
import { CompanyContext } from '@context/CompanyProvider'

const AdminCompany = () => {
  const params = useParams()
  const { showModal } = useContext(ModalContext)
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const { is, greaterThan, lessThan } = useResponsive()
  const { company, getCompany, setCompany } = useContext(CompanyContext)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    if (!isLoading) setIsLoading(true)
    await getCompany(params.companyId as string)
    setIsLoading(false)
  }

  const companyActivation = async () => {
    try {
      const response = await axiosPrivate.patch(
        `/companies/${company?.active ? 'deactivate' : 'reactivate'}/${
          params.companyId
        }`
      )
      setCompany(response.data)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  const renderContactInfo = () => {
    if (!company) return null

    return (
      <>
        <div className="flex-row">
          <div className="flex-cell">
            <strong>Address:</strong>
          </div>
          <div className="flex-cell">
            <div>
              <div className="company-address-1">{company.address1}</div>
              <div className="company-address-2">{company.address2}</div>
              <div className="company-city-state-zip">
                {company.city}, {company.state} {company.postalCode}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-cell">
            <strong>Phone:</strong>
          </div>
          <div className="flex-cell">{company.phone}</div>
        </div>
      </>
    )
  }

  return (
    <Page
      id="admin-company"
      title={company?.name}
      isLoading={isLoading}
      actions={[
        <Button
          style="secondary"
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
          {company?.active ? (
            <AiOutlineEyeInvisible size={16} />
          ) : (
            <AiOutlineEye size={16} />
          )}
          {company?.active ? 'Deactivate' : 'Reactivate'}
        </Button>,
        <Button
          size="sm"
          id="edit-company"
          key="edit"
          onClick={() =>
            showModal({
              name: 'EDIT_COMPANY',
              data: { company, onSuccess: setCompany },
            })
          }
        >
          <MdModeEditOutline size={16} />
          Edit Company
        </Button>,
      ]}
    >
      {company && (
        <>
          <div className="container">
            <div className="grid grid-nogutter-xl">
              <div className="col col-md">
                <div className="flex-table">
                  <div className="flex-row">
                    <div className="flex-cell">
                      <strong>Status:</strong>
                    </div>
                    <div className="flex-cell">
                      <div className="company-status">
                        {company.active ? 'Active' : 'Deactivated'}

                        {company?.active ? (
                          <HiCheckCircle size={20} color="#16a34a" />
                        ) : (
                          <IoIosCloseCircle size={20} color="#dc2626" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="flex-cell">
                      <strong>Account ID:</strong>
                    </div>
                    <div className="flex-cell">{company.accountId}</div>
                  </div>
                  <div className="flex-row">
                    <div className="flex-cell">
                      <strong>Company Type:</strong>
                    </div>
                    <div className="flex-cell">
                      {CONSTANTS.COMPANY_TYPE[company.type]}
                    </div>
                  </div>
                  <div className="flex-row">
                    <div className="flex-cell">
                      <strong>Last updated:</strong>
                    </div>
                    <div className="flex-cell">
                      {dayjs(company.updatedAt).format('MMM D, YYYY h:mm A')}
                    </div>
                  </div>

                  {(is.md || lessThan.md) && renderContactInfo()}
                </div>
              </div>
              {greaterThan.md && (
                <div className="col col-md">
                  <div className="flex-table">{renderContactInfo()}</div>
                </div>
              )}
            </div>
          </div>

          <Outlet context={{ company, setCompany }} />
        </>
      )}

      {!company && <div className="not-found">Company not found</div>}
    </Page>
  )
}

export default AdminCompany
