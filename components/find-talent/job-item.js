import Link from "next/link";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";

function JobItem(props) {
  const title = props.item.name?.Title;
  const images = props.item.name?.ImageLinks;
  const description = props.item.name?.Description;
  const price = props.item.name?.Price;
  const currency = props.item.name?.CurrencyTicker;  
  const id = props.item.name?.JobId;
  const seller = props.item.name?.Seller;
  
  const truncateSeller =  seller 
  ? seller.slice(0, 5) + "..." + seller.slice(-4)
  : "";

  const sumOfRatings = props.item.name.RatingsSum;
  const RatingsCounter = props.item.name.RatingsCounter;
  var averageRating = 0;
  if(sumOfRatings && sumOfRatings != 0 && RatingsCounter && RatingsCounter != 0){
    averageRating = sumOfRatings / RatingsCounter;
  }

  // round to 1 decimal
  averageRating = Math.round(averageRating * 10) / 10; 

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="gigBlock">
      <Link href={`/job/${id}`}>
        <div className="blockInner">
          <div className="blockThumb">
            {images?.length > 0 ? (
              <Image
                src={images[0]}
                alt={title}
                width={200}
                height={173}
                layout="responsive"
              />
            ) : (
              <div className="placeholderImage"></div>
            )}
          </div>
          <div className="blockContent">
            <div className="blockDetails">
              <div className="blockSeller">
                <div className="sellerImage">
                  {seller ? (
                    <Image
                      src={makeBlockie(seller)}
                      alt={seller}
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <div className="placeholderImage"></div>
                  )}
                </div>
                <div className="sellerName">
                  <p>{truncateSeller}</p>
                </div>
              </div>
              <div className="blockTitle">{title}</div>
              <div className="blockDescription">
                {truncate(description, 70 )}
              </div>
            </div>
            <div className="blockFooter">
              <div className="gigRateReview">
                <div className="gigStars">
                  <div className="startRattings">
                    <i>
                      {
                        averageRating === 0 ? (
                          <FaStar size={16} className="disableStar" />
                        ) : (
                          <FaStar size={16} className="activeStar" />
                        )
                      }
                    </i>
                  </div>
                  <div className="rattingCounts">
                    {averageRating === 0 ? "0" : averageRating.toFixed(1)}
                  </div>
                </div>
                <div className="gigTotalReviews">
                  ({RatingsCounter === 0 ? "0 Review" : RatingsCounter})
                </div>
              </div>
              <div className="gigPrice">{price} {currency}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default JobItem;