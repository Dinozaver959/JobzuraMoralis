import { useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import useOutsideClick from "../useOutsideClick";
import { SignMessageWithAlias } from "../../JS/auth/messageSigning";

function JobsRowsSeller(props) {
  const { agreement } = props;
  const [showModal, setShowModal] = useState(false);

  const seller = agreement.name.SellerWallet;
  const jobId = agreement.name.JobId;
  const imageLinks = agreement.name.ImageLinks;
  const title = agreement.name.Title;
  const description = agreement.name.Description;

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const moreOptionsRef = useRef();
  useOutsideClick(moreOptionsRef, () => {
    if (moreOptionsRef) setShowModal(false);
  });


  const deleteJob = async () => {

    var formData = new FormData();

    const signedMessage_seller = await SignMessageWithAlias(seller);
    formData.append("address", signedMessage_seller.address);
    formData.append("message_seller", signedMessage_seller.message);
    formData.append("signature_seller", signedMessage_seller.signature);

    const signedMessage_jobId = await SignMessageWithAlias(jobId);
    formData.append("message_jobId", signedMessage_jobId.message);
    formData.append("signature_jobId", signedMessage_jobId.signature);

    axios.post("/api/V2-Firebase/post/deleteJob", formData)
    .then((res) => {
      if (res.status == 201 ) console.log("data successfully updated!");
    })
    .catch((err) => {
      console.log("data profile failed to update ...");
      console.log(err);
    });


    //const response = await fetch(`/api/general/deleteJob?jobID=${jobId}`);
    //const data = await response.json();
    //console.log(data);

  };

  console.log("agreement:")
  console.log(agreement)

  return (
    <tr>
      <td align="left">
        <Link href={`/job/${jobId}`}>
          <div className="jobDetails" style={{ cursor: 'pointer'}}>
            {imageLinks?.length > 0 ? (
              <Image 
                src={imageLinks} 
                alt="job" 
                width={55}
                height={42}              
                style={{ marginRight: '10px' }}
              />
              ) : (
                <div
                  style={{
                    width: '55px',
                    height: '40px',
                    backgroundColor: '#D9D9D9',
                  }}></div>
              )
            }
            <div className="jobSortInfo">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        </Link>
      </td>
      <td align="left">
        <label className="mobileLabel">Orders</label>
        {
          // number of orders
        }
        0
      </td>
      <td align="left">
        <label className="mobileLabel">Cancellations</label>
        0%
      </td>
      <td align="right" ref={moreOptionsRef}>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button classes="button dark" link={`/edit-job/${jobId}`}>Edit Job</Button>
          {jobId && (
            <Button onClick={handleModal} classes="button bordered default moreButton ml-10">
              <FiMoreVertical
                style={{
                  fontSize: "1.2rem",
                  color: "grey",
                  cursor: "pointer",
                }}
                />
              {showModal ? (
                <div className="moreOptionDropdown">
                  <span
                    onClick={() => {
                      deleteJob();
                      console.log(`delete ${jobId}`);
                    }}
                    >Delete job</span>
                </div>
              ) : null}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default JobsRowsSeller;
