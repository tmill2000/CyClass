# **sdmay23-40 Websocket Documentation**
This README documents how to connect to our websockets and how to properly send messages

## **Connecting to the server**
- Create a websocket request (eg. wss or ws) to the course and lecture you want with a given user
    - example: `wss://sdmay23-40.ece.iastate.edu?userId={number}&courseId={number}&lectureId={number}`
    - queryString = `?userId={number}&courseId={number}&lectureId={number}`
## **Message Format**
- All requests will be sent as objects with the following structure
    - ```
        messageObj = {
            type: string
            payload: object
        }
      ```
## **Message Types**

### **Message**
- Sends a new message to connected users
```
messageObj = {
            type: "message"
            payload: {
                body: string
                is_anonymous: boolean
                parent_id: number | null
                message_id: number
                sender_id: number
                lecture_id: number
            }
        }
```
### **Poll**
- Sends a new poll to connected users
- `is_correct_choice` will be stripped away when sent to the other users
```
messageObj = {
            type: "poll"
            payload: {
                question_text: string
                poll_type: string
                close_date: string
                poll_choices: [
                    choice_text: string
                    is_correct_choice: boolean
                ]
            }
        }
```
### **Question**
- Message is only sent to course_owners (e.g users currently connected with the `PROFESSOR` role)
```
messageObj = {
            type: "question"
            payload: {
                body: string
                is_anonymous: boolean
            }
        }
```
### **Poll Close**
- Used to alert other connected users to a poll being closed
```
messageObj = {
            type: "poll_close"
            payload: {
                poll_id: number
            }
        }
```
### **Media Upload**
- Call POST /message
- use message_id from the response
- Call POST /upload-media
- send message data and media_id as below
```
messageObj = {
            type: "media_upload"
            payload: {
                body: string
                is_anonymous: boolean
                parent_id: number | null
                message_id: number
                sender_id: number
                lecture_id: number
                media_id: string
            }
        }
```

### **Message Update**
- sends message without saving to db
```
messageObj = {
            type: "message_update"
            payload: {
                body: string
                is_anonymous: boolean
                parent_id: number | null
                message_id: number
                sender_id: number
                lecture_id: number
                media_id: string
                timestamp: string (date)
            }
        }
```

### **Poll Update**
- sends poll without saving to db
```
```
messageObj = {
            type: "poll"
            payload: {
                question_text: string
                poll_type: string
                close_date: string
                poll_choices: [
                    choice_text: string
                ]
            }
        }
```
```