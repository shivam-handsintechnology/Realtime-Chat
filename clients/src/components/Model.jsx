import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx"
import { useEffect } from 'react';
import { searchUsers } from '../apis/auth';
import { fetchChats } from '../redux/chatsSlice';
import Search from './group/Search';
import { getChatName, getChatPhoto } from '../utils/logics';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "fit-content",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};
function Model(props) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const [searchResults, setSearchResults] = useState([])
  const [name, setName] = useState("")
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState([])
  const { activeChat } = useSelector((state) => state.chats)
  const activeUser = useSelector((state) => state.activeUser)

  const handleOpen = () => {
    setOpen(true);
    setName(getChatName(activeChat, activeUser))
  };
  const handleClose = () => {
    setOpen(false);
    setSearch("")
    setSearchResults([])
  };

  useEffect(() => {
    const searchChange = async () => {
      setIsLoading(true)
      const { data } = await searchUsers(search)
      setSearchResults(data)
      setIsLoading(false)
    }
    searchChange()
  }, [search])
  return (
    <>
      <button onClick={handleOpen}>
        <img className='w-[40px] h-[40px] rounded-[25px]' alt="Profile Pic" src={getChatPhoto(activeChat, activeUser)} />

      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='w-[250px] h-[250px] flex flex-col items-center justify-center -mt-4'>
            <img className='w-[70px] h-[70px] rounded-[35px] shadow-lg' src={getChatPhoto(activeChat, activeUser)} alt="" />
            <h2 className='text-[17px] tracking-wider font-semibold text-[#313439]'>{getChatName(activeChat, activeUser)}</h2>

            <h3 className='text-[14px] font-semibold text-[#268d61]'>{!activeChat?.isGroup && activeChat?.users[0]?._id === activeUser.id ? activeChat?.users[1]?.email : activeChat?.users[0]?.email}</h3>
            <div className='flex flex-col items-start'>

              <h5 className='text-[13px]'>{!activeChat?.isGroup && activeChat?.users[0]?._id === activeUser.id ? activeChat?.users[1]?.bio : activeChat?.users[0]?.bio}</h5>
            </div>
          </div>


        </Box>
      </Modal>





    </>
  )
}

export default Model