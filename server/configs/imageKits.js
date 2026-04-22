import ImageKit from '@imagekit/nodejs';
import dotenv from 'dotenv';

dotenv.config();

const imageKit = new ImageKit({
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

export default imageKit;