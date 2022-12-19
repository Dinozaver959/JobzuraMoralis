import { GetWallet_NonMoralis } from "../../JS/local_web3_Moralis";
import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link"
import Button from '../ui/Button';
import Moment from "react-moment";
import axios from "axios";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

// import StarIcon from '@mui/icons-material/Star';

function Notifications() {
  const [dataNotifications, setDataNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  async function apis() {
    const connectedAddress = await GetWallet_NonMoralis();

    const dataNotifications = await 
      //fetch(`/api/get/MyNotifications?UserWallet=${connectedAddress}`)
      fetch(`/api/V2-Firebase/get/UserNotifications?UserWallet=${connectedAddress}`)
        .then((res) => res.json())
        .then((json) => {
          setDataNotifications(json)
        }
      );
  } 

  useEffect(() => {
    apis() 
  }, []);

  // TO FIX: mark as read button would clear all notifications 
  // function filterReadNotifications() {
  //   const filteredNotifications = dataNotifications.filter((notification) => {
  //     const notificationArray = Object.values(notification);
  //     const read = notificationArray[2];
  //     if (read === 0) {
  //       return notification;
  //     }
  //   });
  //   setFilteredNotifications(filteredNotifications);
  //   console.log("filteredNotifications: " + filteredNotifications);
  // }


  const pushReadNotification = async (contractID, eventName) => {

    const res = await CheckAndCreateAlias();
    if(res == false){return false;} 

    var formData = new FormData();
    const connectedAddress = (await GetWallet_NonMoralis())[0];

    const signedMessage_UserWallet = await SignMessageWithAlias(connectedAddress);
    formData.append("address", signedMessage_UserWallet.address);
    formData.append("message_UserWallet", signedMessage_UserWallet.message);
    formData.append("signature_UserWallet", signedMessage_UserWallet.signature);

    const signedMessage_eventName = await SignMessageWithAlias(eventName);
    formData.append("message_eventName", signedMessage_eventName.message);
    formData.append("signature_eventName", signedMessage_eventName.signature);

    const signedMessage_contractID = await SignMessageWithAlias(contractID);
    formData.append("message_contractID", signedMessage_contractID.message);
    formData.append("signature_contractID", signedMessage_contractID.signature);

  
    axios.post("/api/V2-Firebase/post/readNotification", formData)
    .then((res) => {
      if (res.status == 201 ) console.log("data successfully updated!");
    })
    .catch((err) => {
      console.log("data profile failed to update ...");
      console.log(err);
    });
    
  };


  const pushReadAllNotifications = async () => {
  
    const res = await CheckAndCreateAlias();
    if(res == false){return false;} 

    var formData = new FormData();
    const connectedAddress = (await GetWallet_NonMoralis())[0];

    const signedMessage_UserWallet = await SignMessageWithAlias(connectedAddress);
    formData.append("address", signedMessage_UserWallet.address);
    formData.append("message_UserWallet", signedMessage_UserWallet.message);
    formData.append("signature_UserWallet", signedMessage_UserWallet.signature);

  
    axios.post("/api/V2-Firebase/post/readAllNotifications", formData)
    .then((res) => {
      if (res.status == 201 ) console.log("data successfully updated!");
    })
    .catch((err) => {
      console.log("data profile failed to update ...");
      console.log(err);
    });
    
  };


  return (
   <>
    <div className="notificationHeader">
      <h2>Notifications ({dataNotifications.length})</h2>
      <Button 
        classes="button default"
        // onClick={filterReadNotifications}
        onClick={() => {pushReadAllNotifications();}}
      >Mark all as read</Button>
    </div>
    {dataNotifications.length > 0 ? dataNotifications.map((item, index) => (
      <div className="notificationContainer" key={index}>
        <div className="notifBlock">
          <div className="notifContent">
            {/* <p>{item.Description}</p>  */}
            <p>{item.name.Event} for contract 
              <Link href={`/contract/${item.name.ContractID}`} key={index}>
                {item.name.ContractID}
              </Link>
            </p>
            <Moment 
              // choose 'format' or 'fromNow'
              //format="DD/MM/YYYY - HH:mm" 
              fromNow
              date={item.name.Created._seconds * 1000}
            />
            <p>
              <Button 
                classes="button default"
                // onClick={pushReadNotification(item.name.ContractID, item.name.Event)}
                onClick={() => {
                  pushReadNotification(item.name.ContractID, item.name.Event);
                }}
              >
                Mark as read
              </Button>
            </p>
          </div>
        </div>
      </div> 
    )) : 
      <div className="notificationContainer">
        <div className="notifBlock">
          <div className="notifContent">
            <p>You have 0 notification</p>
          </div>
        </div>
      </div>
    }
   </>
  );
}

export default Notifications;