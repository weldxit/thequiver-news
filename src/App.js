import "./App.css";
import { useState } from "react";
import { storage } from "./firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState([]);
  const [scheduledDateTime, setScheduledDateTime] = useState(null);
  const [timer, setTimer] = useState("");
  const [showpickup, setShowpickup] = useState(false);

  // const [image, setImage] = useState(null);

  const handleImgSubmit = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      console.log("no file choosen");
    }
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          // console.log(title, content, category, downloadURL)
        });
      }
    );
  };
  function getCurrentDateTimeInIndianTimezone() {
    const indianTimezone = 'Asia/Kolkata';
    const options = { timeZone: indianTimezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const currentDateTime = new Date().toLocaleString('en-IN', options);
    return currentDateTime;
  }
  const handleCategoryChange = (event) => {
    const { value: selectedCategories } = event.target;
    console.log(selectedCategories)
    setCategory(selectedCategories);
  };
  const handleSubmit = async () => {
    // console.log(title, content, category, imgUrl);
    if(imgUrl!==null){
      const date = getCurrentDateTimeInIndianTimezone()
      await axios.get('https://server-for-quiver.onrender.com/create_post', {title, content, category, date, imgUrl}).then(
       (response)=>{
         if (response.status === 200){
           notify("Published Successfully")
           setTitle("")
           setContent("")
           setCategory([])
           setImgUrl(null)
         }
         else{
           notify("Couldn't Publish..! Try Again")
         }
       }
      )
    }
    else{
      notify("The image couldn't be posted !")
    }
   
  };

  const schedulePost = () => {};
  const notify = (text) => toast(text);
  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="form">
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
              >
                <MenuItem value="">Select category</MenuItem>
                <MenuItem value= {1}>Politics</MenuItem>
                <MenuItem value= {2}>Business</MenuItem>
                <MenuItem value= {3}>Education</MenuItem>
                <MenuItem value= {4}>Farming</MenuItem>
                <MenuItem value= {5}>Health & lifestyle</MenuItem>
                <MenuItem value= {6}>Sports</MenuItem>
                <MenuItem value= {7}>State</MenuItem>
                <MenuItem value= {8}>National</MenuItem>
                <MenuItem value= {9}>International</MenuItem>
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
                <div className="file-upload">
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
                </div>
              </div>
            </div>
          </FormGroup>
        </div>
        <div className="buttons">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ marginBottom: 2, height: 30 }}
          >
            Submit
          </Button>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Select time to publish"
                value={timer}
                onChange={(time) => {
                  setTimer(time);
                  setShowpickup(showpickup);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          {/* {showpickup ? ( */}
            <Button
              variant="contained"
              color="primary"
              // type="submit"
              sx={{ marginBottom: 2, height: 30, marginTop:3 }}
              disabled={!timer}
              onClick={schedulePost}
            >
              Schedule
            </Button>
          {/* ) : (
            ""
          )} */}
        </div>
      </form>
      <ToastContainer />
      {!imgUrl && (
        <div className="outerbar">
          <div
            className="innerbar"
            style={{ width: `${progresspercent}%`, backgroundColor: "red" }}
          >
            {progresspercent}%
          </div>
        </div>
      )}
      {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
    </div>
  );
}
export default App;
