/** @format */

export const production = false;

export default {
  // TODO: change api
  // api: production ? "https://api.growpvp.com" : "https://api.growpvp.com",
  api: "https://api.growpvp.com",
  socket: "https://api.growpvp.com",
  h_captcha_key: production
    ? "495be111-f6a7-4ca5-9b8f-d0149998a742"
    : "20000000-ffff-ffff-ffff-000000000002",
};
