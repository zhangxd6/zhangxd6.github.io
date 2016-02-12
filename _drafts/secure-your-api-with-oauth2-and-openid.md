---
layout: default
title: secure your webapi with oauth2 and openid using identityserver3
---

One of my projects progesses to the point that we need to have Access Authorization and Authetication. Since the project is 
a combination of native service, web application and web api. It is natural for me to sought the OAuth2 and OpenId.
<!--more-->

##Requirements

There are three major requirements as far as secure the access of WebApi and web application.

1. A process or a service(web/native) can access the web api 
 
2. A user can interact with web application and the application can impersonate user to access the webapi

3. we want it ties to window domain user accout for role based access control

##OAuth2 and OpenId Connect

>OAuth 2.0 is the next evolution of the OAuth protocol which was originally created in late 2006. 
>OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for web applications, 
>desktop applications, mobile phones, and living room devices. 
>
> from oaut.net/2

OAuth2 is security access token protocal that provides authorization or delegated authorization for your application to 
access backend service or resources. 

OpenID connect is a identity layer on top of OAuth2 to provide authentication by defining identity tokens and
standard token type (interoperatable), standard cryptography , validation procedures, combine authentication with short/long-lived
delegated API access, have flows to web or native applications

There are three endpoints needed to meet the specification 

* Authorizate Endpoint: where Human to Machine interaction to perform authentication and authorization.
* Token Endpoint: where machine to machine interaction to allow the access token be requested
* UserInfo Endpoint: where additional info of authenticated user can be requested

How to interact with these endpoint will be determined by the type of application and the flow of it is going to use.

####Flows 
* Implicit Flow - 

 >1.Client prepares an Authentication Request containing the desired request parameters.
 >
 >2.Client sends the request to the Authorization Server.
 >
 >3.Authorization Server authenticates the End-User.
 >
 >4.Authorization Server obtains End-User Consent/Authorization.
 >
 >5.Authorization Server sends the End-User back to the Client with an ID Token and, if requested, an Access Token.
 >
 >6.Client validates the tokens and retrieves the End-User's Subject Identifier.
 >
 > from https://openid.net/specs/openid-connect-implicit-1_0.html#ImplicitFlow
 
* Authorization Code flow 
 
 >1.Client prepares an Authentication Request containing the desired request parameters.
 >
 >2.Client sends the request to the Authorization Server.
 >
 >3.Authorization Server authenticates the End-User.
 >
 >4.Authorization Server obtains End-User Consent/Authorization.
 >
 >5.Authorization Server sends the End-User back to the Client with code.
 >
 >6.Client sends the code to the Token Endpoint to receive an Access Token and ID Token in the response.
 >
 >7.Client validates the tokens and retrieves the End-User's Subject Identifier.
 >https://openid.net/specs/openid-connect-core-1_0.html
* Hybird Flow
 
 >1.Client prepares an Authentication Request containing the desired request parameters.
 >
 >2.Client sends the request to the Authorization Server.
 >
 >3.Authorization Server Authenticates the End-User.
 >
 >4.Authorization Server obtains End-User Consent/Authorization.
 >
 >5.Authorization Server sends the End-User back to the Client with an Authorization Code and, depending on the Response Type, one or more additional parameters.
 >
 >6.Client requests a response using the Authorization Code at the Token Endpoint.
 >
 >7.Client receives a response that contains an ID Token and Access Token in the response body.
 >
 >8.Client validates the ID Token and retrieves the End-User's Subject Identifier.
 >https://openid.net/specs/openid-connect-core-1_0.html

##Implementation
 We decided to use OpenId connect Hybird to facilate the end-user authentication and authorization in conjuction with ws federation to
 bring the window authentication as enternal authentication provider. As far as service to webapi, we are going to use client credetial 
 flow of OAuth2 since both are inside our security perimeter.
 We opted for popular .net implementation if OAuth2/OpenId Connect: Thinketecture Identity Server3 
 
### Window Authentication
 
### MVC Hybird Flow
 
 


