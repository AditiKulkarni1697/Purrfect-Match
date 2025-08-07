export const chatValidate = (newMessage) =>{
    if(typeof newMessage != "string"){
        newMessage = newMessage+""
    }
    return newMessage
}

