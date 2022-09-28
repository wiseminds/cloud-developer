export const config = {
  "dev": {
    "username": "postgres",
    "password": "udacity-course-2022",
    "database": "udacity-course",
    "host": "udacity-course.cd5hwzo47qt8.us-east-1.rds.amazonaws.com",
    "dialect": "postgres",
    "aws_region": "us-east-2",
    "aws_profile": "default",
    "aws_media_bucket": "udagram-ruttner-dev"
  },
  "jwt": {
    "secret": "vhxgfchgvjhgcgxfgchgfxdfgch "
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }
}
