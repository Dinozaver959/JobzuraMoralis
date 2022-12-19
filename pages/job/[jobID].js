import React, { Fragment, useState } from "react";
import {
  CreateEscrow_Moralis,
  GetWallet_NonMoralis,
  PayzuraCentealizedArbiter,
} from "../../JS/local_web3_Moralis.js";
import { sha256 } from "js-sha256";
import { useRouter } from "next/router.js";
import { useQuery } from "react-query";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import axios from "axios";
import Image from "next/image";
import makeBlockie from "ethereum-blockies-base64";
import AboutSeller from "../../components/job-details/AboutSeller.js";
import MessageIc from "../../components/icons/Message";
import { FaStar } from "react-icons/fa";
import JobDetailsImages from "../../components/job-details/JobDetailsImages.js";
import Link from "next/link.js";

async function GetUserReferralChain(userWallet) {
  //const data = await fetch(
  //  `../api/get/ReferralChain3?userWallet=${userWallet}`
  //).then((res) => res.json()); //.then((json) => setData(json)); // uncomment this line to see the data in the console
  //return data;

  return ["0x1591C783EfB2Bf91b348B6b31F2B04De1442836c"];
}

function JobDetails() {
  const router = useRouter();
  const jobID = router.query.jobID;

  const [tabIndex, setTabIndex] = useState(0);

  const fetchJobDetails = async (jobID) => {
    const jobDetails = await axios.get(`/api/V2-Firebase/get/Job?JobID=${jobID}`);
    return jobDetails.data;
  };

  const { data, isLoading } = useQuery(["JobDetails", jobID], () =>
    fetchJobDetails(jobID)
  );

  const jobDetails = data;

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const jobSellerAddress = jobDetails[0]?.name.SellerWallet.stringValue;
  const jobTitle = jobDetails[0]?.name.Title.stringValue;
  const jobImage = jobDetails[0]?.name.ImageLinks?.arrayValue.values;
  const jobDescription = jobDetails[0]?.name.Description.stringValue;
  
  const jobPriceBasic = jobDetails[0]?.name.Price.stringValue;
  const jobCurrencyBasic = jobDetails[0].name.CurrencyTicker.stringValue;
  const jobTimeToDeliverBasic = jobDetails[0]?.name.TimeToDeliver.stringValue;
  const jobCustomTimeToDeliverBasic = jobDetails[0]?.name.CustomTimeToDeliver.stringValue;
  const jobDescriptionBasic = jobDetails[0]?.name.DescriptionBasic.stringValue;

  const jobPriceStandard = jobDetails[0]?.name.PriceStandard.stringValue;
  const jobCurrencyStandard = jobDetails[0].name.CurrencyTickerStandard.stringValue;
  const jobTimeToDeliverStandard = jobDetails[0]?.name.TimeToDeliverStandard.stringValue;
  const jobCustomTimeToDeliverStandard = jobDetails[0]?.name.CustomTimeToDeliverStandard.stringValue;
  const jobDescriptionStandard = jobDetails[0]?.name.DescriptionStandard.stringValue;

  const jobPricePremium = jobDetails[0]?.name.PricePremium.stringValue;
  const jobCurrencyPremium = jobDetails[0].name.CurrencyTickerPremium.stringValue;
  const jobTimeToDeliverPremium = jobDetails[0]?.name.TimeToDeliverPremium.stringValue;
  const jobCustomTimeToDeliverPremium = jobDetails[0]?.name.CustomTimeToDeliverPremium.stringValue;
  const jobDescriptionPremium = jobDetails[0]?.name.DescriptionPremium.stringValue;
  
  const jobSellerAddressTruncated = jobSellerAddress?.substring(0, 6) + "..." + jobSellerAddress?.substring(36, 42);

  const sumOfRatings = jobDetails[0]?.name?.RatingsSum.integerValue;
  const RatingsCounter = jobDetails[0]?.name?.RatingsCounter.integerValue;

  var averageRating = 0;
  if(sumOfRatings && sumOfRatings != 0 && RatingsCounter && RatingsCounter != 0){
    averageRating = sumOfRatings / RatingsCounter;
  }

  // round to 1 decimal
  averageRating = Math.round(averageRating * 10) / 10; 

  let numberOfStars = 5;
  const stars = Array(numberOfStars).fill(0);


  if (data) {
    return (
      <Fragment>
        <div className="wrapper jobDetailsWpr">
          {/* left side */}
          <div className="jobDetailsMain">
            <h1 className="jobDetailsTitle">{jobTitle}</h1>
            <div className="jobDetailsHeader">
              <span className="profilePic">
                {jobDetails[0] ? (
                  <Image
                  src={makeBlockie(jobSellerAddress)}
                  width="50%"
                  height="50%"
                  alt={jobSellerAddress}
                  style={{ borderRadius: "50%" }}
                />
                ) : null}
              </span>

              <h3 className="ml-10">{jobSellerAddressTruncated}</h3>
              
              <div className="jobDetailsHeader--right">
                <div className="starsRatings">
                  {stars.map((_, index) => {
                    return (
                      <FaStar
                        key={index}
                        size={18}
                        className={index < (Math.round(averageRating)) ? "activeStar" : "disableStar"}
                        style={{ marginRight: 5 }}
                      />
                    );
                  })}
                </div>
                <h4 className="ratingCounts">
                  {RatingsCounter === "NaN" ? "No Ratings" : averageRating}(
                  {RatingsCounter})
                </h4>
              </div>
            </div>

            <div className="jobDetailsDescription">
              <div className="jobDetailsDescriptionImage">
                {jobImage && jobImage.length > 0 ? (
                  <JobDetailsImages images={jobImage} alt={jobTitle} />
                ) : (
                  <div className="placeholderImage"></div>
                )}
              </div>

              <div className="jobDetailsDescriptionText">
                <p>{jobDescription}</p>
              </div>

              <div className="jobDetailsDescriptionAbout">
                <h2>About the seller</h2>
                <AboutSeller
                  jobSellerAddress={jobSellerAddress}
                  jobDescription={jobDescription}
                />
              </div>
            </div>
          </div>

          {/* right side */}
          <div className="buySection">
            <Tabs className="reactTabsMain buySectionContainer" selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
              <TabList className="tabsList">
                <Tab className="tabListItem" selectedClassName="active">Basic</Tab>
                {/* <Tab className="tabListItem" selectedClassName="active">Standard</Tab> */}
                {jobPriceStandard ? <Tab className="tabListItem" selectedClassName="active">Standard</Tab> : <Tab className="tabListItem" disabled={true} disabledClassName="disabled">Standard</Tab>}
                {/* <Tab className="tabListItem" selectedClassName="active">Premium</Tab> */}
                {jobPricePremium ? <Tab className="tabListItem" selectedClassName="active">Premium</Tab> : <Tab className="tabListItem" disabled={true} disabledClassName="disabled">Premium</Tab>}
              </TabList>

              <TabPanel className="tabsContainer" selectedClassName="selected">
                <h1>{jobPriceBasic} {jobCurrencyBasic}</h1>
                <h3>{jobTimeToDeliverBasic!=='custom' ? jobTimeToDeliverBasic : jobCustomTimeToDeliverBasic} Day(s) Delivery</h3>
                <p>{jobDescriptionBasic}</p>
                <div className="actionButton">
                  <button
                    className="button dark"
                    type="submit"
                    onClick={async () =>
                      CreateEscrow_Moralis(
                        jobCurrencyBasic,
                        true, // buyer initialized the contract
                        (await GetWallet_NonMoralis())[0],
                        jobPriceBasic, // also depends on basic, standard, premium
                        "ETH", // expected values: `ETH`, `USDC` - just means the native currency and not ERC20 .... needs better naming for sure
                        await GetUserReferralChain((await GetWallet_NonMoralis())[0]), // referrerAddress
                        (jobTimeToDeliverBasic!=='custom') ? jobTimeToDeliverBasic : jobCustomTimeToDeliverBasic, // 0 for testing only, real value more like:  24 * 7, // the value should be in hours - take 7 days for now, it should be read from the job (also depends on basic, standard, premium)
                        sha256(jobDescriptionBasic),
                        Math.floor(Date.now() / 1000 + 365 * 24 * 60 * 60), // make it valid far in the future (e.g. 1 y or something like this...)
                        jobSellerAddress, // get the seller wallet and put it in array
                        PayzuraCentealizedArbiter // Payzura centralized wallet for now
                      )
                      .catch((error) => {
                        console.error(error);
                        console.log("create offer error code: " + error.code);
                        console.log(
                          "create offer error message: " + error.message
                        );
                        if (error.data && error.data.message) {
                          console.log(error.data.message);
                        } else {
                          console.log(error.message);
                        }
                        process.exitCode = 1;
                      })
                    }
                  >
                    <span>Continue ({jobPriceBasic} {jobCurrencyBasic})</span>
                  </button>
                </div>
              </TabPanel>
              {jobPriceStandard && <TabPanel className="tabsContainer" selectedClassName="selected">
                <h1>{jobPriceStandard} {jobCurrencyStandard}</h1>
                <h3>{jobTimeToDeliverStandard!=='custom' ? jobTimeToDeliverStandard : jobCustomTimeToDeliverStandard} Day(s) Delivery</h3>
                <p>{jobDescriptionStandard}</p>
                <div className="actionButton">
                  <button
                    className="button dark"
                    type="submit"
                    onClick={async () =>
                      CreateEscrow_Moralis(
                        jobCurrencyStandard,
                        true, // buyer initialized the contract
                        (await GetWallet_NonMoralis())[0],
                        jobPriceStandard, // also depends on basic, standard, premium
                        "ETH", // expected values: `ETH`, `USDC` - just means the native currency and not ERC20 .... needs better naming for sure
                        await GetUserReferralChain((await GetWallet_NonMoralis())[0]), // referrerAddress
                        (jobTimeToDeliverStandard!=='custom') ? jobTimeToDeliverStandard : jobCustomTimeToDeliverStandard, // 0 for testing only, real value more like:  24 * 7, // the value should be in hours - take 7 days for now, it should be read from the job (also depends on basic, standard, premium)
                        sha256(jobDescriptionStandard),
                        Math.floor(Date.now() / 1000 + 365 * 24 * 60 * 60), // make it valid far in the future (e.g. 1 y or something like this...)
                        jobSellerAddress, // get the seller wallet and put it in array
                        PayzuraCentealizedArbiter // Payzura centralized wallet for now
                      )
                      .catch((error) => {
                        console.error(error);
                        console.log("create offer error code: " + error.code);
                        console.log(
                          "create offer error message: " + error.message
                        );
                        if (error.data && error.data.message) {
                          console.log(error.data.message);
                        } else {
                          console.log(error.message);
                        }
                        process.exitCode = 1;
                      })
                    }
                  >
                    <span>Continue ({jobPriceStandard} {jobCurrencyStandard})</span>
                  </button>
                </div>
              </TabPanel>}
              {jobPricePremium && <TabPanel className="tabsContainer" selectedClassName="selected">
                <h1>{jobPricePremium} {jobCurrencyPremium}</h1>
                <h3>{jobTimeToDeliverPremium!=='custom' ? jobTimeToDeliverPremium : jobCustomTimeToDeliverPremium} Day(s) Delivery</h3>
                <p>{jobDescriptionPremium}</p>
                <div className="actionButton">
                  <button
                    className="button dark"
                    type="submit"
                    onClick={async () =>
                      CreateEscrow_Moralis(
                        jobCurrencyPremium,
                        true, // buyer initialized the contract
                        (await GetWallet_NonMoralis())[0],
                        jobPricePremium, // also depends on basic, standard, premium
                        "ETH", // expected values: `ETH`, `USDC` - just means the native currency and not ERC20 .... needs better naming for sure
                        await GetUserReferralChain((await GetWallet_NonMoralis())[0]), // referrerAddress
                        (jobTimeToDeliverPremium!=='custom') ? jobTimeToDeliverPremium : jobCustomTimeToDeliverPremium, // 0 for testing only, real value more like:  24 * 7, // the value should be in hours - take 7 days for now, it should be read from the job (also depends on basic, standard, premium)
                        sha256(jobDescriptionPremium),
                        Math.floor(Date.now() / 1000 + 365 * 24 * 60 * 60), // make it valid far in the future (e.g. 1 y or something like this...)
                        jobSellerAddress, // get the seller wallet and put it in array
                        PayzuraCentealizedArbiter // Payzura centralized wallet for now
                      )
                      .catch((error) => {
                        console.error(error);
                        console.log("create offer error code: " + error.code);
                        console.log(
                          "create offer error message: " + error.message
                        );
                        if (error.data && error.data.message) {
                          console.log(error.data.message);
                        } else {
                          console.log(error.message);
                        }
                        process.exitCode = 1;
                      })
                    }
                  >
                    <span>Continue ({jobPricePremium} {jobCurrencyPremium})</span>
                  </button>
                </div>
              </TabPanel>}
            </Tabs>

            <div className="actionButton--bottom">
              <Link href={`/inbox/${jobSellerAddress}`}>
                <button className="button withIcon">
                  <i>
                    <MessageIc />
                  </i>
                  <span>Message Seller</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default JobDetails;
