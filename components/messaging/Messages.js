import React, { useState, useRef, useEffect, Fragment, useMemo } from "react";
import Message from "./Message";
import CloseIc from "./../icons/Close";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import axios from "axios";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

import AttachmentIc from "./../icons/Attachment";
import SmileyIc from "./../icons/Smiley";

const fetcher = async (...args) => fetch(...args).then((res) => res.json());

const Messages = (props) => {
  const { currentAccount, userAddress } = props;
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePOST, setSelectedFilePOST] = useState(null);
  const endOfMessages = useRef(null);
  const truncateReceiverAddress = userAddress
    ? userAddress.slice(0, 5) + "..." + userAddress.slice(-4)
    : "";
  const messageSender = currentAccount.toLowerCase();
  const messageReceiver = userAddress?.toLowerCase();
  const { mutate } = useSWRConfig();
  const { data: messages, error } = useSWR(
    // `/api/get/MyMessages?sender=${messageSender}&receiver=${messageReceiver}`,
    `/api/V2-Firebase/get/MyMessages?sender=${messageSender}&receiver=${messageReceiver}`,
    fetcher,
  );

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessage(message + emoji);
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
    setSelectedFilePOST(e.target.files[0]);
    filePickerRef.current.value = "";
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.length > 0) {

      const res = await CheckAndCreateAlias();
      if(res == false){return false;} 

      // create a formData and send to POST API
      var formData = new FormData();
      //const connectedAddress = (await GetWallet_NonMoralis())[0];

      const signedMessage_sender = await SignMessageWithAlias(messageSender);
      formData.append("address", signedMessage_sender.address);
      formData.append("message_sender", signedMessage_sender.message);
      formData.append("signature_sender", signedMessage_sender.signature);
  
      const signedMessage_receiver = await SignMessageWithAlias(messageReceiver);
      formData.append("message_receiver", signedMessage_receiver.message);
      formData.append("signature_receiver", signedMessage_receiver.signature);

      const signedMessage_message = await SignMessageWithAlias(message);
      formData.append("message_message", signedMessage_message.message);
      formData.append("signature_message", signedMessage_message.signature);

      formData.append(`file0`, selectedFilePOST); // 1 img only
      
    
      axios.post("/api/V2-Firebase/post/saveMessage", formData)
      .then((res) => {
        if (res.status == 201 ) console.log("data successfully updated!");
      })
      .catch((err) => {
        console.log("data profile failed to update ...");
        console.log(err);
      });
      /**/ 
      // DON'T WAIT FOR THE REPLY for MESSAGES - since the time it takes is more important than knowing if it saved the message or not (99% it will save...)
      // leave it for now - otherwise we have a concurrency issue...

      setMessage("");
      setSelectedFile(null);
      setSelectedFilePOST(null);


      //mutate(`/api/get/MyMessages?sender=${messageSender}&receiver=${messageReceiver}`);
      mutate(`/api/V2-Firebase/get/MyMessages?sender=${messageSender}&receiver=${messageReceiver}`);
    }
  };

  useEffect(() => {
    endOfMessages.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  const isDisabled = !message.trim() && !selectedFile;

  // useMemo to stop rerendering the Message component when the user types in the input field and makes it laggy
  const messagesList = useMemo(() => {
    if (messages) {
      return messages.map((message, index) => (
        <Message
          key={index}
          message={message}
          messageSender={messageSender}
          messageReceiver={messageReceiver}
        />
      ));
    }
  }, [messages]);


  return (
    <Fragment>
      <div className="chatboxContainer">
        {messagesList}
        <div ref={endOfMessages}></div>
      </div>

      <div className="chatboxFooter">
        {selectedFile && (
          <div className="attachedFileContainer">
            <div className="chatAttachedFile">
              <div
                onClick={() => setSelectedFile(null)}
                className="chatAttachedFile_removeIc"
              >
                <CloseIc size="18" />
              </div>
              <img src={selectedFile} alt="selected file" />
            </div>
          </div>
        )}

        <form className="chatboxFooterForm">
          <div className="charboxAttachment">
            <AttachmentIc
              size={24}
              onClick={() => filePickerRef.current.click()}
              name="image"
            />
            <input
              type="file"
              ref={filePickerRef}
              hidden
              onChange={addImageToPost}
              accept="image/png, image/jpeg, image/jpg"
            />
          </div>

          <div className="chatInputContainer">
            <input
              type="text"
              value={message}
              placeholder={`Type a message to ${truncateReceiverAddress}`}
              onChange={(e) => setMessage(e.target.value)}
              className="chatboxInput"
            />

            <div className="chatInputSmiley">
              <SmileyIc size="24" onClick={() => setShowEmojis(!showEmojis)} />
              {showEmojis && (
                <div className="smileyPickerMain">
                  <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
                </div>
              )}
            </div>
          </div>

          <div className="chatButton">
            <button
              type="submit"
              className="button dark"
              onClick={sendMessage}
              disabled={isDisabled}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Messages;
