
const Core = require('@alicloud/pop-core');

var client = new Core({
  accessKeyId: 'LTAIUk9v0biplDkw',
  accessKeySecret: 'Bl8uiPMfki9rQjhNgyYg6KT3x3wiwW',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
});

var params = {
  "RegionId": "cn-hangzhou",
  "PhoneNumberJson": "[13513500902,17601614805]",
  "SignNameJson": "[\"阿里云\",\"阿里巴巴\"]",
  "TemplateCode": "SMS_160300689",
  "TemplateParamJson": "[{\"name\":\"TemplateParamJson\"},{\"name\":\"TemplateParamJson\"}]"
}

var requestOption = {
  method: 'POST'
};

client.request('SendBatchSms', params, requestOption).then((result) => {
  console.log(result);
}, (ex) => {
  console.log(ex);
})
