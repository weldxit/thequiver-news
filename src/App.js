import "./App.css";
import React, { useState } from "react";
import { storage } from "./firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import Compressor from "compressorjs";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormGroup,
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
  const [author, setAuthor] = useState('The Quiver')
  const [youtubelink, setYoutubelink] = useState("");
  const [scheduledDateTime, setScheduledDateTime] = useState(null);
  const [timer, setTimer] = useState("");
  const [showpickup, setShowpickup] = useState(false);
  const [open, setOpen] = useState(false);
  const [openA, setOpenA] = useState(false);

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
        quality: 0.6, // Adjust the quality (0 to 1)
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
  const handleAuthorChange = (event) => {
    const { value: selectedCategories } = event.target;
    // console.log()
    setAuthor(selectedCategories);
    setOpenA(false);
  };
  function convertToEmbedLink(youtubeLink) {
    // Extract the video ID from the YouTube link
    const videoIdMatch = youtubeLink.match(/[?&]v=([^&]+)/);

    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      // Create the embed link
      const embedLink = `https://www.youtube.com/embed/${videoId}`;
      return embedLink;
    } else {
      // Invalid YouTube link format
      return null;
    }
  }
  let link = convertToEmbedLink(youtubelink);
  let contentWithBreaks = "";
  if (content) {
    const textWithNewLines = content;
    const splitText = textWithNewLines?.split("\n");
    contentWithBreaks = splitText?.map((line, index) => (
      <React.Fragment key={index}>
        <p className="mb-5">{line}</p>
        {/* {console.log(article,textWithNewLines,article?.youtube_link)} */}
        {content && youtubelink && index === 1 && (
          <div className="flex flex-1 w-full justify-center items-center  mb-5 h-[30vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh]">
            {/* Render your YouTube video component here */}
            {/* Example: Replace 'VIDEO_ID' with your actual YouTube video ID */}
            <iframe
              // width="560"
              // height="315"
              src={link}
              title="YouTube Video"
              allowFullScreen
              className=" w-[100%] h-[30vh] md:h-[50vh] lg:h-[55vh] xl:h-[50vh] xl:w-[80%] rounded-lg"
            ></iframe>
          </div>
        )}
      </React.Fragment>
    ));
  }
  const handleSubmit = async () => {
    try {
      if (
        imgUrl !== null &&
        category.length != [] &&
        title !== "" &&
        content !== ""
      ) {
        const date = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ssZ");
        const response = await axios.post(
          "https://server-for-quiver.onrender.com/append_post",
          {
            title,
            content,
            category,
            date,
            imgUrl,
            youtubelink,
            author,
          }
        );

        if (response.status === 200) {
          notify("Published Successfully");
          setTitle("");
          setContent("");
          setCategory([]);
          setImgUrl(null);
          setYoutubelink("");
          setAuthor('')
        } else {
          notify("Couldn't Publish..! Try Again");
        }
      } else {
        notify("Please fill all fields..and Try Again !");
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
        const scheduleTime = moment(timer.$d)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ssZ");
        notify("Scheduled on server...");
        await axios
          .post(
            "https://https://server-for-quiver.onrender.com/schedule_post",
            {
              title,
              content,
              category,
              date,
              imgUrl,
              youtubelink,
              scheduleTime,
              author,
            }
          )
          .then(async (response) => {
            notify("Scheduled Successfully");
            setTitle("");
            setContent("");
            setCategory([]);
            setImgUrl(null);
            setProgresspercent(0);
            setYoutubelink("");
            setAuthor('')
          });
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          paddingLeft: "5.5rem",
          paddingBottom: "1rem",
          paddingTop: "1rem",
        }}
      >
        <img
          src={require("./ezgif.com-crop.gif")}
          alt="brand logo"
          height={40}
          width={100}
          style={{ justifySelf: "flex-start" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          {/* Form Section */}
          <div
            className="form"
            style={{ flex: "1", padding: "20px", boxSizing: "border-box" }}
          >
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
                <TextField
                  label="Youtube Link"
                  variant="outlined"
                  fullWidth
                  value={youtubelink}
                  onChange={(e) => setYoutubelink(e.target.value)}
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
              <FormGroup sx={{ marginBottom: 2 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Author</InputLabel>
                  <Select
                    // multiple
                    value={author}
                    onChange={handleAuthorChange}
                    label="Author"
                    open={openA}
                    onOpen={() => setOpenA(true)}
                    onClose={() => setOpenA(false)}
                    MenuProps={{
                      onClose: () => setOpenA(false),
                    }}
                  >
                    <MenuItem value="">Select author</MenuItem>
                    <MenuItem value={'Chinmay Pati'}>Chinmay Pati</MenuItem>
                    <MenuItem value={'Biswa Ranjan Sahoo'}>Biswa Ranjan Sahoo</MenuItem>
                    <MenuItem value={'Jyotshna Kumari'}>Jyotshna Kumari</MenuItem>
                    <MenuItem value={'Pratap Kumar'}>Pratap Kumar</MenuItem>
                    {/* <MenuItem value={5}>Health & lifestyle</MenuItem>
                    <MenuItem value={6}>Sports</MenuItem>
                    <MenuItem value={7}>State</MenuItem>
                    <MenuItem value={8}>National</MenuItem>
                    <MenuItem value={9}>International</MenuItem>
                    <MenuItem value={10}>Shree Jagannath</MenuItem> */}
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
                  alignItems: "start",
                }}
              >
                {/* <FormLabel>Upload Thumbnail</FormLabel> */}
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
                      <p>*max file size 10mb</p>
                      <input type="file" onChange={(e) => handleImgSubmit(e)} />
                    </div>
                    <div
                      // style={{
                      //   display: "flex",
                      //   flexDirection: "row",
                      //   flex: 1,
                      //   justifyContent: "space-around",
                      //   alignItems: "center",

                      // }}
                      className="schedule_post"
                    >
                      <div>
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
                        <Button
                          variant="contained"
                          color="secondary"
                          // type="submit"
                          sx={{
                            marginBottom: 2,
                            height: 30,
                            marginTop: 3,
                            width: "100%",
                          }}
                          disabled={!timer}
                          onClick={schedulePost}
                        >
                          Schedule
                        </Button>
                      </div>
                      <div>
                        <Button
                          variant="contained"
                          color="success"
                          type="submit"
                          sx={{ marginBottom: 2, height: 40, width: "100%" }}
                          onClick={handleSubmit}
                        >
                          Publish Post
                        </Button>
                      </div>
                    </div>
                  </div>
                  {!imgUrl && (
                    <div className="outerbar">
                      <div
                        className="innerbar"
                        style={{
                          width: `${progresspercent}%`,
                          backgroundColor: "green",
                          height: "2px",
                          width: "100%",
                        }}
                      >
                        {progresspercent <= 0 ? "" : `${progresspercent}%`}
                      </div>
                    </div>
                  )}
                </div>
              </FormGroup>
            </div>
          </div>

          {/* Preview Section */}
          <div
            className="preview"
            style={{ flex: "1", padding: "20px", boxSizing: "border-box" }}
          >
            <h3 style={{ textAlign: "start" }}>{title ? title : ""}</h3>
            {imgUrl && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "10px",
                }}
              >
                <img
                  src={imgUrl}
                  alt="uploaded file"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}
            <p
              style={{
                textAlign: "start",
                backgroundColor: "white",
                overflow: "hidden",
                paddingTop: "10px",
              }}
            >
              {/* Content goes here */}
              {contentWithBreaks ? contentWithBreaks : ""}
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />

      {/* {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />} */}
    </div>
  );
}
export default App;
