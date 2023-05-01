import { firestore } from '../firebase/firebase';
import emailjs from 'emailjs-com';

const concludeMail = async (e) => {
  const ProductData = await firestore
    .collection("products")
    .doc(e)
    .get();
  const OwnerData = await firestore
    .collection("users")
    .doc(ProductData.data().Owner.uid)
    .get();
  //wait for adding Bidder to product db and then fix line 12
  const BidderData = await firestore
    .collection("users")
    .doc(ProductData.data().bidderUid)
    .get();
  //OWNER
  let data1 = {
    name: OwnerData.data().displayName,
    email: OwnerData.data().email,
    pin : ProductData.data().pin,
    productName : ProductData.data().productName,
    productDes : ProductData.data().description,
    currentBid : ProductData.data().currentBid,
    message: `Your<br><h1>${ProductData.data().productName}<br>${
      ProductData.data().description
    }</h1><br>>>Bidder Information : <br><b>${
      BidderData.data().displayName
    }<br>email : ${BidderData.data().email}</b><br> @ ${
      ProductData.data().currentBid
    } Baht<br> url : banana/auction?pin=${ProductData.data().pin} `,
    subject: `[Used] Your ${
      ProductData.data().productName
    } Auction has been ended ${e}`,
    bidderName: BidderData.data().displayName,
    bidderEmail: BidderData.data().email,
  };
  await sendEmail(data1,"template_5mjrv07");

  //BIDDER
  let data2 = {
    name: BidderData.data().displayName,
    email: BidderData.data().email,
    OwnerName: OwnerData.data().displayName,
    OwnerEmail: OwnerData.data().email,
    productName: ProductData.data().productName,
    currentBid: ProductData.data().currentBid,
    productDes : ProductData.data().description,
    dateEnd : new Date(),
    pin : ProductData.data().pin,
  };
  await sendEmail(data2,"template_s53sshj");
  return (0)
};

const sendEmail = async (e,template) => {
    emailjs.send(
        "service_6pi7a1b",
        template,
        e, // the values in your EmailJS template
        "YxytRzHwwrVf_XuHp",
      )
        .then(({ status }) => {
          // Show success message
          console.log(status)
        });
};

module.exports = {
  concludeMail,
  sendEmail,
};
