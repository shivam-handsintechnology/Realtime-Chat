import React from 'react'
import "./typing.css"
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';
const TypinIndicator = ({Typeing}) => {
   const { Userid } = useSelector((state) => state.socketReducer)
   console.log(Userid, Typeing,"userid is up")
  return (
    <>
      {Typeing.userid!==Userid && Typeing.isTyping ? (
        <div className="typing">
          <span>{`${Typeing?.username}(${Typeing?.usertype}) is typing`}</span>
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
          <div className="typing__dot"></div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
};
TypinIndicator.propTypes = {
  Typeing: PropTypes.object,
}
export default TypinIndicator
