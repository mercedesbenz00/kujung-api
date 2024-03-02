import ogs from 'open-graph-scraper';
import sharp from 'sharp';
import getMetaData from 'metadata-scraper';
export const makeSuccessResponse = (data, message = null) => {
  return {
    success: true,
    errCode: null,
    errMsg: null,
    message: message || undefined,
    data: data,
  };
};

export const makeFailureResponse = (errCode, errMsg, data = null) => {
  return {
    success: false,
    errCode: errCode,
    errMsg: errMsg,
    data: data,
  };
};

const getYouTubeID = (url) => {
  if (/youtu\.?be/.test(url)) {
    // Look first for known patterns
    let i;
    const patterns = [
      /youtu\.be\/([^#\&\?]{11})/, // youtu.be/<id>
      /\?v=([^#\&\?]{11})/, // ?v=<id>
      /\&v=([^#\&\?]{11})/, // &v=<id>
      /embed\/([^#\&\?]{11})/, // embed/<id>
      /\/v\/([^#\&\?]{11})/, // /v/<id>
    ];

    // If any pattern matches, return the ID
    for (i = 0; i < patterns.length; ++i) {
      if (patterns[i].test(url)) {
        return patterns[i].exec(url)[1];
      }
    }

    // If that fails, break it apart by certain characters and look
    // for the 11 character key
    const tokens = url.split(/[\/\&\?=#\.\s]/g);
    for (i = 0; i < tokens.length; ++i) {
      if (/^[^#\&\?]{11}$/.test(tokens[i])) {
        return tokens[i];
      }
    }
  }

  return null;
};

export const getYoutubeThumbUrl = (url) => {
  let thumbnail = null;
  try {
    let id = getYouTubeID(url);

    if (!id && url.length === 11) {
      id = url;
    }

    thumbnail = 'http://img.youtube.com/vi/' + id + '/hqdefault.jpg'; // default, mqdefault
  } catch (error) {}
  return thumbnail;
};

export const getScrapImageUrlDeprecated = async (url) => {
  let ret = null;
  try {
    const ogResults = await ogs({
      url: encodeURI(url),
    });
    if (ogResults && ogResults.result && ogResults.result.success) {
      if (Array.isArray(ogResults.result.ogImage)) {
        console.log(
          'ogResults.result.ogImage: array',
          ogResults.result.ogImage,
        );
        if (ogResults.result.ogImage && ogResults.result.ogImage.length) {
          ret = ogResults.result.ogImage[0].url;
        }
      } else if (typeof ogResults.result.ogImage === 'object') {
        console.log('ogResults.result.ogImage', ogResults.result.ogImage);
        const imageInfo = ogResults.result.ogImage as any;
        ret = imageInfo?.url;
      }
    }
  } catch (error) {
    console.log('error', error);
  }
  return ret;
};

export const getScrapImageUrl = async (url) => {
  let ret = null;

  try {
    const result = await getMetaData(url);

    if (result && result.image) {
      ret = result.image;
    }
    console.log('getScrapImageUrl', url, ret);
  } catch (error) {
    console.log('getScrapImageUrl-error', error);
  }
  return ret;
};

export const getResizeImage = async (buffer, width, height) => {
  return await sharp(buffer, { failOnError: false })
    .resize(width, height)
    .toBuffer();
};
