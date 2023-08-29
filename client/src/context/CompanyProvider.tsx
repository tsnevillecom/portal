/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPrivate } from '@api/axios'
import React, {
  createContext,
  useState,
  PropsWithChildren,
  useMemo,
} from 'react'
import { Company } from 'src/_types'

interface ICompanyContext {
  company: Company | null
  setCompany: (company: Company) => void
  getCompany: (companyId: string) => void
}

export const CompanyContext = createContext<ICompanyContext>({
  getCompany: () => null,
  setCompany: () => null,
  company: null,
})

export const CompanyProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [company, setCompany] = useState<Company | null>(null)

  const getCompany = async (companyId: string) => {
    try {
      const response = await axiosPrivate(`/companies/${companyId}`)
      setCompany(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const contextValue = useMemo(
    () => ({
      company,
      setCompany,
      getCompany,
    }),
    [company]
  )

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  )
}
