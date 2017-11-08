---
title: Give logs context with correlationId -  Part2
date: 2017-02-28 00:00:00 Z
tags:
- logs
- correlationId
- microservice
- WCF
layout: post
---

 In [part one]({% post_url 2017-02-27-give-logs-context-with-correlation-id %}), we documented to pass correlationid to the asp.net MVC and OWIN applications. In this post, we will see how to accomplish it in WCF services.
<!--more-->

## Theory
  As previously stated, correlation Id is a useful way to reconstruct the call graph. When the first call is made, a Unique Identifier, GUID, is generated, this GUID is then passed along to subsequent requests, which is put into logs in a structured way via the logging framework provided to a centralized log storage. You then can take advantage of the capabilities, the log management tool (Splunk) to trace the event all the way through your call graph. 
 
### Client:
 
  When a client initiates a request to WCF service, we will examine if it is an initiating call. If so, a GUID will be generated and add an outgoing header to it. Otherwise, it will reuse the GUID coming from the upstream call.
 
### Server:
 
  Whenever the server receives a request, it will exam the incoming header for the existence of correlation Id. If it finds it, then it will be pass along with downstream call and used for any log in the current context.

## Implementation

How can we generate such GUID implicitly without requiring a lot of efforts on application developers to add it to an existing application or brand new app? The solution we chose is to have a custom header for each WCF calls. The messageInspector, which will inspect the outgoing messages (Client) or incoming messages (Server), can help us to fulfill the requirement.
 
### Client
 
On the client side, we implement the `IClientMessageInspector` to add a header to every outgoing request with GUID. An `IEndpointBehavior` implementation will inject this inspector into the client endpoint and a ` System.ServiceModel.Configuration.BehaviorExtensionElement` is to facilitate it through the configuration files.
 
~~~
 internal class ClientMessageInspector : IClientMessageInspector
 {
     public object BeforeSendRequest(ref Message request, IClientChannel channel)
        {
            if (request.Headers.Where(h => h.Name == "correlationId").Count() == 0)
            {
                object correlationId = CallContext.LogicalGetData("correlationId");
                MessageHeader<string> messageHeader;
                if (correlationId == null)
                {
                    messageHeader = new MessageHeader<string>(Guid.NewGuid().ToString());
                }
                else
                {
                    messageHeader = new MessageHeader<string>(correlationId.ToString());
                }
                var untypedMessageHeader = messageHeader.GetUntypedHeader("correlationId", string.Empty);
                request.Headers.Add(untypedMessageHeader);
            }
            return null;
        }
 }
~~~

~~~
 public class ClientEndPointBehavior : IEndpointBehavior
 {
        public void ApplyClientBehavior(ServiceEndpoint endpoint, ClientRuntime clientRuntime)
        {
#if NET35
            clientRuntime.MessageInspectors.Add(new ClientMessageInspector());
#else
            clientRuntime.ClientMessageInspectors.Add(new ClientMessageInspector());
#endif
        }
 }
~~~

~~~
 public class ClientMessageHeaderBehaviorExtension : BehaviorExtensionElement
 {
     public override Type BehaviorType
        {
            get
            {
                return typeof(ClientEndPointBehavior);
            }
        }
 
        protected override object CreateBehavior()
        {
            return new ClientEndPointBehavior();
        }
 }
~~~
 
## Server
  On the server side, We implement the `IDispatchMessageInspector` to inspect the received requests. A `ServiceMessageHeaderInspectorAttribute` is created to help decorate the service class that every request is checked before the operations are performed
 
~~~
  public class ServiceMessageHeaderInspector : IDispatchMessageInspector
  {
      public object AfterReceiveRequest(ref Message request, IClientChannel channel, InstanceContext instanceContext)
        {
            if (request.Headers.FindHeader("ssicorrelationId", string.Empty) == -1)
            {
                //http://forums.asp.net/t/1986677.aspx?How+to+extract+header+info+in+WCF+service
                //check if this is request from http request and then check the httpheader
                var httpRequest = (HttpRequestMessageProperty) request.Properties[HttpRequestMessageProperty.Name];
                if (httpRequest != null)
                {
                    string colId = httpRequest.Headers["X-CorrelationId"];
                    if (!string.IsNullOrEmpty(colId))
                    {
                        CallContext.LogicalSetData("CorrelationId", colId);
                    }
                }
                else
                {
 
                    //no correlationid using new id
                    CallContext.LogicalSetData("CorrelationId", Guid.NewGuid().ToString());
                }
            }
            else
            {
                var id = request.Headers.GetHeader<string>("CorrelationId", string.Empty);
                if (string.IsNullOrEmpty(id))
                {
                    CallContext.LogicalSetData("CorrelationId", Guid.NewGuid().ToString());
                }
                else
                {
                    CallContext.LogicalSetData("CorrelationId", id);
                }
            }
            return instanceContext;
        }
 
  }
