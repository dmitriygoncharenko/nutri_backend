import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import { s3Config } from "src/config/s3.config";
import axios from "axios";
// import imagemin from "imagemin";
// import imageminPngquant from "imagemin-pngquant";

@Injectable()
export class S3Service {
  private s3: S3;

  // async minifyImageBuffer(imageBuffer: Buffer) {
  //   try {
  //     const result = await imagemin.buffer(imageBuffer, {
  //       plugins: [
  //         imageminPngquant({
  //           quality: [0.6, 0.8],
  //         }),
  //       ],
  //     });
  //     return result; // This is a Buffer of the minified image
  //   } catch (error) {
  //     console.error("Error minifying image:", error);
  //     throw error; // Rethrow or handle as needed
  //   }
  // }

  async uploadFile(fileName: string, b64string: string) {
    let buf = Buffer.from(b64string, "base64");
    // buf = await this.minifyImageBuffer(buf);

    const s3 = new S3({
      ...s3Config(),
      s3ForcePathStyle: true,
      region: "ru-1",
      apiVersion: "latest",
    });
    const bucketParams = {
      Bucket: "28cccca7-a4a6083c-5d86-48e1-9443-f3e3a71dacd5",
    };
    const uploadParams = { Bucket: bucketParams.Bucket, Key: "", Body: null };
    uploadParams.Body = buf;
    uploadParams.Key = fileName;

    const res = await s3.upload(uploadParams).promise();
    console.log("Success", res);
  }
}
