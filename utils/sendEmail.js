const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, HTMLBody, TextBody, emailSubject) => {
  return new SendEmailCommand({
    Destination: {
     
      CcAddresses: [
       
      ],
      ToAddresses: [
        toAddress,
        
      ],
    },
    Message: {
     
      Body: {
      
        Html: {
          Charset: "UTF-8",
          Data: HTMLBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: TextBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailSubject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
     
    ],
  });
};

const run = async (senderEmail, receiverEmail, HTMLBody, TextBody, emailSubject) => {
  const sendEmailCommand = createSendEmailCommand(
    receiverEmail,
    senderEmail,
    HTMLBody, TextBody, emailSubject
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    console.log("caught", caught)
    throw caught;
  }
};

module.exports = { run };