import React, { useEffect } from 'react'
import './ChatBar.css'
import RightSideBar from './RightSideBar'
import LeftSideBar from './LeftSideBar'
import { Notifications } from 'react-push-notification'
import axios from 'axios'
import { API_URL } from 'src'
import { setMyChats } from 'src/redux/actions/socketActions'
import { useDispatch, useSelector } from 'react-redux'

const ChatBar = () => {
    const { Userid } = useSelector((state) => state.socketReducer)
  const dispatch=useDispatch()
    const AddCHatTOAdminid = async (Userid) => {
      await axios
        .post(API_URL + '/api/getrooms', { userid: Userid })
        .then((resp) => {
          console.log('response', resp.data.data)
          dispatch(setMyChats(resp.data.data))
        })
        .catch((error) => {
          console.log('error', error)
        })
    }

    useEffect(() => {
      Userid && AddCHatTOAdminid(Userid)
    }, [])
  return (
    <>
      <div className="container clearfix chatboxabcds">
        <Notifications/>
        <LeftSideBar />
        <RightSideBar />
      </div>
    </>
  )
}

export default ChatBar
