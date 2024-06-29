const emailTemplate = (recieptName, verificationLink) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirm Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #dddddd;
      }
      .header {
        text-align: center;
        background-color: #ffa755;
        color: white;
        padding: 10px 0;
        border-radius: 6px;
      }
      .logo-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
      }
      .logo-container h3 {
        font-size: 1.7rem;
        color: #000000;
        font-weight: 600;
      }
      .logo-container img {
        max-width: 70px;
        object-fit: contain;
      }
      .header p {
        color: #212121;
      }

      .content {
        padding: 20px;
        line-height: 1.6;
      }
      .content h1 {
        color: #0073e6;
      }
      .warning-message {
        color: orange;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888888;
        padding: 10px 0;
        border-top: 1px solid #dddddd;
        margin-top: 20px;
      }
      @media only screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
          padding: 10px !important;
        }
          .header{
            padding: 8px;
          }
            .logo-container img{
            width : 50px;
            object-fit : contain;
            }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <div class="logo-container">
          <img
            src="https://res.cloudinary.com/dax7yvopb/image/upload/v1719558424/image-removebg-preview_hbxmkg.png"
            alt="Logo"
          />
          <h3>Bikemart</h3>
        </div>
        <p>Explore various collection of Bikes and buy your favourite one!</p>
      </div>

      <!-- Content -->
      <div class="content">
        <h1>Hello, ${recieptName}!</h1>
        <p>
          Welcome to Bikemart. We are excited to have you on board. Please visit
          following token link to confirm your email:
        </p>
        <a href=${verificationLink}>${verificationLink}</a>
        <p class="warning-message">
          The Token will expire after 30mins. Please confirm within time or
          request again if expired!
        </p>
        <p>Thank you for being with us!</p>
        <p>Best regards,<br />Bikemart Team</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>&copy; 2024 Bikemart. All rights reserved.</p>
        <p>
          <a href="https://www.yourwebsite.com/unsubscribe">Unsubscribe</a> |
          <a href="https://www.yourwebsite.com">www.bikemart.com</a>
        </p>
      </div>
    </div>
  </body>
</html>
`;

module.exports = emailTemplate;
