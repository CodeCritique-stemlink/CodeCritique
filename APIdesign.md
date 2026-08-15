# CodeCritic API Design Document

## 1. Overview & Architectural Style

**API Style** : REST
**Base URL**  : http://localhost:4000/api
**Format**    : JSON for requests and response

**Global Headers**: 
  * `Content-Type: application/json`
  * `Authorization: Bearer <JWT_TOKEN>`

## 2. Endpoint Specifications

## Get user profile

**Endpoint**   : `/profile`
**Method**     : `GET`

Success Response (200 OK):

```JSON
{
    "success": true,
    "message": "User profile retrieved successfully",
    "user": {
        "id": 1,
        "clerkId": "user_3HEGpTZsv0Fw0JuhhrjMd0lqxDN",
        "email": "john@gmail.com",
        "firstName": "john",
        "lastName": "dev",
        "userName": "j_dev",
        "profileImageUrl": "",
        "karmaPoints": 0,
        "createdAt": "2026-07-28T12:51:02.107Z",
        "updatedAt": "2026-07-28T12:51:02.107Z",
        "interestedTags": [],
        "submissions": []
    }
}
```

## Update user profile

**Endpoint**   : `/profile`
**Method**     : `PUT`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@gmail.com",
  }
}
```

## delete user profile

**Endpoint**   : `/profile`
**Method**     : `DELETE`


## Get user profile by user name

**Endpoint**   : `/profile/username`
**Method**     : `GET`


### Create a New Post

**Endpoint**   : `/submissions`
**Method**     : `POST`

Request Payload:

```JSON

        {
           "title":"create nav bar",
           "description":"Create detailed nav bar useing next.js",
           "githubUrl":"https://github.com/"
            
        }
        ```

Success Response (200 OK):
        {
    "success": true,
    "data": {
        "id": 1,
        "userId": 1,
        "title": "create nav bar",
        "description": "Create detailed nav bar",
        "githubUrl": "https://github.com/",
        "status": "PENDING",
        "createdAt": "2026-08-14T12:53:30.568Z",
        "updatedAt": "2026-08-14T12:53:30.568Z",
        
    }
} 
```

### Get all posts

**Endpoint**   : `/submissions`
**Method**     : `GET`


Success Response (200 OK):

```JSON        {
    "success": true,
    "data": {
        "id": 1,
        "userId": 1,
        "title": "create nav bar",
        "description": "Create detailed nav bar",
        "githubUrl": "https://github.com/",
        "status": "PENDING",
        "createdAt": "2026-08-14T12:53:30.568Z",
        "updatedAt": "2026-08-14T12:53:30.568Z",
        
    }
}
```

### Update post

**Endpoint**   : `/submissions/:id`
**Method**     : `PUT`

Request Payload:
```JSON
        {
           "title":"create nav bar",

        }
```
### Delete post

**Endpoint**   : `/submissions/:id`
**Method**     : `DELETE`

### Get review criteria by ID

### Get review criteria by submission ID

### Delete review Criteria



