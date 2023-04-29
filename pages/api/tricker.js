import { server } from '../../config/tricker';
import { firestore } from '../../firebase/firebase';

export default async function (req, res) {
    // Get the data from the request body
    const targetEndTime = new Date(req.body.endTime);
    const timer = setTimeout(async () => {
      try {
        const ProductData = await firestore.collection('products').doc(req.body.PIN).get()
        const OwnerData = await firestore.collection('users').doc(ProductData.data().Owner.uid).get()
        //wait for adding Bidder to product db and then fix line 12
        const BidderData = await firestore.collection('users').doc(ProductData.data().Owner.uid).get()
        //OWNER
        let data = {
          name: OwnerData.data().displayName,
          email: OwnerData.data().email,
          message: `Your<br><h1>${ProductData.data().productName}<br>${ProductData.data().description}</h1><br>>>Bidder Information : <br><b>${BidderData.data().displayName}<br>email : ${BidderData.data().email}</b><br> @ ${ProductData.data().currentBid} Baht<br> url : ${server}/auction?pin=${ProductData.data().pin} `,
          subject: `[Used] Your ${ProductData.data().productName} Auction has been ended ${req.body.PIN}`,
          bidderName: BidderData.data().displayName,
          bidderEmail: BidderData.data().email,
          productName : ProductData.data().productName,
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
            message: `Congratulaion! <h2>K.${BidderData.data().displayName}.</h2><br>You won the <h1>${ProductData.data().productName}</h1><br>>> Product Owner Information : <b>${OwnerData.data().displayName}</b><br>email : <b>${OwnerData.data().email}</b><br>@ ${ProductData.data().currentBid} Baht <br> url : ${server}/auction?pin=${ProductData.data().pin}`,
            subject: `[Used] ${ProductData.data().productName} winner result ${req.body.PIN}`,
            OwnerName: OwnerData.data().displayName,
            OwnerEmail: OwnerData.data().email,
            productName : ProductData.data().productName,
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
  