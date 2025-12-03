# Environment Setup Guide

## MongoDB Atlas Connection Issue Fix

### Step 1: Create `.env` file

Create a `.env` file in the root directory (`Flood-Relief-Connect/`) with the following content:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<dbName>:<password>@cluster0.5huypzl.mongodb.net

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT Tokens (Generate strong random strings)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-minimum-32-characters-long
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-minimum-32-characters-long
REFRESH_TOKEN_EXPIRY=7d

# Razorpay (Optional - for donations)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Step 2: Fix MongoDB Atlas IP Whitelist

The error you're seeing is because your IP address is not whitelisted in MongoDB Atlas.

#### Quick Fix:

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Select your cluster
3. Click on **"Network Access"** in the left sidebar
4. Click **"Add IP Address"** button
5. Click **"Add Current IP Address"** (recommended)
   - OR for development only: Add `0.0.0.0/0` to allow all IPs (NOT recommended for production)
6. Click **"Confirm"**

#### Steps in Detail:

1. Login to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click on your project
3. Go to **Network Access** (Security section)
4. Click **"Add IP Address"**
5. You have two options:
   - **Recommended**: Click "Add Current IP Address" button (automatically adds your IP)
   - **Development Only**: Enter `0.0.0.0/0` (allows from anywhere - use only for testing)
6. Add a comment like "Development IP" (optional)
7. Click **"Confirm"**

**Wait 2-3 minutes** after adding IP for changes to take effect.

### Step 3: Verify Connection String

Your MongoDB connection string should be in this format:

```
mongodb+srv://username:password@cluster0.5huypzl.mongodb.net
```

Make sure:

- ✅ Username and password are correct
- ✅ No spaces in the connection string
- ✅ Special characters in password are URL-encoded (use %40 for @, %23 for #, etc.)

### Step 4: Generate JWT Secrets

Generate secure random strings for JWT tokens:

**On Windows PowerShell:**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**On Linux/Mac:**

```bash
openssl rand -base64 32
```

Or use online tool: https://www.lastpass.com/features/password-generator

### Step 5: Start Server

After creating `.env` file and whitelisting IP:

```bash
cd Server
npm run dev
```

You should see:

```
✅ MongoDB connected !! DB HOST: ...
✅ Database: floodRelief
Server is running at port : 4000
```

### Common Issues:

1. **"IP not whitelisted"**: Follow Step 2 above
2. **"Authentication failed"**: Check username/password in connection string
3. **"Connection timeout"**:
   - Wait 2-3 minutes after adding IP
   - Check internet connection
   - Verify connection string format

### Security Notes:

⚠️ **Never commit `.env` file to git!**

- It's already in `.gitignore`
- Keep your secrets safe
- Use different credentials for production
