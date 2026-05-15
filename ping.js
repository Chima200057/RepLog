import dotenv from 'dotenv';
dotenv.config();

const key = process.env.IBM_CLOUD_API_KEY;
console.log("== DEBUG ==");
console.log("Raw Key:", `[${key}]`);
console.log("Key Length:", key ? key.length : 'undefined');

for (let i = 0; i < key.length; i++) {
  console.log(key[i], key.charCodeAt(i));
}
