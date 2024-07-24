import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import './ChatBar.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { TranferChat, setMyChats } from 'src/redux/actions/socketActions'
import TypinIndicator from './TypinIndicator'
import { API_URL } from 'src'
const RightSideBar = () => {
  const dispatch=useDispatch()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [UserProfile, setUserProfile] = useState(null)
  const [Usertype, setUsertype] = useState(null)
  const [isTyping, seisTyping] = useState(false)
  const [Typeing, setTypeing] = useState({})
  const { roomid } = useParams()
  const { Userid, usertype, username, socket } = useSelector((state) => state.socketReducer)
  useEffect(() => {
    const messageListener = (newMessage) => {
      console.log({ newMessage })
      setMessages((prevMessages) => [...prevMessages, newMessage])
    }
       const TypingListener = (data) => {
         console.log({ data })
         setTypeing(data)
       }
    if (socket) {
      socket.on('message', messageListener)
      socket.on('usertyping', TypingListener)
      return () => {
        socket.off('message', messageListener)
        socket.off('usertyping', messageListener)
      }
    }
  }, [socket])

  useEffect(() => {
  
    roomid && getMessages(roomid)
    roomid && getUserProfile(roomid)
    usertype && getUsertypeDetails(usertype)
    roomid && socket &&  socket.emit('joinRoom', { Roomid: roomid, usertype, userid: Userid, username: username, })
    socket.emit('istyping', { isTyping, Roomid: roomid, usertype: Usertype, userid: Userid, username, })
   }, [Userid, Usertype, isTyping, roomid, socket, username, usertype])
  
  const getMessages = async (roomid) => {
    try {
      const response = await axios.get(API_URL + 'api/getallmessages?Roomid=' + roomid)
      if (response.data.data.length > 0) {
        setMessages(response.data.data)
      } else {
         console.log('not found messages')
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        setMessages([])
      }
    }
  }
  const getUserProfile = async (roomid) => {
    try {
      const response = await axios.get(API_URL + 'api/getchatuserprofile?Roomid=' + roomid)
      if (response.data.data) {
        console.log(response.data.data)
        setUserProfile(response.data.data)
      } else {
        console.log('not found messages')
      }
    } catch (error) {
      console.log(error)
    }

  }
  const getUsertypeDetails = async (usertype) => {
    try {
      const response = await axios.post(API_URL + 'api/get_user_type_detailsbyid', {
        ParamValue: usertype,
      })
      console.log("getUserType",response.data.data);
      if (response.data.data) {
        setUsertype(response.data.data.usertype)
      } else {
        console.log('not found messages')
      }
    } catch (error) {
      console.log(error)
      if (error?.response?.status === 404) {
         
      }
    }
  }

 const    handleBlur = () => {
     seisTyping(false)
     
    }
  const handleChange = (e) =>{
    console.log(e)
     setMessage(e.target.value)
     seisTyping(true)
  }
  const handleEnter = (e) => (e.keyCode === 13 ? onSubmit() : '')
  const onSubmit = async () => {
    if (roomid && socket && Usertype) {
      const newMessage = {
        msg: message,
        usertype: Usertype,
        username: username,
        Roomid: roomid,
        time: Date.now(),
        Userid,
        unread: false,
      }
      // setMessages([...messages, newMessage])
      setMessage('')
      socket.emit('message', newMessage)
      axios
        .post('https://lmpapi.handsintechnology.in/api/savemessage?Roomid=' + roomid, {
          ...newMessage,
        })
        .then((response) => {})
        .catch((error) => console.log(error))
    } else {
      // setisLoading(true);
    }
  }
  console.log({isTyping})
  return (
    <>
      {window.location.pathname === '/chat' ? (
        <div>background</div>
      ) : (
        <div className="chat">
          <div className="chat-header clearfix">
            <img
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg"
              alt="avatar"
            />
            <div className="chat-about">
              <div className="chat-with">Chat with {UserProfile && UserProfile.full_name}</div>
              <button
                onClick={() => dispatch(TranferChat(roomid, UserProfile.full_name))}
                className="chat-with"
              >
                Transfer {UserProfile && UserProfile.full_name} Query
              </button>
            </div>
            <i className="fa fa-star" />
          </div>
          <div className="chat-history">
            <ul>
              {messages && messages.length > 0 ? (
                messages.map((val, index) => {
                  return val.usertype !== 'client' ? (
                    <li>
                      <div className="message-data align-left">
                        <span className="message-data-time">
                          <Moment fromNow>{val.time}</Moment>
                        </span>{' '}
                        &nbsp; &nbsp;
                        <span className="message-data-name">
                          {' '}
                          {val?.username}({val?.usertype})
                        </span>{' '}
                        <i className="fa fa-circle me" />
                      </div>
                      <div className="message my-message">{val?.msg}</div>
                    </li>
                  ) : (
                    <li className="clearfix">
                      <div className="message-data align-right">
                        <span className="message-data-time">
                          <Moment fromNow>{val.time}</Moment>
                        </span>{' '}
                        &nbsp; &nbsp;
                        <span className="message-data-name"> {val?.username}</span>{' '}
                        <i className="fa fa-circle me" />
                      </div>
                      <div className="message other-message float-right">{val?.msg}</div>
                    </li>
                  )
                })
              ) : (
                <></>
              )}
            </ul>
            <TypinIndicator Typeing={Typeing} />
          </div>{' '}
          {/* end chat-history */}
          <div className="chat-message clearfix">
            <textarea
              name="message-to-send"
              id="message-to-send"
              rows={3}
              onKeyDown={handleEnter}
              onBlur={handleBlur}
              placeholder="Type your message"
              value={message}
              onChange={handleChange}
              defaultValue={''}
            />
            <i className="fa fa-file-o" /> &nbsp;&nbsp;&nbsp;
            <i className="fa fa-file-image-o" />
            <button onClick={onSubmit}>Send</button>
          </div>{' '}
          {/* end chat-message */}
        </div>
      )}
    </>
  )
}

export default RightSideBar
