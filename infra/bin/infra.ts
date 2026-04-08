#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { AdsMediaStack } from "../lib/media-stack";

const app = new cdk.App();

new AdsMediaStack(app, "AdsMediaStack", {
  env: { region: "us-east-1" },
});
