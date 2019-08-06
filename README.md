# Nestjs-Typeorm-Auth

> ### NestJS + Typeorm codebase containing a full authentification system with roles, sessions and email verification. It also contains a frontend which is written in Vuejs and shows a sample use of this Authentification API.

----------

## Getting started

### Installation

Clone the repository

```bash
git clone https://github.com/TannerGabriel/Nestjs-Typeorm-Auth.git
```

Switch to the repo folder

```bash
cd Nestjs-Typeorm-Auth
```

Installing dependencies and starting the servers

Backend:
```bash
cd backend
npm install
npm run start
```

Frontend:
```bash
cd client
npm install
npm run serve
```

The backend needs to be configurated using a .env file which needs to hold the following parameters.
```bash
# Password encryption
SECRET_KEY=

# Database settings
DB_TYPE=
DB_HOST=
DB_NAME=
DB_PORT=
DB_USER=
DB_PASSWORD=

# Email settings https://nodemailer.com/about/
# Free SMTP accounts https://ethereal.email/
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
EMAIL_USER=
EMAIL_PASSWORD=

# General
PORT=3000
URL="localhost"
```

# Author
Gabriel Tanner

## Support me
<a href="https://www.buymeacoffee.com/gabrieltanner" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details