import { server } from '../../config/tricker';
import { firestore } from '../../firebase/firebase';

export default async function (req, res) {
    // Get the data from the request body
    const targetEndTime = new Date(req.body.endTime);
    const timer = setTimeout(async () => {
      try {
        const ProductData = await firestore.collection('products').doc(req.body.PIN).get()
        const OwnerData = await firestore.collection('users').doc(ProductData.data().owner_id).get()
        const BidderData = await firestore.collection('users').doc(ProductData.data().bidder_id).get()
        //OWNER
        let data = {
          name: OwnerData.data().displayName,
          email: OwnerData.data().email,
          message: `${ProductData.data().ProductName} >> Bidder Information : ${BidderData.data().displayName} email : ${BidderData.data().email} @ ${ProductData.data().currentBid} Baht `,
          subject: `[Used] Your ${ProductData.data().ProductName} Auction has been ended ${req.body.PIN}`,
          bidderName: BidderData.data().displayName,
          bidderEmail: BidderData.data().email,
          productName : ProductData.data().ProductName,
          currentBid : ProductData.data().currentBid
        };
        // Send a POST request to the second API endpoint with the data
        const response = await fetch(`${server}/api/email`, {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then((res) => {
            console.log('Request Email')
        })

        //BIDDER
        let data2 = {
            name: BidderData.data().displayName,
            email: BidderData.data().email,
            message: `Congratulaion! K.${BidderData.data().displayName}. You won the ${ProductData.data().ProductName} Aucion >> Product Owner Information : ${OwnerData.data().displayName} email : ${OwnerData.data().email} @ ${ProductData.data().currentBid} Baht `,
            subject: `[Used] ${ProductData.data().ProductName} winner result ${req.body.PIN}`,
            OwnerName: OwnerData.data().displayName,
            OwnerEmail: OwnerData.data().email,
            productName : ProductData.data().ProductName,
            currentBid : ProductData.data().currentBid
          };
        // Send a POST request to the second API endpoint with the data
        const response2 = await fetch(`${server}/api/email`, {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data2),
          }).then((res) => {
              console.log('Request Email')
          })
  
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    }, targetEndTime.getTime() - Date.now());
    res.status(200).send(`Start @ ${req.body.endTime}`)
  }
  