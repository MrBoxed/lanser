# 📁 Lanser – Lightweight Cloud Storage with React, Node.js & SQLite

## 📝 Project Description

**Lanser** is a lightweight and secure cloud-based file storage platform that allows users to upload, manage, and access their files from any device.

Designed for simplicity, privacy, and local control, Lanser gives users a personal “digital haven” for storing documents, media, and more. It’s ideal for solo developers, small teams, or educational purposes where a full cloud solution like Google Drive would be overkill.

Unlike large-scale cloud platforms, **Lanser** uses **SQLite** — a fast, file-based database — making it perfect for local setups, desktop apps, or small-scale deployments.

---

## ⚙️ Tech Stack

### 🔹 Frontend

- **React** (with optional TypeScript)
- **Tailwind CSS** for styling
- **Axios** or native **Fetch API** for backend communication
- **Framer Motion** for smooth animations and UI polish

### 🔹 Backend

- **Node.js** with **Express.js**
- **Multer** for handling file uploads
- **SQLite** using the `sqlite3` Node package
- **JWT** or **session-based** authentication for user access control

### 🔹 Database

- **SQLite** – a fast, lightweight SQL database stored as a local file

---

## 🚀 Core Features

- 📁 Upload and store files (music, books, movies)
- 🔐 User authentication and access control (login/register)
- 🗂️ Organize files into folders or categories
- 🔍 Search and filter files by name, type, or date
- 💾 Choose between local or cloud-based storage (pluggable backends)
- 🧾 File metadata management: name, size, MIME type, createdAt
- 🗑️ Soft-delete or permanently delete files
- 🖼️ File preview support (e.g., images, PDFs, etc.)

---

## 🎯 Use Cases

- 🧍 Personal file storage alternative
- 💻 Lightweight cloud drive for desktop environments
- 🧑‍💼 Internal file manager for freelancers and small teams
- 📚 Educational tool for learning file I/O, auth, and database integration in Node.js
