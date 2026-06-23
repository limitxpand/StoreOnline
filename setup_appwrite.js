const { Client, Storage, Permission, Role } = require('node-appwrite');

async function createBucket() {
  const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('6a3a9ea00020b635ed6b')
    .setKey('standard_914c9479a9f101364da0a1bb55b63ed0bd753bc75ef9b3b0102dcb1c74d6e85c9587b6f2e2387336a292ded47518d1bce8d49eef447aac8689231e953011d0f8e5070b53a72125511ed81e66a5b2bb816464e4447b1fd6b782ef9148c2c6aa2ecaccc5eb800ecf2d9e6738e50494a1a95147a92d895e2f7cfaadfcf176f35722');

  const storage = new Storage(client);

  try {
    const bucket = await storage.createBucket(
      'products_bucket', // bucketId
      'Products', // name
      [Permission.read(Role.any()), Permission.write(Role.users())], // permissions
      false, // fileSecurity
      true, // enabled
      undefined, // maximumFileSize
      ['ex4', 'ex5', 'zip', 'apk', 'png', 'jpg', 'jpeg', 'webp'], // allowedFileExtensions
      undefined, // compression
      true, // encryption
      true // antivirus
    );
    console.log("Bucket created successfully! Bucket ID:", bucket.$id);
  } catch (error) {
    if (error.code === 409) {
       console.log("Bucket already exists! Bucket ID: products_bucket");
    } else {
       console.error("Error creating bucket:", error);
    }
  }
}

createBucket();
