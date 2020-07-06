---
date: '2020-07-06'
tagline: 'Including domain registration, certificates, redirects, and fast content delivery'
image: 'https://i.ibb.co/r2P3Fd1/Untitled-Diagram-8.png'
---

# Step-by-step guide to hosting a static site on AWS

In this guide, I detail all of the steps necessary to host a static site on AWS services.
I use Route53 to register the domain, Certificate Manager for HTTPs, S3 as the origin server, and CloudFront as the content delivery network.
If you want the power and flexibility of the AWS ecosystem, this is will be a great guide for you.

As an aside, there are many ways to host content on the web, and AWS is not super developer-friendly.
If you are not particular about the provider, you may want to start with something simpler, such as [Netlify](https://www.netlify.com/), [Surge](https://surge.sh/), [Begin](https://begin.com/?home=true), or [Vercel](https://vercel.com/), just to name a few.

![System design diagram](https://i.ibb.co/r2P3Fd1/Untitled-Diagram-8.png)

## Route53

Route53 is the AWS domain name registration service. It enables you to purchase new domain names and configure all of the necessary routing information.

* First, go to Route53 > Domains > Registered Domains and click the "Register Domain" button
* Find the domain that you want and go through the purchase forms
* Some time after a successful purchase, you will see this domain pop up under "Hosted Zones"
* At this point the domain has two record sets, NS and SOA
* Congratulations, you own a piece of the web :D

## Certificate Manager

I use AWS Certificate Manager to set up certs so that the new domain can be used securely over HTTPS. The idea here is that once we have been given a certificate for a domain, we need to prove to AWS that we actually own that domain. Since we just purchased our domain on AWS, this is very easy. We let AWS know that our domain can be found in Route53, and we allow AWS to add a new record set to our hosted zone that will complete the verification.

* Go to the Certificate Manager in the AWS console
* Click the button to "Request a certificate"
* Input the domain that you registered above using Route53 (e.g. "example.com")
* Choose to validate the certificate using DNS validation (not email)
* Finish the registration process
* Check that the certificate manager now has a new domain with validation status pending
* Expand the domain item and click "Create record in Route 53"
* After some time, the validation status will change to "Success"
* You can go back to Route53 and check that the hosted zone has a new CNAME record set, it should conain "acm-validations.aws"

## S3

We need to put our content somewhere so that it can be served to the public. Since our content is static we will use AWS's Simple Storage Service (S3) for this. By default, AWS locks down public access behind multiple safegaurds. We will need to turn off these guards and explicity grant public access.

* Go to S3 in the AWS console
* Create a bucket that has the *exact same* name as your domain (e.g. "example.com")
* While configuring the bucket permissions, uncheck "Block all public access" since our bucket needs to be publicly accessable. You can also do this after the bucket has been created.
* Click on the bucket > Properties > Static website hosting > Use this bucket to host a website
* Use "index.html" as the index document and save
* You should see the new Endpoint of the hosting service, copy this because we will need it later
* Click on Permission tab > Bucket policy and copy/paste the json below. Replace the domain name with your own. This makes every item within the bucket accessable.
* Under Permission tab, click on "Access Control List", Public Access Everyone, and select "List objects", save.
* Check that the bucket now has a yellow tag saying "Public"
* Upload your website to this bucket making sure that "index.html" is at the toplevel
* Check that all of the contents are in listed in the Bucket "Overview" tab

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::mywebsite.com/*"
            ]
        }
    ]
}
```

> Protip: use the aws cli to upload content from a local folder

```bash
aws s3 sync ./public s3://mywebsite.com
```

## CloudFront

At this point we could configure Route53 to point to your S3 bucket and call it a day. However, we go a step further here so that the content can be delivered over a CDN provided by AWS using CloudFront. CloudFront will sit between the DNS (Route53) and the origin server (S3) so that site visitors can receive content from nearby cache locations and significantly reduce latency.

* Go to CloudFront in the AWS console
* Click "Create distribution" and choose a web distribution
* For the Origin Domain Name, do not select the S3 bucket from the dropdown list. Instead, use the website endpoint that we copied from S3 earlier. For example, this will look like `example.com.s3-website.us-west-1.amazonaws.com`.
* Set the Viewer Protocol Policy as "Redirect HTTP to HTTPS"
* Under Distribution Settings, add an Alternate Domain Name (CNAME) with the same domain name used on the SSL Certificate (e.g. example.com)
* Set a Custom SSL Certificate to the name of the certificate you just created (it should be in the drop down list). No need to Request or Import a Certificate.
* Set the Default Root Object as `index.html`
* Complete the distribution configuration form
* Check that a new distribution shows up in the console with "Status: In Progress"
* Copy the Domain Name of the new distribution (e.g. id.cloudfrount.net)
* Go back to the Route53 hosted zone and create a new record with Type A (Alias), Alias: Yes, and the Alias Target set to the distribution domain name (just paste the distribution domain name into the Alias Target box)
* Check that the certificate in the Certificate Manager now says "In Use: Yes"
* After some time, check that the new distribution has "Status: Deployed"

## Done

At this point, you should be able to pull up a browser and navigate to your new site.
If it is not there, try waiting for a few minutes, it can take some time for all of the new services to come online, especially the DNS.
If the site is still not showing up, trace your steps through the guide to see if you overlooked something.