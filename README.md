# Swift Comms

<a id="readme-top"></a>

[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

[![Product Name Screen Shot][product-screenshot]](https://swift.nalyd.dev)

> A realtime chat messaging application built on NextJS and Socket IO!

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

As I continue to learn, I decided to challenge myself to make a realtime chat application using web sockets! Below are some of the features this application includes:

- oAuth for full authentication with Google sign-in or Github sign-in
- Prisma ORM which can easily be migrated to any database of choosing, whether that be MySQL, Postgres, Mongo, etc.
- Chat features:
  - Choose a username when prompted to sign in
  - Send real time messages including emojis
  - Create private chatrooms
  - Invite users to chatrooms
  - Leave/delete chatrooms

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

Below are some of the libraries I used to build this application:

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![Mantine]][Mantine-url]
- [![Tailwind]][Tailwind-url]
- [![SocketIO]][SocketIO-url]
- [![Zod]][Zod-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Below are some instructions you can follow in order to run this app locally! If not, feel free to also checkout the [demo](https://swift.nalyd.dev)!

### Installation

1. Retrieve your client ID and client secrets at [Google](https://developers.google.com/identity/protocols/oauth2) and/or [Github](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
2. Clone the repo
   ```sh
   git clone https://github.com/nalyDzzz/swift-comms.git
   ```
3. Navigate to repo directory
   ```sh
   cd swift-comms
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Open `sample.env` and use the reference to make your own `.env` file
6. Run the below command to initialize your database of choice
   ```sh
   npx prisma db push
   ```
7. Run development environment
   ```sh
   npm run dev
   ```
8. Open [localhost:3000](http://localhost:3000)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

- **Add chat message**

[![add-message]][add-message]

- **Add chatroom**

[![add-chatroom]][add-chatroom]

- **Invite user to chat**

[![invite-chatroom]][invite-chatroom]

- **Leave chatroom**

[![leave-chatroom]][leave-chatroom]

- **Delete chatroom**

[![delete-chatroom]][delete-chatroom]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Add voice chatting and video chatting
- [ ] Add friends lists
- [ ] Add roles for chatrooms
- [ ] Add image uploads with uploadthing
- [ ] Multi-language Support
- [ ] Potentially make React Native App

See the [open issues](https://github.com/nalyDzzz/swift-comms/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Dylan - @nalyD. (Discord) - dylanmarin2018@gmail.com

Project Link: [https://github.com/nalyDzzz/swift-comms](https://github.com/nalyDzzz/swift-comms)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/nalyDzzz/swift-comms.svg?style=for-the-badge
[contributors-url]: https://github.com/nalyDzzz/swift-comms/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/nalyDzzz/swift-comms.svg?style=for-the-badge
[forks-url]: https://github.com/nalyDzzz/swift-comms/network/members
[stars-shield]: https://img.shields.io/github/stars/nalyDzzz/swift-comms.svg?style=for-the-badge
[stars-url]: https://github.com/nalyDzzz/swift-comms/stargazers
[issues-shield]: https://img.shields.io/github/issues/nalyDzzz/swift-comms.svg?style=for-the-badge
[issues-url]: https://github.com/nalyDzzz/swift-comms/issues
[license-shield]: https://img.shields.io/github/license/nalyDzzz/swift-comms?style=for-the-badge
[license-url]: https://github.com/nalyDzzz/swift-comms/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/marin-dylan
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Mantine]: https://img.shields.io/badge/MANTINE-3299f0?style=for-the-badge&logo=mantine&logoColor=white
[Mantine-url]: https://mantine.dev/
[Tailwind]: https://img.shields.io/badge/TAILWIND%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[SocketIO]: https://img.shields.io/badge/SOCKET.IO-1b1b1d?style=for-the-badge&logo=socketdotio
[SocketIO-url]: https://socket.io/
[Zod]: https://img.shields.io/badge/ZOD-3068b7?style=for-the-badge&logo=zod
[Zod-url]: https://zod.dev/
[product-screenshot]: public/ss1.png
[add-message]: public/add-message.gif
[add-chatroom]: public/add-chatroom.gif
[invite-chatroom]: public/invite-chatroom.gif
[leave-chatroom]: public/leave-chatroom.gif
[delete-chatroom]: public/delete-chatroom.gif
