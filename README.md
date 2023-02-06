Project for personal portfolio webpage using MERN stack

## Instructions for Setup & Deployment
1. Run the command `npm install`. 
2. Have the following in a `.env` file at the project root.

```
#mongoDB
MONGODB_URI=<mongoDB atlas connection url>

#email sending
SMTP_HOST=<gmail smtp>
SMTP_USERNAME=<email>
SMTP_PASSWORD=<app passord>

BCRYPT_SALT_ROUNDS=<number>
JWT_SECRET_KEY=<secret key>

#AWS S3
AWS_BUCKET_NAME=<AWS bucket name>
AWS_DEFAULT_REGION=<AWS region>
AWS_ACCESS_KEY_ID=<AWS access key>
AWS_SECRET_ACCESS_KEY=<AWS secret access key>
```

3. Run `npm run dev`

