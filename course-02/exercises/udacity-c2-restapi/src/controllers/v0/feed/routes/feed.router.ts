import { Router, Request, Response } from "express";
import { FeedItem } from "../models/FeedItem";
import { requireAuth } from "../../users/routes/auth.router";
import { config } from "../../../../config/config";
import * as AWS from "../../../../aws";
import axios from "axios";
// import { config } from 'aws-sdk';

const router: Router = Router();

// Filter an image
router.get("/filterimage", requireAuth, async (req: Request, res: Response) => {
  let { image_url } = req.query;
  //   console.log(config.dev);
  if (!config.dev.image_filer_link) {
    res.status(400).json({ message: "Image filter not available" });
    return;
  }

  try {
    const response = await axios({
      method: "get",
      baseURL:  config.dev.image_filer_link,
      url: `/filteredimage?image_url=${image_url}`,
      responseType: "arraybuffer",
    }); 
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all feed items
router.get("/", async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({ order: [["id", "DESC"]] });
  items.rows.map((item) => {
    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });
  res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key
router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (!id) {
    res.status(422).json({ message: "Please pass in a valid ID" });
    return;
  }
  const data = await FeedItem.findByPk(id);

  res.status(200).json(data);
});

// update a specific resource
router.patch("/:id", requireAuth, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const body = req.body;

  if (!id) {
    res.status(422).json({ message: "Please pass in a valid ID" });
    return;
  }

  const data = await await FeedItem.findByPk(id);

  if (body.url) data.url = body.url;
  if (body.caption) data.caption = body.caption;

  await data.save();
  res.status(200).send(data);
});

// Get a signed url to put a new item in the bucket
router.get(
  "/signed-url/:fileName",
  requireAuth,
  async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
  }
);

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const caption = req.body.caption;
  const fileName = req.body.url;

  // check Caption is valid
  if (!caption) {
    return res
      .status(400)
      .send({ message: "Caption is required or malformed" });
  }

  // check Filename is valid
  if (!fileName) {
    return res.status(400).send({ message: "File url is required" });
  }

  const saved_item = await FeedItem.create({
    caption: caption,
    url: fileName,
  });

  //   const saved_item = await item.save();

  saved_item.url = AWS.getGetSignedUrl(saved_item.url);
  res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
