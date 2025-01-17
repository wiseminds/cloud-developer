export const config = {
  "dev": {
    "username": process.env.DB_USERNAME, 
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME ,
    "host": process.env.DB_HOST ,
    "dialect": "postgres",
    "aws_region": "us-east-1",
    "aws_profile": process.env.AWS_PROFILE,
    "aws_media_bucket": process.env.S3_BUCKET,
    "image_filer_link": process.env.IMAGE_FILTER
  },
  "jwt": {
    "secret": process.env.SECRET
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }
}




