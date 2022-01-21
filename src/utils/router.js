import sharp from 'sharp';

export const normalizeUserAvatar = async (initialBuffer) => {
  const normalizedAvatarBuffer = await sharp(initialBuffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();

  return normalizedAvatarBuffer;
};

export const handleError = (error, req, res, next) => {
  res.status(400).send({ error: error.message });
};
