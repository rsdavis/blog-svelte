---
date: "2021-02-07"
tagline: "With Subject Alternative Names"
---

# Validating SSL certificates using Terraform

In AWS, you can setup every aspect of your web application, including the domain name, DNS service, and SSL certificates. However, connecting these pieces can get a bit tricky. The Terraform framework allows us to provision all of this infrastructure using configuration rather than the AWS console. This approach is often referred to as "infrastructure-as-code". Taking the time to automate the provisioning process makes the stack easily reproducible and can save time down the road.

In this article, I walk through Terraform configuration for getting an SSL certificate set up with the AWS Certificate Manager and validated using records in the Route53 hosted zone. This becomes more complex when you add Subjective Addition Names (SANs) to the certificate and requires some Terraform tricks.

## Securing a single domain

There are four resources required in this setup.

* `aws_route53_zone` - A hosted zone in Route53 for routing traffic
* `aws_acm_certificate` - An SSL certificate in Certificate Manager for securing the connection
* `aws_route53_record` - A CNAME record in the hosted zone to validate the certificate
* `aws_acm_certificate_validation` - A Terraform-specific resource that waits for the validation process to complete

In order to validate the certificate, AWS gives us a CNAME value that we need to put in the hosted zone. This essentially proves that we own the domain. So, after creating the certificate resource, we create a resource for the Route53 record. Since we registered a single domain on the certificate, we only need to create a single record. The record properties can be found as the first item in the `domain_validation_options` list on the certificate resource, so we simply access this at the zero-index. 

The validation process can take a few minutes, and we need to wait for it to complete before trying to create any other resources that depend on a valid certificate (such as a CloudFront distribution). Terraform provides a convenient way to block until the validation completes via the `aws_acm_certificate_validation` resource. Although this is not strictly required for a working stack, it's helpful to keep all of the provisioning in a single `apply` operation.

```json
data "aws_route53_zone" "zone" {
    name            = "example.com"
    private_zone    = false
}

resource "aws_acm_certificate" "certificate" {

    domain_name                 = "example.com"
    validation_method           = "DNS"

    lifecycle {
        create_before_destroy = true
    }

}

resource "aws_route53_record" "validation" {

    allow_overwrite = true
    zone_id = data.aws_route53_zone.zone.zone_id
    ttl = 60

    name    = aws_acm_certificate.certificate.domain_validation_options.0.resource_record_name
    type    = aws_acm_certificate.certificate.domain_validation_options.0.resource_record_type
    records = [ aws_acm_certificate.certificate.domain_validation_options.0.resource_record_value ]

}

resource "aws_acm_certificate_validation" "check_validation" {
    certificate_arn = aws_acm_certificate.certificate.arn
    validation_record_fqdns = aws_acm_certificate.certificate.domain_validation_options.0.resource_record_name
}

```

## Adding SANs

In a more complex setup, you may want to add more domain names to the certificate. For example, if the domain is "example.com", you may want to also have "api.example.com" or "admin.example.com". This can be accomplished using Subject Alternative Names (SANs), which is a list of subdomains on the certificate that will be secured along with the primary domain. However, each subdomain needs to be validated using a separate CNAME record in the hosted zone. This makes the Terraform configuration a bit more involved.

In the configuration below, I made several changes to accommodate the additional domain names. I added variables for the domain and SANs, and the `aws_route53_record` block now contains a `for_each`. The `for_each` is essentially a templating tool. It lets Terraform know that we actually want multiple resources, one for each validation record, but expressed within a single block. For this to work, I `concat` the list and then convert it to a set.

If you have some experience here, you may be wondering why we don't just loop through `aws_acm_certificate.certificate.domain_validation_options` within the `aws_route53_record` block. The reason is that Terraform doesn't know how many elements are in the `domain_validation_options` list until apply time. This means that we cannot use it within the `for_each`. Unfortunately, the Terraform documentation uses this approach in their example, but it will not work without targeting.  Instead, we create our own list for the loop, since this is known before apply time, and then reference the `domain_validation_options` from the `validations` map that is created as a local variable.

One more change is that we now need to wait for each record to validate before moving on with the provisioning process. So, in the `aws_acm_certificate_validation` we change the zero-index to use `domain_validation_options[*].resource_record_name`.

```json
variable "certificate_domain" {
    type = string
    description = "The domain of the static site, eg example.com"
}

variable "certificate_sans" {
    type = list(string)
    description = "List of subject alternative names"
}

locals {
    validations = {
        for option in aws_acm_certificate.certificate.domain_validation_options :
        option.domain_name => option
    }
}

data "aws_route53_zone" "zone" {
    name            = "example.com"
    private_zone    = false
}

resource "aws_acm_certificate" "certificate" {

    domain_name                 = var.certificate_domain
    subject_alternative_names   = var.certificate_sans
    validation_method           = "DNS"

    lifecycle {
        create_before_destroy = true
    }

}

resource "aws_route53_record" "validation" {

    for_each = toset(concat([var.certificate_domain], var.certificate_sans))

    allow_overwrite = true
    zone_id = data.aws_route53_zone.zone.zone_id
    ttl = 60

    name    = local.validations[each.key].resource_record_name
    type    = local.validations[each.key].resource_record_type
    records = [ local.validations[each.key].resource_record_value ]

}

resource "aws_acm_certificate_validation" "check_validation" {
    certificate_arn = aws_acm_certificate.certificate.arn
    validation_record_fqdns = aws_acm_certificate.certificate.domain_validation_options[*].resource_record_name
}
```

There are a few more points to be made here ...

* If you want to use a wildcard subdomain, `*.example.com`, this approach will not work. The reason is that the validation record used for this subdomain is exactly the same as the primary domain. So, trying to create two identical records will throw an error. You will need to add logic to account for this case. See <a href="https://gist.github.com/chancez/dfaaf799b98698839d65ebba55db7d44" target="_blank">this gist</a>, which outlines a more generalized approach to handle multiple zones and wildcard domains.
* If you purchased the domain name outside of AWS Route53, you will need to associate it with the name servers in the hosted zone in order for the validation to complete.
* The `local.validation` map created here essentially removes the direct dependency from the `for_each` on the certificate. If you don't like this approach, you can use Terraform targeting, which enables you deploy resources in stages and avoid unresolved dependencies.
* <a href="https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html" target="_blank">Here is a good resource</a> to read up on the details involved in the CNAME validation process.