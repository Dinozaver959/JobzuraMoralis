import { useEffect, useMemo, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import Link from "next/link";
import data from "@emoji-mart/data";
import SmileyIc from "../icons/Smiley";
import CloseIc from "../icons/Close";
import AttachmentIc from "./../icons/Attachment";
import {StartDispute_Moralis} from "../../JS/local_web3_Moralis";
import Moment from "react-moment";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";
import DisputeMessage from "./DisputeMessage";
import useSWR, { useSWRConfig } from "swr";
import axios from "axios";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

const fetcher = async (...args) => fetch(...args).then((res) => res.json());

const DisputeBox = (props) => {
  const { contractDetails, currentAccount } = props;
  const lowerCaseCurrentAccount = currentAccount?.toLowerCase();
  const filePickerRef = useRef(null);
  const endOfMessages = useRef(null);
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFilePOST, setSelectedFilePOST] = useState(null);

  const isDisabled = !message.trim() && !selectedFile;

  const Seller = contractDetails?.SellerWallet?.stringValue;
  const truncateBuyer = lowerCaseCurrentAccount?.substring(0, 6) + "..." + lowerCaseCurrentAccount?.substring(38, 42);
  
  const contractID = contractDetails?.ChainId?.stringValue + "_" + contractDetails?.Index?.stringValue;

  const TimeToDeliver = contractDetails?.TimeToDeliver?.stringValue;
  const createdAt = contractDetails?.createdAt?.stringValue;
  const date = new Date(createdAt);
  const dueOn = new Date(date.getTime() + TimeToDeliver * 24 * 60 * 60 * 1000);
  
  // MESSAGE PART
  const messageSender = lowerCaseCurrentAccount;
  const messageReceiver = Seller?.toLowerCase();
  const { mutate } = useSWRConfig();
  const { data: messages, error } = useSWR(
    //`/api/get/MyDisputeMessages?sender=${messageSender}&receiver=${messageReceiver}`,
    `/api/V2-Firebase/get/MyMessagesDispute?contractID=${contractID}`,
    fetcher,
    )

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



      /*
      const Messages = Moralis.Object.extend("DisputeMessages");
      const messageObject = new Messages();

      messageObject.set("sender", messageSender);
      messageObject.set("receiver", messageReceiver);
      messageObject.set("message", message);
      messageObject.set("image", selectedFile);

      await messageObject.save();
      */


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


      // APPEND CONTRACT_ID
      const signedMessage_contractID = await SignMessageWithAlias(contractID);
      formData.append("message_contractID", signedMessage_contractID.message);
      formData.append("signature_contractID", signedMessage_contractID.signature);


      formData.append(`file0`, selectedFilePOST); // 1 img only
      
    
      axios.post("/api/V2-Firebase/post/saveMessageDispute", formData)
      .then((res) => {
        if (res.status == 201 ) console.log("data successfully updated!");
      })
      .catch((err) => {
        console.log("data profile failed to update ...");
        console.log(err);
      });


      setMessage("");
      setSelectedFile(null);
      setSelectedFilePOST(null);

      // mutate(`/api/get/MyDisputeMessages?sender=${messageSender}&receiver=${messageReceiver}`);
      mutate(`/api/V2-Firebase/get/MyMessagesDispute?contractID=${contractID}`);
    }
  };

  useEffect(() => {
    endOfMessages.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  const messagesList = useMemo(() => {
    if (messages) {
      return messages.map((message, index) => (
        <DisputeMessage
          key={index}
          message={message}
          messageSender={messageSender}
          messageReceiver={messageReceiver}
        />
      ));
    }
  }, [messages]);

  return (
    <div className="disputeBox">
      <div className="disputeBoxHeader">
        <h3>Contract #{contractID}</h3>
        <div className="disputeBoxHeaderRight">
          <Link href={`/orders`}>
            <button>
              Close Dispute
            </button>
          </Link>

          <button onClick={() =>
            StartDispute_Moralis(contractDetails.CurrencyTicker.stringValue, contractDetails.Index.stringValue)
              .catch((error) => {
                console.error(error);
                console.log("Start Dispute error code: " + error.code);
                if (error.data && error.data.message) {
                  console.log(error.data.message);
                } else {
                  console.log(error.message);
                }
                process.exitCode = 1;
              })
          }
          >Confirm Dispute</button>
        </div>
      </div>

      <div className="disputeBoxBody">
        <div className="disputeBoxChat">
          <div className="disputeBoxChatHeader">
            {Seller ? (
              <Image
                src={makeBlockie(currentAccount)}
                alt="Seller"
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <div className="placeholderImage"></div>            
            )}
            <div className="profileName">
              <h4>{truncateBuyer}</h4>
              <span>Buyer</span>
            </div>
            <span>|</span>
            <Moment format="h:mm a"/>
          </div>

          <div className="disputeBoxChatBody">


            {/* 

            <div className="disputeBoxChatBodyHeader">
              <span>The dispute is open due to :</span>
              <h4>Delivery time is over</h4>
            </div>

            <div className="disputeBoxChatBodyImages">
              <div className="disputeBoxChatBodyImage"></div>
              <div className="disputeBoxChatBodyImage"></div>
              <div className="disputeBoxChatBodyImage"></div>
            </div>
            
            */}



          </div>
        </div>
        <div className="chatboxContainer">
          {messagesList}
          <div ref={endOfMessages}></div>
        </div>
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
      </div>


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
            placeholder={`Type your message...`}
            onChange={(e) => setMessage(e.target.value)}
            className="chatboxInput"
          />

          <div className="chatInputSmiley">
            <SmileyIc size="24" 
              onClick={() => setShowEmojis(!showEmojis)} 
            />
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
            className="button primary"
            onClick={sendMessage}
            disabled={isDisabled}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default DisputeBox