~~~

~~~
  public class ServiceMessageHeaderInspectorAttribute : Attribute, IServiceBehavior
  {
      public void ApplyDispatchBehavior(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
        {
            foreach (ChannelDispatcher channelDispatcher in serviceHostBase.ChannelDispatchers)
            {
                foreach (var endpointDispatcher in channelDispatcher.Endpoints)
                {
                    endpointDispatcher.DispatchRuntime.MessageInspectors.Add(new ServiceMessageHeaderInspector());
                }
            }
        }
  }
~~~   

## Usage

### Server
 
  On the server side, it is pretty straightforward, you will add the `Common.dll` as a reference and then add `ServiceMessageHeaderInspectorAttribute` on your service class implementation.

~~~
    [ServiceMessageHeaderInspector]
    public class WCFService : IWCFService
    ....
~~~
 
### Client
 
 On the client side, there are two options.
 
#### Using Configuration File **not support .net35**
 
* You will make the configuration aware of `MessageHeadeInspector` by adding behaviorExtension

~~~
    <extensions>
      <behaviorExtensions>
        <add name="MessageHeaderInspector" type="Common.Logging.WCF.ClientMessageHeaderBehaviorExtension,Common"/>
      </behaviorExtensions>
    </extensions>
~~~

* Add endpointbehavior configuration to use it

~~~
      <endpointBehaviors>
        <behavior name="correlationEndpointBehavior">
          <MessageHeaderInspector/>
        </behavior>
      </endpointBehaviors>
~~~
 
*  Make sure the endpoint to use this behaviorConfiguration

~~~
    <client>
      <endpoint address="http://localhost:8733/WCFService/"
        binding="basicHttpBinding" bindingConfiguration="BasicHttpBinding_IService1"
        contract="Logging.Test.WCF.IWCFService" name="BasicHttpBinding_WCFService" behaviorConfiguration="correlationEndpointBehavior" />
    </client>
~~~
 
#### Pragmatically
 
You will need explicitly add the `Common.Logging.WCF.ClientEndPointBehavior` to your WCF channel
 
**.net 452 and .net 46**

~~~
                var endpoint = new EndpointAddress(url);
                var channelFactory = new ChannelFactory<IWCFService>(binding, endpoint );
                var correlationBehavior = new ClientEndPointBehavior();
                channelFactory.Endpoint.EndpointBehaviors.Add(correlationBehavior);
                IWCFService client = null;
 
                ...
~~~

**.net 35**

~~~
                var endpoint = new EndpointAddress(url);
                var channelFactory = new ChannelFactory<IWCFService>(binding, endpoint );
                var correlationBehavior = new ClientEndPointBehavior();
                channelFactory.Endpoint.Behaviors.Add(correlationBehavior);
                IWCFService client = null;
 
                ...
~~~

Instead of the previous example that will use the correlation id stored in callcontext if it is presented, you can specify correlation id specifically for your WCF request
 
 
~~~
                    var id = Guid.NewGuid().ToString();
                    client = channelFactory.CreateChannel();
                    IClientChannel channel = client as IClientChannel;
                    using(new OperationContextScope(channel))
                    {
                        System.ServiceModel.Channels.MessageHeader aMessageHeader = System.ServiceModel.Channels.MessageHeader.CreateHeader("correlationid", "", id);
 
                        OperationContext.Current.OutgoingMessageHeaders.Add(aMessageHeader);
                        var message = client.GetData(1);
                        Assert.AreEqual(id, message);
 
                    }
 
~~~

Note: the header name has to be "correlationid" and namespace is an empty string.


in next post, we will explore the same idea to the Azure Service Fabric