// function uploadSingleImage(url: string, base64: any) {
//     axios
//       .post("http://localhost:5000/uploadImage", { image: base64 })
//       .then((res) => {
//         setUrl(res.data);
//         alert("Image uploaded Succesfully");
//       })
//       .then(() => setLoading(false))
//       .catch(console.log);
//   }

//   function uploadMultipleImages(images) {
//     setLoading(true);
//     axios
//       .post("http://localhost:5000/uploadMultipleImages", { images })
//       .then((res) => {
//         setUrl(res.data);
//         alert("Image uploaded Succesfully");
//       })
//       .then(() => setLoading(false))
//       .catch(console.log);
//   }