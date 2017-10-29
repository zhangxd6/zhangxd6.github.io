---
title: serverless backend -- sending email for a website
date: 2017-04-11 00:00:00 Z
tags:
- azure function
- serverless
- azure
- web
layout: post
---

 Serverless architectures are currently leading the conversations. It is continuing the trend of the industry that is trying to abstract out the complexity of infrastructure from the application developers to allow them to focus on core values they provide, fast time to market and minimize the cost to establish their own IT infrastructure. Three major cloud providers started offering it to the developers; AWS Lambda, Google Cloud function, and Microsoft Azure Function. This post will not try to discuss Pros or Cons of serverless architecture or the comparison of offers providers have. I will try to document the steps to archive a common functionality of a website, sending email from a website accomplished using the Azure function. Hopefully, this will give a peek of the serverless backend. 
<!--more-->

## Requirement

  I have a client's website and there is a contact section to allow visitor send the email to the owner of a website.

  ![Contact Form](/images/2017/4/form.png) 

  and in the javascript file, I will handle the click event and send the ajax post request to send email on behave of visitor

~~~
        $('#submit').click(function() {
                $.ajax({
                    type: "POST",
                    url: 'url',
                    data: JSON.stringify(msg),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function() {
                    $('#emailMessage').text('Your email is on its way to us');
                }).fail(function(err) {
                        $('#emailMessage').text('Opps, something is wrong ');
                    
                });
            }); 
~~~

  One of the ways to archive it will need the owner provide a server hosting an endpoint to relay the email. This will require the ownership or the access of the server. The cloud functions can help to remove the need for a server. 

 
## Azure Function


  >Azure Functions is a solution for easily running small pieces of code, or "functions," in the cloud. You can write just the code you need for the problem at hand, without worrying about a whole application or the infrastructure to run it. 

### Send Grid

We are going to use sendgrid to facilitate the sending of emails. The Microsoft Azure provides an easy way to set up the sendgrid account.

![SendGrid Email](/images/2017/4/SendGrid_Email.png) 

Follow the steps to create a send grid account. It should look similar to 

![SendGrid Setting](/images/2017/4/SendGridSettings.png) 

### Function App

Now let's create a azure functions, Function App,

![Function App](/images/2017/4/Function_App.png) 

![sendgrid function](/images/2017/4/demosendgriddemo.png) 

then click the plus icon alongside with *Functions*. In the template, select *HttpTrigger-CSharp"

Once the function is created, go to the *Integrate*, add a new sendgrid out and remove the HTTP out. It should look similar to

![sendgrid integrate](/images/2017/4/HttpTriggerCSharp.png) 

now replace run.rcx with

~~~
    #r "SendGrid"
#r "Newtonsoft.Json"

using System;
using SendGrid.Helpers.Mail;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System.Net;
using System.Collections.Generic;
using System.Linq;

public static Mail Run(HttpRequestMessage req, TraceWriter log)
{

    
    log.Info($"SendGrid Function Triggered");
    string jsonContent = req.Content.ReadAsStringAsync().Result;
    log.Info(jsonContent);
    if(string.IsNullOrWhiteSpace(jsonContent))
    {
        log.Info($"No data");
        return null;
    }

    var f = JsonConvert.DeserializeObject<Contact>(jsonContent);



    Mail message = new Mail()
    {
        Subject = $" You have a new message from {f.FirstName} {f.LastName}!",
        From = new Email( f.From,$"{f.FirstName} {f.LastName}")
    };

    Content content = new Content
    {
        Type = "text/plain",
        Value = $"{f.Message} \r\n {f.FirstName} {f.LastName} \r\n {f.From}"
    };

    message.AddContent(content);    
    return message;
}

public class Contact
{
    public string From { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Message {get;set;}
}
~~~

Should I run the test, will I be able to receive the email?

Not quite. The sendGrid need an api key. Now go back the *sendgrid* and navigate to sendgrid account where you can create an API Key.
Now go to the *Application Setting* of azure function to enter API key to *SendGridApiKey*.

![app setting](/images/2017/4/Application_settings.png) 

it should match the one in output setting of function

![sendgrid integrate](/images/2017/4/HttpTriggerCSharp.png) 

Now you can replace the URL in the javascript with the function URL and have a fully functional contact form.

