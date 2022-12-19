import Link from "next/link";
import { Fragment, useState } from "react";
import { FaStar } from "react-icons/fa";
import JobsImages from "./jobs-images";
import Button from "../ui/Button";
import ModalUi from "../ui/ModalUi";


function JobItem(props) {
  const title = props.item.name.Title;
  const images = props.item.name.ImageLinks;
  const description = props.item.name.Description;
  const price = props.item.name.Price;
  const currency = props.item.name.CurrencyTicker;
  const jobLink = props.item.name.JobId;

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

  const [modelData, setModelData] = useState({
    show: false,
    type: "alert",
    status: "Error",
    message: "",
  });

  function closeModelDataHandler() {
    setModelData({
      show: false,
    });
  }


  return (
    <Fragment>
      <div className="gigBlock">
        <div className="blockAction">
          <Button classes="button dark small"
            link={`/edit-job/${jobLink}`}
            >
            Edit Job
          </Button>
        </div>
        <Link href={`/job/${jobLink}`}>
          <div className="blockInner">
            <div className="blockThumb">
              {images?.length > 0 ? (
                <div className="imageGaller">
                  <JobsImages images={images} alt={title} />
                </div>
              ) : (
                <div className="placeholderImage"></div>
              )}
            </div>
            <div className="blockContent">
              <div className="blockDetails">
                <div className="blockTitle">{title}</div>
                <div className="blockDescription">
                  {truncate(description, 130)}
                </div>
              </div>
              <div className="blockFooter">
                <div className="gigRateReview">
                  <div className="gigStars">
                    <div className="startRattings">
                      <i>
                        {averageRating === 0 ? (
                          <FaStar size={16} className="disableStar" />
                        ) : (
                          <FaStar size={16} className="activeStar" />
                        )}
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

              {/*
            <div className="blockFooter">
              <div className="gigRateReview">
                <div className="gigStars">
                  <div className="startRattings">
                    <i className="fill">
                      <StarIc />
                    </i>
                  </div>
                  <div className="rattingCounts">4.5</div>
                </div>

                <div className="gigTotalReviews">(15)</div>
              </div>
              <div className="gigPrice">${price}</div>
              {/* <Link href={`/job/${jobLink}`}>View Details</Link>
            </div> 
            */}
            </div>
          </div>
        </Link>
      </div>

      <ModalUi content={modelData} closeModelFn={closeModelDataHandler} />
    </Fragment>
  );
}

export default JobItem;
