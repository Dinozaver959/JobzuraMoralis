import React, {useEffect, useState} from "react";
import Link from "next/link";
import Moment from "react-moment";
import { useQuery } from "react-query";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";


const getUserListFetch = async (userWallet) => {
  const response = await fetch(`/api/V2-Firebase/get/UserMessageList?userWallet=${userWallet}`);
  const data = await response.json();
  return data;
};

const getLastMessagesFetch = async (userWallet) => {
  const response = await fetch(`/api/V2-Firebase/get/UserMessageLastMessage?userWallet=${userWallet}`);
  const data = await response.json();
  return data;
};

const getDirectMessageList = async (userWallet) => {
  const [dirMessageList] = await Promise.all(
    [getUserListFetch(userWallet),]
    );
  return dirMessageList;
};

const getLastMessages = async (userWallet) => {
  const [dirLastMessages] = await Promise.all(
    [getLastMessagesFetch(userWallet),]
    );  

  return dirLastMessages;
};


export const MessagesUsersList = (props) => {
  const { currentAccount, userListVisible, handleClickUserlist } = props;
  const lowerCaseCurrentAccount = currentAccount?.toLowerCase();

  const { data: directMessageList, status: statusMessageList} = useQuery(
    "nameMessageList",
    () => getDirectMessageList(lowerCaseCurrentAccount),
  );

  const { data: LastMessages, status: statusLastMessages } = useQuery(
    "nameLastMessages",
    () => getLastMessages(lowerCaseCurrentAccount),
  );

  return (
    <div className={`inboxList ${userListVisible ? "" : "visibleList"}`}>
      <div className="inboxHeader">
        <div className="inboxHeaderSort">All Conversations</div>
      </div>
      <div className="inboxListContainer">
        {directMessageList &&
          directMessageList?.map((user, index) => (
            <>
              {(statusMessageList === "success" && statusLastMessages === "success") && (
                <Link href={`/inbox/${user.name.stringValue}`} key={index}>
                  <div className="inboxListItem">   {/*  onClick={handleClickUserlist} */}
                    <div className="inboxUserThumb">
                      <span className="profilePic">
                        <Image
                          src={makeBlockie(user.name.stringValue)}
                          width="100%"
                          height="100%"
                          alt={user.name.stringValue}
                          style={{ borderRadius: "50%" }}
                        />
                      </span>
                    </div>
                    <div className="inboxUserSort">
                      <div className="inboxSortLeft">
                        <div className="listUsername">
                          {user.name.stringValue.slice(0, 6) +
                            "..." +
                            user.name.stringValue.slice(-4)}
                        </div>
                        <div className="userLastMsg">
                          {LastMessages[index]?.name.LastMessage}
                        </div>
                      </div>
                      <div className="inboxSortRight">
                        <div className="userLastMsgTime">
                          <Moment fromNow>
                            {LastMessages[index]?.name.Created._seconds * 1000}
                          </Moment>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {(statusMessageList === "loading" || statusLastMessages === "loading") && (
                <div className="inboxListItem">
                  <div className="inbox__users__list__item__header">
                    <div>
                      <span className="inbox__users__list__item__username">
                        Loading
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ))}
        {directMessageList?.length === 0 && (
          <div
            className="inboxListItem"
            style={{
              cursor: "default",
            }}
          >
            <div className="inbox__users__list__item__header">
              <div>
                <span className="inbox__users__list__item__username">
                  No conversations yet
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
