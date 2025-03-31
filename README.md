# Team Updates App

A modern web application for sharing team updates with image support. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 Secure authentication
- 📝 Create and view team updates
- 🖼️ Upload and display images
- 💅 Custom team color scheme
- 📱 Responsive design

## Getting Started

1. Clone the repository
```bash
git clone [your-repo-url]
cd excalibur
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```env
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
UPLOADTHING_TOKEN="your-uploadthing-token"
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [UploadThing](https://uploadthing.com/) - File uploads
- [PostgreSQL](https://www.postgresql.org/) - Database

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a Pull Request

## License

MIT License - feel free to use this project for your own team!
