# NOTES

Because this is a take home test I am not really able to explain how and why I set things up.

## Postman Collection Link
- https://www.getpostman.com/collections/77e893b85147fa60bc5f

### Folder Structure and file names

- I name my respective files prepended with what they are just to make it easier to
search for specifics. So each file is based on a type.


- As I am not dealing with Typescript or classes I generally prefix my 'private' non-exported
members with an '_' just to make it easier and cleaner for the developer to understand
that this is a non-exported member and will only be used within that file.


- As it is a simple project I have just split everything based on routes.
Each 'route' grouping has its own router.


- A router will have a respective 'handler' middleware and 
if warranted based on complexity of business logic will have a matching service.
(I have provided tests for each service).


- There are also new enums and middleware for handling errors and response. This is 
just to create a standardized way of returning a response across out application.


- There is also an enum folder that contains 'frozen' enums for contract statuses as well
as profile types as I wanted to avoid having to miss-type them.

### Extra thoughts

- There are one or two places I added some comments just on thoughts or when I was unsure.


- Since this was a small API normally I would make my core router 'localhost:3001/api/v1/...'
as that was not in the spec I have left that. However I do tend to version my API's.


- I made the npm start command also reset the database on every reboot just for testing purposes.


- Changed profile middleware to rather be on 'res.locals.profile = profile' as this is the standard. 
Not sure if that was something you were looking out for but thought I would mention anyways.
