import Image from 'next/image';
import makeBlockie from 'ethereum-blockies-base64';
import { FaStar } from "react-icons/fa";
import Link from 'next/link';

const UserItem = (props) => {
  const userAddress = props.item.name.userAddress;
  const userHeadline = props.item.name.userHeadline;
  const userDescription = props.item.name.userDescription;
  const userReviews = props.item.reviews;
  const userSkills = props.item.name.userSkills;

  let numberOfStars = 5;
  const stars = Array(numberOfStars).fill(0);

  const ratings = userReviews?.map((review) => {
    return review.name.Rating;
  });

  const fiveStar = ratings?.filter((rating) => {
    return rating === "5";
  }).length;

  const fourStar = ratings?.filter((rating) => {
    return rating === "4";
  }).length;

  const threeStar = ratings?.filter((rating) => {
    return rating === "3";
  }).length;

  const twoStar = ratings?.filter((rating) => {
    return rating === "2";
  }).length;

  const oneStar = ratings?.filter((rating) => {
    return rating === "1";
  }).length;

  const fiveStarRating = (fiveStar / ratings?.length) * 5;
  const fourStarRating = (fourStar / ratings?.length) * 4;
  const threeStarRating = (threeStar / ratings?.length) * 3;
  const twoStarRating = (twoStar / ratings?.length) * 2;
  const oneStarRating = (oneStar / ratings?.length) * 1;


  const totalRating = (
    fiveStarRating +
    fourStarRating +
    threeStarRating +
    twoStarRating +
    oneStarRating
  ).toFixed(1);

  const truncateAddress =  userAddress
  ? userAddress?.slice(0, 5) + "..." + userAddress?.slice(-4)
  : "";

  const userSkillsArray = userSkills?.split(",");

  return (
    <div className='aboutContainer'>
      <div className='aboutSeller'>
        <div className='aboutSeller__header'>
          <div className='aboutSeller__header--left'>
            <div className="aboutSeller__header__image">
              <Image
                src={makeBlockie(userAddress)}
                width="100"
                height="100"
                alt={userAddress}
                style={{ borderRadius: "50%" }}
              />
            </div>
            <div className='aboutSeller__header__details'>
              <h4>{truncateAddress}</h4>
              <h4>{userHeadline}</h4>
            </div>
          </div>
          <div className='aboutSeller__header--right'>
            <Link href={`/user/${userAddress}`}>
              <button>See profile</button>
            </Link>
          </div>
        </div>

        <div className='aboutSeller__description'>
          <p>
            { userDescription === undefined || " " ? "No description provided" : userDescription?.slice(0, 200) + (userDescription?.length > 200 ? "..." : "")}
          </p>
        </div>

        <div className='aboutSeller__skills'>
          {
            userSkillsArray?.map((skill, index) => {
              return (
                <span key={index}>{skill}</span>
              )
            })
          }
        </div>

        <div className='aboutSeller_stats'>
          <div className='aboutSeller__reviews'>
            <div className="starsRatings">
              {stars.map((_, index) => {
                return (
                  <FaStar
                    key={index}
                    size={18}
                    className={index < (Math.round(totalRating)) ? "activeStar" : "disableStar"}
                    style={{ marginRight: 5 }}
                  />
                );
              })}
            </div>
            <div className="ratingCounts">
              {totalRating === "NaN" ? "No Ratings" : totalRating}
            </div>
            ({ratings?.length})
          </div>

          {/* <span>23 Orders</span> */}
          {/* <span>$600k+ earned</span>
          <span>95% Job Success</span>
          <span>Top Rated</span> */}
        </div>
      </div>
    </div>
  )
}

export default UserItem