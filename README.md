
# USOF-BACKEND

Develop an API as the first step in creating your website.

## Requirements

You can easily install those software:

1. `sudo apt install nodejs`
`sudo apt install npm`

2. Then you should download mysql here: 
https://dev.mysql.com/downloads/mysql/

3. Open folder in your terminal and run `npm install`

4. Create your database. If mysql installed run `mysql -u root -p < db.sql` and then input password to your root. This is needed to create important tables. Then register via API at list 5 users and run `mysql -u root -p < testData.sql`. This is needed to see how API works.
## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file

`APP_PORT`
`HOST`
`DB_HOST`
`DB_USER`
`DB_PASS`
`DB_NAME`
`EMAIL_USER`
`EMAIL_PASSWORD`
`ACTIVATION_TOKEN_SECRET`
`ACCESS_TOKEN_SECRET`
`REFRESH_TOKEN_SECRET`
## Deployment

To deploy this project run

```bash
  npm run dev
```


## Using the API

To check this API, use Postman app. It can be used to easily send requests to the urlsdescribed below. The url type is: `http:localhost:3000/api/auth/register`. In order to send data choose `Body` tab and select `x-www-form-urlencoded` radio button and send `key=value` data

#### Here's list of possible user API requests

#### Authorization

| Action | Request | Requirements | Result |
| :- | :-: | :-: | :-: | 
|Register|`POST - /api/auth/register`|json data -> {login, password, passwordConfirmation, email, fullName}|Token send to email|
|Confirm email|`GET - /api/auth/activation/:activationToken`|activation token| Email confirmed, user saved in database |
|Login|`POST - /api/auth/login`|json data -> {login or email, password}|Refresh token returned|
|Logout|`POST - /api/auth/logout`| refreshToken |Clear all cookie|
|Send password-reset|`POST - /api/auth/password-reset`|json -> {email}|Confirm new email|
|Reset Passwoed|`POST - /api/auth/password-reset/:confirm_token`|access token|Email changed|

#### Users

| Action | Request | Requirements | Result |
| :- | :-: | :-: | :-: | 
|Get all users|`GET - /api/users`| Nothing |Show all users|
|Create user|`POST - /api/users`|refreshToken(admin only)|New user saved in database|
|Update avatar|`PATCH - /api/users/avatar`|form-data -> {avatar(.png .jpg)}|User photo updated|
|Get specified user|`GET - /api/users/:user_id`|refreshToken|Specified user displayed|
|Update user|`PATCH - /api/users/:user_id`|json data -> {login, email, fullName}|Confirmation sent to the new email|
|Confirm new email|`GET - /api/users/updateActivation/:activationToken`| access token |Email updated|
|User delete|`DELETE - /api/users`|refreshToken|User deleted|

#### Posts

| Action | Request | Requirements | Result |
| :- | :-: | :-: | -:| 
|Get all posts|`GET - /api/posts`|Nothing|Show all posts|
|Create new post|`POST - /api/posts`|json data -> {title, content, categories}|New post saved in database|
|Get specified post|`GET - /api/posts/:post_id`|Nothing|Show specified post|
|Get comments|`GET - /api/posts/:post_id/comments`|Nothing|Show all comments|
|Create comment|`POST - /api/posts/:post_id/comments`|json data -> {title, content}|New comment saved in database|
|Get categories|`GET - /api/posts/:post_id/categories`|Nothing|Show all post categories|
|Get likes|`GET - /api/posts/:post_id/like`|Nothing|Show all likes to post|
|Create like|`POST - /api/posts/:post_id/like`|json data -> {likeType}|New like/dislike saved in database|
|Update post|`PATCH - /api/posts/:post_id`|json data -> {title, content, categories}|New user saved in database|
|Delete post|`DELETE - /api/posts/:post_id`|refreshToken|Post deleted|
|Delete like|`DELETE - /api/posts/:post_id/like`|refreshToken|Like deleted|

#### Comments

| Action | Request | Requirements | Result |
| :- | :-: | :-: | -:| 
|Get specified comment|`GET - /api/comments/:comment_id`|Nothing|Show specified comment|
|Get likes to comment|`GET - /api/comments/:comment_id/like`|Nothing|Show all likes/dislikes|
|Create like to comment|`POST - /api/comments/:comment_id/like`|json data -> {likeType}|Like created|
|Update comment|`PATCH - /api/comments/:comment_id`|json data -> {title, conetenr}|Comment updated|
|Delete comment|`DELETE - /api/comments/:comment_id`|refreshToken|Comment deleted|
|Delete like to comment|`DELETE - /api/comments/:comment_id/like`|refreshToken|Like deleted|

#### Categories

| Action | Request | Requirements | Result |
| :- | :-: | :-: | -:| 
|Get all categories|`GET - /api/categories`|Nothing|Show all categories|
|Get specified category|`GET - /api/categories/:category_id`|Nothing|Show specified category|
|Get posts related to category|`GET - /api/categories/:category_id/posts`|Nothing|Show category posts |
|Create new category|`POST - /api/categories`|json data -> {title, description}|Category created|
|Update Category|`PATCH - /api/categories/:category_id`|json data -> {title, description}|Category updated|
|Delete category|`DELETE - /api/categories/:category_id`|refreshToken|Category deleted|

### Sorting and filtering **/api/posts/**

| Sorting and Filters | valueTypes |
| :------------ | ---------------:| 
| ?sort=sortType | sortType: {onLikes, onDates} | 
| ?status=statusType | statusType:{active, locked} | 
| ?from=seconds&to=seconds | seconds=1639876438 |  
| ?category[]=First&category[]=Second | category[] - array of categories |  
