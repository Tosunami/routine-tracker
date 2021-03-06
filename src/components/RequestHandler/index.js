const axios = require('axios');
const qs = require('qs');

class RequestHandler {

    constructor(key){
        this.apiKey=key;
    }

    setAPIKey(key){
        this.apiKey=key;
    }
    getAPIKey(){
        return this.apiKey;
    }

    async logIn(loginInfo){
        let response={}
        var baseURL = 'https://api.jotform.com/user/login';

        await axios({
            method: 'POST',
            url: baseURL,
            data: qs.stringify(loginInfo)
        }).then((resp)=> response=resp)
        return response
    }

    logOut(){
        axios({
            method: 'GET',
            url: 'https://api.jotform.com/v1/user/logout'
        }).then((resp)=>console.log(resp));
    }

    async sendSubmission(id,note){
        let submission = new FormData();
        submission.set('submission[4]',note);

        var baseURL = 'https://api.jotform.com/form/'

        await axios({
            method: 'POST',
            url: baseURL+id+'/submissions?apiKey='+this.apiKey,
            data: submission
        }).then((resp)=>console.log(resp))
    }

    async getForms(){
        let response = {}

        var baseURL = 'https://api.jotform.com/user/forms?limit=100&apiKey=';

        await axios({
            method: 'GET',
            url: baseURL+this.apiKey
        }).then((resp) => response=resp )
        return response;
    }

    async getSubmissions(id){
        let response = {};

        var baseURL = 'https://api.jotform.com/form/';

        await axios({
            method: 'GET',
            url: baseURL+id+'/submissions?apiKey='+this.apiKey
        }).then((resp)=> response=resp.data.content)

        return response
    }

    async getQuestions(id){
        let response = {};

        var baseURL = 'https://api.jotform.com/form/';

        await axios({
            method: 'GET',
            url: baseURL+id+'/questions?apiKey='+this.apiKey
        }).then((resp)=> response=resp)

        return response.data.content;
    }

    async getFormProperties(id){
        let response= {};

        let baseURL = 'https://api.jotform.com/form/';
        await axios({
            method:'GET',
            url: baseURL+id+'/properties?apiKey='+this.apiKey
        }).then((resp)=>response=resp);
        return response;
    }


    async postForm(data){
        var baseURL = 'https://api.jotform.com/form?apiKey='

        await axios({
            method: 'POST',
            url: baseURL+this.apiKey,
            data: qs.stringify(data),
        }).then((response)=>{
            if(response.status === 200){
                window.OneSignal.getUserId().then((id)=>{
                    var days = {'Monday':1,'Tuesday':2,'Wednesday':3,'Thursday':4,'Friday':5,'Saturday':6,'Sunday':7}
                    let hoursInfo = JSON.parse(data["questions[4]"].text);
                    Object.keys(hoursInfo).forEach((day)=> {
                        var date = new Date();
                        date.setDate(date.getDate() + (days[day] + 7 - date.getDay()) % 7);
                        date.setHours(hoursInfo[day].substr(0,2),hoursInfo[day].substr(3,2))
                        var notificationData = {
                          "app_id": `${process.env.REACT_APP_ONESIGNAL_APP_ID}`,
                          "include_player_ids": [id],
                          "url":`http://localhost:3000/notifications?date=${date.toString()}&id=${id}&formid=${response.data.content.id}`,
                          "send_after": date.toString(),
                          "contents": {"en": "You may have a routine coming on!"}
                        }
                        axios({
                            method: 'POST',
                            url: 'https://onesignal.com/api/v1/notifications',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Basic ${process.env.REACT_APP_ONESIGNAL_API_KEY}`
                            },
                            data: notificationData
                        }).then((resp)=>console.log(resp))
                    })
                })
            }
        });

    }

    async editForm(id,data){
        var baseURL = 'https://api.jotform.com/form/'
        await axios({
            method: 'POST',
            url: baseURL+id+'/properties?apiKey='+this.apiKey,
            data: qs.stringify({"properties[title]":data["properties[title]"]})
        })
        await axios({
            method: 'POST',
            url: baseURL+id+'/question/1?apiKey='+this.apiKey,
            data: qs.stringify({"question[text]":data["questions[0][text]"]})
        })
        await axios({
            method: 'POST',
            url: baseURL+id+'/question/2?apiKey='+this.apiKey,
            data: qs.stringify({"question[text]":data["questions[1][text]"]})
        })
        await axios({
            method: 'POST',
            url: baseURL+id+'/question/5?apiKey='+this.apiKey,
            data: qs.stringify({"question[text]":data["questions[4]"].text})
        })

    }

    async ScheduleNotificationToNextWeek(playerID,date){
        let currentDate = new Date(date);
        let nextWeeksDate = new Date(currentDate.getTime()+7*24*60*60*1000);
        var notificationData = {
          "app_id": `${process.env.REACT_APP_ONESIGNAL_APP_ID}`,
          "include_player_ids": [playerID],
          "url":`http://localhost:3000/notifications?date=${nextWeeksDate.toString()}&id=${playerID}`,
          "send_after": nextWeeksDate.toString(),
          "contents": {"en": "You may have a routine coming on!"}
        }
        await axios({
            method: 'POST',
            url: 'https://onesignal.com/api/v1/notifications',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.REACT_APP_ONESIGNAL_API_KEY}`
            },
            data: notificationData
        }).then((resp)=>console.log(resp))
        return true;
    }

    async removeForm(id){
        var baseURL = 'https://api.jotform.com/form/'
        await axios({
            method: 'DELETE',
            url: baseURL+id+'?apiKey='+this.apiKey
        })
    }

    async activateForm(id){
        var baseURL = 'https://api.jotform.com/form/'
        await axios({
            method: 'POST',
            data: qs.stringify({properties:{status:'ENABLED'}}),
            url: baseURL+id+'/properties?apiKey='+this.apiKey
        })
    }
}

var requestHandler = new RequestHandler('');
export default requestHandler;
