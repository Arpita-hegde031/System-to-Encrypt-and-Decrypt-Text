# System-to-Encrypt-and-Decrypt-Text
This projects aims in formatting the Text in Encrypted form and Decrypting the same
Project Overview
SecureCrypt is a comprehensive Java-based security application built using the Spring Boot ecosystem. The system is designed to provide users with a secure environment to encrypt and decrypt sensitive text, files, and database records.

Beyond simple text conversion, the system integrates with RDBMS (MySQL) to fetch data, convert it into Excel format, and wrap it in a layer of AES encryption for secure storage and transmission. It also features a built-in encrypted email module and a detailed reporting engine to track cryptographic activities.

🚀 Key Features
User Authentication: Secure Registration and Login system using Spring Security and BCrypt password hashing.

Text Cryptification: Instant encryption and decryption of raw text strings.

File Security: Ability to upload documents/files, encrypt them at the byte level, and store/download them securely.

Email Integration: A "Secure-Mail" converter that ensures email bodies are encrypted before being dispatched.

Data Export (RDBMS to Excel): Automated fetching of database records, conversion to .xlsx (Apache POI), followed by mandatory encryption.

Audit & Reporting: Comprehensive tracking of every encryption and decryption event for compliance and monitoring.

🛠 Tech Stack
Backend: Spring Boot, Spring Data JPA, Hibernate ORM

Security: Spring Security (JWT or Session-based)

Database: MySQL

Frontend: [ReactJS / Thymeleaf / JSP - Choose yours]

Encryption Standard: AES-256 (Advanced Encryption Standard)

Utilities: Apache POI (Excel handling), JavaMail Sender

🏗 System Architecture
The application follows a tiered architecture to separate concerns between security logic and data processing:

Presentation Layer: Handles user inputs for text, file uploads, and report viewing.

Service Layer: Contains the CryptoEngine which manages the Cipher instances and transformation logic.

Persistence Layer: Stores user metadata, encrypted file references, and activity logs.

Integration Layer: Connects to SMTP servers for email and generates Excel files from the DB.

📊 Database Schema (Core Entities)
User: id, username, password, email, role

FileMetadata: id, original_name, encrypted_name, upload_date, user_id

CryptoLog: id, action_type (ENC/DEC), target_type (FILE/TEXT/DB), timestamp, status

⚙️ How to Run
Clone the Repo: git clone https://github.com/yourusername/SecureCrypt.git

Configure Database: Update src/main/resources/application.properties with your MySQL credentials.

Build Project: Run mvn clean install.

Run: Execute mvn spring-boot:run and navigate to localhost:8080.
