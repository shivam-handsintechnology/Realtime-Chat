import React from 'react'
import { myChatsCreate } from '../apis/chat'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChats } from '../redux/chatsSlice'
const ChatRoom = () => {
    const dispatch = useDispatch()
    const handleJoin = async () => {
        await myChatsCreate()
        dispatch(fetchChats())
    }
    return (
        <div>
            <button onClick={handleJoin}>join</button>
        </div>
    )
}

export default ChatRoom
