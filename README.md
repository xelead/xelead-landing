# Xelead Landing page

## Getting Started

First, run:

```bash
npm install
```

Then run the development server (using the package manager of your choice):

```bash
npm run dev
```


## CDN And Public Assets

Public files are saved in CloudFlare's R2.
To get access key you should do it using R2 UI -> Generate Token (generating from accout won't give you S3 credentials)
Then configure AWS CLI with a new profile and use it in every AWS command

Add Cloudflare Profile to AWS if you haven't already:
```shell
aws configure --profile xecloudflare
```

Use AWS CLI to sync public assets
```shell
aws s3 sync --profile=xecloudflare s3://xelead-landing-public ./public \
  --endpoint-url https://bf692fdb0c7dc998b860c3321df6b8d2.r2.cloudflarestorage.com
```

To sync assets from local to CloudFlare
```shell
aws s3 sync --profile=xecloudflare ./public s3://xelead-landing-public \
  --endpoint-url https://bf692fdb0c7dc998b860c3321df6b8d2.r2.cloudflarestorage.com
```

The public URL for CDN is: https://cdn1.xelead.com/

You can also serve public assets from your own CDN by setting `NEXT_PUBLIC_ASSETS_BASE_URL`
before running the build or dev server; 
the site will files from whatever base URL is configured, defaulting back to `/` when the variable is empty.
