const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const { ConnectionRequestModel } = require("../databases/models/connectionRequest.model");
const { run } = require("./sendEmail");

cron.schedule("0 8 * * *",async()=>{
    console.log("Cron job ran at 8AM")
        try{
    const yesterday = subDays(new Date(), 1)
    const startOfYesterday = startOfDay(yesterday)
    const endOfYesterday = endOfDay(yesterday)

    const yesterdayRequests = await ConnectionRequestModel.find({createdAt:{$gte: startOfYesterday,$lt: endOfYesterday}}).populate("receiverId")

    

    const listOfUniqueEmails = [...new Set(yesterdayRequests.map((request)=>request.receiverId.email))]

   
    const HTMLBody = `<h1>You have a friend request</h1>`
    const textBody = 'You have friend request, please check'
    for(let i=0;i<listOfUniqueEmails.length;i++){
       const emailSend = await run("sujlegaonkar16@gmail.com", "aditisujlegaonkar@gmail.com", HTMLBody, textBody, "Friend Request Received")
       
    }

}catch(err){
    console.log("error in cron job", err.message)
}

})



