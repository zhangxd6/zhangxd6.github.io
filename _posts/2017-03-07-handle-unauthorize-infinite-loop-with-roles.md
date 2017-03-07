---
layout: post
title: handle role based unauthorized infinite loop
tags:
  - webapi
  - authorization
  - security
  - identityserver3
---
Asp.net provide **Authorize** attribute to decorate the controllers or actions with authorization control. The identityserver provide nice framework to archive the sigle sign with oAuth protocol. However when we scope the access to the certain roles and the request fails to be authorized, it creates a infinite call loop to the identity server implemented with identityserver3 without tweeking.

<!--more-->
When a authenticated user tries to access a resource that is out of his/her role of authorization. The Authoriz attribute finds out the user is not authorized, then a 401 unauthorized reponse if generated and redirects to IdentityServer instance for authorization again. At the point, the identityserver says, he is authorized and you can proceed. However the user is not in the role, the 401 is generated again; so the redirecton happens again and again. Now we are in infinite loop. The way out of the loop, is to let authorize generated 403 forbidden status. Unfortunately, AuthorizeAttribute is not implemented
such way by default, we have to roll our enhanced version.

```
        public class RoleAuthorizeAttribute: AuthorizeAttribute
```

we override the **HandleUnauthorizedRequest** to deal this

```
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (!filterContext.HttpContext.User.Identity.IsAuthenticated)
            {
                base.HandleUnauthorizedRequest(filterContext);
            }
            else
            {
                //return 403 instead of 401 to avoid dead loop
                throw new HttpException(403, "Access Denied");
            }
        }
```
