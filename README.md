## Setup

To get started, navigate to the inside of the folder, and run `yarn start`

**Note:** The default port for the project is 3001. If this needs to change, please create a .env file and add `PORT=PORT_NUMBER_HERE` (Replace "PORT_NUMBER_HERE" with your desired port number) then run `yarn start`

## GET: /v1/zips (Display)

## POST: /v1/zips/{zip_code} (Insert)

No post data required

## DELETE: /v1/zips/{zip_code} (Delete)

No post data required

## HEAD: /v1/zips/{zip_code} (Has)

A header `X-Zip-Exists` is set to determine if ZIP exists, as well as an appropriate HTTP error code .
