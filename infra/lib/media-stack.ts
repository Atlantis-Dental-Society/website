import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as ses from "aws-cdk-lib/aws-ses";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";

export class AdsMediaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import the existing S3 bucket
    const mediaBucket = s3.Bucket.fromBucketName(
      this,
      "AdsMediaBucket",
      "ads-atlantis-media",
    );

    // Use AWS managed CachingOptimized policy (free tier compatible)
    const distribution = new cloudfront.Distribution(this, "MediaCdn", {
      comment: "ADS media CDN",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(mediaBucket),
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      httpVersion: cloudfront.HttpVersion.HTTP2,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      minimumProtocolVersion:
        cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      enableIpv6: true,
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: mediaBucket.bucketName,
    });

    // SES domain identity for sending notifications
    const emailIdentity = new ses.EmailIdentity(this, "AdsEmailIdentity", {
      identity: ses.Identity.domain("atlantisdentalsociety.ca"),
    });

    new cdk.CfnOutput(this, "SesIdentityName", {
      value: emailIdentity.emailIdentityName,
    });
  }
}
