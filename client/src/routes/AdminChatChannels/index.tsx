import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { Channel } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

const AdminChatChannels = () => {
  const axiosPrivate = useAxiosPrivate()
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getChatChannels()
  }, [])

  const getChatChannels = async () => {
    try {
      const response = await axiosPrivate('/channels')
      setChannels(response.data)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  return (
    <Page id="admin-chat-channels" title="Chat Channels" isLoading={isLoading}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Created by</th>
            <th>Is active?</th>
          </tr>
        </thead>
        <tbody>
          {_.map(channels, (channel) => {
            return (
              <tr key={channel._id}>
                <td>{channel.name}</td>
                <td>
                  {channel.createdBy.firstName} {channel.createdBy.lastName}
                </td>
                <td>{channel.active.toString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Page>
  )
}

export default AdminChatChannels
