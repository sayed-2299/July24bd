# July24bd

A web application for supporting and managing relief for victims of the July 24 tragedy. Built with Next.js, TypeScript, MongoDB, and Cloudinary.

## Features
- Victim reporting and verification (UNO/Admin)
- Donor dashboard and fund management
- Nominee fund requests and tracking
- Image/document uploads (Cloudinary)
- Gallery and articles
- Role-based authentication

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/sayed-2299/July24bd.git
cd July24bd
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run the Development Server
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## GitHub Workflow

### Initial Push (already done)
```sh
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/sayed-2299/July24bd.git
git branch -M main
git push -u origin main
```

### For Future Updates
```sh
git add .
git commit -m "Describe your changes"
git push
```

## Folder Structure
- `app/` - Next.js app directory (pages, API routes, components)
- `models/` - Mongoose models
- `public/images/` - Static images for slideshows, etc.
- `components/` - Shared React components
- `lib/` - Utility libraries (Cloudinary, MongoDB, etc.)

## Adding Images to the Slideshow
1. Place your images in `public/images/` (e.g., `slide1.jpg`, `slide2.jpg`).
2. Edit `app/page.tsx` and update the `heroImages` array:
   ```js
   const heroImages = [
     "/images/slide1.jpg",
     "/images/slide2.jpg",
     "/images/slide3.jpg",
   ]
   ```

## License
This project is for educational and humanitarian purposes. 