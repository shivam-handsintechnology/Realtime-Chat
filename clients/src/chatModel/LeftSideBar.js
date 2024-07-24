import React, { useEffect, useState } from 'react'
import './ChatBar.css'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setMyChats } from 'src/redux/actions/socketActions'
import { API_URL } from 'src'
const LeftSideBar = () => {
  const dispatch=useDispatch()
  const { Userid, socket, mychats, allchats } = useSelector(
    (state) => state.socketReducer,
  )
  const [isOnline, setisOnline] = useState(null)
  useEffect(() => {
    if (socket) {
      socket.on('userleft', ({ Roomid, chatstatus }) => {
        console.log({ Roomid, chatstatus })
        setisOnline({ Roomid, chatstatus })
      })
      socket.on('chatstatus', ({ Roomid, chatstatus }) => {
        setisOnline({ Roomid, chatstatus })
      })
    }
  }, [socket])


  // const getAllRoomids = async () => {
  //   await axios
  //     .get(`${API_URL}api/getallchatusers`)
  //     .then((response) => {
  //       console.log('response aaya ', response)

  //       if (response.data.data.length > 0) {
  //         setRoomIds(response.data.data)
  //       }
  //     })
  //     .catch((error) => {})
  // }
  // const getAllRoomidsByUsertype = async (id) => {
  //   await axios
  //     .get(`${API_URL}api/getallchatusers?id=${id}`)
  //     .then((response) => {
  //       console.log('response aaya id se', response)
  //       if (response.data.data.length > 0) {
  //         setMyChats(response.data.data[0].result)
  //       }
  //     })
  //     .catch((error) => {

  //     })
  // }

console.log('my chats', mychats)

  return (
    <div className="people-list" id="people-list">
      <div className="search">
        <input type="text" placeholder="search" />
        <i className="fa fa-search" />
      </div>

      <>
        <ul className="list">
          {mychats && mychats.length > 0 ? (
            mychats.map((val) => (
              <>
                <li className="clearfix">
                  <img
                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg"
                    alt="avatar"
                  />
                  <div className="about">
                    <Link
                      style={{ color: 'greenyellow', textDecoration: 'none' }}
                      to={`/chat/${val.customer?._id}`}
                    >
                      {' '}
                      <div className="name">visitor#{val.customer?.full_name}</div>
                    </Link>
                    <div className="status">
                      <i className="fa fa-circle online" />{' '}
                      {isOnline && isOnline?.Roomid === val.customer?._id
                        ? isOnline?.chatstatus
                          ? 'Online'
                          : 'offline'
                        : val.customer?.chatstatus
                        ? 'Online'
                        : 'offline'}
                    </div>
                  </div>
                </li>
              </>
            ))
          ) : (
            <></>
          )}
        </ul>
      </>
    </div>
  )
}

LeftSideBar.propTypes = {
  RoomIds: PropTypes.array,
}
export default LeftSideBar
