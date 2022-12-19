import { Fragment, useState, useEffect } from 'react';
import { Input, Form, Upload } from 'antd';
import axios from "axios";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";
import { CheckAndCreateAlias } from "../../JS/auth/AliasAuthentication";
import Select from "react-dropdown-select";

// import 'antd/dist/antd.css';

// import JobStep1 from "./create-job-step1";
// import JobStep2 from "./create-job-step2";
// import JobStep3 from "./create-job-step3";
import JobStep4 from "./create-job-step4";

import { skills } from './../../data/skills';

import Button from "./../ui/Button";
// import PlaceholderIc from "./../icons/Placeholder";
import PlusIc from "./../icons/Plus";

function JobForm(props) {
  const { jobDetails, seller } = props;
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSent, setFormSent] = useState(false);

  const createJobSteps = [
    {
      count: 1,
      label: "Overview",
    },
    {
      count: 2,
      label: "Pricing",
    },
    {
      count: 3,
      label: "Gallery",
    },
    {
      count: 4,
      label: "Publish",
    }
  ]
  const priceCurrencyOptions = [
    {
      label: "ETH",
      value: "ETH",
      disabled: true
    },
    {
      label: "BNB",
      value: "BNB",
    },
    {
      label: "MATIC",
      value: "MATIC",
    },
  ]
  const jobDeliveryOptions = [
    {
      label: "1 Day",
      value: "1",
    },
    {
      label: "3 Day",
      value: "3",
    },
    {
      label: "7 Day",
      value: "7",
    },
    {
      label: "14 Day",
      value: "14",
    },
    {
      label: "Set Custom",
      value: "custom",
    },
  ]

  const [errorStep1, setErrorStep1] = useState({});
  const [errorStep2, setErrorStep2] = useState({});


  //========== step 1 ==========//
  const [title, setTitle] = useState(jobDetails ? jobDetails[0]?.name.Title.stringValue : '');
  const [jobCategory, setJobCategory] = useState(jobDetails ? jobDetails[0]?.name.Category.stringValue : '');
  const [jobSkills, setJobSkills] = useState(jobDetails ? jobDetails[0]?.name.Skills.stringValue : '');
  const [jobDescription, setJobDescription] = useState(jobDetails ? jobDetails[0]?.name.Description.stringValue : '');
  const [imageLinks, setImageLinks] = useState(jobDetails ? jobDetails[0]?.name.ImageLinks.arrayValue.values : []);
  const jobId = jobDetails ? jobDetails[0]?.name.JobId.stringValue : "";

  const jobAllImages = [...new Set(imageLinks?.map(item => item.stringValue))]
  const jobImagesOptions = jobAllImages.map((image, idx) => ({
    uid: (idx + 1),
    // name: idx+'img.png',
    status: 'done',
    url: image,
  }));

  const jobAllCategories = [...new Set(skills.map(item => item.category))]
  const jobCategoryOptions = jobAllCategories.map((category) => ({
    label: category,
    value: category
  }));

  const filterSubCategories = skills.filter((skills) => {
    return skills.category === jobCategory;
  });
  const jobAllSubCategories = [...new Set(filterSubCategories.map(item => item.skill))]
  const jobSkillsOptions = jobAllSubCategories.map((skills) => ({
    label: skills,
    value: skills
  }));

  function handlePriceCurrency(value) {
    setJobPriceCurrencyBasic(value);
    setJobPriceCurrencyStandard(value);
    setJobPriceCurrencyPremium(value);
  }

  //========== step 2 ==========//
  // Basic Package
  const [jobDescriptionBasic, setJobDescriptionBasic] = useState(jobDetails ? jobDetails[0]?.name.DescriptionBasic.stringValue : '');
  const [jobPriceCurrencyBasic, setJobPriceCurrencyBasic] = useState(jobDetails ? jobDetails[0]?.name.CurrencyTicker.stringValue : '');
  const [jobPriceBasic, setJobPriceBasic] = useState(jobDetails ? jobDetails[0]?.name.Price.stringValue : '');
  const [jobDeliveryTimeBasic, setJobDeliveryTimeBasic] = useState(jobDetails ? jobDetails[0]?.name.TimeToDeliver.stringValue : '');

  const [customBasicDeliveryTime, setCustomBasicDeliveryTime] = useState(jobDetails ? jobDetails[0]?.name.TimeToDeliver.stringValue==="custom" : false);
  const [customBasicDeliveryValue, setCustomBasicDeliveryValue] = useState(jobDetails ? jobDetails[0]?.name.CustomTimeToDeliver.stringValue : '');

  function handleCustomBasicDelivery(opt) {
    let selectedVal = opt[0] ? opt[0]['value'] : '';
    if (selectedVal === "custom") {
      setCustomBasicDeliveryTime(true);
    } else {
      setCustomBasicDeliveryTime(false);
    }
    setJobDeliveryTimeBasic(selectedVal);
  }

  // Standard Package
  const [jobDescriptionStandard, setJobDescriptionStandard] = useState(jobDetails ? jobDetails[0]?.name.DescriptionStandard.stringValue : '');
  const [jobPriceCurrencyStandard, setJobPriceCurrencyStandard] = useState(jobDetails ? jobDetails[0]?.name.CurrencyTickerStandard.stringValue : '');
  const [jobPriceStandard, setJobPriceStandard] = useState(jobDetails ? jobDetails[0]?.name.PriceStandard.stringValue : '');
  const [jobDeliveryTimeStandard, setJobDeliveryTimeStandard] = useState(jobDetails ? jobDetails[0]?.name.TimeToDeliverStandard.stringValue : '');

  const [customStandardDeliveryTime, setCustomStandardDeliveryTime] = useState(jobDetails ? jobDetails[0]?.name.TimeToDeliverStandard.stringValue==="custom" : false);
  const [customStandardDeliveryValue, setCustomStandardDeliveryValue] = useState(jobDetails ? jobDetails[0]?.name.CustomTimeToDeliverStandard.stringValue : '');

  const [isStandardVisible, setStandardVisible] = useState(jobDetails && jobDetails[0]?.name.DescriptionStandard.stringValue!='' ? true : false);

  function handleStandardPrice() {
    setStandardVisible(!isStandardVisible);

    if(isStandardVisible===true) {
      setJobDescriptionStandard("");
      setJobPriceCurrencyStandard("");
      setJobPriceStandard("");
      setJobDeliveryTimeStandard("");
      setCustomStandardDeliveryValue("");
    }
  }

  function handleCustomStandardDelivery(opt) {
    let selectedVal = opt[0] ? opt[0]['value'] : '';
    if (selectedVal === "custom") {
      setCustomStandardDeliveryTime(true);
    } else {
      setCustomStandardDeliveryTime(false);
    }
    setJobDeliveryTimeStandard(selectedVal);
  }

  // Premium Package
  const [jobDescriptionPremium, setJobDescriptionPremium] = useState(jobDetails ? jobDetails[0]?.name.DescriptionPremium.stringValue : '');
  const [jobPriceCurrencyPremium, setJobPriceCurrencyPremium] = useState(jobDetails ? jobDetails[0]?.name.CurrencyTickerPremium.stringValue : '');
  const [jobPricePremium, setJobPricePremium] = useState(jobDetails ? jobDetails[0]?.name.PricePremium.stringValue : '');
  const [jobDeliveryTimePremium, setJobDeliveryTimePremium] = useState(jobDetails ? jobDetails[0]?.name.TimeToDeliverPremium.stringValue : '');

  const [customPremiumDeliveryTime, setCustomPremiumDeliveryTime] = useState(jobDetails ? jobDetails[0]?.name.TimeToDeliverPremium.stringValue==="custom" : false);jobDeliveryTimePremium
  const [customPremiumDeliveryValue, setCustomPremiumDeliveryValue] = useState(jobDetails ? jobDetails[0]?.name.CustomTimeToDeliverPremium.stringValue : '');

  const [isPremiumVisible, setPremiumVisible] = useState(jobDetails && jobDetails[0]?.name.DescriptionPremium.stringValue!='' ? true : false);

  function handlePremiumPrice() {
    setPremiumVisible(!isPremiumVisible);

    if(isPremiumVisible===true) {
      setJobDescriptionPremium("");
      setJobPriceCurrencyPremium("");
      setJobPricePremium("");
      setJobDeliveryTimePremium("");
      setCustomPremiumDeliveryValue("");
    }
  }

  function handleCustomPremiumDelivery(opt) {
    let selectedVal = opt[0] ? opt[0]['value'] : '';
    if (selectedVal === "custom") {
      setCustomPremiumDeliveryTime(true);
    } else {
      setCustomPremiumDeliveryTime(false);
    }
    setJobDeliveryTimePremium(selectedVal);
  }



  //========== step 3 ==========//
  const [imageFiles, setImageFiles] = useState([]);

  function handleUploadChange({ fileList }) {
    console.log('fileList', fileList);
    setImageFiles(fileList);
  };


  const onFinish = async () => {
    // check if Alias is present in local storage, if not, create a new one
    const res = await CheckAndCreateAlias();
    if (res == false) { return false; }

    if (title == '') return true; // ?

    var formData = new FormData();

    const signedMessage_seller = await SignMessageWithAlias(seller);
    formData.append("address", signedMessage_seller.address);
    formData.append("message_seller", signedMessage_seller.message);
    formData.append("signature_seller", signedMessage_seller.signature);

    const signedMessage_jobId = await SignMessageWithAlias(jobId);
    formData.append("message_jobId", signedMessage_jobId.message);
    formData.append("signature_jobId", signedMessage_jobId.signature);

    const signedMessage_title = await SignMessageWithAlias(title);
    formData.append("message_title", signedMessage_title.message);
    formData.append("signature_title", signedMessage_title.signature);

    const signedMessage_description = await SignMessageWithAlias(jobDescription);
    formData.append("message_description", signedMessage_description.message);
    formData.append("signature_description", signedMessage_description.signature);

    // basic
    const signedMessage_descriptionBasic = await SignMessageWithAlias(jobDescriptionBasic);
    formData.append("message_descriptionBasic", signedMessage_descriptionBasic.message);
    formData.append("signature_descriptionBasic", signedMessage_descriptionBasic.signature);

    const signedMessage_currencyTicker = await SignMessageWithAlias(jobPriceCurrencyBasic);
    formData.append("message_currencyTicker", signedMessage_currencyTicker.message);
    formData.append("signature_currencyTicker", signedMessage_currencyTicker.signature);

    const signedMessage_price = await SignMessageWithAlias(jobPriceBasic);
    formData.append("message_price", signedMessage_price.message);
    formData.append("signature_price", signedMessage_price.signature);

    const signedMessage_timeToDeliver = await SignMessageWithAlias(jobDeliveryTimeBasic);
    formData.append("message_timeToDeliver", signedMessage_timeToDeliver.message);
    formData.append("signature_timeToDeliver", signedMessage_timeToDeliver.signature);

    const signedMessage_customTimeToDeliver = await SignMessageWithAlias(customBasicDeliveryValue);
    formData.append("message_customTimeToDeliver", signedMessage_customTimeToDeliver.message);
    formData.append("signature_customTimeToDeliver", signedMessage_customTimeToDeliver.signature);

    // standard
    const signedMessage_descriptionStandard = await SignMessageWithAlias(jobDescriptionStandard);
    formData.append("message_descriptionStandard", signedMessage_descriptionStandard.message);
    formData.append("signature_descriptionStandard", signedMessage_descriptionStandard.signature);

    const signedMessage_currencyTickerStandard = await SignMessageWithAlias(jobPriceCurrencyStandard);
    formData.append("message_currencyTickerStandard", signedMessage_currencyTickerStandard.message);
    formData.append("signature_currencyTickerStandard", signedMessage_currencyTickerStandard.signature);

    const signedMessage_priceStandard = await SignMessageWithAlias(jobPriceStandard);
    formData.append("message_priceStandard", signedMessage_priceStandard.message);
    formData.append("signature_priceStandard", signedMessage_priceStandard.signature);

    const signedMessage_timeToDeliverStandard = await SignMessageWithAlias(jobDeliveryTimeStandard);
    formData.append("message_timeToDeliverStandard", signedMessage_timeToDeliverStandard.message);
    formData.append("signature_timeToDeliverStandard", signedMessage_timeToDeliverStandard.signature);

    const signedMessage_customTimeToDeliverStandard = await SignMessageWithAlias(customStandardDeliveryValue);
    formData.append("message_customTimeToDeliverStandard", signedMessage_customTimeToDeliverStandard.message);
    formData.append("signature_customTimeToDeliverStandard", signedMessage_customTimeToDeliverStandard.signature);

    // premium
    const signedMessage_descriptionPremium = await SignMessageWithAlias(jobDescriptionPremium);
    formData.append("message_descriptionPremium", signedMessage_descriptionPremium.message);
    formData.append("signature_descriptionPremium", signedMessage_descriptionPremium.signature);

    const signedMessage_currencyTickerPremium = await SignMessageWithAlias(jobPriceCurrencyPremium);
    formData.append("message_currencyTickerPremium", signedMessage_currencyTickerPremium.message);
    formData.append("signature_currencyTickerPremium", signedMessage_currencyTickerPremium.signature);

    const signedMessage_pricePremium = await SignMessageWithAlias(jobPricePremium);
    formData.append("message_pricePremium", signedMessage_pricePremium.message);
    formData.append("signature_pricePremium", signedMessage_pricePremium.signature);

    const signedMessage_timeToDeliverPremium = await SignMessageWithAlias(jobDeliveryTimePremium);
    formData.append("message_timeToDeliverPremium", signedMessage_timeToDeliverPremium.message);
    formData.append("signature_timeToDeliverPremium", signedMessage_timeToDeliverPremium.signature);

    const signedMessage_customTimeToDeliverPremium = await SignMessageWithAlias(customPremiumDeliveryValue);
    formData.append("message_customTimeToDeliverPremium", signedMessage_customTimeToDeliverPremium.message);
    formData.append("signature_customTimeToDeliverPremium", signedMessage_customTimeToDeliverPremium.signature);


    const signedMessage_jobCategory = await SignMessageWithAlias(jobCategory);
    formData.append("message_jobCategory", signedMessage_jobCategory.message);
    formData.append("signature_jobCategory", signedMessage_jobCategory.signature);

    const signedMessage_jobSkills = await SignMessageWithAlias(jobSkills);
    formData.append("message_jobSkills", signedMessage_jobSkills.message);
    formData.append("signature_jobSkills", signedMessage_jobSkills.signature);

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append(`file${i}`, imageFiles[i].originFileObj);
    }

    axios.post("/api/V2-Firebase/post/createJob", formData)
      .then((res) => {
        if (res.status == 201) console.log("data successfully updated!");
      })
      .catch((err) => {
        console.log("data profile failed to update ...");
        console.log(err);
      });
  }


  useEffect(() => {
    if (previousStep == 3) {
      if (!formSent) // no idea why it wants to send it twice otherwise
      {
        onFinish();
        setFormSent(true);
      }
    } else if (currentStep == 4) {
      // send all 'steps' together in 1 go
    }
  }, [currentStep]);

  function validAndNextStep() {
    if(currentStep === 1){
      let errors = {};
      if(title === ''){ errors.title = 'Job title should not be empty.'; }
      if(jobCategory === ''){ errors.jobCategory = 'Job category should not be empty.'; }
      if(jobSkills === ''){ errors.jobSkills = 'Job skill should not be empty.'; }
      if(jobDescription === ''){ errors.jobDescription = 'Job description should not be empty.'; }
      
      setErrorStep1(errors);
      if(Object.keys(errors).length !== 0){
        return false;
      }
    }

    else if(currentStep === 2){
      let errors = {};
      if(jobDescriptionBasic === ''){ errors.jobDescriptionBasic = 'Description should not be empty.'; }
      if(jobPriceCurrencyBasic === ''){ errors.jobPriceCurrencyBasic = 'Please select currency.'; }
      if(jobPriceBasic === ''){ errors.jobPriceBasic = 'Please enter price.'; }
      if(jobDeliveryTimeBasic === ''){ errors.jobDeliveryTimeBasic = 'Select delivery time.'; }
      if(jobDeliveryTimeBasic === 'custom'){ if(customBasicDeliveryValue === ''){ errors.customBasicDeliveryValue = 'Enter delivery days.'; } }

      if(isStandardVisible) {
        if(jobDescriptionStandard === ''){ errors.jobDescriptionStandard = 'Description should not be empty.'; }
        if(jobPriceCurrencyStandard === ''){ errors.jobPriceCurrencyStandard = 'Please select currency.'; }
        if(jobPriceStandard === ''){ errors.jobPriceStandard = 'Please enter price.'; }
        if(jobDeliveryTimeStandard === ''){ errors.jobDeliveryTimeStandard = 'Select delivery time.'; }
        if(jobDeliveryTimeStandard === 'custom'){ if(customStandardDeliveryValue === ''){ errors.customStandardDeliveryValue = 'Enter delivery days.'; } }
      }
      
      if(isPremiumVisible) {
        if(jobDescriptionPremium === ''){ errors.jobDescriptionPremium = 'Description should not be empty.'; }
        if(jobPriceCurrencyPremium === ''){ errors.jobPriceCurrencyPremium = 'Please select currency.'; }
        if(jobPricePremium === ''){ errors.jobPricePremium = 'Please enter price.'; }
        if(jobDeliveryTimePremium === ''){ errors.jobDeliveryTimePremium = 'Select delivery time.'; }
        if(jobDeliveryTimePremium === 'custom'){ if(customPremiumDeliveryValue === ''){ errors.customPremiumDeliveryValue = 'Enter delivery days.'; } }
      }

      setErrorStep2(errors);
      if(Object.keys(errors).length !== 0){
        return false;
      }
    }
    setPreviousStep(currentStep);
    setCurrentStep(currentStep + 1);
  }

  function backStep() {
    setCurrentStep(currentStep - 1);
  }

  return (
    <Fragment>
      <div className="CreateJobSteps">
        <div className="createJobWrapper">
          <ul>
            {createJobSteps.map((step, index) =>
              <li key={index} className={currentStep > step.count ? "completedStep" : currentStep === step.count ? "currentStep" : ""}><i>{step.count}</i><span>{step.label}</span></li>
            )}
          </ul>
        </div>
      </div>
      <div className="createJobWrapper">
        <div className="createJobContainer">

          {currentStep === 1 &&
            // <JobStep1
            //   selectedJobTitle={jobDetails?jobDetails[0].name.Title:''}
            //   selectedJobCategory={jobDetails?jobDetails[0].name.Category:''}
            //   selectedJobSkills={jobDetails?jobDetails[0].name.Category:''}
            //   selectedJobDescription={jobDetails?jobDetails[0].name.Description:''}
            // />
            <div>
              <div className="formRow">
                <div className="formCol">
                  <h3>Job title</h3>
                  <p>As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours.</p>
                  <input
                    type="text"
                    value={title}
                    placeholder="Enter a title"
                    className="formControl"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errorStep1.title!='' && (
                    <div className="errorText mt-5">{errorStep1.title}</div>
                  )}
                </div>
              </div>

              <div className="formRow">
                <div className="formCol">
                  <h3>Category</h3>
                  <p>Choose the category and sub-category most suitable for your Gig.</p>
                  <Select
                    options={jobCategoryOptions}
                    values={[
                      jobCategoryOptions.find((opt) => opt.value === jobCategory) !== undefined ? jobCategoryOptions.find((opt) => opt.value === jobCategory) : ""
                    ]}
                    onChange={(opt) => setJobCategory(opt[0] ? opt[0]['value'] : '')}
                  />
                  {errorStep1.jobCategory!='' && (
                    <div className="errorText mt-5">{errorStep1.jobCategory}</div>
                  )}

                  <Select
                    className="mt-15"
                    options={jobSkillsOptions}
                    values={[
                      jobSkillsOptions.find((opt) => opt.value === jobSkills) !== undefined ? jobSkillsOptions.find((opt) => opt.value === jobSkills) : ""
                      //jobSkillsOptions.find((opt) => opt.value === jobSkills)
                    ]}
                    onChange={(opt) => setJobSkills(opt[0] ? opt[0]['value'] : '')}
                  //onChange={function(opt){return console.log("----------------",opt)}}
                  />
                  {errorStep1.jobSkills!='' && (
                    <div className="errorText mt-5">{errorStep1.jobSkills}</div>
                  )}
                </div>
              </div>

              <div className="formRow">
                <div className="formCol">
                  <h3>Job Details</h3>
                  <p>Briefly Describe Your Gig.</p>
                  <textarea
                    rows="8"
                    defaultValue={jobDescription}
                    placeholder=""
                    className="formControl textarea"
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  {errorStep1.jobDescription!='' && (
                    <div className="errorText mt-5">{errorStep1.jobDescription}</div>
                  )}
                </div>
              </div>
            </div>
          }

          {currentStep === 2 &&
            //   <JobStep2
            //   selectedJobCurrencyTicker={jobDetails?jobDetails[0].name.CurrencyTicker:''}
            //   selectedJobPrice={jobDetails?jobDetails[0].name.Price:''}
            //   selectedJobTimeToDeliver={jobDetails?jobDetails[0].name.TimeToDeliver:''}
            // />
            <div>
              <h2 className="stepHeader">Packages</h2>

              <div className="stepFormBlockMain">
                <div className="stepFormBlockHeader">
                  <h3>Basic</h3>
                </div>

                <div className="stepFormContainer">
                  <div className="formRow">
                    <div className="formCol">
                      <h3>Package Details</h3>
                      <p>Describe the details of your offering.</p>
                      <textarea
                        rows="5"
                        defaultValue={jobDescriptionBasic}
                        placeholder="Enter a describe"
                        className="formControl textarea"
                        onChange={(e) => setJobDescriptionBasic(e.target.value)}
                      />
                      {/* <input
                        type="text"
                        value={jobDescriptionBasic}
                        placeholder="Enter a describe"
                        className="formControl"
                        onChange={(e) => setJobDescriptionBasic(e.target.value)}
                      /> */}
                      {errorStep2.jobDescriptionBasic!='' && (
                        <div className="errorText mt-5">{errorStep2.jobDescriptionBasic}</div>
                      )}
                    </div>
                  </div>

                  <div className="formRow">
                    <div className="formCol">
                      <h3>Price</h3>
                      <div className="mergeControl">
                        <div>
                          <Select
                            options={priceCurrencyOptions}
                            values={[
                              priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyBasic) !== undefined ? priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyBasic) : ""
                              // priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyBasic)
                            ]}
                            onChange={(opt) => handlePriceCurrency(opt[0] ? opt[0]['value'] : '')}
                            className="jobCurrencyDropdown"
                          />
                          {errorStep2.jobPriceCurrencyBasic!='' && (
                            <div className="errorText mt-5">{errorStep2.jobPriceCurrencyBasic}</div>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            value={jobPriceBasic}
                            placeholder="Enter a price"
                            className="formControl"
                            onChange={(e) => setJobPriceBasic(e.target.value)}
                          />
                          {errorStep2.jobPriceBasic!='' && (
                            <div className="errorText mt-5">{errorStep2.jobPriceBasic}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="formCol">
                      <h3>Delivery time</h3>
                      <div className='deliveryTimeControls'>
                        <div>
                          <Select
                            options={jobDeliveryOptions}
                            values={[
                              jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTimeBasic) !== undefined ? jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTimeBasic) : ""
                              // jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTimeBasic)
                            ]}
                            onChange={(opt) => handleCustomBasicDelivery(opt)}
                          />
                          {errorStep2.jobDeliveryTimeBasic!='' && (
                            <div className="errorText mt-5">{errorStep2.jobDeliveryTimeBasic}</div>
                          )}
                        </div>
                        {customBasicDeliveryTime === true &&
                          <div className='deliveryTimeCustomSet'>
                            <input
                              type="number"
                              value={customBasicDeliveryValue}
                              placeholder="Days"
                              className="formControl"
                              onChange={(e) => setCustomBasicDeliveryValue(e.target.value)}
                            />
                            {errorStep2.customBasicDeliveryValue!='' && (
                              <div className="errorText mt-5">{errorStep2.customBasicDeliveryValue}</div>
                            )}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stepFormBlockMain">
                <div className="stepFormBlockHeader">
                  <h3>Standard <span>(Optional)</span></h3>
                  <div className="stepFormBlockHeaderActions">
                    <button onClick={handleStandardPrice}>
                      {isStandardVisible ? "Delete" : "Add"}
                    </button>
                  </div>
                </div>
                {isStandardVisible && (
                  <div className="stepFormContainer">
                    <div className="formRow">
                      <div className="formCol">
                        <h3>Package Details</h3>
                        <p>Describe the details of your offering.</p>
                        <textarea
                          rows="5"
                          defaultValue={jobDescriptionStandard}
                          placeholder="Enter a describe"
                          className="formControl textarea"
                          onChange={(e) => setJobDescriptionStandard(e.target.value)}
                        />
                        {/* <input
                          type="text"
                          value={jobDescriptionStandard}
                          placeholder="Enter a describe"
                          className="formControl"
                          onChange={(e) => setJobDescriptionStandard(e.target.value)}
                        /> */}
                        {errorStep2.jobDescriptionStandard!='' && (
                          <div className="errorText mt-5">{errorStep2.jobDescriptionStandard}</div>
                        )}
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formCol">
                        <h3>Price</h3>
                        <div className="mergeControl">
                          <div>
                            <Select
                              options={priceCurrencyOptions}
                              values={[
                                priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyStandard) !== undefined ? priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyStandard) : ""
                              ]}
                              onChange={(opt) => handlePriceCurrency(opt[0] ? opt[0]['value'] : '')}
                              className="jobCurrencyDropdown"
                            />
                            {errorStep2.jobPriceCurrencyStandard!='' && (
                              <div className="errorText mt-5">{errorStep2.jobPriceCurrencyStandard}</div>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              value={jobPriceStandard}
                              placeholder="Enter a price"
                              className="formControl"
                              onChange={(e) => setJobPriceStandard(e.target.value)}
                            />
                            {errorStep2.jobPriceStandard!='' && (
                              <div className="errorText mt-5">{errorStep2.jobPriceStandard}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="formCol">
                        <h3>Delivery time</h3>
                        <div className='deliveryTimeControls'>
                          <div>
                            <Select
                              options={jobDeliveryOptions}
                              values={[
                                jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTimeStandard) !== undefined ? jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTimeStandard) : ""
                              ]}
                              onChange={(opt) => handleCustomStandardDelivery(opt)}
                            />
                            {errorStep2.jobDeliveryTimeStandard!='' && (
                              <div className="errorText mt-5">{errorStep2.jobDeliveryTimeStandard}</div>
                            )}
                          </div>
                          {customStandardDeliveryTime === true &&
                            <div className='deliveryTimeCustomSet'>
                              <input
                                type="number"
                                value={customStandardDeliveryValue}
                                placeholder="Days"
                                className="formControl"
                                onChange={(e) => setCustomStandardDeliveryValue(e.target.value)}
                              />
                              {errorStep2.customStandardDeliveryValue!='' && (
                                <div className="errorText mt-5">{errorStep2.customStandardDeliveryValue}</div>
                              )}
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="stepFormBlockMain">
                <div className="stepFormBlockHeader">
                  <h3>Premium <span>(Optional)</span></h3>
                  <div className="stepFormBlockHeaderActions">
                    <button onClick={handlePremiumPrice}>
                      {isPremiumVisible ? "Delete" : "Add"}
                    </button>
                  </div>
                </div>

                {isPremiumVisible && (
                  <div className="stepFormContainer">
                    <div className="formRow">
                      <div className="formCol">
                        <h3>Package Details</h3>
                        <p>Describe the details of your offering.</p>
                        <textarea
                          rows="5"
                          defaultValue={jobDescriptionPremium}
                          placeholder="Enter a describe"
                          className="formControl textarea"
                          onChange={(e) => setJobDescriptionPremium(e.target.value)}
                        />
                        {/* <input
                          type="text"
                          value={jobDescriptionPremium}
                          placeholder="Enter a describe"
                          className="formControl"
                          onChange={(e) => setJobDescriptionPremium(e.target.value)}
                        /> */}
                        {errorStep2.jobDescriptionPremium!='' && (
                          <div className="errorText mt-5">{errorStep2.jobDescriptionPremium}</div>
                        )}
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formCol">
                        <h3>Price</h3>
                        <div className="mergeControl">
                          <div>
                            <Select
                              options={priceCurrencyOptions}
                              values={[
                                priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyPremium) !== undefined ? priceCurrencyOptions.find((opt) => opt.value === jobPriceCurrencyPremium) : ""
                              ]}
                              onChange={(opt) => handlePriceCurrency(opt[0] ? opt[0]['value'] : '')}
                              className="jobCurrencyDropdown"
                            />
                            {errorStep2.jobPriceCurrencyPremium!='' && (
                              <div className="errorText mt-5">{errorStep2.jobPriceCurrencyPremium}</div>
                            )}
                          </div>
                          <div>
                            <input
                              type="text"
                              value={jobPricePremium}
                              placeholder="Enter a price"
                              className="formControl"
                              onChange={(e) => setJobPricePremium(e.target.value)}
                            />
                            {errorStep2.jobPricePremium!='' && (
                              <div className="errorText mt-5">{errorStep2.jobPricePremium}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="formCol">
                        <h3>Delivery time</h3>
                        <div className='deliveryTimeControls'>
                          <div>
                            <Select
                              options={jobDeliveryOptions}
                              values={[
                                jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTimePremium) !== undefined ? jobDeliveryOptions.find((opt) => opt.value === jobDeliveryTimePremium) : ""
                              ]}
                              onChange={(opt) => handleCustomPremiumDelivery(opt)}
                            />
                            {errorStep2.jobDeliveryTimePremium!='' && (
                              <div className="errorText mt-5">{errorStep2.jobDeliveryTimePremium}</div>
                            )}
                          </div>
                          {customPremiumDeliveryTime === true &&
                            <div className='deliveryTimeCustomSet'>
                              <input
                                type="number"
                                value={customPremiumDeliveryValue}
                                placeholder="Days"
                                className="formControl"
                                onChange={(e) => setCustomPremiumDeliveryValue(e.target.value)}
                              />
                              {errorStep2.customPremiumDeliveryValue!='' && (
                                <div className="errorText mt-5">{errorStep2.customPremiumDeliveryValue}</div>
                              )}
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          }

          {currentStep === 3 &&
            // <JobStep3
            //   selectedJobImages={jobDetails?jobDetails[0].name.ImageLinks:''}
            // />
            <div>
              <div className="formRow">
                <div className="formCol">
                  <h3>Images (up to 5)</h3>
                  <p>Get noticed by the right buyers with visual examples of your services.</p>


                  <Form.Item valuePropName="fileList">
                    <Upload
                      /* action="/upload.do" */
                      //customRequest={dummyRequest} 
                      listType="picture-card"
                      maxCount={5}

                      //fileList={fileList}
                      //onPreview={this.handlePreview}
                      //onChange={this.handleUpload}

                      imageLinks
                      defaultFileList={jobImagesOptions}
                      onChange={handleUploadChange}
                      beforeUpload={() => false}
                      accept="image/*"  // .jpg,.png 
                    >
                      <Button classes="button transparent withIcon small flexCol">
                        <i>
                          <PlusIc size="18" />
                        </i>
                        <span>Upload</span>
                      </Button>
                      {/* <div>
                      <PlaceholderIc />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div> */}
                    </Upload>
                  </Form.Item>
                </div>
              </div>
            </div>
          }

          {currentStep === 4 && <JobStep4 />}
        </div>
        {currentStep < 4 && (<div className="formFooter">
          {currentStep > 1 && <Button classes="button transparent" onClick={backStep}>Back</Button>}
          <Button classes="button dark" onClick={validAndNextStep}>
            {(currentStep === 3 || currentStep === 4) ? "Publish" : "Save & Continue"}
          </Button>
        </div>)}
      </div>
    </Fragment>
  )
}

export default JobForm;