import { server } from '../../config/tricker';

export default async function (req, res) {
    // Get the data from the request body
    
    const targetEndTime = new Date("2023-04-19T21:30:00");
    const timer = setTimeout(async () => {
      try {
        let data = {
          name: "Marthx",
          email: "marthx001@gmail.com",
          message: "From tricker",
          subject: "End",
          to: "HOST or BIDDER",
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
  
      //   // Get the response from the second API endpoint
      //   const responseData = response.json();
  
      //   // Return the response data
      //   res.status(200).json(responseData);
      //   clearTimeout(timer);
  
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    }, targetEndTime.getTime() - Date.now());
    res.status(200).send("Done")
  }
  