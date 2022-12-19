import { FaStar } from 'react-icons/fa'
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai'
import Link from 'next/link';
import Moment from "react-moment";
import makeBlockie from "ethereum-blockies-base64";
import Image from "next/image";
import { useState } from 'react'
import axios from 'axios';
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";

const UserReview = (props) => {
  const { review, currentAccount } = props;

  const userWallet = currentAccount.toLowerCase(); //'0x2c5f037879eD7E0AC328531987b04a15620E8BFE'.toLowerCase();
  const rating = review.name.Rating;
  const content = review.name.Review;
  const date = review.name.Created;

  const buyerName = review.name.BuyerWallet
  ? review.name.BuyerWallet.slice(0, 5) + "..." + review.name.BuyerWallet.slice(-4)
  : "";

  let LikesBy = review.name.LikesBy!==undefined&&review.name.LikesBy!==[''] ? review.name.LikesBy : [];
  let DislikesBy = review.name.DislikesBy!==undefined&&review.name.DislikesBy!==[''] ? review.name.DislikesBy : [];
  const [liked, setLiked] = useState(LikesBy.indexOf(userWallet)>=0);
  const [disliked, setDisliked] = useState(DislikesBy.indexOf(userWallet)>=0);
  const [likes, setLikes] = useState((review.name.Likes && review.name.Likes!==0) ? review.name.Likes : 0);
  const [dislikes, setDislikes] = useState( (review.name.Dislikes && review.name.Dislikes!==0) ? review.name.Dislikes : 0);

  let num = 5;
  const stars = Array(num).fill(0)


  
  const updateUserReviewLikeDislike = async (contractID, reviewStatus, action) => {

    const res = await CheckAndCreateAlias();
    if(res == false){return false;} 


    var formData = new FormData();

    const signedMessage_userWallet = await SignMessageWithAlias(userWallet);
    formData.append("address", signedMessage_userWallet.address);
    formData.append("message_userWallet", signedMessage_userWallet.message);
    formData.append("signature_userWallet", signedMessage_userWallet.signature);

    const signedMessage_contractID = await SignMessageWithAlias(contractID);
    formData.append("message_contractID", signedMessage_contractID.message);
    formData.append("signature_contractID", signedMessage_contractID.signature);

    const signedMessage_reviewStatus = await SignMessageWithAlias(reviewStatus);
    formData.append("message_reviewStatus", signedMessage_reviewStatus.message);
    formData.append("signature_reviewStatus", signedMessage_reviewStatus.signature);

    const signedMessage_action = await SignMessageWithAlias(action);
    formData.append("message_action", signedMessage_action.message);
    formData.append("signature_action", signedMessage_action.signature);

    const signedMessage_toSeller = await SignMessageWithAlias("true");
    formData.append("message_toSeller", signedMessage_toSeller.message);
    formData.append("signature_toSeller", signedMessage_toSeller.signature);


    axios.post("/api/V2-Firebase/post/updateReviewLikeDislike", formData)  
    .then((res) => {
      if (res.status == 201 ) console.log("review successfully voted on!");
    })
    .catch((err) => {
      console.log("voting on a review failed...");
      console.log(err);
    });

  };

  const likeReview = (contractID) => {
    liked = isNaN(liked)||liked==''?0:liked;
    disliked = isNaN(disliked)||disliked==''?0:disliked;
    if (liked) {
      setLiked(false);
      setLikes(likes-1);

      updateUserReviewLikeDislike(contractID, 'like', 'deselect');

    } else {
      setLiked(true);
      setLikes(likes + 1);
      if (disliked) {
        setDisliked(false);
        setDislikes(dislikes - 1);
      }

      updateUserReviewLikeDislike(contractID, 'like', 'select');
    }
  }

  const dislikeReview = (contractID) => {
    liked = isNaN(liked)||liked==''?0:liked;
    disliked = isNaN(disliked)||disliked==''?0:disliked;
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);

      updateUserReviewLikeDislike(contractID, 'dislike', 'deselect');

    } else {
      setDisliked(true);
      setDislikes(dislikes + 1);
      if (liked) {
        setLiked(false);
        setLikes(likes - 1);
      }

      updateUserReviewLikeDislike(contractID, 'dislike', 'select');
    }
  }



  return (
    <div className='reviewContainer'>
      <div className='reviewContainerHeader'>
        <div className='reviewContainerLeft'>
          <Image
            src={makeBlockie(review?.name.BuyerWallet)}
            style={{
              borderRadius: '50%',
            }}
            width={50}
            height={50}
            alt={review?.name.BuyerWallet}
          />
          <Link href={`/user/${review?.name.BuyerWallet}`}>
            <h3 style={{ cursor: 'pointer' }}>
              {buyerName}
            </h3>
          </Link>
          <div className='ratingStars'>
            {stars.map((_, index) => {
              return (
                <FaStar
                  key={index}
                  size={16}
                  className={
                    index < `${rating}`
                      ? "activeStar"
                      : "disableStar"
                  }
                  style={{ marginRight: 5 }}
                />
              )
            })}
            <h3>{rating}</h3>
          </div>
        </div>
        <div className='reviewContainerRight'>
          <p>
            published <Moment fromNow>{date}</Moment>
          </p>
        </div>
      </div>

      <div className='reviewContent'>
        <p>{content}</p>
      </div>


   
    {/* 
      THE LIKE/DISLIKE MECHANIC
*/}
      <div className='reviewQuestion'>
        <p>Was this review helpful?</p>
        <div className='reviewQuestionButtons'>
          {
            liked ? disliked ? (
              <>
                <AiFillLike
                  size={20}
                  className='starRattingIcon selected'
                  style={{ marginRight: 5 }}
                  />
                <p>{likes}</p>
              </>
            ) : (
              <>
                <AiFillLike
                  size={20}
                  className='starRattingIcon selected'
                  style={{ marginRight: 5, cursor: 'pointer' }}
                  onClick={() => likeReview(review?.name.contractId)}
                  />
                <p>{likes}</p>
              </>
            ) : disliked ? (
              <>
                <AiOutlineLike
                  size={20}
                  className='starRattingIcon'
                  style={{ marginRight: 5 }}
                />
                <p>{likes}</p>
              </>
            ) : (
              <>
                <AiOutlineLike
                  size={20}
                  className='starRattingIcon'
                  style={{ marginRight: 5, cursor: 'pointer' }}
                  onClick={() => likeReview(review?.name.contractId)}
                />
                <p>{likes}</p>
              </>
            )
          }
          {
            disliked ? liked ? (
              <>
                <AiFillDislike
                  size={20}
                  className='starRattingIcon selected'
                  style={{ marginRight: 5 }}
                />
                <p>{dislikes}</p>
              </>
            ) : (
              <>
                <AiFillDislike
                  size={20}
                  className='starRattingIcon selected'
                  style={{ marginRight: 5, cursor: 'pointer' }}
                  onClick={() => dislikeReview(review?.name.contractId)}
                />
                <p>{dislikes}</p>
              </>
            ) : liked ? (
              <>

                <AiOutlineDislike 
                  size={20}
                  className='starRattingIcon'
                  style={{ marginRight: 5 }}
                />
                <p>{dislikes}</p>
              </>
            ) : (
              <>
                <AiOutlineDislike
                  size={20}
                  className='starRattingIcon'
                  style={{ marginRight: 5, cursor: 'pointer' }}
                  onClick={() => dislikeReview(review?.name.contractId)}
                />
                <p>{dislikes}</p>
              </>
            )
          }
        </div>
      </div>
 


    </div>
  )
}

export default UserReview