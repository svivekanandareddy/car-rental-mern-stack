// server/configs/imageKit.js (patched - safe guard)
import 'dotenv/config';
import ImageKit from 'imagekit';

const PUBLIC = process.env.IMAGEKIT_PUBLIC_KEY;
const PRIVATE = process.env.IMAGEKIT_PRIVATE_KEY;
const URL = process.env.IMAGEKIT_URL_ENDPOINT;

let imagekit = null;
if (PUBLIC && PRIVATE && URL) {
  imagekit = new ImageKit({
    publicKey: PUBLIC,
    privateKey: PRIVATE,
    urlEndpoint: URL,
  });
} else {
  console.warn("ImageKit keys missing - image upload disabled in dev mode.");
  imagekit = {
    upload: async (options) => {
      return { url: "", response: "stub" };
    },
    // add other stub methods as needed by the app
  };
}

export default imagekit;
