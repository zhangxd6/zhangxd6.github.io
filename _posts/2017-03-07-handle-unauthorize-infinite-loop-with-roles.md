---
title: handle role based unauthorized infinite loop
date: 2017-03-07 00:00:00 Z
tags:
- webapi
- authorization
- security
- identityserver3
layout: post
---

Asp.net provide **Authorize** attribute to decorate the controllers or actions with authorization control. The identityserver provide a nice framework to archive the single sign with OAuth protocol. However, when we scope the access to the certain roles and the request fails to be authorized, it creates an infinite call loop to the identity server implemented with identityserver3 without tweaking.

<!--more-->
When a authenticated user tries to access a resource that is out of his/her role of authorization. The Authorize attribute finds out the user is not authorized, then a 401 unauthorized response if generated and redirects to IdentityServer instance for authorization again. At the point, the identityserver says, he is authorized and you can proceed. However the user is not in the role, the 401 is generated again; so the redirection happens again and again. Now we are in an infinite loop. The way out of the loop is to let authorize generated 403 forbidden status. Unfortunately, AuthorizeAttribute is not implemented
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
