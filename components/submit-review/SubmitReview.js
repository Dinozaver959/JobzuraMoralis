import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Image from "next/image";
import { GetWallet_NonMoralis } from "../../JS/local_web3_Moralis.js";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";



function SubmitReview (props) {
  const { currentAccount } = props;
  const router = useRouter();
  const contractID = router.query.contractID;  
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  //const [like, setLike] = useState("");
  //const [dislike, setDislike] = useState("");
  const [privateReview, setPrivateReview] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hoverValue, setHoverValue] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const fetchContractDetails = async (contractID) => {
    const response = await axios.get(`/api/V2-Firebase/get/Contract?contractID=${contractID}`);
    return response.data;
  };

  const { data, isLoading } = useQuery(["SubmitReview", contractID], () =>
    fetchContractDetails(contractID)
  );

  const contractDetails = data;
  const contractSeller = contractDetails?.SellerWallet.stringValue;
  const contractBuyer = contractDetails?.BuyerWallet.stringValue;
  const jobID = contractDetails?.JobId.stringValue;
  const contractTitle = contractDetails?.Title.stringValue;
  const contractPrice = contractDetails?.Price.stringValue;
  const contractImage = contractDetails?.ImageLinks.arrayValue.values;
 

  let starsNumber = 5;
  let limitCharacters = 1200;
  const stars = Array(starsNumber).fill(0);

  const togglePrivateInfo = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleContractDetails = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleClick = (value) => {
    setRating(value);
  };

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const onFinish = async () => {
    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if (res == false) {
      return false;
    }

    var formData = new FormData();
    const connectedAddress = (await GetWallet_NonMoralis())[0];

    // run for every parameter to append
    const signedMessage_connectedAddress = await SignMessageWithAlias(connectedAddress);
    formData.append("address", signedMessage_connectedAddress.address);
    formData.append("message_UserWallet", signedMessage_connectedAddress.message);
    formData.append("signature_UserWallet", signedMessage_connectedAddress.signature);

    const signedMessage_contractID = await SignMessageWithAlias(contractID);
    formData.append("message_contractID", signedMessage_contractID.message);
    formData.append("signature_contractID", signedMessage_contractID.signature);

    const signedMessage_jobID = await SignMessageWithAlias(jobID);
    formData.append("message_jobID", signedMessage_jobID.message);
    formData.append("signature_jobID", signedMessage_jobID.signature);

    const signedMessage_contractSeller = await SignMessageWithAlias(contractSeller);
    formData.append("message_contractSeller", signedMessage_contractSeller.message);
    formData.append("signature_contractSeller", signedMessage_contractSeller.signature);

    const signedMessage_contractBuyer = await SignMessageWithAlias(contractBuyer);
    formData.append("message_contractBuyer", signedMessage_contractBuyer.message);
    formData.append("signature_contractBuyer", signedMessage_contractBuyer.signature); 

    const signedMessage_review = await SignMessageWithAlias(review);
    formData.append("message_review", signedMessage_review.message);
    formData.append("signature_review", signedMessage_review.signature);

    const signedMessage_rating = await SignMessageWithAlias(rating.toString());
    formData.append("message_rating", signedMessage_rating.message);
    formData.append("signature_rating", signedMessage_rating.signature);

    const signedMessage_privateReview = await SignMessageWithAlias(privateReview.toString());
    formData.append("message_privateReview", signedMessage_privateReview.message);
    formData.append("signature_privateReview", signedMessage_privateReview.signature);


    axios.post("/api/V2-Firebase/post/createReview", formData)
    .then((res) => {
      if (res.status == 201 ) console.log("review successfully created!");
    })
    .catch((err) => {
      console.log("creating a review failed...");
      console.log(err);
    });

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please rate the service and the buyer");
    } else {
      setFeedback("Thank you for your feedback !");
      setTimeout(() => {
        setFeedback("");
        router.back();
      }, 3000);
      onFinish();
    }
  };

  const changeColor = () => {
    if (review.length >= limitCharacters) {
      return { color: "red" };
    }
  };

  return (
    <div className="reviewContainer">
      <div className="formBox">
        <div className="submitReviewTitle">
          <h1>Review</h1>
          <div className="reviewNote">
            Please leave a review for {" "}
            <span
              className="reviewJobModel"
              onMouseOver={toggleContractDetails}
              onMouseLeave={toggleContractDetails}
            >
              {contractTitle}.
              {isModalOpen && (
                <>
                  <div className="modal">
                    <div className="modalContent">
                      <h3>{contractTitle}</h3>
                      {contractImage && contractImage[0] ? (
                        <Image
                          src={contractImage[0].stringValue}
                          width={250}
                          height={100}
                          alt="contractImage"
                          objectFit="contain"
                        />
                      ) : null}
                      <p>Price : {contractPrice}</p>
                      <p>
                        Seller :{" "}
                        {contractSeller?.slice(0, 9) + "..." + contractSeller?.slice(-4)}
                      </p>
                    </div>
                    <div className="polygon"></div>
                  </div>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="starRatting">
          <h2>Rate the buyer</h2>
          <div className="rating">
            {stars.map((_, index) => {
              return (
                <FaStar
                  key={index}
                  size={24}
                  color={index < (hoverValue || rating) ? "#545454" : "#b0b4c1"}
                  onClick={() => handleClick(index + 1)}
                  onMouseOver={() => handleMouseOver(index + 1)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    marginRight: 10,
                    cursor: "pointer",
                  }}
                />
              );
            })}
            <span
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
              }}
            >
              {rating === 0 ? null : rating}
            </span>
          </div>
        </div>

        <div className="reviewComment">
          <h2>Comments</h2>

          <div className="commentArea">
            <textarea
              className="formControl textarea"
              value={review}
              maxLength="1200"
              onChange={(e) => setReview(e.target.value)}
              rows="5"
              placeholder="Type your review here..."
            />

            <div className="textareaNote" style={changeColor()}>
              {review.length} / {limitCharacters} Characters
            </div>

            <div className="privateCheckbox">
              <input
                type="checkbox"
                value={privateReview}
                onChange={(e) => setPrivateReview(e.target.checked)}
              />
              <div className="checkboxLabel">
                <span>Make a review private </span>
                <AiOutlineInfoCircle
                  onClick={togglePrivateInfo}
                  className="info__icon"
                  size={18}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                  }}
                />
                {isOpen && (
                  <div className="infoTooltip">
                    <p>If you make a review private, no one will see it.</p>
                    <div className="polygon"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="submitButton mt-20">
        <span>{feedback}</span>
        <button
          type="submit"
          className="button dark"
          onClick={handleSubmit}
          disabled={!review.trim()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SubmitReview;
