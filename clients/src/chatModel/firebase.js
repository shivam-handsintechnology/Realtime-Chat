import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
import { getToken } from 'firebase/messaging'
import { API_URL } from 'src'

const firebaseConfig = {
  apiKey: 'AIzaSyD4E3qkP9WGxQznYxWB6f52G_1PPnaQ95U',
  authDomain: 'securityforhandsin.firebaseapp.com',
  databaseURL: 'https://securityforhandsin-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'securityforhandsin',
  storageBucket: 'securityforhandsin.appspot.com',
  messagingSenderId: '200245150083',
  appId: '1:200245150083:web:d27082352a5efa5f4f76b6',
}
export const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)
const CreateFirebaseToken = async(token) => {
  let id=null
     if (localStorage.getItem('user')) {
       id = JSON.parse(localStorage.getItem('user'))._id   
     }
    if (id && token) {
      await axios
        .post(API_URL + '/api/CreateFirebaseToken?Userid=' + id, {
          token,
        })
        .then((res) => {})
        .catch((error) => console.log(error))
    }else{
      console.log("please send proper credentials")
    }
  
}
export const requestPermission = async() => {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      // Generate Token
      await getToken(messaging, {
        vapidKey:
          'BPTanIWQPu9gBVr8rbsn0SnfS7u9wy7pDoPB4ZAr6oSR7tjN35yvp_pUW_wnim1xXkA8I8QZC4jCCMem1tTv6ck',
      })
        .then((res) => {
          CreateFirebaseToken(res)
        })
        .catch((error) => {
          console.log(error)
        })
    } else if (permission === 'denied') {
      alert('You denied for the notification')
    }

}