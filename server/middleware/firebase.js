// const the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app") ;
const { getAnalytics } = require( "firebase/analytics") ;
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require("firebase/storage") ;
const fs = require("fs");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1qbRTpSTy8g--otgD3LrVFc4rj4d1gbs",
  authDomain: "node-react-60def.firebaseapp.com",
  projectId: "node-react-60def",
  storageBucket: "node-react-60def.appspot.com",
  messagingSenderId: "794520462420",
  appId: "1:794520462420:web:f54839000fb418037df9c1",
  measurementId: "G-C228TFZCH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const storage = getStorage(app);

const uploadFilesAndGetUrls = async (files) => {
  if (!files) {
    return []; // Trả về một mảng rỗng nếu `files` không tồn tại hoặc không có giá trị
  }
  const promises = files.map(async (file) => {
    const storageRef = ref(storage, "images/" + file.originalname);
    const buffer = await fs.promises.readFile(file.path);
    await uploadBytesResumable(storageRef, buffer);
   
    const url = await getDownloadURL(storageRef);
    return url;
  });
  
  const urls = await Promise.all(promises);
  return urls;
};

const deleteFilesByUrl = async (urls) => {
  const promises = urls.map(async (url) => {
    const storageRef = ref(storage, "images/" + url);
    await deleteObject(storageRef);
    return url;
  });

  const deletedUrls = await Promise.all(promises);
  return deletedUrls;
};
  
module.exports = { uploadFilesAndGetUrls, deleteFilesByUrl }
