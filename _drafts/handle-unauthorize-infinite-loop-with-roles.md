Asp.net provide **Authorize** to decorate the controllers or actions with authorization control. However when we scope the access 
to the centain roles, it creates a infinite call loop to the identity server implemented with identityserver3

It turns out, Authorize attribute generate 401 unauthorized response which redirects to Identityserver for authorization. Since the
user is authenticated and redirected back. However the user is not in the role, the 401 is generated again. Now we are in these dead
loop. The way out of the loop, is to let authorize generated 403 forbidden status. Unfortunately, AuthorizeAttribute is not implemented
such way, we have to roll our own version.

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
