---
layout: post
title: Logging with correlationId in azure service fabric
tags:
 - logs
 - correlationId
 - microservice
 - azure
 - azure service fabric
---
 Azure Service Fabric is the Microsoft offer to 
 `
  Build and operate always-on, scalable, distributed applications
 `. The communication between services can use http or wcf, therefore, we can use the same to correlated the end user requests as shown in last two posts. [part1]({% post_url 2017-02-27-give-logs-context-with-correlation-id %}) and [part2]({% post_url 2017-02-28-give-logs-context-correlation-id-2 %}). 

<!--more-->

Azure Service Fabric provides the developers the flexibility to choose protocols and stacks about communication between services ([doc](https://aka.ms/servicefaricservicecommunication)). One of common choose is using the http or REST, where we can use the http header to carry the correlationId as we did in part1. Another one is taking advantage of WCF as communication stack. We will sort to use the MessageInspector equivalent ServiceRemoteDispather.


## Server

When we create the service, we can provide a list of communication listener to service to allow it receive intra-service or external calls.

~~~
   protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
   {
        return new List<ServiceReplicaListener> ();
   }
~~~
On each instance of ServiceReplicaListener, we can create an ICommunicationListenser that will accept a message handlers in which we can manipulate request headers.

~~~
   protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
   {
        return new List<ServiceReplicaListener>
        {
            new ServiceReplicaListener(context=>
                new WcfServiceRemotingListener(context,  new CustomRemotingDispatcher(this),null,"ServiceEndpoint"))

        }
   }
~~~
Reliable Service and Reliable Actor have different base class regarding the RemotingDispather

### Reliable Service

~~~
 public class CustomServiceRemotingDispatcher: ServiceRemotingDispatcher
    {
 
        public CustomServiceRemotingDispatcher(ServiceContext serviceContext, IService service)
            : base(serviceContext, service)
        {
        }

        public override void HandleOneWay(IServiceRemotingRequestContext requestContext, ServiceRemotingMessageHeaders messageHeaders, byte[] requestBody)
        {
            byte[] col;
            messageHeaders.TryGetHeaderValue("X-CorrelationID", out col);
            if (col != null && col.Any())
            {
                CallContext.LogicalSetData("X-CorrelationID", ASCIIEncoding.UTF8.GetString(col));
            }
            base.HandleOneWay(requestContext, messageHeaders, requestBody);
        }

        public override Task<byte[]> RequestResponseAsync(IServiceRemotingRequestContext requestContext, ServiceRemotingMessageHeaders messageHeaders, byte[] requestBody)
        {
            byte[] col;
            messageHeaders.TryGetHeaderValue("X-CorrelationID", out col);
            if(col!=null && col.Any())
            {
                CallContext.LogicalSetData("X-CorrelationID", ASCIIEncoding.UTF8.GetString(col));
            }
            return base.RequestResponseAsync(requestContext, messageHeaders, requestBody);
        }
    }
~~~

### Reliable Actor

~~~
    public class CustomActorRemotingDispatcher: ActorServiceRemotingDispatcher
    {
        public CustomActorRemotingDispatcher(ActorService actorService)
            : base(actorService)
        {
        }

       
        public override void HandleOneWay(IServiceRemotingRequestContext requestContext, ServiceRemotingMessageHeaders messageHeaders, byte[] requestBody)
        {
            byte[] col;
            messageHeaders.TryGetHeaderValue("X-CorrelationID", out col);
            if (col != null && col.Any())
            {
                CallContext.LogicalSetData("X-CorrelationID", ASCIIEncoding.UTF8.GetString(col));
            }
            base.HandleOneWay(requestContext, messageHeaders, requestBody);
        }

        public override Task<byte[]> RequestResponseAsync(IServiceRemotingRequestContext requestContext, ServiceRemotingMessageHeaders messageHeaders, byte[] requestBody)
        {
            byte[] col;
            messageHeaders.TryGetHeaderValue("X-CorrelationID", out col);
            if(col!=null && col.Any())
            {
                CallContext.LogicalSetData("X-CorrelationID", ASCIIEncoding.UTF8.GetString(col));
            }
            return base.RequestResponseAsync(requestContext, messageHeaders, requestBody);
        }
    }
~~~

## Client

Now that the service can incept incoming request to inspect the header. We need client to be able include such header. We can use *ServiceProxyFactory* with wrapped *IServiceRemotingClientFactory* and *IServiceRemotingClient* and intercept the service calls.[StackOverflow](http://stackoverflow.com/questions/34166193/how-to-add-message-header-to-the-request-when-using-default-client-of-azure-serv).

~~~
  public class ServiceRemotingClientFactoryWrapper : IServiceRemotingClientFactory
    {
        public event EventHandler<CommunicationClientEventArgs<IServiceRemotingClient>> ClientConnected;
        public event EventHandler<CommunicationClientEventArgs<IServiceRemotingClient>> ClientDisconnected;

        private readonly IServiceRemotingClientFactory _inner;

        public ServiceRemotingClientFactoryWrapper(IServiceRemotingClientFactory inner)
        {
            _inner = inner;
        }

        public async Task<IServiceRemotingClient> GetClientAsync(ResolvedServicePartition previousRsp,
            TargetReplicaSelector targetReplicaSelector, 
            string listenerName,
            OperationRetrySettings retrySettings,
            CancellationToken cancellationToken)
        {
            var client = await _inner.GetClientAsync(previousRsp, targetReplicaSelector, listenerName, retrySettings, cancellationToken);
            return new ServiceRemotingClientWrapper(client);
        }

        public async Task<IServiceRemotingClient> GetClientAsync(Uri serviceUri,
            ServicePartitionKey partitionKey,
            TargetReplicaSelector targetReplicaSelector,
            string listenerName, 
            OperationRetrySettings retrySettings,
            CancellationToken cancellationToken)
        {
            var client = await _inner.GetClientAsync(serviceUri, partitionKey, targetReplicaSelector, listenerName, retrySettings, cancellationToken);
            return new ServiceRemotingClientWrapper(client);
        }

        public Task<OperationRetryControl> ReportOperationExceptionAsync(IServiceRemotingClient client,
            ExceptionInformation exceptionInformation, 
            OperationRetrySettings retrySettings, 
            CancellationToken cancellationToken)
        {
            return _inner.ReportOperationExceptionAsync(((ServiceRemotingClientWrapper)client).Client, exceptionInformation, retrySettings, cancellationToken);
        }

        private class ServiceRemotingClientWrapper : IServiceRemotingClient
        {
            private IServiceRemotingClient client;

            public ServiceRemotingClientWrapper(IServiceRemotingClient client)
            {
                this.client = client;
            }

            internal IServiceRemotingClient Client
            {
                get
                {
                    return client;
                }

                
            }

            public ResolvedServiceEndpoint Endpoint
            {
                get
                {
                    return client.Endpoint;
                }

                set
                {
                    client.Endpoint = value;
                }
            }

            public string ListenerName
            {
                get
                {
                    return client.ListenerName;
                }

                set
                {
                    client.ListenerName = value;
                }
            }

            public ResolvedServicePartition ResolvedServicePartition
            {
                get
                {
                    return client.ResolvedServicePartition;
                }

                set
                {
                    client.ResolvedServicePartition = value;
                }
            }

            public Task<byte[]> RequestResponseAsync(ServiceRemotingMessageHeaders messageHeaders, byte[] requestBody)
            {
                var correlation=  CallContext.LogicalGetData("X-CorrelationID");
                messageHeaders.AddHeader("X-CorrelationID",correlation==null?Guid.NewGuid().ToByteArray(): ASCIIEncoding.UTF8.GetBytes(correlation.ToString()));
                return client.RequestResponseAsync(messageHeaders, requestBody);

            }

            public void SendOneWay(ServiceRemotingMessageHeaders messageHeaders, byte[] requestBody)
            {
                var correlation = CallContext.LogicalGetData("X-CorrelationID");
                messageHeaders.AddHeader("X-CorrelationID", correlation == null ? Guid.NewGuid().ToByteArray() : ASCIIEncoding.UTF8.GetBytes(correlation.ToString()));

                client.SendOneWay(messageHeaders, requestBody);
            }
        }
    }
~~~

Then, proxy can used as 

~~~
        public static async Task<T> GetProxy<T>(string serviceName) where T : IService
        {
            ServiceUriBuilder builder = new ServiceUriBuilder(serviceName);
            var serviceUri = builder.ToUri();
            var list = await fc.QueryManager.GetPartitionListAsync(serviceUri);
            if (list.Count > 0)
            {
                var int64RangePartitionInformation
                    = list[0].PartitionInformation as Int64RangePartitionInformation;
                if (int64RangePartitionInformation != null)
                {
                    long minKey = int64RangePartitionInformation.LowKey;
                    var  _proxyFactory = new ServiceProxyFactory(c => new ServiceRemotingClientFactoryWrapper(
                     // we can use any factory here
                     new WcfServiceRemotingClientFactory(callbackClient: c)));
                    var proxy = _proxyFactory.CreateServiceProxy<T>(serviceUri, new ServicePartitionKey(minKey));
                    //ServiceProxy.Create<T>(serviceUri, new ServicePartitionKey(minKey));
                    return proxy;
                }
            }
            return default(T);
        }

        public static Task<T> GetActorProxy<T>(string serviceName,ActorId id) where T : IActor
        {
            ServiceUriBuilder builder = new ServiceUriBuilder(serviceName);
            var serviceUri = builder.ToUri();
   
     
            var _proxyFactory = new ActorProxyFactory(s => new ServiceRemotingClientFactoryWrapper(
                new WcfServiceRemotingClientFactory(callbackClient: s)));
            return Task.FromResult(_proxyFactory.CreateActorProxy<T>(serviceUri, id));
        }
~~~

