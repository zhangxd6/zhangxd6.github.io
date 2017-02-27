---
layout: post
title: Give logs context with correlationId -  Part1
tags:
 - logs
 - correlationId
 - microservice
 - ASP.net
 - WebApi
---
In today's softwares, a single client request is typically fulfilled by multiple services. In layered architecture, the call is
received by presentation or api layer and passed along to business logic layer and eventually to persistent layer. These layer can
locate physically in the same server or span across multiple servers. We can produce logs extensively to help us to monitor the 
call stack in production with help of log aggregators, such as splunk or azure application insight. However, it is difficult to trace
how a single request passing along all individual layers. In microservice architecture, this become even difficult since the nature
of it, a great number of services to work together to provide end user with requested capabilities. A very useful technique is the 
correlation id. When the entry call is made, a GUID is generator and passed along to all subsequent calls. In this blog, we will document
how we archive it in ASP.net/WebApi applications.   

<!--more-->

## Theory
Web applications implemented with ASP.net or the APIs provided by WebApi generally are receiving requests from web browsers. The 
correlationId can be passed along with every single request originated from browsers, most case will be from javascript. However
the requirement for clients pass it is not realistic when we consider existing applications. Fortunately, it is not a must have 
requirement since we are more concern about how the server side handle all requests. If you are trying accomplish user experience 
tracking at front end, you will have to develop a way to uniquely track user interaction at client side and bridge it with correlation
id passed to server, which is not the scope here. 

ASP.net MVC or OWIN are built with process pipeline in their requests, therefore, we can take advantage of it to generate a new GUID
in the very early stage of process. We agree to use a custom header "X-correlationId" as a media to carry this GUID. In the process,
we are going to check if the incoming request has this header. If so, the GUID will be pass along, other wise, a brand new identifier
will be generated and used for subsequent calls.

## Implementation

### Customize IHttpModule
`An HTTP module is an assembly that is called on every request made to your application. HTTP modules are called as part of the ASP.NET
request pipeline and have access to life cycle events throughout the request.
-from MSDN
`
 
Because the HttpModule is called on every request, therefore we can inspect and modify headers of each request. And the OWIN hosted
through asp.net application will go through the same request pipeline, this will work for both cases. However, the downside is the application has to
be host on IIS while developers develops/debug the application.

~~~
public class Correlation : IHttpModule
    {
        public void Dispose()
        {
           
        }
 
        public void Init(HttpApplication context)
        {
            context.BeginRequest += Context_BeginRequest;
        }
 
        private void Context_BeginRequest(object sender, EventArgs e)
        {
            HttpApplication app = (HttpApplication)sender;
            HttpContext context = app.Context;
            var coId = context.Request.Headers["X-SSI-CorrelationId"];
 
            if (coId == null)
            {
                coId = Guid.NewGuid().ToString();
                context.Request.Headers.Add("X-SSI-CorrelationId", coId);
            }
            CallContext.LogicalSetData("ssicorrelationId", coId);
          
        }
    }
~~~

the next thing we have to let the asp.net application know the customized module by
 
~~~ 
  <system.webServer>
    <modules>
      <add name="Correlation" type="SSI.Platform.ASP.Correlation"/>
    </modules>
  </system.webServer>
 
~~~

## Owin Middleware
 
For Owin based web application, we can have a middle-ware injected into the request pipeline. 

~~~
using Microsoft.Owin;
    using System.Runtime.Remoting.Messaging;
    using AppFunc = Func<IDictionary<string, object>, Task>;
    public class CorrelationMiddleWare
    {
        AppFunc next = null;
        public CorrelationMiddleWare(AppFunc next)
        {
            this.next = next;
        }
        public async Task Invoke(IDictionary<string, object> context)
        {
 
            IOwinContext con = new OwinContext(context);
            string corrlationID = con.Request.Headers["X-SSI-CorrelationId"];
            if (string.IsNullOrEmpty(corrlationID))
            {
                corrlationID = Guid.NewGuid().ToString();
                con.Request.Headers.Add("X-SSI-CorrelationId", new string[] { corrlationID });
            }
 
            CallContext.LogicalSetData("ssicorrelationId", corrlationID);
            await next.Invoke(context);
        }
    }
 
    public static class AppBuilderExtensions
    {
        public static void UseCorrelationMiddleWare(this IAppBuilder app)
        {
            app.Use<CorrelationMiddleWare>();
        }
    }
~~~

 The next thing you have to do is add this middle-ware to your owin startup class. For instance
 
~~~
  public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCorrelationMiddleWare();
            ...
            //other middleware or configuration
        }
  }
~~~

in [next part]({% post_url 2017-02-27-give-logs-context-correlation-id-2 %}), we will see how to archive it for WCF services.