import "./App.css";
import { useState } from "react";
import { storage } from "./firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import Compressor from 'compressorjs';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import axios from "axios";
// import { DateTimePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";

function App() {
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState([]);
  const [scheduledDateTime, setScheduledDateTime] = useState(null);
  const [timer, setTimer] = useState("");
  const [showpickup, setShowpickup] = useState(false);
  const [open, setOpen] = useState(false);

  // const [image, setImage] = useState(null);

  const handleImgSubmit = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
  
    if (!file) {
      console.log("No file chosen");
      return;
    }
  
    try {
      // Additional options for image compression
      const options = {
        quality: 0.6,  // Adjust the quality (0 to 1)
        maxWidth: 800, // Maximum width of the compressed image
        maxHeight: 800, // Maximum height of the compressed image
      };
  
      // Compress the image before uploading
      new Compressor(file, {
        ...options,
        success: (compressedFile) => {
          // Generate a timestamp or a unique identifier
          const timestamp = Date.now(); // Using a timestamp as an example
  
          // Append the timestamp to the file name
          const fileNameWithTimestamp = `${timestamp}_${file.name}`;
  
          // Create a reference to the storage location with the new filename
          const storageRef = ref(storage, `files/${fileNameWithTimestamp}`);
  
          // Upload the compressed file to Firebase Storage
          const uploadTask = uploadBytesResumable(storageRef, compressedFile);
  
          // Listen to the upload state changes
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Calculate and update the upload progress
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setProgresspercent(progress);
            },
            (error) => {
              // Handle errors during the upload
              alert(error);
            },
            () => {
              // Once the upload is complete, get the download URL
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // Set the download URL in the component state
                setImgUrl(downloadURL);
              });
            }
          );
        },
        error: (err) => {
          console.error("Error compressing image:", err.message);
        },
      });
    } catch (error) {
      console.error("Error compressing image:", error);
    }
  };
  
  const handleCategoryChange = (event) => {
    const { value: selectedCategories } = event.target;
    setCategory(selectedCategories);
    setOpen(false);
  };


  const handleSubmit = async () => {
    try {
      if (imgUrl !== null) {
        const date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ssZ");
        const response = await axios.post("http://localhost:3001/append_post", {
          title,
          content,
          category,
          date,
          imgUrl,
          author:"The Quiver"
        });

        if (response.status === 200) {
          notify("Published Successfully");
          setTitle("");
          setContent("");
          setCategory([]);
          setImgUrl(null);
        } else {
          notify("Couldn't Publish..! Try Again");
        }
      } else {
        notify("The image couldn't be posted !");
      }
    } catch (error) {
      // Handle errors here
      console.error("Error occurred:", error);
      notify("An error occurred. Please try again later.");
    }
  };

  const schedulePost = async () => {
    try {
      if (imgUrl !== null) {
        const date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ssZ");
        const scheduleTime = moment(timer.$d).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ssZ');
        notify("Scheduled on server...")
        await axios.post("http://localhost:3001/schedule_post", {
          title,
          content,
          category,
          date,
          imgUrl,
          scheduleTime,
          author:"The Quiver"
        }).then(
          async (response) =>{

            notify("Scheduled Successfully");
            setTitle("");
              setContent("");
              setCategory([]);
              setImgUrl(null);
          }
        );
      } else {
        notify("The image couldn't be posted !");
      }
    } catch (error) {
      // Handle errors here
      console.error("Error occurred:", error);
      notify("An error occurred. Please try again later.");
    }
  };
  const notify = (text) => toast(text);
  return (
    <div className="App">
      <h1 className="heading">THE Quiver News</h1>
      <div className="form">
        <div className="inputs">
          <FormGroup sx={{ marginBottom: 2 }}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup sx={{ marginBottom: 2 }}>
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={13}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>
          <FormGroup sx={{ marginBottom: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                multiple
                value={category}
                onChange={handleCategoryChange}
                label="Category"
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                MenuProps={{
                  onClose: () => setOpen(false), 
                }}
              >
                <MenuItem value="">Select category</MenuItem>
                <MenuItem value={1}>Politics</MenuItem>
                <MenuItem value={2}>Business</MenuItem>
                <MenuItem value={3}>Education</MenuItem>
                <MenuItem value={4}>Farming</MenuItem>
                <MenuItem value={5}>Health & lifestyle</MenuItem>
                <MenuItem value={6}>Sports</MenuItem>
                <MenuItem value={7}>State</MenuItem>
                <MenuItem value={8}>National</MenuItem>
                <MenuItem value={9}>International</MenuItem>
                <MenuItem value={10}>Shree Jagannath</MenuItem>
                {/* <MenuItem value="travel">Travel</MenuItem> */}
                {/* Add more categories as needed */}
              </Select>
            </FormControl>
          </FormGroup>
          <FormGroup
            sx={{
              marginBottom: 2,
              marginTop: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormLabel>Upload Thumbnail</FormLabel>
            <div className="app">
              <div className="parent">
               {!imgUrl ? <div className="file-upload">
                  <img
                    src={
                      "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pngall.com%2Fwp-content%2Fuploads%2F2%2FUpload-PNG.png&f=1&nofb=1&ipt=b4498f166d3660329fc0c88795c0131e191452079391257b9a552558f27a91bc&ipo=images"
                    }
                    alt="upload"
                    className="img"
                  />
                  <h3>Click box to upload</h3>
                  <p>Maximun file size 10mb</p>
                  <input type="file" onChange={(e) => handleImgSubmit(e)} />
                </div> : <img src={imgUrl} alt="uploaded file" height={200} />}
              </div>
              {!imgUrl && (
        <div className="outerbar">
          <div
            className="innerbar"
            style={{ width: `${progresspercent}%`, backgroundColor: "green", height:'2px' }}
          >
            {progresspercent <= 0 ? '' : `${progresspercent}%`}
          </div>
        </div>
      )}
            </div>
          </FormGroup>
        </div>
        <div className="buttons">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginBottom: 2, height: 30 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Select time to publish"
                value={timer}
                onChange={(time) => {
                  
                  console.log(time);
                  setTimer(time);
                  setShowpickup(showpickup);
                  // console.log(timer)
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          {/* {showpickup ? ( */}
          <Button
            variant="contained"
            color="primary"
            // type="submit"
            sx={{ marginBottom: 2, height: 30, marginTop: 3 }}
            disabled={!timer}
            onClick={schedulePost}
          >
            Schedule
          </Button>
          {/* ) : (
            ""
          )} */}
        </div>
      </div>
      <ToastContainer />
      
      {/* {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />} */}
    </div>
  );
}
export default App;
